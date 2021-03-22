#!/usr/bin/env node

import { Command }           from 'commander/esm.mjs';
import { load as parseYAML } from 'js-yaml';
import path                  from 'path';
import { readFileSync }      from 'fs';
import toolbox2json          from '../src/toolbox2json.js';

import { fileURLToPath, pathToFileURL } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const json        = readFileSync(path.join(currentDir, `../package.json`));
const { version } = JSON.parse(json);

const program = new Command();

program.configureHelp({ sortOptions: true });

program
.version(version, `-v, --version`, `output the version number`)
.arguments(`<filePath>`)
.description(`parse the Toolbox file`, {
  filePath: `path to the Toolbox file`,
})
.option(`-m, --mappings <mappingsPath>`, `path to file specifying line marker > property name mappings`)
.option(`-n, --ndjson`, `output newline-delimited JSON`, false)
.option(`-o, --out <outPath>`, `path for the output JSON file`)
.option(`-p, --postprocessor <postprocessorPath>`, `path to the postprocessor file`)
.option(`-s, --silent`, `silences console output`, false)
.option(`-t, --transforms <transformsPath>`, `path to transformations file`)
.action(async (filePath, options) => {

  const {
    mappings:      mappingsPath,
    out:           outPath,
    postprocessor: postprocessorPath,
    transforms:    transformsPath,
  } = options;

  // get mappings from file

  let mappings = {};

  if (mappingsPath) {

    const mappingsExt  = path.extname(mappingsPath);
    const mappingsText = readFileSync(mappingsPath, `utf8`);

    if (mappingsExt === `.json`) {
      mappings = JSON.parse(mappingsText);
    } else {
      mappings = parseYAML(mappingsText);
    }

  }

  // get postprocessor function from file

  let postprocessor = entry => entry;

  if (postprocessorPath) {
    const importPath = pathToFileURL(path.join(process.cwd(), postprocessorPath));
    ({ default: postprocessor } = await import(importPath));
  }

  // get transforms from file

  let transforms = {};

  if (transformsPath) {
    const importPath         = pathToFileURL(path.join(process.cwd(), transformsPath));
    ({ default: transforms } = await import(importPath));
  }

  // run module

  Object.assign(options, {
    mappings,
    postprocessor,
    transforms,
  });

  const readStream = toolbox2json(filePath, options);

  if (!outPath) {
    readStream.on(`data`, console.info);
  }

});

program.parseAsync(process.argv);
