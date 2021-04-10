import { createInterface as createLineStream } from 'readline';
import { EOL }                                 from 'os';
import ProgressBar                             from 'progress';
import { Transform }                           from 'stream';

import {
  createReadStream,
  createWriteStream,
  promises as fsPromises,
} from 'fs';

const { stat } = fsPromises;

const lineRegExp = /^\\(?<marker>\S+)\s*(?<data>.*)$/u;

/**
 * Parses a raw line into an object with "marker" and "data" properties.
 * @param  {String} line The raw line from the Toolbox file
 * @return {Object}      Returns an object with "marker" and "data" properties.
 */
function getLineData(line) {
  return line.trim().match(lineRegExp).groups;
}

/**
 * A Transform Stream that transforms an array of Toolbox lines into a JavaScript object representing a single entry.
 * @extends Transform
 */
class Lines2JSStream extends Transform {

  constructor({ parseError }) {

    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });

    this.blankLineRegExp = /^\s*$/u;
    this.fileHeader      = true; // the first set of lines is the file header
    this.lines           = [];
    this.parseError      = parseError;

  }

  // This runs when the stream has no more data, but before calling "end".
  // It allows you to process any remaining data in the pipeline.
  _flush(callback) {
    this.parseLines(callback);
  }

  _transform(line, encoding, callback) {

    const isBlank = this.blankLineRegExp.test(line);

    if (isBlank) {               // a blank line indicates the end of a Toolbox entry; ready to parse entry

      if (this.fileHeader) {     // ignore file header lines
        this.lines      = [];
        this.fileHeader = false;
        return callback();
      }

      this.parseLines(callback); // parse current set of lines into a JavaScript object

    } else {                     // end of entry not yet reached

      this.lines.push(line);     // add line to current entry
      callback();

    }

  }

  parseLines(callback) {

    try {

      const linesMap = this.lines
      .map(getLineData)
      .reduce((map, { marker, data }) => {

        if (map.has(marker)) {

          const currentData = map.get(marker);
          if (Array.isArray(currentData)) currentData.push(data);
          else map.set(marker, [currentData, data]);

        } else {

          map.set(marker, data);

        }

        return map;

      }, new Map);

      const entry = Object.fromEntries(linesMap);

      this.push(entry);

    } catch (e) {

      const err = new ParseError(e.message);

      switch (this.parseError) {
        case `error`: return callback(err);
        case `none`:  break;
        case `object`:
          this.push({
            lines:   this.lines,
            message: err.message,
            name:    err.name,
          });
          break;
        default: console.warn(err);
      }

    } finally {

      this.lines = []; // reset lines for next entry
      callback();

    }

  }

}

class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = `ParseError`;
  }
}

function writeEntries(entries, outPath, ndjson) {
  return new Promise((resolve, reject) => {

    const separator   = ndjson ? EOL : `,`;
    const writeStream = createWriteStream(outPath);

    writeStream.on(`error`, reject);
    writeStream.on(`close`, resolve);

    if (!ndjson) writeStream.write(`[`);

    entries.forEach((entry, i) => {
      writeStream.write(JSON.stringify(entry));
      if (i < entries.length - 1) writeStream.write(separator);
    });

    if (!ndjson) writeStream.write(`]${EOL}`);

    writeStream.end();

  });
}

export default async function toolbox2json(filePath, {
  ndjson = false,
  out,
  parseError = 'warn',
  silent = false,
} = {}) {

  if (!filePath) {
    throw new TypeError(`Please provide a <filePath> argument containing the path to the Toolbox file.`);
  }

  const { size: fileSize } = await stat(filePath);
  const progressBar        = new ProgressBar(`:bar :percent :eta`, { total: fileSize });
  const readStream         = createReadStream(filePath);
  const lineStream         = createLineStream({ input: readStream, terminal: false });
  const transformStream    = new Lines2JSStream({ parseError });

  lineStream.on(`close`, () => transformStream.end());
  lineStream.on(`line`, line => transformStream.write(line));

  if (!silent) {
    readStream.on(`data`, chunk => progressBar.tick(chunk.length > fileSize ? fileSize : chunk.length));
  }

  const entries = [];

  for await (const entry of transformStream) {
    entries.push(entry);
  }

  if (out) await writeEntries(entries, out, ndjson);

  return entries;

}
