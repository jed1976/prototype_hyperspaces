// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { cyan } from "../deps.js";
import { exec } from "../std/sys/exec.js";
import { whitespace } from "../config.js";

const denoCmd = [
  Deno.execPath(),
  "upgrade"
]

const hyperspacesCmd= [
  Deno.execPath(),
  "cache",
  "--reload",
  "-q",
  "https://code.hyperspaces.app/cli.js"
]

/** Updates the version of the Hyperspaces CLI. */
export async function update () {
  const proc = await exec({ cmd: denoCmd, stderr: "piped", stdout: "piped" });
  const { code, success } = await proc.status();

  if (!success) {
    const rawError = await proc.stderrOutput();
    console.error(whitespace.lf, new TextDecoder().decode(rawError));
  } else {
    const proc2 = await exec({ cmd: hyperspacesCmd, stderr: "piped", stdout: "piped" });
    const { code, success } = await proc2.status();

    if (!success) {
      const rawError = await proc.stderrOutput();
      console.error(whitespace.lf, new TextDecoder().decode(rawError));
    } else {
      console.log(
        whitespace.lf,
        "✅",
        cyan("Hyperspaces updated successfully."),
        whitespace.lf
      );
    }
  }
}
