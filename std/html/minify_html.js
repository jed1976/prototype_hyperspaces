// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

export const minifyHtml = string => string
  .replace(/\n/g, "")
  .replace(/[\t ]+\</g, "<")
  .replace(/\>[\t ]+\</g, "><")
  .replace(/\>[\t ]+$/g, ">");
