// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { exec } from "../sys/exec.js";
import { dir, extension } from "../../config.js";
import { join } from "../../deps.js";

const fileServerUrl = "https://deno.land/std@0.70.0/http/file_server.ts";

/** Runs a file server. */
export async function fileServer (config) {
  const files = {
    cert: join(Deno.cwd(), dir.configs, config.host + extension.crt),
    key: join(Deno.cwd(), dir.configs, config.host + extension.key),
  }

  const cmd = [
    Deno.execPath(),
    "run",
    "--allow-net",
    "--allow-read",
    "-q",
    fileServerUrl,
    dir._dist,
    "--cors",
    // "--host",
    // config.host,
    // "--cert",
    // files.cert,
    // "--key",
    // files.key,
    "-p",
    config.port
  ]

  const proc = exec({ cmd });
  await proc.status();
}
