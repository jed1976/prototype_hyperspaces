// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Executes the command line program with the specified arguments. */
export function exec (args) {
  const proc = Deno.run(args);

  if (proc.success === false) {
    Deno.exit(proc.code);
  }

  return proc;
}
