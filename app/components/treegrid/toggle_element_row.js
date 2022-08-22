// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { toggleRow } from './_util.js'

/**  */
export function toggleElementRow (ctx) {
  const target = ctx.event.target
  const rowTargets = ctx.controller.rowTargets

  toggleRow(target, rowTargets)
}
