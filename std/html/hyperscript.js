// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { dir, extension, files, whitespace } from "../../config.js";
import { join, SEP } from "../../deps.js";
import { emptyElements } from "./empty_elements.js";
import { jsonLogic } from "../data/json_logic.js";
import { templateLiterals } from "../string/template_literals.js";
import { valueForKeyPath } from "../data/mod.js";
import { dispatchCustomEvent } from "../event/dispatch_custom_event.js";
import { getTemplateType } from "../data/mod.js";
import { loadDataFile, parseDataFile } from "../../std/data/mod.js";


/** HTML indentation level */
let indentationLevel = 0;

/** Mutable options */
let outputOptions = {}

/** Default options */
const defaults = {
  minify: true,
  spaces: 2
}

/** Array.flat() requires a depth value for the number of levels to recurse. */
const depth = 20;

/** Custom events  */
export const events = {
  component: "hyperscript:component",
  element: "hyperscript:element",
  logic: "hyperscript:logic",
}

/** Content to filter from the output. */
const contentFilter = {
  slot: "___SLOT___",
}

/** HTML tag/attribute tag. */
const tag = {
  close: ">",
  end: "</",
  equal: "=",
  open: "<",
  quote: "\""
}

/** Generates the appropriate line feed based on the offset and number of spaces specified. */
function lineFeed () {
  const output = [];

  for (let level = 0; level < indentationLevel; level++) {
    for (let space = 0; space < outputOptions.spaces; space++) {
      output.push(whitespace.space);
    }
  }

  return output.join("");
}

/** Generates new line/carriage return characters. */
function newLine () {
  return outputOptions.minify ? "" : whitespace.cr + whitespace.lf;
}

/** Returns the updated template with the slot replacement. */
function updateTemplateSlotWithContent (template, slot, content) {
  template = Array.isArray(template) ? template : [template];
  template.forEach((item, index) => {
    if (item.constructor.name === "Object" && item.slot && item.slot === slot) {
      if (item.element) {
        item.content = content;
      } else {
        template[index] = content;
      }
    } else if (item.content) {
      return updateTemplateSlotWithContent(item.content, slot, content);
    }
  });

  return template;
}

/**
 * Generates a string from the specified template and data.
 * @param template The hyperscript template.
 * @param data The data to be bound to the hyperscript template.
 * @param options Output options.
 */
export async function hyperscript (template, data = {}, options = defaults) {
  if (typeof template === "undefined") return;

  outputOptions = options;
  outputOptions.spaces = options.minify ? 0 : options.spaces || defaults.spaces;

  const output = [];

  switch (template.constructor.name) {
    case "Array": {
      for (let index = 0, length = template.length; index < length; index++) {
        const content = await hyperscript(template[index], data, outputOptions);

        // Filter content
        if (Object.values(contentFilter).includes(content)) {
          continue;
        }

        output.push(content);

        if ((index + 1) < length) {
          output.push(newLine(), lineFeed());
        }
      }
      break;
    }

    case "Object": {
      if (template.component) {
        const { component, props = {}, slots = {} } = template;

        let componentPath = join(SEP, dir.components, component, files.componentSpec + (getTemplateType(component) || extension.yml));
        let componentSpec;

        // Load component spec
        if (Deno) {
          componentPath = join(Deno.cwd(), componentPath);
          componentSpec = await loadDataFile(componentPath);
        } else {
          componentPath = new URL(componentPath, data.project.host);
          componentSpec = await fetch(componentPath).then(res => res.text()).then(data => parseDataFile(data, componentFileName));
        }

        // Set default prop values
        if (componentSpec.props) {
          // Object.keys(componentSpec.props).forEach(key => defaultProps[key] = componentSpec.props[key][1]);
          data.props = Object.assign(data.props, props);
        }

        // Content slots
        if (slots && slots.constructor.name === "Object") {
          Object.entries(slots).forEach(entry => {
            const { 0:slot, 1:template } = entry;
            componentSpec.template = updateTemplateSlotWithContent(componentSpec.template, slot, template);
          })
        }

        output.push(await hyperscript(componentSpec.template, data, outputOptions));
      } else if (template.element) {
        const { attributes, collection, content, element, slot } = template;

        // Element open
        output.push(tag.open);
        output.push(await hyperscript(element, data, outputOptions));

        // Attributes
        if (attributes) {
          const sortedAttributes = Object.entries(attributes).sort();

          for (let index = 0, length = sortedAttributes.length; index < length; index++) {
            const entry = sortedAttributes[index];
            const value = await hyperscript(entry[1], data, outputOptions);

            // Do not display the attribute name if the value if false
            // Examples: checked, selected, open, aria-hidden
            if (value !== false) {
              output.push(whitespace.space);
              output.push(entry[0].toLowerCase());
            }

            // Do not display the attribute value if it is a boolean value
            if (typeof value !== "boolean") {
              output.push(tag.equal);
              output.push(tag.quote);
              output.push(await hyperscript(value, data, outputOptions));
              output.push(tag.quote);
            }
          }
        }

        output.push(tag.close);

        // Collection
        if (collection) {
          const { keypath:collectionKeypath, template:collectionTemplate } = collection;
          let dataForKeypath = valueForKeyPath(data, collectionKeypath) || [];

          if (Array.isArray(dataForKeypath) === false) {
            dataForKeypath = Object.entries(dataForKeypath).sort((a, b) => {
              if (a[0] < b[0]) return -1
              if (a[0] > b[0]) return 1
              return 0
            }).map(entry => entry[1]);
          }

          const collectionData = dataForKeypath
          const count = collectionData.length;

          for (let index = 0, length = collectionData.length; index < length; index++) {
            const collectionItem = collectionData[index];

            // Expose property helpers for use in templates
            collectionItem.___count = count;
            collectionItem.___index = index; // 0-based indexes
            collectionItem.___index_1 = index + 1; // 1-based indexes

            data.item = collectionItem;

            indentationLevel++;
            output.push(newLine(), lineFeed());
            output.push(await hyperscript(collectionTemplate, data, outputOptions));
            indentationLevel--;
          }

          output.push(newLine(), lineFeed());
        }

        // Content
        if (content && content !== "") {
          indentationLevel++;
          output.push(newLine(), lineFeed());
          output.push(await hyperscript(content, data, outputOptions));
          indentationLevel--;
          output.push(newLine(), lineFeed());
        }

        // Element close
        if (emptyElements.includes(element) === false) {
          output.push(tag.end);
          output.push(await hyperscript(element, data, outputOptions));
          output.push(tag.close);
        }
      } else if (template.slot) {
        template = contentFilter.slot;
        output.push(await hyperscript(template, data, outputOptions));
      } else if (jsonLogic.is_logic(template)) {
        const result = jsonLogic.apply(template, data);

        if (result && result.constructor.name.toLowerCase() === "object") {
          output.push(await hyperscript(result, data, outputOptions));
        } else {
          return result;
        }
      }
      break
    }

    case "String": {
      output.push(templateLiterals(template, data));
      break
    }

    default: {
      return template;
    }
  }

  return output.flat(depth).join("");
}
