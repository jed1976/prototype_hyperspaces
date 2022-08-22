// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { assert } from "https://deno.land/std@0.70.0/testing/asserts.ts";
import { jsonLogic } from "./json_logic.js";

Deno.test("isLogic", function () {
  const data = { active: true }
  const logic = { "if": [ { "var": "active" }, "Yes", "No" ] }

  const actual = jsonLogic.is_logic(logic);
  const expected = true;

  assert(actual, expected);
})
