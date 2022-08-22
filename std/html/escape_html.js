// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

export function escapeHtml (value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}
