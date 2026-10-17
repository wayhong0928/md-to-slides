'use strict';

// npm run matrix 的判定邏輯（SDD-v2.6 D7）。完整的 700 組只在 CI 跑，這裡用一個主題驗通過與失敗兩條路。

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadCatalog } = require('../src/catalog');
const { partLayouts, contrastFailures } = require('../scripts/check-matrix');
const { fixturesDir, mkTmp } = require('./_helpers');

const layouts = loadCatalog().entries.length;
const tmp = mkTmp('md-to-slides-matrix-test-');
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

test('第一部分：classic 的全部版型都通過，沒有略過的規則', async () => {
  const r = await partLayouts(tmp, ['classic'], new Set());
  assert.equal(r.total, layouts);
  assert.deepEqual(r.failures, []);
});

test('第一部分：找不到的主題（R4 沒辦法檢查），全部版型都算失敗', async () => {
  const r = await partLayouts(tmp, ['no-such-theme'], new Set());
  assert.equal(r.failed, layouts);
  assert.ok(r.failures.every((f) => f.reasons.some((m) => m.startsWith('有規則沒檢查：R4'))), JSON.stringify(r.failures[0]));
});

test('第一部分：對比不過的主題，全部版型都算失敗', async () => {
  const bad = contrastFailures(path.join(fixturesDir, 'contrast-bad'));
  assert.ok(bad.size > 0, '對比不足的 fixture 應該被抓到');
  const r = await partLayouts(tmp, ['classic'], new Set(['classic']));
  assert.equal(r.failed, layouts);
  assert.ok(r.failures.every((f) => f.reasons.includes('npm run contrast 不過')));
});
