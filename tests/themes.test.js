'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { repoRoot, mkTmp, copyDirSync, runNode, normalizeNewlines } = require('./_helpers');

test('themes/classic.css 存在、自帶 @theme 標記，而且沒有 @import 其他自家檔案', () => {
  const css = fs.readFileSync(path.join(repoRoot, 'themes', 'classic.css'), 'utf-8');
  assert.match(css, /\/\*\s*@theme classic\s*\*\//);
  assert.match(css, /--theme-primary:\s*#2980b9/i);
  assert.match(css, /section\.cover/);
  assert.doesNotMatch(css, /@import\s+['"]_base/);
});

test('themes/src 分成 _base.css（版型）和 classic.css（token）', () => {
  const base = fs.readFileSync(path.join(repoRoot, 'themes', 'src', '_base.css'), 'utf-8');
  const tokens = fs.readFileSync(path.join(repoRoot, 'themes', 'src', 'classic.css'), 'utf-8');
  assert.match(base, /var\(--theme-primary\)/);
  assert.match(tokens, /--theme-primary:/);
  assert.doesNotMatch(tokens, /section\.cover/);
});

const THEME_IDS = ['classic', 'scholar', 'classroom', 'mono', 'boardroom', 'pitch', 'editorial', 'midnight'];

test('8 個主題的產物都存在、自帶 @theme 標記，而且 TOKENS.md 列的 token 都有定義', () => {
  const tokensMd = fs.readFileSync(path.join(repoRoot, 'themes', 'TOKENS.md'), 'utf-8');
  const required = [...new Set([...tokensMd.split('## 固定不換')[0].matchAll(/^\|\s*`(--theme-[a-z0-9-]+)`\s*\|/gm)].map((m) => m[1]))];
  assert.ok(required.length >= 50, `TOKENS.md 應該列出全部 token，只讀到 ${required.length} 個`);
  for (const id of THEME_IDS) {
    const css = fs.readFileSync(path.join(repoRoot, 'themes', `${id}.css`), 'utf-8');
    assert.match(css, new RegExp(`/\\*\\s*@theme ${id}\\s*\\*/`), `${id}.css 要有 @theme 標記`);
    assert.doesNotMatch(css, /@import\s+['"]_base/);
    const missing = required.filter((token) => !new RegExp(`${token}\\s*:`).test(css));
    assert.deepEqual(missing, [], `${id}.css 缺少 token`);
  }
});

test('npm run themes -- --check：主題少一個 token 就 exit 1，並指出是哪個 token', async () => {
  const root = mkTmp();
  try {
    copyDirSync(path.join(repoRoot, 'themes'), path.join(root, 'themes'));
    const file = path.join(root, 'themes', 'src', 'scholar.css');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf-8').replace(/^\s*--theme-muted:[^\n]*\n/m, ''));
    // 先重產，排除「產物過期」的失敗原因，只留 token 缺漏
    const rebuilt = await runNode('scripts/build-themes.js', ['--root', root]);
    assert.equal(rebuilt.code, 0, rebuilt.output);
    const result = await runNode('scripts/build-themes.js', ['--check', '--root', root]);
    assert.equal(result.code, 1, result.output);
    assert.match(result.output, /scholar\.css 缺少 1 個 token：--theme-muted/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('npm run themes -- --check：產物是最新的就 exit 0', async () => {
  const result = await runNode('scripts/build-themes.js', ['--check']);
  assert.equal(result.code, 0, result.output);
});

test('npm run themes -- --check：基底改了但沒重跑，exit 1', async () => {
  const root = mkTmp();
  try {
    copyDirSync(path.join(repoRoot, 'themes'), path.join(root, 'themes'));
    const basePath = path.join(root, 'themes', 'src', '_base.css');
    fs.appendFileSync(basePath, '\n.stale-marker { color: red; }\n');

    const stale = await runNode('scripts/build-themes.js', ['--check', '--root', root]);
    assert.equal(stale.code, 1, stale.output);
    assert.match(stale.output, /classic\.css/);

    const rebuilt = await runNode('scripts/build-themes.js', ['--root', root]);
    assert.equal(rebuilt.code, 0, rebuilt.output);
    assert.match(
      normalizeNewlines(fs.readFileSync(path.join(root, 'themes', 'classic.css'), 'utf-8')),
      /\.stale-marker/
    );

    const fresh = await runNode('scripts/build-themes.js', ['--check', '--root', root]);
    assert.equal(fresh.code, 0, fresh.output);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
