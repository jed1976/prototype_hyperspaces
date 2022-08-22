// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { isButton } from '../../_util.js'
import { getClosestRow } from '../treegrid/_util.js'

/**  */
export function editElement (ctx) {
  const { controller, event } = ctx
  const target = isButton(event.target) ? getClosestRow(event.target) : event.target

  console.log(target)
}
