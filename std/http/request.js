// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

/** Requests a resource and returns a parsed response. */
export async function request (url, body, headers, method = "GET") {
  return await fetch(url, {
    body: JSON.stringify(body),
    headers,
    method,
    redirect: "follow"
  })
  .then(response => {
    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return response.arrayBuffer();
  })
}
