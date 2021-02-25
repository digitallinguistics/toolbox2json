#!/usr/bin/env node

import { Command }       from 'commander/esm.mjs';
import { fileURLToPath } from 'url';
import path              from 'path';
import { readFileSync }  from 'fs';
import toolbox2json      from '../toolbox2json.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const json        = readFileSync(path.join(currentDir, `../package.json`));
const { version } = JSON.parse(json);

const program = new Command();

program
.version(version, `-v, --version`, `output the version number`)
.arguments(`<filePath>`)
.description(`parse the Toolbox file`, {
  filePath: `path to the Toolbox file`,
})
.action(toolbox2json);

program.parse(process.argv);
