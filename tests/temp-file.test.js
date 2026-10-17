'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { fixturesDir, mkTmp, runBuild, leftoverTempFiles } = require('./_helpers');

function makeInputDir() {
  const dir = mkTmp();
  fs.writeFileSync(path.join(dir, 'alpha.md'), '---\nmarp: true\n---\n\n# Alpha 簡報\n\n只屬於 alpha。\n');
  fs.writeFileSync(path.join(dir, 'beta.md'), '---\nmarp: true\n---\n\n# Beta 簡報\n\n只屬於 beta。\n');
  return dir;
}

test('兩個 build 並行輸出到同一個資料夾，彼此不會互相覆蓋，也不留殘檔', async () => {
  const input = makeInputDir();
  const out = mkTmp();
  try {
    const [a, b] = await Promise.all([
      runBuild([path.join(input, 'alpha.md'), '--out', out, '--format', 'html,pdf']),
      runBuild([path.join(input, 'beta.md'), '--out', out, '--format', 'html,pdf']),
    ]);
    assert.equal(a.code, 0, a.output);
    assert.equal(b.code, 0, b.output);

    const alpha = fs.readFileSync(path.join(out, 'alpha.html'), 'utf-8');
    const beta = fs.readFileSync(path.join(out, 'beta.html'), 'utf-8');
    assert.match(alpha, /只屬於 alpha/);
    assert.doesNotMatch(alpha, /只屬於 beta/);
    assert.match(beta, /只屬於 beta/);
    assert.doesNotMatch(beta, /只屬於 alpha/);
    assert.ok(fs.statSync(path.join(out, 'alpha.pdf')).size > 1000);
    assert.ok(fs.statSync(path.join(out, 'beta.pdf')).size > 1000);

    assert.deepEqual(leftoverTempFiles(input), []);
    assert.equal(fs.existsSync(path.join(out, '._temp_render.md')), false);
  } finally {
    fs.rmSync(input, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('build 失敗之後，輸入資料夾沒有殘檔', async () => {
  const input = makeInputDir();
  const out = mkTmp();
  try {
    // 讓 marp 寫不進去：把輸出檔名佔成資料夾
    fs.mkdirSync(path.join(out, 'alpha.pdf'));
    const result = await runBuild([path.join(input, 'alpha.md'), '--out', out, '--format', 'pdf']);
    assert.notEqual(result.code, 0, '這個 build 應該失敗');
    assert.deepEqual(leftoverTempFiles(input), []);
    assert.equal(fs.existsSync(path.join(out, '._temp_render.md')), false);
  } finally {
    fs.rmSync(input, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('Mermaid 前處理失敗時，輸入資料夾也沒有殘檔', async () => {
  const input = mkTmp();
  const out = mkTmp();
  try {
    fs.copyFileSync(path.join(fixturesDir, 'invalid-mermaid.md'), path.join(input, 'bad.md'));
    const result = await runBuild([path.join(input, 'bad.md'), '--out', out, '--format', 'html']);
    assert.notEqual(result.code, 0);
    assert.deepEqual(leftoverTempFiles(input), []);
    assert.equal(fs.existsSync(path.join(out, '._temp_render.md')), false);
  } finally {
    fs.rmSync(input, { recursive: true, force: true });
    fs.rmSync(out, { recursive: true, force: true });
  }
});
