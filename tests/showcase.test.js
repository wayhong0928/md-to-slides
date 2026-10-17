'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { runNode, runCheck } = require('./_helpers');

test('npm run showcase -- --check：examples/showcase.md 是最新的就 exit 0', async () => {
  const r = await runNode('scripts/build-showcase.js', ['--check']);
  assert.equal(r.code, 0, r.output);
  assert.match(r.output, /是最新的/);
});

test('examples/showcase.md 通過 check，沒有任何 finding', async () => {
  const r = await runCheck(['examples/showcase.md']);
  assert.equal(r.code, 0, r.output);
  assert.match(r.output, /全部通過/);
});
