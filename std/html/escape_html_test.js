// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { assertEquals } from "https://deno.land/std@0.70.0/testing/asserts.ts";
import { escapeHtml } from "./escape_html.js";

Deno.test("escapeHtml", function () {
  const actual = escapeHtml("<script>alert(\"safe & \"escaped\"\")</script>");
  const expected = "&lt;script&gt;alert(&quot;safe &amp; &#39;escaped&#39;&quot;)&lt;/script&gt;";

  assertEquals(actual, expected);
})
