'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { fixturesDir, mkTmp, copyDirSync, runBuild, leftoverTempFiles } = require('./_helpers');

function setup() {
  const input = mkTmp();
  copyDirSync(path.join(fixturesDir, 'relative-image'), input);
  const out = mkTmp();
  return { input, out };
}

test('相對路徑圖片：HTML 的本機 <img> 都指到 assets/images/，檔案存在，遠端網址不動', async () => {
  const { input, out } = setup();
  try {
    const result = await runBuild([path.join(input, 'slides.md'), '--out', out, '--format', 'html']);
    assert.equal(result.code, 0, result.output);

    const html = fs.readFileSync(path.join(out, 'slides.html'), 'utf-8');
    const srcs = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
    const local = srcs.filter((s) => !/^https?:/.test(s));
    const remote = srcs.filter((s) => /^https?:/.test(s));

    assert.equal(local.length, 2, `本機圖片應有 2 張，實際：${srcs.join(', ')}`);
    for (const src of local) {
      assert.match(src, /^assets\/images\//);
      assert.equal(fs.existsSync(path.join(out, src)), true, `${src} 應該存在`);
    }
    assert.deepEqual(remote, ['https://example.com/remote.png']);
    assert.deepEqual(leftoverTempFiles(input), []);
  } finally {
    fs.rmSync(input, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('相對路徑圖片：PDF 與 PPTX 找得到圖（沒有 missing 警告），PDF 裡有圖片物件', async () => {
  const { input, out } = setup();
  try {
    const result = await runBuild([path.join(input, 'slides.md'), '--out', out, '--format', 'pdf,pptx']);
    assert.equal(result.code, 0, result.output);
    assert.doesNotMatch(result.output, /local files are missing and will be ignored/i);

    const pdf = fs.readFileSync(path.join(out, 'slides.pdf')).toString('latin1');
    // 找不到的圖，Chrome 會畫成 14x16 的破圖小圖示，所以要認尺寸，不能只數圖片物件。fixture 的兩張圖都是 64x64。
    const real = pdf.match(/\/Subtype\s*\/Image\s*\/Width\s+64\s*\/Height\s+64/g) || [];
    assert.equal(real.length, 2, `PDF 應有 2 個 64x64 圖片物件，實際 ${real.length}`);
    assert.ok(fs.statSync(path.join(out, 'slides.pptx')).size > 1000);
  } finally {
    fs.rmSync(input, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('Mermaid 圖在 HTML 裡用相對於 HTML 的路徑引用 assets/diagrams/', async () => {
  const input = mkTmp();
  const out = mkTmp();
  try {
    fs.copyFileSync(path.join(fixturesDir, 'one-mermaid.md'), path.join(input, 'm.md'));
    const result = await runBuild([path.join(input, 'm.md'), '--out', out, '--format', 'html']);
    assert.equal(result.code, 0, result.output);
    const html = fs.readFileSync(path.join(out, 'm.html'), 'utf-8');
    assert.match(html, /<img[^>]+src="assets\/diagrams\/diagram-0\.png"[^>]*class="mermaid-diagram"|<img[^>]+class="mermaid-diagram"[^>]*src="assets\/diagrams\/diagram-0\.png"/);
    assert.equal(fs.existsSync(path.join(out, 'assets', 'diagrams', 'diagram-0.png')), true);
  } finally {
    fs.rmSync(input, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  }
});
