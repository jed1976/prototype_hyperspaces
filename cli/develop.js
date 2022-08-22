// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { build, processFiles } from "./build.js";
import { dir, events, extension, files, port } from "../config.js";
import { acceptWebSocket, basename, isWebSocketCloseEvent, isWebSocketPingEvent, SEP, serve } from "../deps.js";
import { fileServer } from "../std/http/file_server.js"
import { dispatchCustomEvent } from "../std/event/dispatch_custom_event.js";


const ignorePaths = [
  dir._dist,
  files.dsStore,
  files.winNewFolder,
  files.macNewFolder,
]

const projectName = basename(Deno.cwd());

const watchDelay = 500;


/** Returns a Deno FileInfo object from the specified event object. */
export async function createFileInfoFromEvent (event) {
  let fileInfo = {}
  const pathName = event.paths[0];

  try {
    fileInfo = await Deno.stat(event.paths[0]);
  } catch (error) {}

  fileInfo.changeType = event.kind;
  fileInfo.name = pathName.split(SEP).pop();
  fileInfo.path = pathName;

  return fileInfo;
}

/** Runs the Deno WebSocket server. */
async function createWebSocketServer (portNumber = port.ws) {
  for await (const req of serve(`:${portNumber}`)) {
    const { conn, r:bufReader, w:bufWriter, headers } = req;

    try {
      const socket = await acceptWebSocket({ conn, bufReader, bufWriter, headers });
      webSocketHandler(socket);
    } catch (error) {
      console.error(`❗️Failed to accept websocket: ${error}`);
      await req.respond({ status: 400 });
    }
  }
}

/** Runs a development server. */
export async function develop () {
  await build();
  watchFiles();
  createWebSocketServer();
  fileServer({
    host: [projectName, dir.hs, extension.test].join(""),
    port: port.fs
  });
}

/** Sends the reload message to the client. */
async function sendReloadMessage (socket) {
  if (socket.isClosed === false) {
    await socket.send("reload");
  }
}

/** Watches for file changes and dispatches the custom event `fileChanged`. */
async function watchFiles (pathName = Deno.cwd()) {
  let reloading = false;
  const watcher = Deno.watchFs(pathName);

  for await (const event of watcher) {
    if ((event.kind === "create" || event.kind === "modify") && reloading === false) {
      reloading = true;

      const fileInfo = await createFileInfoFromEvent(event);
      const ignoreMatches = ignorePaths.filter(ignorePath => fileInfo.name === ignorePath);

      if (ignoreMatches.length === 0) {
        await processFiles([fileInfo]);
        dispatchCustomEvent(events.fileChanged, { fileInfo });
      }

      setTimeout(() => reloading = false, watchDelay);
    }
  }
}

/** Handler for WebSocket requests. */
async function webSocketHandler (socket) {
  addEventListener(events.fileChanged, _ => sendReloadMessage(socket));

  try {
    for await (const event of socket) {
      if (typeof event === "string") {
        // console.log("text", event);
      } else if (event instanceof Uint8Array) {
        // console.log("binary", event);
      } else if (isWebSocketPingEvent(event)) {
        const [, body] = event;
        // console.log("ping", body);
      } else if (isWebSocketCloseEvent(event)) {
        // console.log("close", event);
      }
    }
  } catch (err) {
    console.error(`❗️Failed to receive frame from WebSocket: ${err}`);

    if (socket.isClosed === false) {
      await socket.close().catch(console.error);
    }
  }
}
