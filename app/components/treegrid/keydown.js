// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import {
  getFocusableElements,
  hasChildren,
  isAriaExpanded,
  isButton,
  isExpandable,
  isShown,
  setRovingFocus,
  setTabIndexOfFocusableElements
} from '../../_util.js'
import {
  dispatchPrimaryEvent,
  focusButtonInCell,
  getClosestCell,
  getClosestRow,
  getFirstCell,
  isRow,
  moveRowFocus,
  toggleRow
} from './_util.js'

/**  */
export function keydown (ctx) {
  const { controller, event } = ctx
  const { rowTargets } = controller
  const { target } = event

  switch (event.key) {
    case 'Tab': {
      if (event.shiftKey) {
        if (isButton(target)) {
          const previousCell = getClosestCell(target).previousElementSibling

          if (previousCell && hasChildren(previousCell)) {
            focusButtonInCell(previousCell)
          } else {
            const parentRow = getClosestRow(target)
            setRovingFocus(parentRow)
          }
        } else if (isRow(target)) {
          setTabIndexOfFocusableElements(target, -1)
          return
        }
      } else {
        if (isButton(target)) {
          const nextCell = getClosestCell(target).nextElementSibling

          if (nextCell) {
            focusButtonInCell(nextCell)
          } else {
            setTabIndexOfFocusableElements(getClosestRow(target), -1)
            return
          }
        } else if (isRow(target)) {
          let nextCell = getFirstCell(target)

          // Check each cell until we find one that's not empty to focus
          while (nextCell) {
            if (hasChildren(nextCell)) {
              focusButtonInCell(nextCell)
              break
            }

            nextCell = nextCell.nextElementSibling
          }
        }
      }
      break
    }
    case 'ArrowDown': {
      if (isButton(target)) {
        let nextRow = getClosestRow(target).nextElementSibling

        while (nextRow) {
          if (isShown(nextRow)) {
            setRovingFocus(nextRow)
            break
          }

          nextRow = nextRow.nextElementSibling
        }
      } else if (isRow(target)) {
        let nextRow = target.nextElementSibling

        while (nextRow) {
          if (isShown(nextRow)) {
            moveRowFocus(target, nextRow)
            break
          }

          nextRow = nextRow.nextElementSibling
        }
      }
      break
    }
    case 'ArrowUp': {
      if (isButton(target)) {
        let previousRow = getClosestRow(target).previousElementSibling

        while (previousRow) {
          if (isShown(previousRow)) {
            setRovingFocus(previousRow)
            break
          }

          previousRow = previousRow.previousElementSibling
        }
      } else if (isRow(target)) {
        let previousRow = target.previousElementSibling

        while (previousRow) {
          if (isShown(previousRow)) {
            moveRowFocus(target, previousRow)
            break
          }

          previousRow = previousRow.previousElementSibling
        }
      }
      break
    }
    case 'ArrowLeft': {
      if (isButton(target)) {
        const previousCell = getClosestCell(target).previousElementSibling

        if (previousCell && hasChildren(previousCell)) {
          focusButtonInCell(previousCell)
        } else {
          const parentRow = getClosestRow(target)
          setRovingFocus(parentRow)
        }
      } else if (isRow(target)) {
        if (isAriaExpanded(target)) {
          toggleRow(target, rowTargets)
        } else {
          let previousRow = target.previousElementSibling

          if (previousRow) {
            while (previousRow != controller.element) {
              if (previousRow.getAttribute('aria-level') < target.getAttribute('aria-level')) {
                moveRowFocus(target, previousRow)
                break
              }

              previousRow = previousRow.previousElementSibling
            }
          }
        }
      }
      break
    }
    case 'ArrowRight': {
      if (isButton(target)) {
        const nextCell = getClosestCell(target).nextElementSibling

        if (nextCell) {
          focusButtonInCell(nextCell)
        }
      } else if (isRow(target)) {
        if (isExpandable(target) && !isAriaExpanded(target)) {
          toggleRow(target, rowTargets)
        } else {
          // Get the first cell
          let nextCell = getFirstCell(target)

          // Check each cell until we find one that's not empty to focus
          while (nextCell) {
            if (hasChildren(nextCell)) {
              focusButtonInCell(nextCell)
              break
            }

            nextCell = nextCell.nextElementSibling
          }
        }
      }
      break
    }
    case 'Home': {
      if (isButton(target)) {
        const currentCell = getClosestCell(target)
        const currentRow = getClosestRow(target)
        const currentRowCells = Array.from(currentRow.children)
        const currentRowFocusableElements = getFocusableElements(currentRow)

        if (currentRowCells.indexOf(currentCell) === 0) {
          return
        } else {
          setRovingFocus(currentRowFocusableElements[0])
        }
      } else if (isRow(target)) {
        if (rowTargets.indexOf(target) === 0) {
          return
        } else {
          setRovingFocus(rowTargets[0])
        }
      }
      break
    }
    case 'End': {
      if (isButton(target)) {
        const currentCell = getClosestCell(target)
        const currentRowCells = Array.from(getClosestRow(target).children)
        const lastCellIndex = currentRowCells.length - 1

        if (currentRowCells.indexOf(currentCell) === lastCellIndex) {
          return
        } else {
          focusButtonInCell(currentRowCells[lastCellIndex])
        }
      } else if (isRow(target)) {
        const shownRows = rowTargets.filter(row => isShown(row))
        const lastRowIndex = shownRows.length - 1

        if (rowTargets.indexOf(target) === lastRowIndex) {
          return
        } else {
          setRovingFocus(shownRows[lastRowIndex])
        }
      }
      break
    }
    case 'Enter': {
      if (isButton(target)) {
        target.click()
      } else {
        dispatchPrimaryEvent(target, controller)
      }
      break
    }
  }

  event.preventDefault()
}
