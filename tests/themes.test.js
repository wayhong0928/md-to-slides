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
