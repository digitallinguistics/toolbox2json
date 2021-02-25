import convert from './toolbox2json.js';
import expect  from 'expect.js';

describe(`toolbox2json`, () => {
  it(`returns a no-op function`, () => {
    expect(convert()).to.be(``);
  });
});
