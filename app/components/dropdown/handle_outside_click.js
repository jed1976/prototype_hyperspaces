// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/**  */
export function handleOutsideClick (ctx) {
  const { controller, event } = ctx
  const element = controller.element

  const dropdownTrigger = document.querySelector(`[aria-controls="${element.id}"]`)

  if (event.target.closest(`[aria-controls="${element.id}"]`)) return

  if (event.target.closest(`[data-element="${element.dataset.element}"]`) === null) {
    element.hidden = true
    dropdownTrigger.setAttribute('aria-expanded', 'false')
  }

  return
}
