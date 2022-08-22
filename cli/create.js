// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { dir, files } from "../config.js";
import { cyan, ensureDir, join, SEP } from "../deps.js";
import { exec } from "../std/sys/exec.js";
import { snakeCase } from "../std/string/snake_case.js";


/** Creates a new project. */
export async function create (name) {
  name = snakeCase(name);

  // const home = Deno.env.get("HOME")

  // const localPath = {
  //   configs: join(Deno.cwd(), name, SEP),
  //   output: join(Deno.cwd(), name),
  //   rootCA: {
  //     key: join(home, dir.hs, dir.cert, files.rootCAKey),
  //     pem: join(home, dir.hs, dir.cert, files.rootCAPem)
  //   }
  // }

  try {
    // Generate cert for site

    // if (success) {
      console.log(`\n✅ Created project`, cyan(`"${name}"\n`));
    // } else {
      // throw new Error(`There was an error generating the TLS certificate. Error code: ${code}`);
    // }
  } catch (error) {
    throw new Error(error);
  }
}
