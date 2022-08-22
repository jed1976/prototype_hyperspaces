// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Snake-case the string. */
export function snakeCase (string) {
  return string
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
    .replace(/([a-z])([A-Z])/g, (_, a, b) => a + "_" + b.toLowerCase())
    .replace(/[^A-Za-z0-9]+|_+/g, "_")
    .toLowerCase();
}
