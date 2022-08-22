// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Common directories. */
export const dir = {
  app: "app",
  cli: "cli",
  _dist: "_dist",
  components: "components",
  configs: "configs",
  data: "data",
  git: ".git",
  hs: ".hyperspaces",
  pages: "pages",
  _project: "_project",
  runtime: "runtime",
}

/** File extensions. */
export const extension = {
  crt: ".crt",
  html: ".html",
  js: ".js",
  json: ".json",
  key: ".key",
  pem: ".pem",
  png: ".png",
  svg: ".svg",
  test: ".test",
  toml: ".toml",
  webmanifest: ".webmanifest",
  xml: ".xml",
  yaml: ".yaml",
  yml: ".yml",
}

export const events = {
  fileChanged: "hs:fileChanged",
}

/** Common file names. */
export const files = {
  cli: "cli" + extension.js,
  componentSpec: "spec",
  deps: "deps" + extension.js,
  dsStore: ".DS_Store",
  macNewFolder: "untitled folder",
  mod: "mod" + extension.js,
  projectConfig: "project" + extension.yml,
  rootCAKey: "hyperspaces_CA" + extension.key,
  rootCAPem: "hyperspaces_CA" + extension.pem,
  runtime: "runtime" + extension.js,
  template: "index" + extension.json,
  winNewFolder: "New folder",
}

/** Port configs */
export const port = {
  fs: 49737,
  ws: 32277
}

/** Whitespace characters. https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace */
export const whitespace = {
  cr: "\r",
  lf: "\n",
  space: " ",
  tab: "\t"
}
