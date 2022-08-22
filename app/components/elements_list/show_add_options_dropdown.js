// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { dispatchCustomEvent } from '../../deps.js'

/**  */
export function showAddOptionsDropdown (ctx) {
  const target = ctx.event.target

  dispatchCustomEvent('dropdown.toggle', { target })
}
