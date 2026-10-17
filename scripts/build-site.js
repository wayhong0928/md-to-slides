'use strict';

// npm run site：產生樣式畫廊到 output/site/（SDD-v2.5，v2.6 加預設選項與品牌色調色欄位）。
//   site/ 的頁面骨架照抄過去，預覽、版型、主題、token 與起手包 zip 都從 catalog/、scenarios/、themes/ 產生。
//   jsDelivr 網址固定到 commit：CI 用 GITHUB_SHA，本機用 git rev-parse HEAD。
// npm run site -- --out <資料夾>  改輸出位置（測試用）

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadCatalog } = require('../src/catalog');
const { loadScenarios, splitPages } = require('../src/scenarios');
const { starterZip, listThemes, THEME_NOTES } = require('../src/starter');
const { createRenderer } = require('../src/site/render');
const { loadPairs, resolveVars } = require('./check-contrast');

const ROOT = path.resolve(__dirname, '..');
const SITE_SRC = path.join(ROOT, 'site');
const THEMES_DIR = path.join(ROOT, 'themes');
const REPO = 'wayhong0928/md-to-slides';
const SHOWCASE_PAGES = 6;
// 畫廊各頁打開時先選哪一個（SDD-v2.6 D10）。場合頁帶出預設場合的第一個推薦主題
const DEFAULTS = { scenario: 'business-proposal', theme: 'classic' };
// 可以在畫廊調色的 token（SDD-v2.6 D3、D4），只有宣告了它的主題才有調色欄位
const TUNABLE = '--theme-brand';

const normalize = (text) => text.replace(/\r\n/g, '\n');

// TOKENS.md「固定不換」之前的表格列：| `--theme-xxx` | 用途 | ...
function readTokens(themesDir = THEMES_DIR) {
  const text = normalize(fs.readFileSync(path.join(themesDir, 'TOKENS.md'), 'utf-8'));
  const end = text.indexOf('## 固定不換');
  const head = end < 0 ? text : text.slice(0, end);
  const tokens = [];
  for (const m of head.matchAll(/^\|\s*`(--theme-[a-z0-9-]+)`\s*\|\s*([^|]*?)\s*\|/gm)) {
    if (!tokens.some((t) => t.name === m[1])) tokens.push({ name: m[1], purpose: m[2] });
  }
  return tokens;
}

