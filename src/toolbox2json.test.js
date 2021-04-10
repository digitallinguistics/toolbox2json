/* eslint-disable
  func-names,
  max-nested-callbacks,
  prefer-arrow-callback,
*/

import convert           from './toolbox2json.js';
import { expect }        from 'chai';
import { fileURLToPath } from 'url';
import fs                from 'fs';
import path              from 'path';

const currentDir   = path.dirname(fileURLToPath(import.meta.url));
const { readFile } = fs.promises;

const badPath = path.join(currentDir, `../test/bad.db`);
const crkPath = path.join(currentDir, `../test/crk.db`);
const outPath = `test.json`;

describe(`toolbox2json`, function() {

  after(function() {
    const exists = fs.existsSync(outPath);
    if (exists) fs.unlinkSync(outPath);
  });

  it.only(`returns 1 object per Toolbox entry`, async function() {

    const numEntries = 5;
    const entries    = await convert(crkPath);

    expect(entries).to.have.length(numEntries);

  });

  it(`trims white space`, async function() {

    await convert(crkPath, {
      out:    outPath,
      silent: true,
    });

    const json      = await readFile(outPath, `utf8`);
    const [{ sem }] = JSON.parse(json);

    expect(sem).to.be(`Sky`);

  });

  specify(`<filePath>`, function() {
    expect(() => convert()).to.throwError(`filePath`);
  });

  specify(`option: mappings (default)`, async function() {

    await convert(crkPath, {
      out:    outPath,
      silent: true,
    });

    const json          = await readFile(outPath, `utf8`);
    const [{ sro, dl }] = JSON.parse(json);

    expect(sro).to.be(`acâhkos`);
    expect(dl).to.be.an(Array);
    expect(dl).to.have.length(2);

  });

  specify(`option: mappings (custom)`, async function() {

    await convert(crkPath, {
      mappings: {
        mrp: `morphemes`,
        sro: `txn-sro`,
      },
      out:    outPath,
      silent: true,
    });

    const json    = await readFile(outPath, `utf8`);
    const [entry] = JSON.parse(json);

    const {
      morphemes,
      mrp,
      sro, 'txn-sro': txn,
    } = entry;

    expect(morphemes).to.be.an(Array);
    expect(morphemes).to.have.length(2);
    expect(mrp).to.be(undefined);
    expect(sro).to.be(undefined);
    expect(txn).to.be(`acâhkos`);

  });

  specify(`option: ndjson = false (default)`, async function() {

    await convert(crkPath, {
      out:    outPath,
      silent: true,
    });

    const text = await readFile(outPath, `utf8`);

    try {
      JSON.parse(text);
    } catch (e) {
      expect().fail(e.message);
    }

  });

  specify(`option: ndjson = true`, async function() {

    await convert(crkPath, {
      ndjson: true,
      out:    outPath,
      silent: true,
    });

    const text  = await readFile(outPath, `utf8`);
    const lines = text.split(/\r?\n/gu);

    lines.forEach(line => {
      try {
        JSON.parse(line);
      } catch (e) {
        expect().fail(e.message);
      }
    });

  });

  specify(`option: parseError = "error"`, async function() {

    try {
      await convert(badPath, {
        out:        outPath,
        parseError: `error`,
        silent:     true,
      });
    } catch (e) {
      expect(e.name).to.be(`ParseError`);
    }

  });

  specify(`option: parseError = "none"`, async function() {

    await convert(badPath, {
      out:        outPath,
      parseError: `none`,
      silent:     true,
    });

    const json    = await readFile(outPath, `utf8`);
    const entries = JSON.parse(json);

    expect(entries).to.have.length(0);

  });

  specify(`option: parseError = "object"`, async function() {

    await convert(badPath, {
      out:        outPath,
      parseError: `object`,
      silent:     true,
    });

    const json            = await readFile(outPath, `utf8`);
    const entries         = JSON.parse(json);
    const { name, lines } = entries.pop();

    expect(name).to.be(`ParseError`);
    expect(lines).to.be.an(`array`);

  });

  specify(`option: parseError = "warn"`, async function() {

    // stub console.warn to prevent console output
    const original = console.warn;
    console.warn = () => { /* no-op */ };

    await convert(badPath, {
      out:        outPath,
      parseError: `warn`,
      silent:     true,
    });

    // reset console.warn to original method
    console.warn = original.bind(console);

  });

  specify(`option: out`, async function() {
    await convert(crkPath, { out: outPath, silent: true });
    const exists = fs.existsSync(outPath);
    expect(exists).to.be(true);
  });

  specify(`option: postprocessor`, async function() {

    const postprocessor = () => ({ postprocessed: true });

    await convert(crkPath, { out: outPath, postprocessor, silent: true });

    const json = await readFile(outPath, `utf8`);
    const [entry] = JSON.parse(json);

    expect(entry.postprocessed).to.be(true);

  });

  specify(`option: transforms`, async function() {

    const { default: transforms } = await import(`../test/transforms.js`);

    await convert(crkPath, {
      mappings: { sro: `txn-sro` },
      out:      outPath,
      silent:   true,
      transforms,
    });

    const json   = await readFile(outPath, `utf8`);
    const [A, B] = JSON.parse(json);

    expect(A[`txn-sro`]).to.be(`ACÂHKOS`);
    expect(A.dl).to.be.an(Array);
    expect(A.dl).to.have.length(2);
    expect(B.dl).to.be.an(Array);
    expect(B.dl).to.have.length(1);

  });

  specify(`transforms should be applied after all lines are parsed`, async function() {

    const { default: transforms } = await import(`../test/transforms.js`);

    await convert(crkPath, {
      out:    outPath,
      silent: true,
      transforms,
    });

    const json    = await readFile(outPath, `utf8`);
    const [entry] = JSON.parse(json);

    expect(entry.dl).to.have.length(2);
    expect(entry.dl[1]).to.be.a(`string`);

  });

});
