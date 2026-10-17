'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { fixturesDir, runCheck } = require('./_helpers');

const bad = path.join(fixturesDir, 'check-bad.md');
const good = path.join(fixturesDir, 'check-good.md');

test('check --json：check-bad.md 抓到 R1–R5 各一條以上，exit 1', async () => {
  const result = await runCheck([bad, '--json']);
  assert.equal(result.code, 1, result.output);
  const report = JSON.parse(result.stdout);
  const rules = new Set(report.findings.map((f) => f.rule));
  for (const rule of ['R1', 'R2', 'R3', 'R4', 'R5']) {
    assert.equal(rules.has(rule), true, `應該抓到 ${rule}`);
  }
  assert.deepEqual(report.skipped, []);
});

test('R1 超框：check-bad.md 第 4 頁被抓到，而且是 error', async () => {
  const result = await runCheck([bad, '--json']);
  const report = JSON.parse(result.stdout);
  const r1 = report.findings.filter((f) => f.rule === 'R1');
  assert.deepEqual(r1.map((f) => f.page), [4]);
  assert.equal(r1[0].severity, 'error');
  assert.equal(r1[0].line, 29);
});

test('check-good.md：四條靜態規則加 R1 都沒有發現，exit 0', async () => {
  const result = await runCheck([good, '--json']);
  assert.equal(result.code, 0, result.output);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.findings, []);
  assert.deepEqual(report.skipped, []);
});

test('瀏覽器路徑不存在時，明講 R1 沒有檢查，不當成通過', async () => {
  const result = await runCheck([good], { env: { CHROME_PATH: path.join(fixturesDir, 'no-such-browser.exe') } });
  assert.match(result.output, /R1 沒有檢查/);
  assert.match(result.output, /no-such-browser/);
  assert.doesNotMatch(result.output, /全部通過/);
});

test('文字輸出逐條印出頁碼、行號、規則和說明', async () => {
  const result = await runCheck([bad, '--no-browser']);
  assert.match(result.stdout, /p\.5\s+L40\s+R2\s+error/);
  assert.match(result.stdout, /p\.1\s+L11\s+R5\s+warning/);
  assert.equal(result.code, 1);
});

test('只有 warning 時 exit 0，加 --strict 後 R5 變 error 而 exit 1', async () => {
  const fs = require('fs');
  const os = require('os');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'md-to-slides-strict-'));
  try {
    const file = path.join(dir, 'warn.md');
    fs.writeFileSync(file, '---\nmarp: true\n---\n\n# 標題\n\n【填：標題】\n');
    const plain = await runCheck([file, '--no-browser']);
    assert.equal(plain.code, 0, plain.output);
    const strict = await runCheck([file, '--no-browser', '--strict']);
    assert.equal(strict.code, 1, strict.output);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('沒給檔案或檔案不存在時，印說明並 exit 2', async () => {
  const none = await runCheck([]);
  assert.equal(none.code, 2);
  const missing = await runCheck(['no-such-file.md']);
  assert.equal(missing.code, 2);
});
