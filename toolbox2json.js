/* eslint-disable
  max-statements,
*/

import createSpinner from 'ora';
import fs            from 'fs';
import readLine      from 'readline';
import { Transform } from 'stream';

const blankLineRegExp = /^\s*$/u;
let   lines           = []; // holder for current lines until end of entry is reached

function createJS2JSONStream() {
  return new Transform({

    writableObjectMode: true,

    transform(entry, encoding, callback) {
      const json = JSON.stringify(entry);
      this.push(json);
      this.push(`,`);
      callback();
    },

  });
}

function createLines2JSStream() {
  return new Transform({

    readableObjectMode: true,
    writableObjectMode: true,

    transform(line, encoding, callback) {

      // a blank line indicates the end of a Toolbox entry
      const isBlank = blankLineRegExp.test(line);

      if (isBlank) {

        try {
          const entry = parseLines(lines); // attempt to parse lines
          this.push(entry);                // write entry to stream
        } catch (e) {
          return callback(e);
        } finally {
          lines = [];                      // reset lines for next entry
        }

      } else {

        lines.push(line);                 // add line to current entry

      }

      callback();

    },

  });
}

/**
 * Parses an array of Toolbox lines into a single JavaScript object
 * @param  {Array}  lines The array of Toolbox lines for an entry
 * @return {Object}
 */
function parseLines(lines) {
  return lines;
}

export default function toolbox2json(filePath, { out, silent = false } = {}) {

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

  const lines2js = createLines2JSStream();

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

  const js2json     = createJS2JSONStream();
  const writeStream = fs.createWriteStream(out);

  writeStream.write(`[`);
  readStream.on(`end`, () => writeStream.write(`]`));

  lines2js
  .pipe(js2json)
  .pipe(writeStream);

}
