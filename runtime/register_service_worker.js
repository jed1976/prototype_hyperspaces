// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { files } from "../config.js";
import { join } from "../deps.js";

/** Registers the Service Worker. */
export async function registerServiceWorker () {
  if ("serviceWorker" in navigator === false) {
    throw Error("Service worker not supported.");
  }

  const registration = await navigator.serviceWorker.register(join(location.origin, files.serviceWorker), { scope: "/" });

  console.log(registration);
}
