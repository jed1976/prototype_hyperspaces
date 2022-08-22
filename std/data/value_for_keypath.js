// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Returns the value for the keypath for the specified object. */
export function valueForKeyPath (data, path) {
  if (!path) {
    return data
  }

  const split = path.split('.')
  let target = data

  for (let i = 0; i < split.length; i++) {
    const part = split[i]

    if (part in target) {
      target = target[part]
    } else {
      return
    }
  }

  return target
}
