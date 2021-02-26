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
- [Streaming Data](#streaming-data)
- [Contributing](#contributing)
<!-- /TOC -->

## Basic Usage

Install using [npm][npm] or [yarn][yarn]:

```cmd
npm install @digitallinguistics/toolbox2json
yarn add @digitallinguistics/toolbox2json
```

The library exports a single function, `toolbox2json`, which accepts the path to the Toolbox file as an argument.

```js
import convert from '@digitallinguistics/toolbox2json';

convert(`./my-data.db`);
```

You can also run the library from the command line using `toolbox2json <filePath>`, where `<filePath>` is the path to the Toolbox file.

## Streaming Data

The `toolbox2json` function returns a readable stream of JavaScript objects (where each object represents one entry in the Toolbox file), which you can subscribe to using the `data` event. In this example, each JavaScript object is converted to JSON, and streamed to the `my-data.json` file.

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
