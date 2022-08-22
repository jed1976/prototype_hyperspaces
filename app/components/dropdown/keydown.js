// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import {
  focusNextItem,
  focusPreviousItem,
  getFocusableElements
} from '../../_util.js'
import { closeDropdownWithKeyboard } from './_util.js'

/**  */
export function keydown (ctx) {
  const { controller, event } = ctx
  const element = controller.element

  const focusableItems = getFocusableElements(element)

  switch (event.key) {
    case 'Tab': {
      if (event.shiftKey) {
        focusPreviousItem(focusableItems)
      } else {
        focusNextItem(focusableItems)
      }
      break
    }
    case 'ArrowDown':
    case 'ArrowRight': {
        focusNextItem(focusableItems)
      break
    }
    case 'ArrowUp':
    case 'ArrowLeft': {
        focusPreviousItem(focusableItems)
      break
    }
    case 'Escape': {
      closeDropdownWithKeyboard(element)
      break
    }
  }

  event.preventDefault()
}
