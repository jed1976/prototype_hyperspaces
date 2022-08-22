// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { assert, cyan, ensureDir, join } from "../deps.js";
import { bytesToUnit } from "../std/fmt/bytes.js";
import { dir, files, whitespace } from "../config.js";


const messages = {
  compiled: (pathName, fileInfo) => {
    console.log(whitespace.lf, cyan(pathName), `(${bytesToUnit(fileInfo.size)})`);
  }
}

const sources = [
  join(Deno.cwd(), dir.cli, files.mod),
  join(Deno.cwd(), dir.runtime, files.mod),
]

const targets = [
  join(Deno.cwd(), dir._dist, files.cli),
  join(Deno.cwd(), dir._dist, files.runtime),
]

if (import.meta.main) {
  console.log(whitespace.lf, "Compiling");

  for (let i = 0, l = sources.length; i < l; i++) {
    const code = sources[i];

    const [diagnostics, emit] = await Deno.bundle(code);
    assert(diagnostics == null);

    await ensureDir(dir._dist);

    const encoder = new TextEncoder();
    const data = encoder.encode(emit);

    const pathName = targets[i];

    await Deno.writeFile(pathName, data);
    const fileInfo = await Deno.stat(pathName);

    messages.compiled(targets[i], fileInfo);
  }

  console.log(whitespace.lf, "✅ Done", whitespace.lf);
}
