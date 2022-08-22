// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { assertEquals } from "https://deno.land/std@0.70.0/testing/asserts.ts";
import { templateLiterals } from "./template_literals.js";

Deno.test("createTemplate", function () {
  const data = { icon: "🌏", chars: { exclamation: "!" } };
  const tpl = templateLiterals("hey, ${icon}${chars.exclamation}");
  const actual = tpl.set(data).get();
  const expected = `hey, ${data.icon}!`;

  assertEquals(actual, expected);
})
