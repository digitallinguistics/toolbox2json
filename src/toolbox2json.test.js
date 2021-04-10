/* eslint-disable
  func-names,
  max-nested-callbacks,
  prefer-arrow-callback,
*/

import chai              from 'chai';
import convert           from './toolbox2json.js';
import { fileURLToPath } from 'url';
import fs                from 'fs';
import path              from 'path';
import sinon             from 'sinon';
import sinonChai         from 'sinon-chai';

const currentDir   = path.dirname(fileURLToPath(import.meta.url));
const { expect }   = chai;
const { readFile } = fs.promises;
const { stub }     = sinon;

const badPath = path.join(currentDir, '../test/bad.db');
const crkPath = path.join(currentDir, '../test/crk.db');
const outPath = 'test.json';

chai.use(sinonChai);

describe('toolbox2json', function() {

  after(function() {
    const exists = fs.existsSync(outPath);
    if (exists) fs.unlinkSync(outPath);
  });

  it('returns 1 object per Toolbox entry', async function() {

    const numEntries = 5;
    const entries    = await convert(crkPath, { silent: true });

    expect(entries).to.have.length(numEntries);

  });

  it('trims white space', async function() {
    const [{ sem }] = await convert(crkPath, { silent: true });
    expect(sem).to.equal('Sky');
  });

  specify('<filePath>', function() {
    try {
      convert();
      expect.fail();
    } catch { /* no catch */ }
  });

  specify('option: ndjson = false (default)', async function() {

    await convert(crkPath, { out: outPath, silent: true });
    const text = await readFile(outPath, 'utf8');

    try {
      JSON.parse(text);
    } catch (e) {
      expect.fail(e.message);
    }

  });

  specify('option: ndjson = true', async function() {

    await convert(crkPath, { ndjson: true, out: outPath, silent: true });

    const text  = await readFile(outPath, 'utf8');
    const lines = text.split(/\r?\n/gu);

    lines.forEach(line => {
      try {
        JSON.parse(line);
      } catch (e) {
        expect.fail(e.message);
      }
    });

  });

  specify('option: parseError = "error"', async function() {

    try {
      await convert(badPath, { parseError: 'error', silent: true });
    } catch (e) {
      expect(e.name).to.equal('ParseError');
    }

  });

  specify('option: parseError = "none"', async function() {
    const entries = await convert(badPath, { parseError: 'none', silent: true });
    expect(entries).to.have.length(0);
  });

  specify('option: parseError = "object"', async function() {

    const entries         = await convert(badPath, { parseError: 'object', silent: true });
    const { name, lines } = entries.pop();

    expect(name).to.equal('ParseError');
    expect(lines).to.be.an('array');

  });

  specify('option: parseError = "warn"', async function() {

    // stub console.warn to prevent console output
    const original = console.warn;
    console.warn = stub();

    await convert(badPath, { parseError: 'warn', silent: true });

    expect(console.warn).to.have.been.calledOnce;

    // reset console.warn to original method
    console.warn = original.bind(console);

  });

  specify('option: out', async function() {
    await convert(crkPath, { out: outPath, silent: true });
    const exists = fs.existsSync(outPath);
    expect(exists).to.be.true;
  });

});
