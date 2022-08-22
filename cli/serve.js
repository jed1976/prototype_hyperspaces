// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { fileServer } from "../std/http/file_server.js";

/** Serves the production build. */
export async function serve () {
  await fileServer();
}
