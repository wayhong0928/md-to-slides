'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { fixturesDir, runNode } = require('./_helpers');
const { contrast, parseHex } = require('../scripts/check-contrast');

test('contrast：WCAG 公式（黑對白 21、同色 1）', () => {
  assert.equal(Math.round(contrast(parseHex('#000'), parseHex('#ffffff')) * 100) / 100, 21);
  assert.equal(contrast(parseHex('#336699'), parseHex('#336699')), 1);
});

test('npm run contrast：repo 的 8 個主題 exit 0，classic 的例外標成「例外」', async () => {
  const result = await runNode('scripts/check-contrast.js');
  assert.equal(result.code, 0, result.output);
  for (const id of ['classic', 'scholar', 'classroom', 'mono', 'boardroom', 'pitch', 'editorial', 'midnight']) {
    assert.match(result.output, new RegExp(`== ${id}（`), `${id} 應該出現在輸出裡`);
  }
  assert.match(result.output, /8 個主題，0 個失敗，\d+ 個例外/);
  assert.match(result.output, /○ .*例外/);
  assert.doesNotMatch(result.output, /✗/);
});

test('npm run contrast：指向對比不足的 fixture，exit 1 並指出未達標的配對', async () => {
  const result = await runNode('scripts/check-contrast.js', [path.join(fixturesDir, 'contrast-bad')]);
  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /✗ text \/ bg\s+[\d.]+\s+< 4\.5/);
  assert.match(result.output, /✗ on-accent \/ orange/);
  assert.doesNotMatch(result.output, /無法讀成十六進位色碼/);
});
