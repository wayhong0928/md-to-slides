'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { fixturesDir, mkTmp, runBuild, runCheck, normalizeNewlines } = require('./_helpers');

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
    // Marp 沒指定 lang 時會用系統 locale 填 lang 屬性（Windows 是 en-US，Ubuntu runner 是 C），比對前拿掉
    const normalize = (s) => normalizeNewlines(s).replace(/\blang="[^"]*"/g, 'lang=""');
    const actual = normalize(fs.readFileSync(path.join(out, 'legacy-inline-style.html'), 'utf-8'));
    const baseline = normalize(
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

// AC-3：v2.1 的舊稿用 col，v2.2 的輸出必須跟 v2.1.0 逐字相同。
// 基準檔是在動任何程式碼之前，用 v2.1.0（commit 5e98c599b58f02228de889385643699a83aec5b1，工作樹乾淨）build 出來的。
test('舊稿（theme: classic、用 col）的 HTML 輸出跟 2.1.0 基準一致，check 只出 info', async () => {
  const out = mkTmp();
  try {
    const result = await runBuild([
      path.join(fixturesDir, 'legacy-col.md'),
      '--out',
      out,
      '--stem',
      'legacy-col',
      '--format',
      'html',
    ]);
    assert.equal(result.code, 0, result.output);
    const normalize = (s) => normalizeNewlines(s).replace(/\blang="[^"]*"/g, 'lang=""');
    const actual = normalize(fs.readFileSync(path.join(out, 'legacy-col.html'), 'utf-8'));
    const baseline = normalize(fs.readFileSync(path.join(fixturesDir, 'baseline', 'legacy-col.html'), 'utf-8'));
    if (actual !== baseline) {
      let i = 0;
      while (i < actual.length && actual[i] === baseline[i]) i++;
      const around = (s) => JSON.stringify(s.slice(Math.max(0, i - 120), i + 120));
      assert.fail(
        `輸出與 2.1.0 基準不同（長度 ${actual.length} vs ${baseline.length}，第一個差異在第 ${i} 字元）\n` +
          `實際：${around(actual)}\n基準：${around(baseline)}`
      );
    }

    const checked = await runCheck([path.join(fixturesDir, 'legacy-col.md'), '--no-browser']);
    assert.equal(checked.code, 0, checked.output);
    assert.match(checked.output, /R4\s+info\s+class「col」/);
    assert.doesNotMatch(checked.output, /warning\s+class/);
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});