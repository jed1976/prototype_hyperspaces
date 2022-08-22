// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { port } from "../config.js";

/** Registers a WebSocket connection for file reloading. */
export function registerWebSocketConnection () {
  const host = `ws://localhost:${port.ws}`;
  const socket = new WebSocket(host);

  socket.addEventListener("close", event => {
    console.log("The connection has been closed successfully.");
  })

  socket.addEventListener("error", function (event) {
    console.log(`WebSocket error: ${event}`);
  })

  socket.addEventListener("message", event => {
    if (event.data === "reload") {
      console.log("Reloading");
      location.reload();
    }
  })

  socket.addEventListener("open", event => {
    console.log(`Connected to ${host}`);
  })
}
