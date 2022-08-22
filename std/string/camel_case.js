// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Camel-case the string. */
export function camelCase (string) {
  return string
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, character) => character.toUpperCase());
}
