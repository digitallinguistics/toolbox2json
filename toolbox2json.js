import createSpinner from 'ora';
import fs            from 'fs';
import readLine      from 'readline';
import { Transform } from 'stream';

export default function toolbox2json(filePath, { out, silent = false } = {}) {

  if (!filePath) {
    throw new TypeError(`Please provide a <filePath> argument containing the path to the Toolbox file.`);
  }

  const spinner = createSpinner(`Converting Toolbox file.`);

  const displayError = e => {
    spinner.isSilent = false;
    spinner.fail(e.message);
  };

  if (silent) spinner.isSilent = true;

  spinner.start();

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
  lineStream.on(`error`, displayError);
  lineStream.on(`line`, line => transformStream.write(line));
  readStream.on(`error`, displayError);
  transformStream.on(`error`, displayError);

  if (!out) return transformStream;

  const writeStream = fs.createWriteStream(out);

  transformStream.pipe(writeStream);

}