// themes/src/<id>.css 裡每個 token 第一次宣告的值
function readTokenValues(theme, themesDir = THEMES_DIR) {
  const css = fs.readFileSync(path.join(themesDir, 'src', `${theme}.css`), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  const values = {};
  for (const m of css.matchAll(/(--theme-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    if (!(m[1] in values)) values[m[1]] = m[2].trim();
  }
  return values;
}

function currentCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf-8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

// 調色欄位要的資料：哪些 token 綁到品牌色、要重算的對比配對與其他 token 的解析值
function tunerData(raw, resolved, pairs) {
  if (!(TUNABLE in raw)) return null;
  const bound = Object.keys(raw).filter((name) => raw[name] === `var(${TUNABLE})`);
  const used = pairs.filter((p) => bound.includes(p.fg) || bound.includes(p.bg));
  return { token: TUNABLE, value: resolved[TUNABLE], bound, pairs: used.map(({ fg, bg, min, note }) => ({ fg, bg, min, note })) };
}

const themeUrl = (commit, theme) => `https://cdn.jsdelivr.net/gh/${REPO}@${commit}/themes/${theme}.css`;

// 主題頁的 VS Code 設定片段（D5）
function vscodeSnippet(commit, theme) {
  const settings = { 'markdown.marp.themes': [themeUrl(commit, theme)], 'markdown.marp.html': 'all' };
  return JSON.stringify(settings, null, 2);
}

function write(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
}

function parseArgs(argv) {
  const i = argv.indexOf('--out');
  return { out: i >= 0 && argv[i + 1] ? path.resolve(argv[i + 1]) : path.join(ROOT, 'output', 'site') };
}

function buildSite({ out }) {
  const catalog = loadCatalog();
  const loaded = loadScenarios();
  const problems = [...catalog.problems.map((p) => `${p.file}  ${p.message}`), ...loaded.problems.map((p) => `${p.file}  ${p.message}`)];
  if (problems.length) return { problems };

  const commit = currentCommit();
  if (!commit) return { problems: ['取不到 commit（不是 git repo，也沒有 GITHUB_SHA），jsDelivr 網址沒辦法固定版本'] };

  const themes = listThemes(THEMES_DIR);
  const render = createRenderer({ themesDir: THEMES_DIR });
  const counts = { pages: 0, css: 0, scenarios: 0, layouts: 0, themes: 0, zips: 0 };

  // 頁面骨架、site.css、site.js 照抄
  for (const file of fs.readdirSync(SITE_SRC)) {
    write(path.join(out, file), fs.readFileSync(path.join(SITE_SRC, file)));
    if (file.endsWith('.html')) counts.pages += 1;
  }

  const showcase = normalize(fs.readFileSync(path.join(ROOT, 'examples', 'showcase.md'), 'utf-8'));
  const showcaseHead = splitPages(showcase.replace(/^---\n[\s\S]*?\n---\n/, '')).slice(0, SHOWCASE_PAGES).join('\n\n---\n\n');

  for (const theme of themes) {
    let css = null;
    for (const s of loaded.scenarios) {
      const r = render(s.example, theme);
      css = r.css;
      write(path.join(out, 'data', 'scenarios', s.id, `${theme}.html`), r.html);
      counts.scenarios += 1;
      write(path.join(out, 'starters', `${s.id}-${theme}.zip`), starterZip(s, theme, { catalog }).data);
      counts.zips += 1;
    }
    write(path.join(out, 'data', 'css', `${theme}.css`), css);
    counts.css += 1;

    const layouts = {};
    for (const e of catalog.entries) layouts[e.id] = render(e.example, theme).html;
    write(path.join(out, 'data', 'layouts', `${theme}.json`), JSON.stringify(layouts));
    counts.layouts += 1;

    write(path.join(out, 'data', 'themes', `${theme}.html`), render(showcaseHead, theme).html);
    counts.themes += 1;
  }

  // 頁面要的清單：場合、主題、版型、token。只有這一份，三頁共用。
  const tokens = readTokens(THEMES_DIR);
  const { pairs } = loadPairs(path.join(THEMES_DIR, 'TOKENS.md'));
  const missing = [DEFAULTS.theme].filter((t) => !themes.includes(t)).concat(loaded.scenarios.some((s) => s.id === DEFAULTS.scenario) ? [] : [DEFAULTS.scenario]);
  if (missing.length) return { problems: [`畫廊的預設選項找不到：${missing.join('、')}`] };
  const site = {
    commit,
    defaults: DEFAULTS,
    scenarios: loaded.scenarios.map((s) => ({ id: s.id, name_zh: s.name_zh, themes: s.themes, slides: render(s.example, s.themes[0]).slides })),
    themes: themes.map((t) => {
      const values = readTokenValues(t, THEMES_DIR);
      const { values: resolved, errors } = resolveVars(values);
      if (errors.length) problems.push(...errors.map((e) => `${t}：${e}`));
      return {
        id: t,
        note: THEME_NOTES[t] || '',
        url: themeUrl(commit, t),
        snippet: vscodeSnippet(commit, t),
        values,
        resolved,
        tuner: tunerData(values, resolved, pairs),
      };
    }),
    tokens,
    layouts: catalog.entries.map((e) => ({ id: e.id, name_zh: e.name_zh, pack: e.pack, purpose: e.purpose, skeleton: e.skeleton })),
    packs: [...new Set(catalog.entries.map((e) => e.pack))],
  };
  if (problems.length) return { problems };
  write(path.join(out, 'data', 'site.json'), JSON.stringify(site, null, 2));
  return { problems: [], counts, commit };
}

function main(argv) {
  const { out } = parseArgs(argv);
  const result = buildSite({ out });
  if (result.problems.length) {
    result.problems.forEach((p) => console.error(`✗ ${p}`));
    return 1;
  }
  const c = result.counts;
  console.log(`樣式畫廊已產生在 ${path.relative(process.cwd(), out) || out}`);
  console.log(`頁面 ${c.pages}、主題 CSS ${c.css}、場合預覽 ${c.scenarios}、版型 ${c.layouts}、主題預覽 ${c.themes}、起手包 zip ${c.zips}`);
  console.log(`jsDelivr 網址固定在 commit ${result.commit.slice(0, 7)}`);
  return 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { buildSite, readTokens, readTokenValues, vscodeSnippet, themeUrl, tunerData, DEFAULTS, main };
