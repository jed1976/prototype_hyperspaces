// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { build } from "./build.js";
import { create } from "./create.js";
import { develop } from "./develop.js";
import { help } from "./help.js";
import { postInstall } from "./post_install.js";
import { serve } from "./serve.js";
import { update } from "./update.js";

/** Main command-line interface entry point. */
export function cli () {
  const args = Deno.args;
  const command = args[0];

  if (command === "build") {
    build({ exit: true });
  } else if (command === "create") {
    create(args[1]);
  } else if (command === "develop") {
    develop();
  } else if (command === "help" || !command) {
    help();
  } else if (command === "post_install") {
    postInstall();
  } else if (command === "serve") {
    serve();
  } else if (command === "update") {
    update();
  }
}

if (import.meta.main) {
  cli();
}
