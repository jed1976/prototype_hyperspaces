// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { escapeHtml } from "../html/escape_html.js";
import { valueForKeyPath } from "../data/value_for_keypath.js";

const defaultOptions = {
  escapeHTML: false
}

/** Template
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
 *
 *         const template = "<h1>${content.title}</h1>"
 *
 *         const data = {
 *           content: {
 *             title: "hey, world"
 *           }
 *         }
 *
 *         const tpl = templateLiteral(str)
 *         const output = tpl.set(data).get()
 *
 *         ////
 *
 *         <h1>hey, world</h1>
 */
export function templateLiterals (string = "", data = {}, options = defaultOptions) {
  options = Object.assign(defaultOptions, options);

  if (options.escapeHTML) {
    string = escapeHtml(string);
  }

  return new Function(`with(this) { return \`${string}\` }`).call(data);
}
