// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { extension } from "../../config.js";

/** Returns the template type (.yaml, .yml) */
export function getTemplateType (file) {
  if (file.endsWith(extension.yaml)) {
    return extension.yaml;
  } else if (file.endsWith(extension.yml)) {
    return extension.yml;
  }

  return undefined;
}
