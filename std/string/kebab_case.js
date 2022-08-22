// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Kebab-case the string. */
export function kebabCase (string) {
  return string
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(match => match.toLowerCase())
    .join('-')
}
