'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { fixturesDir, runNode } = require('./_helpers');
const { contrast, parseHex, resolveVars } = require('../scripts/check-contrast');
const { listThemes } = require('../src/starter');

test('resolveVars：var() 可以連續引用，循環引用與沒宣告的 token 都回報錯誤', () => {
  const ok = resolveVars({ '--theme-brand': '#aa0c26', '--theme-primary': 'var(--theme-brand)', '--theme-em': 'var( --theme-primary )' });
  assert.deepEqual(ok.errors, []);
  assert.equal(ok.values['--theme-primary'], '#aa0c26');
  assert.equal(ok.values['--theme-em'], '#aa0c26');

  const loop = resolveVars({ '--theme-a': 'var(--theme-b)', '--theme-b': 'var(--theme-a)' });
  assert.equal(loop.values['--theme-a'], null);
  assert.ok(loop.errors.some((e) => /循環引用：--theme-a → --theme-b → --theme-a/.test(e)), loop.errors.join('\n'));

  const missing = resolveVars({ '--theme-heading': 'var(--theme-nope)' });
  assert.equal(missing.values['--theme-heading'], null);
  assert.deepEqual(missing.errors, ['--theme-heading 引用的 --theme-nope 沒有宣告']);
});

test('contrast：WCAG 公式（黑對白 21、同色 1）', () => {
  assert.equal(Math.round(contrast(parseHex('#000'), parseHex('#ffffff')) * 100) / 100, 21);
  assert.equal(contrast(parseHex('#336699'), parseHex('#336699')), 1);
});

test('npm run contrast：repo 的全部主題 exit 0，classic 的例外標成「例外」', async () => {
  const result = await runNode('scripts/check-contrast.js');
  assert.equal(result.code, 0, result.output);
  const ids = listThemes();
  for (const id of ids) {
    assert.match(result.output, new RegExp(`== ${id}（`), `${id} 應該出現在輸出裡`);
  }
  assert.match(result.output, new RegExp(`${ids.length} 個主題，0 個失敗，\\d+ 個例外`));
  // 例外只出現在 classic 那一段
  const sections = result.output.split(/\n(?=== )/);
  for (const sec of sections.filter((s) => /○ .*例外/.test(s))) assert.match(sec, /^== classic（/);
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
