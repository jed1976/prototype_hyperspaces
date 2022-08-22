// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { focusFirstItem } from '../../_util.js'

/**  */
export function toggle (ctx) {
  const target = ctx.event.detail.target
  const targettedDropdownId = target.getAttribute('aria-controls')

  if (this.element.id !== targettedDropdownId) return

  if (this.element.hidden) {
    this.element.hidden = false
    this.element.setAttribute('aria-labelledby', target.id)
    target.setAttribute('aria-expanded', 'true')

    focusFirstItem(this.element)
  } else {
    this.element.hidden = true
    this.element.removeAttribute('aria-labelledby')
    target.setAttribute('aria-expanded', 'false')
  }
}
