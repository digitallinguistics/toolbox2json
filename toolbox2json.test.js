/* eslint-disable
  max-nested-callbacks,
  no-sync,
  no-undefined,
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

  specify(`<filePath>`, () => {
    expect(() => convert()).to.throwError(`filePath`);
  });

  specify(`option: out`, () => {

    const returnValue = convert(crkPath, { out: outPath, silent: true });
    expect(returnValue).to.be(undefined);

    const exists = fs.existsSync(outPath);
    expect(exists).to.be(true);

  });

});
