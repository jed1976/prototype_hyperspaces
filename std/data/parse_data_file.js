// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { extension } from "../../config.js";
import { parseAllYaml, parseYaml, parseToml } from "../../deps.js";

/** Parses the data files based on supported extensions. */
export function parseDataFile (data, name) {
  let output;

  if (name.endsWith(extension.toml)) {
    output = parseToml(data);
  } else if (name.endsWith(extension.yaml) || name.endsWith(extension.yml)) {
    try {
      output = parseYaml(data);
    } catch (e) {
      output = parseAllYaml(data);
    }
  } else if (name.endsWith(extension.json)) {
    output = JSON.parse(data);
  } else {
    output = data;
  }

  return output;
}
