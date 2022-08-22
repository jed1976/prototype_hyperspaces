// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Assert */
export { assert } from "https://deno.land/std@0.70.0/testing/asserts.ts";

/** Colors */
export { cyan, gray, italic, red, underline } from "https://deno.land/std@0.70.0/fmt/colors.ts";

/** Encoding */
export { parse as parseYaml, parseAll as parseAllYaml } from "https://deno.land/std@0.70.0/encoding/yaml.ts";
export { parse as parseToml } from "https://deno.land/std@0.70.0/encoding/toml.ts";

/** FS */
export { copy, ensureDir, exists, walk } from "https://deno.land/std@0.70.0/fs/mod.ts";

/** Http */
export { serve } from "https://deno.land/std@0.70.0/http/server.ts";

/** Path */
export { basename, extname, join, SEP } from "https://deno.land/std@0.70.0/path/mod.ts";

/** WS */
export { acceptWebSocket, isWebSocketCloseEvent, isWebSocketPingEvent } from "https://deno.land/std@0.70.0/ws/mod.ts";
