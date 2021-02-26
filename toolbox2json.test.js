/* eslint-disable
  max-nested-callbacks,
  no-sync,
*/

import convert           from './toolbox2json.js';
import expect            from 'expect.js';
import { fileURLToPath } from 'url';
import fs                from 'fs';
import path              from 'path';
import { Transform }     from 'stream';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const crkPath = path.join(currentDir, `./data/crk.db`);
const outPath = `test.json`;

describe(`toolbox2json`, () => {

  afterEach(() => {
    const exists = fs.existsSync(outPath);
    if (exists) fs.unlinkSync(outPath);
  });

  it(`returns a stream by default`, () => {
    const transformStream = convert(crkPath, { silent: true });
    expect(transformStream).to.be.a(Transform);
  });

  it(`returns 1 object per Toolbox entry`, done => {

    const numEntries = 5;
    const stream     = convert(crkPath, { silent: true });
    const entries    = [];

    stream.on(`data`, entry => entries.push(entry));
    stream.on(`end`, () => {
      expect(entries).to.have.length(numEntries);
      done();
    });

  });

  specify(`<filePath>`, () => {
    expect(() => convert()).to.throwError(`filePath`);
  });

  specify(`option: ndjson = false (default)`, async () => {

    await convert(crkPath, {
      out:    outPath,
      silent: true,
    });

    const text = fs.readFileSync(outPath, `utf8`);

    try {
      JSON.parse(text);
    } catch (e) {
      expect().fail(e.message);
    }

  });

  specify(`option: ndjson = true`, async () => {

    await convert(crkPath, {
      ndjson: true,
      out:    outPath,
      silent: true,
    });

    const text  = fs.readFileSync(outPath, `utf8`);
    const lines = text.split(/\r?\n/gu);

    lines.forEach(line => {
      try {
        JSON.parse(line);
      } catch (e) {
        expect().fail(e.message);
      }
    });

  });

  specify(`option: out`, async () => {
    await convert(crkPath, { out: outPath, silent: true });
    const exists = fs.existsSync(outPath);
    expect(exists).to.be(true);
  });

});
