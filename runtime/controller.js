// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { dispatchCustomEvent } from "../std/event/dispatch_custom_event.js";
import { capitalize, snakeCase } from "../std/string/mod.js";
import { controller, files } from "../config.js";
import { join } from "../deps.js";

/** Controller formatting syntax symbols */
export const controller = {
  schema: {
    controller: "data-controller",
    event: "data-event",
    target: "data-target",
  },
  syntax: {
    event: "->",
    global: "@",
    has: "has",
    nameSep: "-",
    sep: ".",
    space: " "
  }
}

/** Controller cache */
const cache = {
  controllers: new Map,
  events: new Map,
  modules: {}
}

/** Controller callbacks */
const callbacks = {
  connect: "connect",
  disconnect: "disconnect",
  eventConnected: "eventConnected",
  eventDisconnected: "eventDisconnected",
  initialize: "initialize",
  targetConnected: "targetConnected",
  targetDisconnected: "targetDisconnected"
}

/** Suffixes for property types supported by the controller. */
const propertySuffix = {
  class: "Class",
  changed: "ValueChanged",
  target: "Target",
  targets: "Targets",
  value: "Value"
}

/** Adds an event listener based on the event object. */
function addEventListener (event) {
  const { controller, method, target, type } = event;

  event.listener = event => {
    if (method in controller === false) {
      throw new Error(`"${controller.identifier}${controller.syntax.sep}${method}" not found.`);
    }
    controller[method].call(controller, { controller, event });
  }

  target.addEventListener(type, event.listener);
  cacheEventListener(event);

  dispatchLifecyleCallback(callbacks.eventConnected, controller, { event });
}

/** Defines the target property on the controller. */
function addTargetProperty (controller, target) {
  const { identifier } = controller;
  const targetElements = Array.from(controller.element.querySelectorAll(`[${controller.schema.target}~="${identifier}${controller.syntax.sep}${target}"]`));

  targetElements.forEach((element, index) => {
    const hasTargetName = formatPropertyValue(controller.syntax.has, target, propertySuffix.target);
    const targetName = formatPropertyValue(target, propertySuffix.target);
    const targetsName = formatPropertyValue(target, propertySuffix.targets);

    if (index === 0 && targetName in controller === false) {
      Object.defineProperty(controller, targetName, {
        value: element,
        writable: true
      });
    }

    if (targetsName in controller === false) {
      Object.defineProperty(controller, targetsName, {
        value: targetElements,
        writable: true
      });
    }

    if (hasTargetName in controller === false) {
      Object.defineProperty(controller, hasTargetName, {
        value: typeof controller[targetName] !== "undefined",
        writable: true
      });
    }

    controller[targetName] = targetElements[0] || undefined;
    controller[targetsName] = targetElements;
    controller[hasTargetName] = typeof controller[targetName] !== "undefined";

    dispatchLifecyleCallback(callbacks.targetConnected, controller, { element, target });
  })
}

/** Adds the controller to the controller cache. */
function cacheController (controller) {
  const value = cache.controllers.get(controller.identifier) || new Map;
  value.set(controller.element, controller);
  cache.controllers.set(controller.identifier, value);
}

/** Adds the event to the event cache. */
function cacheEventListener (event) {
  const events = cache.events.get(event.target);
  const map = events || new Map;
  const value = map.set(event.descriptor, event);
  cache.events.set(event.target, value);
}

/** Connects the element to any controllers specified in `data-controller`. */
async function connectElementToControllers (element) {
  return await Promise.all(
    parseControllerIdentifiers(element.getAttribute(controller.schema.controller))
      .map(async controllerIdentifier => {
        let controller = getControllerFromCache(controllerIdentifier, element);

        if (typeof controller === "undefined") {
          const module = await loadControllerModule(controllerIdentifier);
          controller = createController(module, element, controllerIdentifier);
        }

        dispatchLifecyleCallback(callbacks.connect, controller);
      })
  )
}

