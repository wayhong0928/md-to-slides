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

// v2.1 的舊稿用 col，換版後的輸出必須跟基準逐字相同。
// 基準檔 2.3.0 重產：2.3.0 把 themes/src/_base.css 寫死的顏色、陰影、等寬字型
// 與兩個內距改成 --theme-* token，classic 的每個 token 值都等於原本寫死的值。
// classic 的 HTML 會內嵌整份 classic.css，所以逐字比對一定會變，這是基準重產的唯一理由。
// 畫面與 2.2.0 逐像素相同：examples/showcase.md、legacy-col.md、theme-classic.md 三份用 classic
// 在 Chrome 逐頁截圖，共 39 張，重產前後逐位元組比對 39/39 相同（T1 截圖比對）。
// 基準檔 2.2.0 以前是在動任何程式碼之前，用 v2.1.0（commit 5e98c599b58f02228de889385643699a83aec5b1，工作樹乾淨）build 出來的。
// 2.1.0 起的斷言（class「col」的 R4 info、不出 class 警告）一條都沒動。
test('舊稿（theme: classic、用 col）的 HTML 輸出跟 2.3.0 重產的基準一致，check 只出 info', async () => {
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
        `輸出與基準不同（長度 ${actual.length} vs ${baseline.length}，第一個差異在第 ${i} 字元）\n` +
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