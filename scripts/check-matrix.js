'use strict';

// npm run matrix：全組合檢查（SDD-v2.6 D7）。要 Chrome 或 Edge，找不到就失敗。
// 第一部分：目錄裡每個版型的 example 各放一頁，拼成一份簡報，每個主題 build 一次 HTML、跑 check 的 R1 到 R5，
//           某頁有 error 算那個主題與版型的組合失敗；npm run contrast 不過的主題，全部組合都算失敗。
// 第二部分：每個場合的每個推薦主題產生起手包，example.md 不能有 error，slides.md 至少一筆 finding 而且只有 R5 的 warning。
// 兩部分都不接受略過的規則。

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadCatalog } = require('../src/catalog');
const { loadScenarios } = require('../src/scenarios');
const { checkFile, splitSlides } = require('../src/check');
const { buildStarter, allCombos, listThemes } = require('../src/starter');

const ROOT = path.resolve(__dirname, '..');

const frontmatter = (theme) => `---\nmarp: true\ntheme: ${theme}\npaginate: true\n---\n\n`;

// 跑一次 npm run contrast（可以指定主題資料夾），回傳對比不過的主題
function contrastFailures(dir) {
  const args = [path.join(__dirname, 'check-contrast.js'), ...(dir ? [dir] : [])];
  const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf-8' });
  const failed = new Set();
  let current = null;
  for (const line of (r.stdout || '').split(/\r?\n/)) {
    const m = /^== (\S+)（/.exec(line);
    if (m) current = m[1];
    else if (current && /^\s*✗/.test(line)) failed.add(current);
  }
  if (r.status !== 0 && failed.size === 0) failed.add('(npm run contrast 失敗但沒有指出主題)');
  return failed;
}

function build(file, outDir, stem) {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'src', 'cli', 'build-cli.js'), file, '--format', 'html', '--out', outDir, '--stem', stem], {
    cwd: ROOT,
    encoding: 'utf-8',
  });
  return r.status === 0 ? null : (r.stdout || '') + (r.stderr || '');
}

const describe = (f) => `${f.rule} ${f.severity}${f.page ? ` 第 ${f.page} 頁` : ''}：${f.message}`;

async function partLayouts(tmp, themes, badContrast = contrastFailures()) {
  const entries = loadCatalog().entries;
  const body = entries.map((e) => e.example.trim()).join('\n\n---\n\n') + '\n';
  const pages = splitSlides(frontmatter('classic') + body).length;
  if (pages !== entries.length) throw new Error(`版型 example 拼起來是 ${pages} 頁，目錄有 ${entries.length} 個版型`);

  const failures = [];
  for (const theme of themes) {
    const file = path.join(tmp, `layouts-${theme}.md`);
    fs.writeFileSync(file, frontmatter(theme) + body);
    const buildError = build(file, tmp, `layouts-${theme}`);
    const result = await checkFile(file);
    const themeProblems = [];
    if (buildError) themeProblems.push(`build 失敗：${buildError.trim().split('\n').pop()}`);
    if (result.skipped.length) themeProblems.push(`有規則沒檢查：${result.skipped.map((s) => `${s.rule}（${s.reason}）`).join('、')}`);
    if (badContrast.has(theme)) themeProblems.push('npm run contrast 不過');
    for (const [i, entry] of entries.entries()) {
      const errors = result.findings.filter((f) => f.severity === 'error' && f.page === i + 1);
      const reasons = [...themeProblems, ...errors.map(describe)];
      if (reasons.length) failures.push({ combo: `${theme} × ${entry.id}`, reasons });
    }
    // 沒有頁碼的 error 不屬於任何版型，整個主題算失敗
    const loose = result.findings.filter((f) => f.severity === 'error' && !f.page);
    if (loose.length) for (const entry of entries) failures.push({ combo: `${theme} × ${entry.id}`, reasons: loose.map(describe) });
    console.log(`${themeProblems.length ? '✗' : '✓'} ${theme}`);
  }
  for (const missing of [...badContrast].filter((t) => !themes.includes(t))) failures.push({ combo: missing, reasons: ['npm run contrast 不過'] });
  const failedCombos = new Set(failures.map((f) => f.combo));
  return { total: themes.length * entries.length, failed: failedCombos.size, failures };
}

async function partScenarios(tmp) {
  const combos = allCombos(loadScenarios());
  const failures = [];
  for (const { scenario, theme } of combos) {
    const b = buildStarter(scenario, theme, { outDir: tmp });
    const reasons = [];
    const example = await checkFile(path.join(b.dir, 'example.md'));
    const slides = await checkFile(path.join(b.dir, 'slides.md'));
    for (const [label, r] of [['example.md', example], ['slides.md', slides]]) {
      if (r.skipped.length) reasons.push(`${label} 有規則沒檢查：${r.skipped.map((s) => `${s.rule}（${s.reason}）`).join('、')}`);
    }
    reasons.push(...example.findings.filter((f) => f.severity === 'error').map((f) => `example.md ${describe(f)}`));
    reasons.push(...slides.findings.filter((f) => !(f.rule === 'R5' && f.severity === 'warning')).map((f) => `slides.md ${describe(f)}`));
    if (slides.findings.length === 0) reasons.push('slides.md 沒有任何 finding，填空的佔位應該要被找到');
    if (reasons.length) failures.push({ combo: b.name, reasons });
    console.log(`${reasons.length ? '✗' : '✓'} ${b.name}`);
  }
  return { total: combos.length, failed: failures.length, failures };
}

function report(title, part) {
  console.log(`\n${title}：${part.total} 組，通過 ${part.total - part.failed} 組，失敗 ${part.failed} 組`);
  for (const f of part.failures.slice(0, 50)) console.log(`  ✗ ${f.combo}\n      ${f.reasons.join('\n      ')}`);
  if (part.failures.length > 50) console.log(`  …另外 ${part.failures.length - 50} 筆沒有列出`);
}

async function main() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'md-to-slides-matrix-'));
  try {
    const themes = listThemes();
    console.log(`第一部分：${themes.length} 個主題 × 版型目錄`);
    const layouts = await partLayouts(tmp, themes);
    console.log('\n第二部分：場合的推薦組合');
    const scenarios = await partScenarios(tmp);
    report('第一部分（主題 × 版型）', layouts);
    report('第二部分（場合推薦組合）', scenarios);
    return layouts.failed || scenarios.failed ? 1 : 0;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

if (require.main === module) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      console.error(err.message);
      process.exit(1);
    }
  );
}

module.exports = { main, partLayouts, contrastFailures };
