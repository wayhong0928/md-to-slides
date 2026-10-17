'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { loadCatalog } = require('../src/catalog');
const { loadScenarios, splitPages, DEFAULT_DIR } = require('../src/scenarios');
const { validateScenarios } = require('../scripts/validate-scenarios');

const themesDir = path.resolve(__dirname, '..', 'themes');
const catalog = loadCatalog();
// Windows 上 git 可能轉成 CRLF，轉回 LF 才能用含 \n 的字串替換
const original = fs.readFileSync(path.join(DEFAULT_DIR, 'course-report.md'), 'utf-8').replace(/\r\n/g, '\n');

// 把改過的 course-report.md 放進暫存資料夾驗證，回傳錯誤訊息陣列
function errorsFor(text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'md-to-slides-scenarios-'));
  try {
    fs.writeFileSync(path.join(dir, 'course-report.md'), text);
    return validateScenarios(loadScenarios(dir), catalog, themesDir).map((e) => e.message);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('第一批 5 個場合全部通過驗證，共 6 個組合', () => {
  const loaded = loadScenarios();
  assert.deepEqual(
    loaded.scenarios.map((s) => s.id),
    ['business-proposal', 'course-report', 'tech-talk', 'thesis-defense', 'workshop']
  );
  assert.deepEqual(validateScenarios(loaded, catalog, themesDir), []);
  assert.equal(loaded.scenarios.reduce((n, s) => n + s.themes.length, 0), 6);
});

test('sections 放一個不存在的版型 id 會被擋下', () => {
  const errors = errorsFor(original.replace('layouts: [cover, toc]', 'layouts: [cover, no-such-layout]'));
  assert.ok(errors.some((m) => m.includes('「no-such-layout」不在目錄裡')), errors.join('\n'));
});

test('填空版用到 sections 沒列的版型 class 會被擋下', () => {
  const errors = errorsFor(original.replace('layouts: [section, stat-boxes, two-column]', 'layouts: [section, stat-boxes]'));
  assert.ok(errors.some((m) => /填空版用到的 class 不屬於.*「columns」/.test(m)), errors.join('\n'));
});

test('填空版的舊格式佔位、範例版的【、頁數不符、主題不存在都會被擋下', () => {
  const blankStart = original.indexOf('## 填空版');
  const exampleStart = original.indexOf('## 範例版');
  let text =
    original.slice(0, blankStart) +
    original.slice(blankStart, exampleStart).replace('【填：觀察到的現象】', '【觀察到的現象】') +
    original.slice(exampleStart).replace('歡迎提問', '【待補】');
  text = text.replace('themes: [classic]', 'themes: [classic, no-such-theme]');
  text = text.replace('    slides: 2\n    layouts: [section, conclusion-bar]', '    slides: 3\n    layouts: [section, conclusion-bar]');
  const errors = errorsFor(text);
  assert.ok(errors.some((m) => m.includes('要寫成【填：…】：【觀察到的現象】')), errors.join('\n'));
  assert.ok(errors.some((m) => m.startsWith('範例版不能有【')), errors.join('\n'));
  assert.ok(errors.some((m) => m.includes('填空版有 13 頁，sections 加總是 14 頁')), errors.join('\n'));
  assert.ok(errors.some((m) => m.includes('主題「no-such-theme」找不到')), errors.join('\n'));
});

test('splitPages：程式碼區塊裡的 --- 不算分頁', () => {
  const pages = splitPages(['# A', '', '```yaml', '---', '```', '', '---', '', '# B'].join('\n'));
  assert.equal(pages.length, 2);
});
