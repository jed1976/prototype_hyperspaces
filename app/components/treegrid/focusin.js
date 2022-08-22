// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { setTabIndexOfFocusableElements } from '../../_util.js'

/**  */
export function focusin (ctx) {
  if (ctx.event.target.getAttribute('role') === 'row') {
    setTabIndexOfFocusableElements(ctx.event.target, 0)
  }

  ctx.event.preventDefault()
}
