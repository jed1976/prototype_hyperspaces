// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Ensure the DOM is ready to be addressed. */
export async function domReady () {
  return await new Promise(resolve => {
    if (document && document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", resolve);
    } else {
      resolve();
    }
  })
}
