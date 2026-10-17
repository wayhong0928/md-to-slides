'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { parseArgs } = require('../src/cli/build-cli');
const { fixturesDir, mkTmp, runBuild } = require('./_helpers');

test('parseArgs：--theme-set 可以重複', () => {
  const args = parseArgs(['a.md', '--theme-set', 'x', '--theme-set', 'y/z']);
  assert.deepEqual(args.themeSets, ['x', 'y/z']);
});

test('parseArgs：沒給 --theme-set 時是空陣列', () => {
  assert.deepEqual(parseArgs(['a.md']).themeSets, []);
});

test('theme: classic 三種格式都能 build，HTML 帶得到 classic 的主色 token', async () => {
  const out = mkTmp();
  try {
    const result = await runBuild([path.join(fixturesDir, 'theme-classic.md'), '--out', out, '--stem', 'classic']);
    assert.equal(result.code, 0, result.output);
    for (const ext of ['html', 'pdf', 'pptx']) {
      const file = path.join(out, `classic.${ext}`);
      assert.equal(fs.existsSync(file), true, `${ext} 應該存在`);
      assert.ok(fs.statSync(file).size > 1000, `${ext} 應該有內容`);
    }
    const html = fs.readFileSync(path.join(out, 'classic.html'), 'utf-8');
    assert.match(html, /--theme-primary:\s*#2980b9/i);
    assert.match(html, /cover-title/);
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('8 個內建主題各 build 一次 HTML，HTML 帶得到該主題自己的底色 token', async () => {
  const showcase = fs.readFileSync(path.join(__dirname, '..', 'examples', 'showcase.md'), 'utf-8');
  const work = mkTmp();
  try {
    for (const id of ['classic', 'scholar', 'classroom', 'mono', 'boardroom', 'pitch', 'editorial', 'midnight']) {
      const bg = fs
        .readFileSync(path.join(__dirname, '..', 'themes', 'src', `${id}.css`), 'utf-8')
        .match(/--theme-bg:\s*(#[0-9a-f]{3,6})/i)[1];
      const md = path.join(work, `${id}.md`);
      fs.writeFileSync(md, showcase.replace(/^theme:\s*\S+/m, `theme: ${id}`));
      const out = path.join(work, `out-${id}`);
      const result = await runBuild([md, '--out', out, '--stem', id, '--format', 'html']);
      assert.equal(result.code, 0, `${id}：${result.output}`);
      const html = fs.readFileSync(path.join(out, `${id}.html`), 'utf-8');
      assert.ok(html.includes(`--theme-bg: ${bg}`), `${id} 的 HTML 應該帶 --theme-bg: ${bg}`);
      assert.match(html, /cover-title/);
    }
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
});

test('--theme-set 可以加使用者自己的主題', async () => {
  const work = mkTmp();
  try {
    const themeDir = path.join(work, 'my-themes');
    fs.mkdirSync(themeDir);
    fs.writeFileSync(
      path.join(themeDir, 'mine.css'),
      '/* @theme mine */\n@import "default";\nsection { background: #abcdef; }\n'
    );
    const md = path.join(work, 'deck.md');
    fs.writeFileSync(md, '---\nmarp: true\ntheme: mine\n---\n\n# 自訂主題\n');
    const out = path.join(work, 'out');
    const result = await runBuild([md, '--out', out, '--format', 'html', '--theme-set', themeDir]);
    assert.equal(result.code, 0, result.output);
    assert.match(fs.readFileSync(path.join(out, 'deck.html'), 'utf-8'), /#abcdef/i);
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
});

test('FR-8：沒有 theme: 的簡報不會套 classic', async () => {
  const out = mkTmp();
  try {
    const result = await runBuild([
      path.join(fixturesDir, 'legacy-inline-style.md'),
      '--out',
      out,
      '--format',
      'html',
    ]);
    assert.equal(result.code, 0, result.output);
    const html = fs.readFileSync(path.join(out, 'legacy-inline-style.html'), 'utf-8');
    assert.doesNotMatch(html, /--theme-primary/);
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});
