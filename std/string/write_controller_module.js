// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { ensureDir, exists, join } from "../deps.js";
import { controller, dir, files, whitespace } from "../config.js";
import { loadDataFile } from "./load_data_file.js";

/** Writes the controller module file.  */
export async function writeControllerModule (componentPath) {
  const componentSpec = await loadDataFile(componentPath);
  const { id:componentIdentifier, props = {} } = componentSpec;

  if (typeof componentSpec.template === "undefined") {
    throw new Error("Component spec requires a `template` object.");
  } else if (typeof componentSpec.template[0] === "undefined") {
    throw new Error("Component spec template requires a child element or component.");
  }

  if (typeof componentSpec.template[0].attributes === "undefined" ||
    typeof componentSpec.template[0].attributes[controller.schema.controller] === "undefined") {
    return;
  }

  const componentControllers = componentSpec.template[0].attributes[controller.schema.controller].split(controller.syntax.space);
  const componentControllerPath = join(Deno.cwd(), dir.components, componentIdentifier);
  const componentModuleRoot = join(componentControllerPath, files.mod);

  if (componentControllers.includes(componentIdentifier) === false) {
    if (exists(componentModuleRoot)) {
      await Deno.remove(componentModuleRoot);
      return;
    }
  }

  const targetValues = componentSpec.template[0].content.map(element => {
    if (element.attributes && element.attributes[controller.schema.target]) {
      return element.attributes[controller.schema.target].split(controller.syntax.space).map(target => {
        if (target.startsWith(componentIdentifier))
          return target.split(controller.syntax.sep).pop();
      }).flat();
    }
    return [];
  }).flat();

  const targets = [whitespace.lf, `export const targets = ${JSON.stringify(targetValues.sort(), null, 2)}`, whitespace.lf].join("");
  const values = props ? [whitespace.lf, `export const values = ${JSON.stringify(props, null, 2)}`, whitespace.lf].join("") : "";

  const controllerModule = `/** ⚠️Hyperspaces-generated file. Any changes made will be overwritten. ⚠️*/

import "./deps.js"
${targets}${values}
`;

  await ensureDir(componentControllerPath);
  await Deno.writeTextFile(join(componentControllerPath, files.mod), controllerModule);
  await Deno.writeTextFile(join(componentControllerPath, files.deps), "// export * from \"./initialize.js\"");
}
