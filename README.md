# toolbox2json [<span style="color: red;">WORK IN PROGRESS</span>]

A Node / JavaScript library for converting [SIL][SIL] [Toolbox][Toolbox] files in [SFM format][SFM] to [JSON][JSON]. Useful for any linguist working with Toolbox data.

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/digitallinguistics/toolbox2json)][releases]
[![GitHub issues](https://img.shields.io/github/issues/digitallinguistics/toolbox2json)][issues]
[![GitHub](https://img.shields.io/github/license/digitallinguistics/toolbox2json)][license]
[![GitHub Repo stars](https://img.shields.io/github/stars/digitallinguistics/toolbox2json?style=social)][GitHub]

<!-- TOC -->
<!-- /TOC -->

## Basic Usage

Install using [npm][npm] or [yarn][yarn]:

```cmd
npm install @digitallinguistics/toolbox2json
yarn add @digitallinguistics/toolbox2json
```

The library exports a single function `toolbox2json`:

```js
import convert from '@digitallinguistics/toolbox2json';

convert();
```

<!-- LINKS -->
[GitHub]:   https://github.com/digitallinguistics/toolbox2json#readme
[issues]:   https://github.com/digitallinguistics/toolbox2json/issues
[JSON]:     https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
[license]:  https://github.com/digitallinguistics/toolbox2json/blob/main/LICENSE
[npm]:      https://www.npmjs.com/
[releases]: https://github.com/digitallinguistics/toolbox2json/releases
[SFM]:      https://www.angelfire.com/planet/linguisticsisfun/ToolboxReferenceManual.pdf
[SIL]:      https://www.sil.org/
[Toolbox]:  https://software.sil.org/toolbox/
[yarn]:     https://yarnpkg.com/