/** Connects the element to any controllers, events or targets defined on it. */
async function connectElementToDescriptors (element) {
  if (element.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const matchingAttributes = Object.values(schema).filter(element.hasAttribute(attribute)).sort();

  for (let index = 0, length = matchingAttributes.length; index < length; index++) {
    const attribute = matchingAttributes[index];

    if (attribute === controller.schema.controller) {
      await connectElementToControllers(element);
    }

    if (attribute === controller.schema.event) {
      connectElementToEvents(element);
    }

    if (attribute === controller.schema.target) {
      connectElementToTargets(element);
    }
  }
}

/** Connects the element to the event descriptor.  */
function connectElementToEvent (element, event) {
  const controllerIdentifier = event.identifier;
  const controllerElement = element.closest(`[${controller.schema.controller}="${controllerIdentifier}"]`);

  event.controller = getControllerFromCache(controllerIdentifier, controllerElement);
  event.target = event.target || element;

  addEventListener(event);
}

/** Connects the element to any events specified in `data-event`. */
function connectElementToEvents (element) {
  return parseEventDescriptors(element.getAttribute(controller.schema.event)).map(event => {
    connectElementToEvent(element, event);
  })
}

/** Connects the element to any targets specified in `data-target`. */
function connectElementToTargets (element) {
  return parseTargetDescriptors(element.getAttribute(controller.schema.target)).map(({ controllerIdentifier, target }) => {
    const controllerElement = element.closest(`[${controller.schema.controller}="${controllerIdentifier}"]`);
    const controller = getControllerFromCache(controllerIdentifier, controllerElement);

    addTargetProperty(controller, target);
  })
}

/** Connects the page with any controller, event or target descriptors. */
async function connectPageToDescriptors (element = document.documentElement) {
  [
    (element.hasAttribute(controller.schema.controller) && element) || "",
    ...Array.from(element.querySelectorAll(`[${controller.schema.controller}]`))
  ].filter(String).forEach(connectElementToControllers);
}

/** Create a new instance of a controller. */
function createController (module, element, identifier) {
  const controller = Object.assign({}, module);

  defineStaticProperties(controller, element, identifier);
  defineClassProperties(controller);
  defineDataProperties(controller);
  defineEventListeners(controller);
  defineTargetProperties(controller);
  defineValueProperties(controller);

  dispatchLifecyleCallback(callbacks.initialize, controller);

  return controller;
}

/** Defines `${name}Class` and `has${name}Class` proprties on the controller. */
function defineClassProperties (controller) {
  const { classes, element, identifier} = controller;

  classes.forEach(className => {
    const classAttribute = formatAttributeValue(identifier, className, propertySuffix.class);
    const hasClassProperty = formatPropertyValue(controller.syntax.has, className, propertySuffix.class);

    Object.defineProperty(controller, hasClassProperty, {
      get: () => element.hasAttribute(classAttribute)
    });

    Object.defineProperty(controller, formatPropertyValue(className, propertySuffix.class), {
      get: () => element.getAttribute(classAttribute)
    });
  })

  return controller;
}

/** Defines the `data` property on the controller. */
function defineDataProperties (controller) {
  const { identifier } = controller;

  controller.data = {
    delete: (key) => {
      controller.element.removeAttribute(formatAttributeValue(identifier, key))
      delete controller[formatPropertyValue(key, propertySuffix.value)]
    },

    get: (key) => {
      const controllerValue = controller.values[key] || {};
      const { 0:valueType, 1:controllerDefaultValue } = controllerValue;

      if (typeof valueType === "undefined") {
        throw new Error(`Specified value "${key}" does not exist on controller "${identifier}".`);
      }

      return parseValue(controller.element.getAttribute(formatAttributeValue(identifier, key)), valueType) || controllerDefaultValue || getDefaultValueForType(valueType);
    },

    has: (key) => controller.element.hasAttribute(formatAttributeValue(identifier, key)),

    set: (key, value) => {
      const { 0:valueType } = controller.values[key];
      const callbackName = formatPropertyValue(key, propertySuffix.changed);
      const newValue = stringifyValue(valueType, value || getDefaultValueForType(valueType));
      const oldValue = controller.data.get(key);

      controller.element.setAttribute(formatAttributeValue(identifier, key), newValue);

      dispatchLifecyleCallback(callbackName, controller, { oldValue, newValue });
    }
  }

  return controller;
}

/** Defines the event listeners for the controller element and any children. */
function defineEventListeners (controller) {
  [
    controller.element.hasAttribute(controller.schema.event) && controller.element || "",
    ...Array.from(controller.element.querySelectorAll(`[${controller.schema.event}*="${controller.identifier}${controller.syntax.sep}"]`))
  ].filter(String).forEach(connectElementToEvents);
}

/** Defines the static properties that every controller requires. */
function defineStaticProperties (controller, element, identifier) {
  controller.classes = controller.classes || [];
  controller.dispatchEvent = dispatchCustomEvent;
  controller.element = element;
  controller.identifier = identifier;
  controller.targets = controller.targets || [];
  controller.values = controller.values || {};

  cacheController(controller);

  return controller;
}

/** Defines the target properties on the controller. */
function defineTargetProperties (controller) {
  controller.targets.forEach(target => addTargetProperty(controller, target))
  return controller;
}

/** Defines `${name}Value` and `has${name}Value` properties on the controller. */
function defineValueProperties (controller) {
  Object.keys(controller.values).forEach(key => {
    const hasValueName = formatPropertyValue(controller.syntax.has, key, propertySuffix.value);
    const valueName = formatPropertyValue(key, propertySuffix.value);

    if (hasValueName in controller === false) {
      Object.defineProperty(controller, hasValueName, {
        get: () => controller.data.has(key)
      });
    }

    if (valueName in controller === false) {
      Object.defineProperty(controller, valueName, {
        get: () => controller.data.get(key),
        set: (value) => controller.data.set(key, value)
      });
    }

    controller.data.set(key, controller.data.get(key));
  })

  return controller;
}

/** Disconnects the element from any controllers specified in the `data-controller` attribute. */
function disconnectElementFromControllers (element, parentElement) {
  return parseControllerIdentifiers(element.getAttribute(controller.schema.controller))
    .map(controllerIdentifier => {
      const controllerElement = getClosestMatchingControllerElement(parentElement, controllerIdentifier);
      const controller = getControllerFromCache(controllerIdentifier, controllerElement);

      dispatchLifecyleCallback(callbacks.disconnect, controller, { element });

      removeControllerFromCache(controller);
    })
}

function _disconnectElementFromDescriptors (element, parentElement) {
  const matchingAttributes = Object.values(schema).filter(attribute => element.hasAttribute(attribute));
  matchingAttributes.reverse();

  for (let index = 0, length = matchingAttributes.length; index < length; index++) {
    const attribute = matchingAttributes[index];

    if (attribute === controller.schema.controller) {
      disconnectElementFromControllers(element, parentElement);
    }

    if (attribute === controller.schema.event) {
      disconnectElementFromEvents(element, parentElement);
    }

    if (attribute === controller.schema.target) {
      disconnectElementFromTargets(element, parentElement);
    }
  }
}

/** Disconnects the element from any controllers, events or targets defined on it. */
function disconnectElementFromDescriptors (element, parentElement) {
  if (element.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const children = Array.from(element.children).reverse();

  for (let index = 0, length = children.length; index < length; index++) {
    const childElement = children[index];

    if (Object.values(schema).some(attribute => childElement.getAttributeNames().includes(attribute))) {
      _disconnectElementFromDescriptors(childElement, element);
    }
  }

  _disconnectElementFromDescriptors(element, parentElement);
}

/** Disconnects the element from the event descriptor. */
function disconnectElementFromEvent (element, parentElement, event) {
  const controllerIdentifier = event.identifier;
  const controllerElement = getClosestMatchingControllerElement(parentElement, controllerIdentifier);

  event.controller = getControllerFromCache(controllerIdentifier, controllerElement);
  event.target = event.target || element;

  removeEventListener(event);
}

/** Disconnects the element from any events specified in the `data-event` attribute. */
function disconnectElementFromEvents (element, parentElement) {
  return parseEventDescriptors(element.getAttribute(controller.schema.event)).map(async event => {
    disconnectElementFromEvent(element, parentElement, event);
  })
}

/** Disconnects the element from any targets specified in the `data-target` attribute. */
function disconnectElementFromTargets (element, parentElement) {
  return parseTargetDescriptors(element.getAttribute(controller.schema.target))
    .map(async ({ controllerIdentifier, target }) => {
      if (controllerIdentifier === "" || typeof target === "undefined") {
        return;
      }
      const controllerElement = getClosestMatchingControllerElement(parentElement, controllerIdentifier);
      const controller = getControllerFromCache(controllerIdentifier, controllerElement);

      removeTargetProperty(controller, target, element);
    })
}

/** Calls the lifecyle callback on the controller and dispatches a matching global custom event. */
function dispatchLifecyleCallback (callbackName, controller, data = {}) {
  if (callbackName in controller) {
    setTimeout(() => controller[callbackName]({ controller, ...data }));
  }

  setTimeout(() => dispatchCustomEvent(controller.identifier + controller.syntax.sep + callbackName, { controller, data }));
}

/** Formats the attribute name for a value. */
function formatAttributeValue (controllerIdentifier, attributeName, suffix = "value") {
  return ["data", controllerIdentifier, attributeName, suffix].join(controller.syntax.nameSep).toLowerCase();
}

/** Formats the property name for a controller. */
function formatPropertyValue () {
  return Array.from(arguments).map((part, index) => index === 0 ? part : capitalize(part)).join("");
}

/** Returns the closest matching controller element. */
function getClosestMatchingControllerElement (element, controllerIdentifier) {
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);

  let dir = "next";
  let currentNode = treeWalker.currentNode;

  while (currentNode) {
    if (element === currentNode) {
      dir = "previous";
    }

    if (dir = "previous") {
      const controllerIdentifiers = currentNode.getAttribute(controller.schema.controller);

      console.log(controllerIdentifiers);

      if (controllerIdentifiers && controllerIdentifiers.includes(controllerIdentifier)) {
        return currentNode;
      }
    }

    currentNode = treeWalker[formatPropertyValue(dir, "Node")]();
  }
}

/** Returns the controller with the identifier and element from cache. */
function getControllerFromCache (identifier, element) {
  const value = cache.controllers.get(identifier);
  return value && value.get(element);
}

/** Gets the default value based on value type. */
function getDefaultValueForType (type = String) {
  let result;

  if (type === Array)
    result = [];
  else if (type === Boolean)
    result = false;
  else if (type === Number)
    result = 0;
  else if (type === Object)
    result = {};
  else if (type === String)
    result = "";

  return result;
}

/** Loads the controller module by the identifier and caches it. */
async function loadControllerModule (identifier) {
  const formattedIdentifier = snakeCase(identifier);
  const modulePath = join(location.origin, dir.components, formattedIdentifier, files.mod);

  cache.modules[identifier] = cache.modules[identifier] || Object.assign({}, await import(modulePath));

  return cache.modules[identifier];
}

/** Observes changes to the DOM and updates the controllers, events and targets that match the changed element. */
export async function observePageChanges (element = document.documentElement) {
  const observer = new MutationObserver(changeList => {
    changeList.filter(mutation => mutation.type === "childList").forEach(({ addedNodes, removedNodes, target }) => {
      Array.from(addedNodes).forEach(connectElementToDescriptors);
      Array.from(removedNodes).forEach(removedNodes => disconnectElementFromDescriptors(removedNodes, target));
    });
    changeList.filter(mutation => mutation.type === "attributes").forEach(({ attributeName, oldValue, target }) => {
      toggleElementDescriptorConnections(target, attributeName, oldValue, target.getAttribute(attributeName));
    });
  })

  function beforeUnload () {
    observer.disconnect();
    window.removeEventListener("beforeunload", beforeUnload);
  }

  window.addEventListener("beforeunload", beforeUnload);

  await connectPageToDescriptors(element);

  observer.observe(element, { attributeFilter: Object.values(schema), attributeOldValue: true, attributes: true, childList: true, subtree: true });
}

/** Returns an array of controller names parsed from the identifier. */
function parseControllerIdentifiers (identifiers) {
  return identifiers.split(controller.syntax.space);
}

/** Returns an array of event details parsed from the descriptor. */
function parseEventDescriptors (descriptors) {
  const result = [];

  descriptors.split(controller.syntax.space).forEach(descriptor => {
    const { 0:eventName, 1:controllerIdentifier } = descriptor.split(controller.syntax.event);
    const { 0:type, 1:global } = eventName.split(controller.syntax.global);
    const target = window[global];

    if (controllerIdentifier && type) {
      const { 0:identifier, 1:method } = controllerIdentifier.split(controller.syntax.sep);
      result.push({ identifier, descriptor, method, target, type });
    }
  })

  return result;
}

/** Returns an array of target  */
function parseTargetDescriptors (descriptors) {
  const result = [];

  descriptors.split(controller.syntax.space).forEach(descriptor => {
    const { 0:identifier, 1:target } = descriptor.split(controller.syntax.sep);
    result.push({ controllerIdentifier: identifier, target });
  })

  return result;
}

/** Parses value based on value type. */
export function parseValue (value = "", type = String) {
  let result = value;

  if (type === Array || type === Object) {
    result = JSON.parse(value);
  } else if (type === Boolean) {
    result = new Boolean(value).valueOf();
  } else if (type === Number) {
    result = parseInt(value, 10);
  }

  return result;
}

/** Removes the controller from the cache. */
function removeControllerFromCache (controller) {
  const { identifier } = controller;
  const value = cache.controllers.get(identifier);

  if (value) {
    value.delete(controller.element);

    if (value.size === 0) {
      cache.controllers.delete(identifier);
    } else {
      cache.controllers.set(identifier, value);
    }
  }
}

/** Removes the event from the element. */
function removeEventListener (event) {
  const { controller, target, type } = event;

  target.removeEventListener(type, event.listener);

  dispatchLifecyleCallback(callbacks.eventDisconnected, controller, { event });

  removeEventListenerFromCache(event);
}

/** Removes the event listener from the cache. */
function removeEventListenerFromCache (event) {
  const { descriptor, target } = event;
  const events = cache.events.get(event.target);

  if (events) {
    events.delete(descriptor);

    if (events.size === 0) {
      cache.events.delete(target);
    } else {
      cache.events.set(target, events);
    }
  }
}

/** Removes the target property from the controller. */
function removeTargetProperty (controller, target, element) {
  const hasTargetName = formatPropertyValue(controller.syntax.has, target, propertySuffix.target);
  const targetName = formatPropertyValue(target, propertySuffix.target);
  const targetsName = formatPropertyValue(target, propertySuffix.targets);

  if (controller[targetName] === element) {
    controller[targetName] = undefined;
    controller[hasTargetName] = false;
  }

  dispatchLifecyleCallback(callbacks.targetDisconnected, controller, { element, target });

  controller[targetsName].splice(controller[targetsName].indexOf(element), 1);
}

/** Converts the value based on value type to a string for use in the DOM. */
function stringifyValue (type, value) {
  let result = value;

  if (type === Array || type === Object) {
    result = JSON.stringify(value);
  } else if (type === Boolean || type === Number) {
    result = value.toString();
  }

  return result;
}

/** Toggles the connection between the cached controllers and the element. */
async function toggleElementControllerConnections (element, oldValue, newValue) {
  const oldControllerIdentifiers = oldValue.split(controller.syntax.space);
  const newControllerIdentifiers = newValue.split(controller.syntax.space);

  // Find the difference between the old and new controller identifier values
  // and connect or disconnect the element.
  oldControllerIdentifiers
    .filter(value => !newControllerIdentifiers.includes(value))
    .concat(newControllerIdentifiers.filter(value => !oldControllerIdentifiers.includes(value)))
    .forEach(async controllerIdentifier => {
      const controller = getControllerFromCache(controllerIdentifier, element);

      if (controller) {
        disconnectElementFromControllers(element);
      } else {
        await connectElementToControllers(element);
      }
    })
}

/** Toggles the connection between the element and the data attribute that was changed. */
async function toggleElementDescriptorConnections (element, attribute, oldValue, newValue) {
  if (attribute === controller.schema.controller) {
    await toggleElementControllerConnections(element, oldValue, newValue);
  }

  if (attribute === controller.schema.event) {
    toggleElementEventConnections(element, oldValue, newValue);
  }

  if (attribute === controller.schema.target) {
    toggleElementTargetConnections(element, oldValue, newValue);
  }
}

/** Toggles the connections between cached events and the element. */
function toggleElementEventConnections (element, oldValue, newValue) {
  const oldEventDescriptors = (oldValue && oldValue.split(controller.syntax.space)) || [];
  const newEventDescriptors = (newValue && newValue.split(controller.syntax.space)) || [];

  // Find the difference between the old and new event descriptor values
  // and connect or disconnect the element.
  oldEventDescriptors
    .filter(value => !newEventDescriptors.includes(value))
    .concat(newEventDescriptors.filter(value => !oldEventDescriptors.includes(value)))
    .filter(String) // Filter empty `data-event` values
    .forEach(eventDescriptor => {
      parseEventDescriptors(eventDescriptor).map(event => {
        event.controller = getControllerFromCache(event.identifer, element);
        event.target = element;

        const cachedEventValue = cache.events.get(event.target);
        const cachedEvent = (cachedEventValue && cachedEventValue.get(event.descriptor)) || undefined;

        if (cachedEvent) {
          removeEventListener(cachedEvent);
        } else {
          connectElementToEvent(element, event);
        }
      })
    })
}

/** Toggles the connections between cached targets and the element. */
function toggleElementTargetConnections (element, oldValue, newValue) {
  const oldTargetDescriptors = oldValue.split(controller.syntax.space);
  const newTargetDescriptors = newValue.split(controller.syntax.space);

  // Find the difference between the old and new event descriptor values
  // and connect or disconnect the element.
  oldTargetDescriptors
    .filter(value => !newTargetDescriptors.includes(value))
    .concat(newTargetDescriptors.filter(value => !oldTargetDescriptors.includes(value)))
    .filter(String) // Filter empty `data-target` values
    .forEach(targetDescriptor => {
      parseTargetDescriptors(targetDescriptor).map(({ controllerIdentifier, target }) => {
        const controllerElement = getClosestMatchingControllerElement(document.documentElement, controllerIdentifier);
        const controller = getControllerFromCache(controllerIdentifier, controllerElement);
        const targetValue = formatPropertyValue(target, propertySuffix.target);

        if (targetValue in controller && controller[targetValue] === element) {
          removeTargetProperty(controller, target, element);
        } else {
          addTargetProperty(controller, target);
        }
      })
    })
}
