# toolbox2json [<span style="color: red;">WORK IN PROGRESS</span>]

A Node / JavaScript library for converting [SIL][SIL] [Toolbox][Toolbox] files in [SFM format][SFM] to [JSON][JSON]. Useful for any linguist working with Toolbox data. Runs as a module or on the command line.

If you use this library for research purposes, please consider citing it using the following model:

> Hieber, Daniel W. 2021. @digitallinguistics/toolbox2json. DOI:10.5281/zenodo.4560920.

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/digitallinguistics/toolbox2json)][releases]
[![tests status](https://github.com/digitallinguistics/toolbox2json/actions/workflows/test.yml/badge.svg?branch=main)][status]
[![GitHub issues](https://img.shields.io/github/issues/digitallinguistics/toolbox2json)][issues]
[![DOI](https://zenodo.org/badge/342063996.svg)](https://zenodo.org/badge/latestdoi/342063996)
[![license](https://img.shields.io/github/license/digitallinguistics/toolbox2json)][license]
[![GitHub repo stars](https://img.shields.io/github/stars/digitallinguistics/toolbox2json?style=social)][GitHub]

## Contents
<!-- TOC -->
- [Basic Usage](#basic-usage)
- [Options](#options)
- [Streaming Data](#streaming-data)
- [Contributing](#contributing)
<!-- /TOC -->

## Basic Usage

Install using [npm][npm] or [yarn][yarn]:

```cmd
npm install @digitallinguistics/toolbox2json
yarn add @digitallinguistics/toolbox2json
```

The library can be run as either an ES module or from the command line.

The ES module exports a single function, `toolbox2json`, which accepts two arguments:

* the path to the Toolbox file (_required_)
* an options object (_optional_)

The resulting JSON is saved to the path specified in the `out` option:

```js
import convert from '@digitallinguistics/toolbox2json';

convert(`./my-data.db`, { out: `my-data.json` });
```

To run the library from the command line, use `toolbox2json <filePath>`. This will print the results to the console by default. To save the JSON output to a file, use the `--out` option or `-o` flag: `toolbox2json <filePath> --out <jsonPath>`. To see the full list of command line options, run `toolbox2json --help`.

## Options

Module   | Command Line | Flag | Type    | Default | Description
---------|--------------|------|---------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         | `--help`     | `-h` |         |         | Display help.
`ndjson` | `--ndjson`   | `-n` | Boolean | `false` | Outputs newline-delimited JSON.
`out`    | `--out`      | `-o` | String  |         | The path where the JSON file should be saved. If this option is provided, the module will return a Promise that resolves when the operation is complete, and no JSON data will be displayed on the command line. Otherwise, the module returns a readable stream of JavaScript objects (one for each entry in the Toolbox file).
`silent` | `--silent`   | `-s` | Boolean | `false` | Silences console output (except for the converted JSON).
         | `--version`  | `-v` |         |         | Output the version number.

## Streaming Data

By default, calling the `toolbox2json` function returns a readable stream of JavaScript objects (where each object represents one entry in the Toolbox file), which you can subscribe to using the `data` event. (If the `out` option is provided, nothing is returned from the function.)

In this example, each JavaScript object is converted to JSON, and streamed to the `my-data.json` file.

```js
import convert       from '@digitallinguistics/toolbox2json';
import fs            from 'fs';
import { Transform } from 'stream';

const readableStream = convert(`./my-data.db`);
const writableStream = fs.createWriteStream(`my-data.json`);

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk.toString()));
    callback();
  }
})

readableStream
.pipe(transformStream)
.pipe(writableStream);
```

## Contributing

* Find a bug? Want to request a feature? [Open an issue.][new-issue]
* Pull requests are welcome!
* Tests are run using [Mocha][Mocha] and [expect.js][expect]. You can run them locally with `npm test`.
* Sample data for testing are located in `/data`.

<!-- LINKS -->
[expect]:    https://github.com/Automattic/expect.js
[GitHub]:    https://github.com/digitallinguistics/toolbox2json#readme
[issues]:    https://github.com/digitallinguistics/toolbox2json/issues
[JSON]:      https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
[license]:   https://github.com/digitallinguistics/toolbox2json/blob/main/LICENSE
[Mocha]:     https://mochajs.org/
[new-issue]: https://github.com/digitallinguistics/toolbox2json/issues/new
[npm]:       https://www.npmjs.com/
[releases]:  https://github.com/digitallinguistics/toolbox2json/releases
[SFM]:       https://www.angelfire.com/planet/linguisticsisfun/ToolboxReferenceManual.pdf
[SIL]:       https://www.sil.org/
[status]:    https://github.com/digitallinguistics/toolbox2json/actions/workflows/test.yml
[Toolbox]:   https://software.sil.org/toolbox/
[yarn]:      https://yarnpkg.com/
