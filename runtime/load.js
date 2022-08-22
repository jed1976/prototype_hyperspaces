// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { domReady } from "./dom_ready.js";
import { observePageChanges } from "./controller.js";
import { registerServiceWorker } from "./register_service_worker.js";
import { registerWebSocketConnection } from "./register_web_socket_connection.js";

/** The main entry point. */
export function load (element = document.documentElement) {
  domReady();
  registerServiceWorker();
  registerWebSocketConnection();
  observePageChanges(element);
}
