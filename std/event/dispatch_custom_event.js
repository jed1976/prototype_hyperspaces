// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Triggers a custom event that can be listened to with window.addEventListener(). */
export function dispatchCustomEvent (type = '', detail = {}, target = window) {
  // Custom events are synchronous, force it to be asynchronous with `setTimeout`
  setTimeout(() => target.dispatchEvent(
    new CustomEvent(type, { bubbles: true, cancelable: true, detail }))
  )
}
