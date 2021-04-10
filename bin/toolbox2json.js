#!/usr/bin/env node

import { Command }       from 'commander/esm.mjs';
import { fileURLToPath } from 'url';
import path              from 'path';
import { stringify }     from 'ndjson';
import toolbox2json      from '../src/toolbox2json.js';

import {
  createWriteStream,
  readFileSync,
} from 'fs';

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
.option(`-n, --ndjson`, `output newline-delimited JSON`, false)
.option(`-o, --out <outPath>`, `path for the output JSON file`)
.action((filePath, options) => {

  const entries = toolbox2json(filePath, options);

  if (!options.out) return console.info(entries);

  const jsonStream  = stringify();
  const writeStream = createWriteStream(options.out);

  for (const entry of entries) {
    jsonStream.write(entry);
  }

  jsonStream.pipe(writeStream);

});

program.parseAsync(process.argv);
