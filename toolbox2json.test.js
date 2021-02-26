/* eslint-disable
  max-nested-callbacks,
*/

import convert           from './toolbox2json.js';
import expect            from 'expect.js';
import { fileURLToPath } from 'url';
import path              from 'path';
import { Transform }     from 'stream';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const crkPath = path.join(currentDir, `./data/crk.db`);

describe(`toolbox2json`, () => {

  it(`requires a <filePath> argument`, () => {
    expect(() => convert()).to.throwError(`filePath`);
  });

  it(`returns a stream by default`, () => {
    const transformStream = convert(crkPath);
    expect(transformStream).to.be.a(Transform);
  });

});
