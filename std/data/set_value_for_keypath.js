// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Sets the value on the keypath for the specified object. */
export function setValueForKeyPath (data, path, value) {
  const split = path.split('.')
  let target = data = { ...data }

  for (let i = 0; i < split.length; i++) {
    const part = split[i]

    if (i === split.length - 1) {
      target[part] = value
    } else {
      target = target[part] = {
        ...target[part]
      }
    }
  }

  return data
}
