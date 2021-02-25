/* eslint-disable
  max-nested-callbacks,
*/

import convert from './toolbox2json.js';
import expect  from 'expect.js';

describe(`toolbox2json`, () => {

  it(`requires a <filePath> argument`, () => {
    expect(() => convert()).to.throwError(`filePath`);
  });

});
