// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

const isObject = (obj) => {
  return obj !== null && typeof obj === "object";
}

/**
 * Returns a diff between two objects in the form of the
 * added, updated, removed and unchanged properties.
 * @param a An object or array.
 * @param b An object or array.
 * @param deep A boolean that determines whether to recurse through the structures.
 */
export const diffObjects = (a = {}, b = {}, deep = false) => {
  const added = {};
  const updated = {};
  const removed = {};
  const unchanged = {};

  for (const prop in a) {
    if (a.hasOwnProperty(prop)) {
      const bPropValue = b[prop];
      const aPropValue = a[prop];

      if (b.hasOwnProperty(prop)) {
        if (bPropValue === aPropValue) {
          unchanged[prop] = aPropValue;
        } else {
          updated[prop] = deep && isObject(aPropValue) && isObject(bPropValue) ? diffObjects(aPropValue, bPropValue, deep) : { newValue: bPropValue };
        }
      } else {
        removed[prop] = aPropValue;
      }
    }
  }

  for (const prop in b) {
    if (b.hasOwnProperty(prop)) {
      const aPropValue = a[prop];
      const bPropValue = b[prop];

      if (a.hasOwnProperty(prop)) {
        if (aPropValue !== bPropValue) {
          if (!deep || !isObject(aPropValue)) {
            updated[prop].oldValue = aPropValue;
          }
        }
      } else {
        added[prop] = bPropValue;
      }
    }
  }

  return { added, updated, removed, unchanged };
}
