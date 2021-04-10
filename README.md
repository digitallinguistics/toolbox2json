# toolbox2json

A Node / JavaScript library for parsing [SIL][SIL] [Toolbox][Toolbox] dictionary files and optionally converting them to [JSON][JSON]. Useful for any linguist working with a Toolbox dictionary database. Runs as a module or on the command line.

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
  - [Running as a Module](#running-as-a-module)
  - [Running on the Command Line](#running-on-the-command-line)
- [Field Mappings](#field-mappings)
- [Options](#options)
- [Contributing](#contributing)
<!-- /TOC -->

## Basic Usage

Install using [npm][npm] or [yarn][yarn]:

```cmd
npm install @digitallinguistics/toolbox2json
yarn add @digitallinguistics/toolbox2json
```

The library can be run as either an ES module or from the command line.

### Running as a Module

The ES module exports a single function, `toolbox2json`, which accepts two arguments:

* the path to the Toolbox file (_required_)
* an options object (_optional_)

By default, the library returns a Promise that resolves to an Array of the entries in the Toolbox file.

```js
import convert from '@digitallinguistics/toolbox2json';

const entries = await convert(`./my-data.db`);
```

You can also save the data to a JSON file by providing the `out` option:

```js
import convert from '@digitallinguistics/toolbox2json';

await convert(`./my-data.db`, { out: `my-data.json` });
```

### Running on the Command Line

To run the library from the command line, use `toolbox2json <filePath>`. (The `toolbox2json` command is added to the PATH when the library is installed.) This will print the results to the console by default. To save the JSON output to a file, use the `--out` option or `-o` flag: `toolbox2json <filePath> --out <jsonPath>`. To see the full list of command line options, run `toolbox2json --help`.

## Field Mappings

The library will use line markers as property names when converting data. For example, if the Toolbox file has a field `\txn` for transcriptions, that would be converted to `{ "txn": "<data>" }`.

If the Toolbox entry contains multiple instances of the same line marker, they will be converted to an array by default. For example, if the Toolbox file has two `\gl` fields containing the data `fire` and `light`, those would be converted to `{ "gl": ["fire", "light"] }`.

## Options

| Module       | Command Line    | Flag | Type    | Default  | Description                                                                                                                                                                                                                                                          |
|--------------|-----------------|------|---------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|              | `--help`        | `-h` |         |          | Display help.                                                                                                                                                                                                                                                        |
| `parseError` | `--parse-error` | `-e` | String  | `"warn"` | How to handle errors when parsing records. `"error"`: Stop and throw an error. `"none"`: Fail silently and continue. No object is created for that entry. `"object"`: Return a ParseError object for that entry. `"warn"`: Throw a warning and continue (_default_). |
| `ndjson`     | `--ndjson`      | `-n` | Boolean | `false`  | Outputs newline-delimited JSON.                                                                                                                                                                                                                                      |
| `out`        | `--out`         | `-o` | String  |          | The path where the JSON file should be saved. If this option is provided, the module will return a Promise that resolves when the operation is complete, and no JSON data will be displayed on the command line.                                                     |
|              | `--version`     | `-v` |         |          | Output the version number.                                                                                                                                                                                                                                           |

## Contributing

* Find a bug? Want to request a feature? [Open an issue.][new-issue]
* Pull requests are welcome!
* Tests are run using [Mocha][Mocha] and [Chai][Chai]. You can run them locally with `npm test`.
* Sample data for testing are located in `/test`.

<!-- LINKS -->
[Chai]:      https://www.chaijs.com/
[GitHub]:    https://github.com/digitallinguistics/toolbox2json#readme
[issues]:    https://github.com/digitallinguistics/toolbox2json/issues
[JSON]:      https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
[license]:   https://github.com/digitallinguistics/toolbox2json/blob/main/LICENSE
[Mocha]:     https://mochajs.org/
[new-issue]: https://github.com/digitallinguistics/toolbox2json/issues/new
[npm]:       https://www.npmjs.com/
[releases]:  https://github.com/digitallinguistics/toolbox2json/releases
[SIL]:       https://www.sil.org/
[status]:    https://github.com/digitallinguistics/toolbox2json/actions/workflows/test.yml
[Toolbox]:   https://software.sil.org/toolbox/
[yarn]:      https://yarnpkg.com/
