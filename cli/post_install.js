// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { dir, files, whitespace } from "../config.js";
import { ensureDir, exists, italic, join } from "../deps.js";
import { exec } from "../std/sys/exec.js";

export async function postInstall () {
  const home = Deno.env.get("HOME")
  const paths = {};
  paths.hyperspaces = join(home, dir.hyperspaces);
  paths.output = join(home, dir.hyperspaces);
  paths.rootCA = {
    key: join(paths.hyperspaces, files.rootCAKey),
    pem: join(paths.hyperspaces, files.rootCAPem)
  }

  if (await exists(paths.hyperspaces)) {
    await Deno.remove(paths.hyperspaces, { recursive: true });
  }

  try {
    await ensureDir(join(paths.output, dir.cert));

    const rootCAKeyCmd = ["openssl", "genrsa", "-out", paths.rootCA.key, 4096];
    let proc = exec({ cmd: rootCAKeyCmd, stderr: "null", stdout: "null" });
    await proc.status();

    const rootCAPemCmd = ["openssl", "req", "-x509", "-new", "-nodes", "-key", paths.rootCA.key, "-sha256", "-days", 1825, "-out", paths.rootCA.pem, "-subj", "/C=US/ST=MI/L=Detroit/O=Hyperspaces/OU=/CN=Hyperspaces"];
    proc = exec({ cmd: rootCAPemCmd, stderr: "null", stdout: "null" });
    await proc.status();

    if (Deno.build.os === "darwin") {
      console.log(whitespace.cr);
      console.log("Adding", italic("Hyperspaces Root CA"), "to your keychain. Password may be required.");

      const cmd = ["sudo", "security", "add-trusted-cert", "-d", "-r", "trustRoot", "-k", "/Library/Keychains/System.keychain", paths.rootCA.pem];
      proc = exec({ cmd });
      const { code, success } = await proc.status();

      if (success === false) {
        throw new Error(`There was an error adding the root CA to the keychain. Error code: ${code}`);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}
