// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { parseDataFile } from "./parse_data_file.js";

/** Loads and parses the template file. */
export async function loadDataFile (filePath) {
  const data = await Deno.readFile(filePath);
  const decoder = new TextDecoder("utf-8");
  return parseDataFile(decoder.decode(data), filePath);
}
