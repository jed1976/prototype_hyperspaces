// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Capitalize the first letter of the string. */
export function capitalize (string) {
  if (typeof string !== "string") {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}
