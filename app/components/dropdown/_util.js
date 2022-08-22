// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/**  */
export function closeDropdownWithKeyboard (dropdown) {
  const dropdownTrigger = document.querySelector(`[aria-controls="${dropdown.id}"]`)

  dropdown.hidden = true
  dropdownTrigger.setAttribute('aria-expanded', 'false')
  dropdownTrigger.focus()
}

