// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { assertEquals, assertStringContains } from "https://deno.land/std@0.70.0/testing/asserts.ts";
import { hyperscript } from "./hyperscript.js";

const data = {
  class: "accordion",
  external: {
    projects: [
      {
        name: "Project A",
        url: "/123"
      },
      {
        name: "Project B",
        url: "/456"
      },
      {
        name: "Project C",
        url: "/789"
      }
    ]
  }
}

const operationTemplate = [
  {
    "element": {
      "if": [ { "var": "active" }, "details", "div" ]
    },
    "attribute": {
      "class": {
        "if": [ { "var": "active" }, "hs-${class}", "hs-button" ]
      },
      "data-test": {
        "if": [ { "var": "test" }, "${class}", "" ]
      },
      "open": {
        "if": [ { "var": "active" }, true, false]
      }
    },
    "content": [
      {
        "element": "summary",
        "content": [
          {
            "element": "strong",
            "content": [
              "Styles"
            ]
          }
        ]
      },
      "Style content"
    ]
  }
]

Deno.test("createString", function () {
  const template = "Hyperspaces"
  const actual = hyperscript(template, null, { minify: true })
  const expected = template

  assertEquals(actual, expected)
})

Deno.test("nullValue", function () {
  const template = [
    {
      "element": "div",
      "content": [
        {
          "if": [
            { "var": "children" },
            {
              "element": "p",
              "content": "Hey"
            }
          ]
        }
      ]
    }
  ]
  const actual = hyperscript(template, null, { minify: true })
  const expected = "<div></div>"

  assertEquals(actual, expected)
})

Deno.test("createElementWithNoContent", function () {
  const template = [
    {
      "element": "h1"
    }
  ]
  const actual = hyperscript(template, null, { minify: true })
  const expected = `<h1></h1>`

  assertEquals(actual, expected)
})

Deno.test("createEmptyElement", function () {
  const template = [
    {
      "element": "img"
    }
  ]
  const actual = hyperscript(template, null, { minify: true })
  const expected = "<img>"

  assertEquals(actual, expected)
})

Deno.test("createElementWithAttributes", function () {
  const template = [
    {
      "element": "details",
      "attribute": {
        "class": "hs-accordion",
        "open": true
      }
    }
  ]
  const actual = hyperscript(template, null, { minify: true })
  const expected = "<details class="hs-accordion" open></details>"

  assertEquals(actual, expected)
})


Deno.test("createAttributeWithTrueValue", function () {
  const template = [
    {
      "element": "input",
      "attribute": {
        "checked": true,
        "type": "checkbox"
      }
    }
  ]
  const actual = hyperscript(template, null, { minify: true })
  const expected = "<input checked type="checkbox">"

  assertEquals(actual, expected)
})

Deno.test("createAttributeWithFalseValue", function () {
  const template = [
    {
      "element": "input",
      "attribute": {
        "checked": false,
        "type": "checkbox"
      }
    }
  ]
  const actual = hyperscript(template, null, { minify: true })
  const expected = "<input type="checkbox">"

  assertEquals(actual, expected)
})

Deno.test("createAttributeWithEmptyValue", function () {
  const template = [
    {
      "element": "div",
      "attribute": {
        "data-test": ""
      }
    }
  ]
  const actual = hyperscript(template, null, { minify: true })
  const expected = "<div data-test=""></div>"

  assertEquals(actual, expected)
})

Deno.test("ensureAttributesSortedAlphabetically", function () {
  const template = [
    {
      "element": "div",
      "attribute": {
        "title": "Testing",
        "data-controller": "clipboard",
        "data-clipboard-action": "copy"
      }
    }
  ]
  const actual = hyperscript(template, null, { minify: true })
  const expected = "<div data-clipboard-action="copy" data-controller="clipboard" title="Testing"></div>"

  assertEquals(actual, expected)
})

Deno.test("createCollectionWithDefinedData", function () {
  const template = [
    {
      "element": "ul",
      "collection": {
        "keypath": "external.projects",
        "template": [
          {
            "element": "li",
            "content": [
              {
                "element": "a",
                "attribute": {
                  "href": "${url}"
                },
                "content": ["${name}"]
              }
            ]
          }
        ]
      }
    }
  ]
  const actual = hyperscript(template, data, { minify: true })
  const expected = "<ul><li><a href="/123">Project A</a></li><li><a href="/456">Project B</a></li><li><a href="/789">Project C</a></li></ul>"

  assertEquals(actual, expected)
})

Deno.test("createCollectionWithUndefinedData", function () {
  const template = [
    {
      "element": "ul",
      "collection": {
        "keypath": "users",
        "template": [
          {
            "element": "li",
            "content": [
              "${user}"
            ]
          }
        ]
      }
    }
  ]
  const actual = hyperscript(template, data, { minify: true })
  const expected = "<ul></ul>"

  assertEquals(actual, expected)
})

Deno.test("minifyFalse", function () {
  const template = [
    {
      "element": "p",
      "attribute": {
        "class": "t5"
      },
      "content": [
        "This is a test."
      ]
    },
    {
      "element": "p",
      "attribute": {
        "class": "t5"
      },
      "content": [
        "This is only a test."
      ]
    }
  ]

  const actual = hyperscript(template, null, { minify: false })

  assertStringContains(actual, "\n")
})

Deno.test("performOperationIfTrue", function () {
  hyperscript.options = { minfify: true }
  data.active = true

  const actual = hyperscript(operationTemplate, data, { minify: true })
  const expected = "<details class="hs-accordion" data-test="" open><summary><strong>Styles</strong></summary>Style content</details>"

  assertEquals(actual, expected)
})

Deno.test("performOperationIfFalse", function () {
  hyperscript.options = { minfify: true }
  data.active = false

  const actual = hyperscript(operationTemplate, data, { minify: true })
  const expected = "<div class="hs-button" data-test=""><summary><strong>Styles</strong></summary>Style content</div>"

  assertEquals(actual, expected)
})
