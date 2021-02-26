import createSpinner from 'ora';
import fs            from 'fs';
import readLine      from 'readline';
import { Transform } from 'stream';

export default function toolbox2json(filePath) {

  if (!filePath) {
    throw new TypeError(`Please provide a <filePath> argument containing the path to the Toolbox file.`);
  }

  const spinner = createSpinner(`Converting Toolbox file.`).start();

  const readStream = fs.createReadStream(filePath);

  const transformStream = new Transform({

    readableObjectMode: true,

    transform(chunk, encoding, callback) {
      this.push(chunk);
      // Lines will be processed and converted to JS objects here
      // Each JS object will be added to the transform stream.
      // callback signals that the chunk is processed
      // pass an Error to the callback to signal a failure
      callback();
    },

    writableObjectMode: true,

  });

  const lineStream = readLine.createInterface({
    input:    readStream,
    output:   transformStream,
    terminal: false,
  });

  lineStream.on(`close`, () => spinner.succeed(`Toolbox file converted.`));
  lineStream.on(`error`, e => spinner.fail(e.message));
  lineStream.on(`line`, line => transformStream.write(line));
  readStream.on(`error`, e => spinner.fail(e.message));
  transformStream.on(`error`, e => spinner.fail(e.message));

  return transformStream;

}
