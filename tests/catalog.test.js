'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { fixturesDir, runNode } = require('./_helpers');
const { loadCatalog, definedClasses, describeClass } = require('../src/catalog');

const good = path.join(fixturesDir, 'catalog-good');
const bad = path.join(fixturesDir, 'catalog-bad');

// ROADMAP 列的 35 個版型，id 寫死，目錄少一個或多一個都會失敗。
const EXPECTED = {
  structure: ['cover', 'toc', 'section', 'closing', 'appendix-divider'],
  core: [
    'two-column', 'three-cards', 'four-cards', 'table', 'code', 'syntax-compare', 'quote-note', 'callout',
    'conclusion-bar', 'stat-boxes', 'flow-horizontal', 'timeline', 'loop-cycle', 'diagram', 'screenshot',
    'thumbnail-wall', 'references', 'resource-wall',
  ],
  academic: ['variable-model', 'construct-badges', 'operational-definition', 'hypothesis-list', 'research-questions'],
  teaching: ['terminal', 'prompt-breakdown', 'classroom-exercise', 'step-pills', 'given-when-then', 'ladder', 'pyramid'],
};

test('loader：讀出 good 目錄的版型、別名、工具 class 與未歸版型的元件', () => {
  const c = loadCatalog(good);
  assert.deepEqual(c.problems, []);
  assert.deepEqual(c.entries.map((e) => e.id).sort(), ['code-page', 'two-box']);
  assert.deepEqual(c.aliases['old-box'], { to: 'box', id: 'two-box' });
  assert.deepEqual([...definedClasses(c)].sort(), [
    'box', 'box-item', 'code-wrap', 'legend', 'legend-dot', 'muted', 'old-box',
  ]);
});

test('loader：骨架內含程式碼區塊時，外層四個反引號的內容完整讀出', () => {
  const entry = loadCatalog(good).entries.find((e) => e.id === 'code-page');
  assert.match(entry.skeleton, /```js/);
  assert.match(entry.skeleton, /console\.log\('【說明】'\);/);
  assert.match(entry.skeleton, /<div class="code-wrap">/);
  assert.doesNotMatch(entry.skeleton, /````/);
});

test('validator：good 目錄 exit 0', async () => {
  const r = await runNode('scripts/validate-catalog.js', [good, '--css', path.join(good, '_base.css')]);
  assert.equal(r.code, 0, r.output);
  assert.match(r.output, /目錄驗證通過/);
});

test('validator：bad 目錄 exit 1，而且指出壞掉的是哪個檔案和問題', async () => {
  const r = await runNode('scripts/validate-catalog.js', [bad, '--css', path.join(bad, '_base.css')]);
  assert.equal(r.code, 1, r.output);
  assert.match(r.output, /core[\\/]broken\.md/);
  assert.match(r.output, /missing-one/);
  assert.doesNotMatch(r.output, /two-box\.md/);
});

test('真實目錄：35 個 id 與 ROADMAP 一致，分成 5、18、5、7，驗證通過', async () => {
  const c = loadCatalog();
  assert.deepEqual(c.problems, []);
  for (const [pack, ids] of Object.entries(EXPECTED)) {
    const actual = c.entries.filter((e) => e.pack === pack).map((e) => e.id).sort();
    assert.deepEqual(actual, [...ids].sort(), `${pack} 的 id 不一致`);
  }
  assert.equal(c.entries.length, 35);
  const r = await runNode('scripts/validate-catalog.js');
  assert.equal(r.code, 0, r.output);
});

test('describeClass：多個版型共用的 class 先取包別在前、再取 classes 最少的版型', () => {
  const catalog = loadCatalog();
  // column 屬於 core 的雙欄對照、四格卡片和 teaching 的終端機，同在 core 時雙欄對照的 classes 最少
  assert.equal(describeClass(catalog, 'column'), '雙欄對照');
  // hflow 屬於 core 的橫向流程和 academic 的變數模型圖，core 在前
  assert.equal(describeClass(catalog, 'hflow'), '橫向流程');
});
