// Copyright 2020 Hyperspaces. All rights reserved. MIT license.

import { dir, extension, files, whitespace } from "../config.js";
import { cyan, ensureDir, exists, extname, join, SEP, walk } from "../deps.js";
import { setValueForKeyPath } from "../std/data/set_value_for_keypath.js";
import { hyperscript } from "../std/html/hyperscript.js";
import { getTemplateType } from "../std/data/get_template_type.js";
import { loadDataFile } from "../std/data/load_data_file.js";

const messages = {
  processed: (pathName) => {
    console.log("", "✅", cyan(pathName))
  },
  removed: (pathName) => {
    console.log("", "❌", red(pathName))
  }
}

const projectDirs = {
  _dist: join(Deno.cwd(), dir._dist),
  components: join(Deno.cwd(), dir.components),
  configs: join(Deno.cwd(), dir.configs),
  data: join(Deno.cwd(), dir.data),
  pages: join(Deno.cwd(), dir.pages),
}

const supportedDataFormats = [
  extension.json,
  extension.toml,
  extension.yaml,
  extension.yml
]


/** Build script */
export async function build () {
  await preBuild();
  await ensureDir(projectDirs._dist);
  await processFiles(await getTemplateFiles());
  await postBuild();
}

/** Returns the primary data sources for templates. */
async function getData () {
  return {
    data: await getProjectData(),
    project: await getProjectConfig(),
  }
}

/** Returns the project config. */
async function getProjectConfig () {
  return await loadDataFile(join(projectDirs.configs, files.projectConfig));
}

/** Returns an object representing the contents of the data folder. */
async function getProjectData () {
  let keypath, tempData;

  const data = {};
  const pathName = projectDirs.data;

  for await (const entry of walk(pathName)) {
    if (entry.isFile && isDataFile(entry.name)) {
      keypath = entry.path.replace(pathName + SEP, "").replace(extname(entry.name), "").replaceAll(SEP, ".");
      tempData = setValueForKeyPath(data, keypath, await loadDataFile(entry.path));
    }
    Object.assign(data, tempData);
  }

  return data;
}

/** Returns the source and target paths for the specified file entry. */
function getSourceAndTargetPathsFromFileEntry (file) {
  const source = file.path;
  const target = join(projectDirs._dist, file.path.replace(Deno.cwd(), ""));

  return { source, target }
}

/** Returns the site template files. */
async function getTemplateFiles () {
  const templates = [];

  for await (const entry of walk(projectDirs.pages)) {
    if (isProcessableFile(entry) && isTemplateFile(entry)) {
      templates.push(entry);
    }
  }

  return templates;
}

/** Determines if the file name is a supported data format. */
function isDataFile (name) {
  return supportedDataFormats.includes(extname(name));
}

/** Ensures that the entry is a copyable path for static site generation. */
function isProcessableFile (file) {
  const matches = Object.values(projectDirs).filter(projectDir => file.path.startsWith(projectDir));
  return matches.length > 0 && file.isFile && file.name.startsWith(".") === false;
}

/** Determines if the file name is a supported template format. */
function isTemplateFile (file) {
  return (file.path.startsWith(projectDirs.pages) || file.path.startsWith(projectDirs.components)) &&
    (file.path.endsWith(extension.yaml) || file.path.endsWith(extension.yml));
}

/** Post build step. */
async function postBuild () {
  console.log(whitespace.lf);
  console.timeEnd(" Done");
  console.log(whitespace.lf);
}

/** Pre build step. */
async function preBuild () {
  console.clear();
  console.log(whitespace.lf, "Building", whitespace.lf);
  console.time(" Done");
}

/** Adds files to the templates or resources arrays for processing. */
export async function processFiles (files = []) {
  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i];
    const { source, target } = getSourceAndTargetPathsFromFileEntry(file);

    if (await exists(source)) {
      if (isTemplateFile(file)) {
        await processTemplate(file);
      }

      messages.processed(target);
    } else {
      await Deno.remove(target, { recursive: true });
      messages.removed(target);
    }
  }
}

/** Generates an HTML page from the template. */
async function processTemplate (file) {
  try {
    const spec = await loadDataFile(file.path);
    const specType = getTemplateType(file.path);

    try {
      const html = await hyperscript(spec || null, {
        ...await getData(),
        props: spec.props || {}
      }, { minify: false });

      const pageDirectory = join(projectDirs._dist, file.path.replace(join(Deno.cwd(), dir.pages), "").replace(file.name, ""));
      const filePath = file.path.replace(dir.pages, dir._dist).replace(specType, extension.html);
      const content = new TextEncoder().encode(html);

      await ensureDir(pageDirectory);
      await Deno.writeFile(filePath, content);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
