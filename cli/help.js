// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { cyan, gray, italic, underline } from "../deps.js";
import { whitespace } from "../config.js";

/** Help options. */
export function help () {
  console.clear();

  console.log(
    whitespace.lf,
    underline('Hyperspaces'),
  );
  console.log(
    whitespace.lf,
    "Create new project",
    whitespace.lf,
    cyan("hyperspaces create"), gray(italic("projectname"))
  );
  console.log(
    whitespace.lf,
    "Start development server",
    whitespace.lf,
    cyan("hyperspaces develop")
  );
  console.log(
    whitespace.lf,
    "Create a production build",
    whitespace.lf,
    cyan("hyperspaces build")
  );
  console.log(
    whitespace.lf,
    "Serve the production build locally",
    whitespace.lf,
    cyan("hyperspaces serve"),
  );
  console.log(
    whitespace.lf,
    "Check for updates and install them",
    whitespace.lf,
    cyan("hyperspaces update"),
  );
  console.log(whitespace.lf);
}
