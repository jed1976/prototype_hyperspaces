// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { assertEquals } from 'https://deno.land/std@0.70.0/testing/asserts.ts'
import { minifyHtml } from './minify_html.js'

Deno.test('minifyHtml', function () {
  const html = `
  <article data-controller="card">
    <h2>Tasks</h2>
    <ul>
      <li data-target="card.task">Task 1</li>
      <li data-target="card.task">Task 2</li>
      <li data-target="card.task">Task 3</li>
    </ul>
  </article>
  `
  const actual = minifyHtml(html)
  const expected = '<article data-controller="card"><h2>Tasks</h2><ul><li data-target="card.task">Task 1</li><li data-target="card.task">Task 2</li><li data-target="card.task">Task 3</li></ul></article>'

  assertEquals(actual, expected)
})
