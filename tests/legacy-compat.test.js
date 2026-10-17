'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { fixturesDir, mkTmp, runBuild, normalizeNewlines } = require('./_helpers');

// 基準檔是用 2.0 的程式（commit 98fef24）build 出來的，沒有做任何後處理。
// 它同時綁定 Marp 的版本：升級 Marp 後輸出若變了，重新產生基準前要先確認變動只來自 Marp。
test('舊稿（沒有 theme、樣式內嵌在 style:）的 HTML 輸出跟 2.0 基準一致', async () => {
  const out = mkTmp();
  try {
    const result = await runBuild([
      path.join(fixturesDir, 'legacy-inline-style.md'),
      '--out',
      out,
      '--stem',
      'legacy-inline-style',
      '--format',
      'html',
    ]);
    assert.equal(result.code, 0, result.output);
    const actual = normalizeNewlines(fs.readFileSync(path.join(out, 'legacy-inline-style.html'), 'utf-8'));
    const baseline = normalizeNewlines(
      fs.readFileSync(path.join(fixturesDir, 'baseline', 'legacy-inline-style.html'), 'utf-8')
    );
    if (actual !== baseline) {
      let i = 0;
      while (i < actual.length && actual[i] === baseline[i]) i++;
      const around = (s) => JSON.stringify(s.slice(Math.max(0, i - 120), i + 120));
      assert.fail(
        `輸出與 2.0 基準不同（長度 ${actual.length} vs ${baseline.length}，第一個差異在第 ${i} 字元）\n` +
          `實際：${around(actual)}\n基準：${around(baseline)}`
      );
    }
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});
