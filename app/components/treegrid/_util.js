// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import {
  getFocusableElements,
  isAriaExpanded,
  setAriaExpanded,
  setRovingFocus,
  setTabIndexOfFocusableElements
} from '../../_util.js'

/**  */
export function dispatchPrimaryEvent (target, controller) {
  if (!isRow(target)) {
    target = getClosestRow(target)
  }

  target.dispatchEvent(new CustomEvent('treegrid.primaryEvent', {
    bubbles: true,
    detail: { root: controller.element, target }
  }))
}

/**  */
export function focusButtonInCell (cell) {
  const buttons = getFocusableElements(cell)
  setRovingFocus(buttons[0])
}

/**  */
export function getAriaLevel (row) {
  return row && parseInt(row.getAttribute('aria-level'))
}

/**  */
export function getClosestCell (target) {
  return target.closest('[role="gridcell"]')
}

/**  */
export function getClosestRow (target) {
  return target.closest('[role="row"]')
}

/**  */
export function getFirstCell (target) {
  return target.querySelector('[role="gridcell"]')
}

/**  */
export function getRowWithFocus () {
  return getContainingRow(document.activeElement)
}

/**  */
export function isRow (target) {
 return target.getAttribute('role') === 'row'
}

/**  */
export function isRowFocused (target) {
  return target.closest('[role="row"]') === document.activeElement
}

/**  */
export function moveRowFocus (currentRow, newRow) {
  setRovingFocus(newRow)
  setTabIndexOfFocusableElements(currentRow, -1)
  currentRow.tabIndex = -1
}

/**  */
export function toggleRow (target, rowTargets) {
  // Get closest row from target element
  const row = getClosestRow(target)
  if (!row) { return }

  let rowToggled
  let currentRowIndex = rowTargets.indexOf(row)

  const currentAriaLevel = getAriaLevel(row)

  // Starting from current row index, check each subsequent row for `aria-level` that is 1 more than current and show them
  const shouldExpandLevel = []
  shouldExpandLevel[currentAriaLevel + 1] = !isAriaExpanded(row)

  while (++currentRowIndex < rowTargets.length) {
    const nextRow = rowTargets[currentRowIndex]
    const newRowAriaLevel = getAriaLevel(nextRow)

    // Next row is not a level down from current row
    if (newRowAriaLevel <= currentAriaLevel) {
      break
    }

    // Only expand the next level if this level is expanded and previous level is expanded
    shouldExpandLevel[newRowAriaLevel + 1] = shouldExpandLevel[newRowAriaLevel] && isAriaExpanded(nextRow)

    const shouldHideRow = !shouldExpandLevel[newRowAriaLevel]

    if (shouldHideRow !== nextRow.hasAttribute('hidden')) {
      nextRow.toggleAttribute('hidden', shouldHideRow)
      rowToggled = true
    }
  }

  if (rowToggled) {
    setAriaExpanded(row, !isAriaExpanded(row))
  }
}
