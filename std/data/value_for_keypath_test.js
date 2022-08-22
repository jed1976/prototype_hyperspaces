// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { assertEquals } from 'https://deno.land/std@0.70.0/testing/asserts.ts'
import { valueForKeyPath } from './value_for_keypath.js'

const data = {
  app: {
    title: 'Hyperspaces'
  }
}

Deno.test('getKeypath', function () {
  const actual = valueForKeyPath(data, 'app.title')
  const expected = data.app.title

  assertEquals(actual, expected)
})

Deno.test('getUndefinedKeypath', function () {
  const actual = valueForKeyPath(data, 'app.version')
  const expected = undefined

  assertEquals(actual, expected)
})
