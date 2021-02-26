import createSpinner from 'ora';
import fs            from 'fs';
import os            from 'os';
import readLine      from 'readline';
import { Transform } from 'stream';

const blankLineRegExp = /^\s*$/u;

/**
 * Transform Stream that transforms a stream of JavaScript objects to JSON.
 * @extends Transform
 */
class JS2JSONStream extends Transform {

  /**
   * Create a new JS2JSONStream
   * @param {String} separator The separator to use between JSON objects.
   */
  constructor({ separator }) {
    super({ writableObjectMode: true });
    this.separator = separator;
    this.sep       = ``; // the first chunk is not preceded by a separator
  }

  _transform(entry, encoding, callback) {
    const json = JSON.stringify(entry);
    this.push(this.sep);
    this.push(json);
    this.sep = this.separator; // update after first chunk
    callback();
  }

}

/**
 * A Transform Stream that transforms an array of Toolbox lines into a JavaScript object representing a single entry.
 * @extends Transform
 */
class Lines2JSStream extends Transform {

  constructor() {

    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });

    this.lines = [];

  }

  _transform(line, encoding, callback) {

    const isBlank = blankLineRegExp.test(line);

    if (isBlank) {                            // a blank line indicates the end of a Toolbox entry; ready to parse entry

      try {
        const entry = parseLines(this.lines); // attempt to parse lines
        this.push(entry);                     // write entry to stream
      } catch (e) {
        return callback(e);                   // throw parsing errors
      } finally {
        this.lines = [];                      // reset lines for next entry
      }

    } else {                                  // end of entry not yet reached

      this.lines.push(line);                  // add line to current entry

    }

    callback();

  }

}

/**
 * Parses an array of Toolbox lines into a single JavaScript object
 * @param  {Array}  lines The array of Toolbox lines for an entry
 * @return {Object}
 */
function parseLines(lines) {
  return lines;
}

export default function toolbox2json(filePath, {
  ndjson = false,
  out,
  silent = false,
} = {}) {

  // validation

  if (!filePath) {
    throw new TypeError(`Please provide a <filePath> argument containing the path to the Toolbox file.`);
  }

  // set up console spinner

  const spinner = createSpinner(`Converting Toolbox file.`);

  const displayError = e => {
    spinner.isSilent = false;
    spinner.fail(e.message);
  };

  if (silent) spinner.isSilent = true;

  spinner.start();

  // create streams

  const readStream = fs.createReadStream(filePath);

  const lineStream = readLine.createInterface({
    input:    readStream,
    terminal: false,
  });

  const lines2js = new Lines2JSStream();

  // subscribe to stream events

  lines2js.on(`error`, displayError);
  lineStream.on(`close`, () => spinner.succeed(`Toolbox file converted.`));
  lineStream.on(`close`, () => lines2js.end());
  lineStream.on(`error`, displayError);
  lineStream.on(`line`, line => lines2js.write(line));
  readStream.on(`error`, displayError);

  // return a readable stream if no "out" option is provided

  if (!out) return lines2js;

  // stream the resulting JSON to a file

  return new Promise((resolve, reject) => {

    const separator   = ndjson ? os.EOL : `,`;
    const js2json     = new JS2JSONStream({ separator });
    const writeStream = fs.createWriteStream(out);

    lines2js.on(`error`, reject);
    js2json.on(`error`, reject);
    writeStream.on(`error`, reject);
    writeStream.on(`finish`, resolve);

    if (!ndjson) {
      writeStream.write(`[`);
      js2json.on(`end`, () => writeStream.end(`]`));
    }

    lines2js
    .pipe(js2json)
    .pipe(writeStream);

  });

}
