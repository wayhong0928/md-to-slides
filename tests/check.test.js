'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { checkFile, splitSlides } = require('../src/check');
const { fixturesDir, runCheck } = require('./_helpers');

const bad = path.join(fixturesDir, 'check-bad.md');
const good = path.join(fixturesDir, 'check-good.md');

async function staticFindings(file, options = {}) {
  const result = await checkFile(file, { browser: false, ...options });
  return result.findings;
}

const only = (findings, rule) => findings.filter((f) => f.rule === rule);

test('splitSlides：被 HTML 區塊吃掉的 --- 不算分頁，程式碼區塊裡的 --- 也不算', () => {
  const md = [
    '---',
    'marp: true',
    '---',
    '',
    '# A',
    '',
    '```text',
    '---',
    '```',
    '',
    '---',
    '',
    '# B',
    '',
    '<div>',
    'x',
    '</div>',
    '---',
    '',
    '# C',
  ].join('\n');
  const slides = splitSlides(md);
  assert.equal(slides.length, 2);
  assert.equal(slides[0].startLine, 4);
  assert.equal(slides[1].startLine, 12);
});

test('R2 黏頁：check-bad.md 的第 5 頁被抓到', async () => {
  const hits = only(await staticFindings(bad), 'R2');
  assert.equal(hits.length, 1);
  assert.equal(hits[0].severity, 'error');
  assert.equal(hits[0].page, 5);
  assert.equal(hits[0].line, 40);
});

test('R3 破圖：Markdown 圖片與 <img> 是 error，CSS url() 是 warning', async () => {
  const hits = only(await staticFindings(bad), 'R3');
  const byLine = Object.fromEntries(hits.map((h) => [h.line, h]));
  assert.equal(byLine[17].severity, 'error');
  assert.equal(byLine[17].page, 2);
  assert.match(byLine[17].message, /img\/not-here\.png/);
  assert.equal(byLine[19].severity, 'error');
  assert.match(byLine[19].message, /img\/also-missing\.png/);
  assert.equal(byLine[6].severity, 'warning');
  assert.match(byLine[6].message, /img\/missing-bg\.png/);
  assert.equal(hits.length, 3);
});

test('R4 未定義 class：只抓 ghost-class，主題與 frontmatter style 裡有的不抓', async () => {
  const hits = only(await staticFindings(bad), 'R4');
  assert.equal(hits.length, 1);
  assert.equal(hits[0].severity, 'warning');
  assert.equal(hits[0].page, 3);
  assert.equal(hits[0].line, 25);
  assert.match(hits[0].message, /ghost-class/);
});

test('R5 未填佔位：warning，加 strict 變 error', async () => {
  const hits = only(await staticFindings(bad), 'R5');
  assert.equal(hits.length, 1);
  assert.equal(hits[0].severity, 'warning');
  assert.equal(hits[0].page, 1);
  assert.equal(hits[0].line, 11);

  const strict = only(await staticFindings(bad, { strict: true }), 'R5');
  assert.equal(strict[0].severity, 'error');
});

test('check-good.md：靜態規則沒有任何誤報', async () => {
  const findings = await staticFindings(good);
  assert.deepEqual(findings, []);
});

test('沒有開瀏覽器時，結果明講 R1 沒有檢查', async () => {
  const result = await checkFile(good, { browser: false });
  assert.equal(result.skipped.some((s) => s.rule === 'R1'), true);
});

test('未知的 theme 找不到 CSS 時，R4 跳過並說明，不亂報', async () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'md-to-slides-r4-'));
  try {
    const file = path.join(dir, 'x.md');
    fs.writeFileSync(file, '---\nmarp: true\ntheme: nowhere\n---\n\n<div class="anything">x</div>\n');
    const result = await checkFile(file, { browser: false });
    assert.deepEqual(only(result.findings, 'R4'), []);
    assert.equal(result.skipped.some((s) => s.rule === 'R4'), true);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// ---- v2.2：R4 以版型目錄為準、info 等級 ----

function writeTmpDeck(files) {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'md-to-slides-r4v22-'));
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), text);
  return dir;
}

test('R4（v2.2）：內建主題用舊名 col 只出 info，不是 warning，exit 0', async () => {
  const dir = writeTmpDeck({
    'x.md': '---\nmarp: true\ntheme: classic\n---\n\n<div class="columns">\n<div class="col">甲</div>\n</div>\n',
  });
  try {
    const result = await checkFile(path.join(dir, 'x.md'), { browser: false });
    const hits = only(result.findings, 'R4');
    assert.equal(hits.length, 1);
    assert.equal(hits[0].severity, 'info');
    assert.match(hits[0].message, /col.*column/);
    const cli = await runCheck([path.join(dir, 'x.md'), '--no-browser']);
    assert.equal(cli.code, 0, cli.output);
    assert.match(cli.output, /0 個 error、0 個 warning、1 個 info/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('R4（v2.2）：內建主題的拼錯 class 是 warning，並附目錄裡相近的 class 與中文名', async () => {
  const dir = writeTmpDeck({
    'x.md': '---\nmarp: true\ntheme: classic\n---\n\n<div class="hflo">甲</div>\n',
  });
  try {
    const result = await checkFile(path.join(dir, 'x.md'), { browser: false });
    const hits = only(result.findings, 'R4');
    assert.equal(hits.length, 1);
    assert.equal(hits[0].severity, 'warning');
    assert.match(hits[0].message, /「hflo」/);
    assert.match(hits[0].message, /「hflow」（橫向流程）/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('R4（v2.2）：第三方主題照舊解析自己的 CSS，不套用版型目錄，也不給建議', async () => {
  const dir = writeTmpDeck({
    'mine.css': '/* @theme mine */\nsection .mine-only { color: red; }\n',
    'x.md':
      '---\nmarp: true\ntheme: mine\n---\n\n<div class="mine-only">甲</div>\n<div class="col">乙</div>\n<div class="hflo">丙</div>\n',
  });
  try {
    const result = await checkFile(path.join(dir, 'x.md'), { browser: false });
    const hits = only(result.findings, 'R4');
    assert.deepEqual(hits.map((h) => h.severity), ['warning', 'warning']);
    assert.match(hits[0].message, /「col」/);
    assert.match(hits[1].message, /「hflo」/);
    assert.doesNotMatch(hits[1].message, /要找的可能是/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
