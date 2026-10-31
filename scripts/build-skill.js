'use strict';

// 產生簡報 skill 裡「由 repo 資料產生」的三份 reference（SDD-v2.8 D3、T3）。
//   npm run skill            寫入 plugin/skills/make-slides/references/
//   npm run skill -- --check 只比對，有差異 exit 1（CI 與 tests/skill.test.js 用）
// 參數：--root <repo 根目錄>（預設是這支腳本的上一層）、--out <輸出資料夾>
//
// 三份產物與來源：
//   marp-rules.md  starter/rules.md 經 renderRules() 產生的 AGENTS.md，從「## 不能改的東西」切到結尾（AC-2 同源）
//   layouts.md     catalog/ 每個版型的欄位與骨架
//   scenarios.md   scenarios/ 每個場合的 frontmatter（段落、頁數、版型、推薦主題、notice）

const fs = require('fs');
const path = require('path');

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const ROOT = path.resolve(arg('--root', path.resolve(__dirname, '..')));
const OUT = path.resolve(arg('--out', path.join(ROOT, 'plugin', 'skills', 'make-slides', 'references')));
const CHECK = process.argv.includes('--check');

const { loadCatalog } = require(path.join(ROOT, 'src', 'catalog'));
const { loadScenarios } = require(path.join(ROOT, 'src', 'scenarios'));
const { renderRules } = require(path.join(ROOT, 'src', 'starter'));

const GENERATED = (src) => `<!-- 由 npm run skill 從 ${src} 產生，不要直接修改這個檔案 -->\n\n`;
const RULES_FROM = '## 不能改的東西';

// AGENTS.md 開頭兩段（資料夾說明、要做的事）只適用起手包，skill 從「不能改的東西」開始取。
function sliceRules(agentsMd) {
  const i = agentsMd.indexOf(`\n${RULES_FROM}\n`);
  if (i < 0) throw new Error(`renderRules() 的輸出裡找不到「${RULES_FROM}」，starter/rules.md 的標題改過了嗎？`);
  return agentsMd.slice(i + 1);
}

// plugin 安裝後沒有 themes/ 資料夾，rules.md 的「對應的 CSS 都在 `themes/`」要改成不指向不存在的路徑。
const THEMES_FROM = '對應的 CSS 都在 `themes/`：';
const THEMES_TO = '主題的 CSS 在 md-to-slides repo 的 `themes/`，plugin 沒有附，這裡只列各主題的特色：';

function buildMarpRules(catalog) {
  const rules = sliceRules(renderRules({ catalog }));
  if (!rules.includes(THEMES_FROM)) throw new Error(`rules 裡找不到「${THEMES_FROM}」，starter/rules.md 的說法改過了嗎？`);
  return (
    GENERATED('starter/rules.md') +
    '# Marp 路線的規則\n\n' +
    '這份規則跟 md-to-slides 起手包的 `AGENTS.md` 由同一份來源產生。起手包裡說的 `slides.md`，在這裡就是你正在寫的簡報檔。\n\n' +
    rules.replace(THEMES_FROM, THEMES_TO)
  );
}

const PACK_ZH = { structure: '結構頁', core: '核心版型', academic: '學術包', teaching: '教學包' };

function buildLayouts(catalog) {
  const out = [GENERATED('catalog/'), '# 版型目錄\n\n'];
  out.push(
    `共 ${catalog.entries.length} 個版型。Marp 路線照「骨架」複製，把 \`【填：…】\` 換成內容；大綱路線（Claude Slides／Claude Design）只用「中文名」「英文名」「用途」描述版面，不要帶 class。\n\n`
  );
  out.push('| id | 中文名 | 英文名 | 包 | 用途 |\n|---|---|---|---|---|\n');
  for (const e of catalog.entries) out.push(`| \`${e.id}\` | ${e.name_zh} | ${e.name_en} | ${PACK_ZH[e.pack] || e.pack} | ${e.purpose} |\n`);
  for (const e of catalog.entries) {
    const classes = e.classes.length ? e.classes.map((c) => `\`${c}\``).join('、') : '不用 class（Markdown 表格）';
    const aliases = Object.entries(e.aliases || {}).map(([from, to]) => `\`${from}\` 是 \`${to}\` 的舊名`);
    const fence = /```/.test(e.skeleton) ? '````' : '```';
    out.push(`\n## ${e.name_zh}（\`${e.id}\`）\n\n`);
    out.push(`- 用途：${e.purpose}\n- 適用情境：${(e.scenes || []).join('、')}\n- class：${classes}\n`);
    if (aliases.length) out.push(`- 舊名：${aliases.join('；')}\n`);
    out.push(`\n${fence}markdown\n${e.skeleton.replace(/\r\n/g, '\n')}\n${fence}\n`);
  }
  const tools = catalog.utilities.tools.map((u) => `- ${u.text}`).join('\n');
  out.push(`\n## 工具 class\n\n每種版型都能搭配：\n\n${tools}\n`);
  return out.join('');
}

function buildScenarios(loaded, catalog) {
  const name = Object.fromEntries(catalog.entries.map((e) => [e.id, e.name_zh]));
  const out = [GENERATED('scenarios/'), '# 場合骨架\n\n'];
  out.push(
    `共 ${loaded.scenarios.length} 個場合。每個場合列出段落順序、建議頁數、各段用的版型與推薦主題。頁數是起手包的預設，使用者給的時長比較長時，照段落比例加頁。\n\n`
  );
  out.push('| id | 場合 | 推薦主題 | 頁數 |\n|---|---|---|---|\n');
  for (const s of loaded.scenarios) {
    const total = s.sections.reduce((n, sec) => n + sec.slides, 0);
    out.push(`| \`${s.id}\` | ${s.name_zh} | ${s.themes.map((t) => `\`${t}\``).join('、')} | ${total} |\n`);
  }
  for (const s of loaded.scenarios) {
    out.push(`\n## ${s.name_zh}（\`${s.id}\`）\n\n`);
    out.push(`推薦主題：${s.themes.map((t) => `\`${t}\``).join('、')}\n`);
    if (s.notice) out.push(`\n第一頁要寫上：${s.notice}\n`);
    out.push('\n| 段落 | 頁數 | 版型 |\n|---|---|---|\n');
    for (const sec of s.sections) {
      const layouts = sec.layouts.map((id) => `${name[id] || id}（\`${id}\`）`).join('、');
      out.push(`| ${sec.title} | ${sec.slides} | ${layouts} |\n`);
    }
  }
  return out.join('');
}

function main() {
  const catalog = loadCatalog(path.join(ROOT, 'catalog'));
  const loaded = loadScenarios(path.join(ROOT, 'scenarios'));
  const problems = [...catalog.problems, ...loaded.problems];
  if (problems.length) {
    problems.forEach((p) => console.error(`${p.file}: ${p.message}`));
    process.exit(1);
  }
  const files = {
    'marp-rules.md': buildMarpRules(catalog),
    'layouts.md': buildLayouts(catalog),
    'scenarios.md': buildScenarios(loaded, catalog),
  };
  let stale = 0;
  for (const [name, text] of Object.entries(files)) {
    const target = path.join(OUT, name);
    if (CHECK) {
      const now = fs.existsSync(target) ? fs.readFileSync(target, 'utf-8').replace(/\r\n/g, '\n') : null;
      if (now !== text) {
        stale++;
        console.error(`過期：${name}`);
      }
    } else {
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(target, text);
      console.log(`寫入 ${name}（${Buffer.byteLength(text)} bytes）`);
    }
  }
  if (CHECK) {
    console.log(stale ? `${stale} 份過期，執行 npm run skill` : '三份 reference 都是最新');
    process.exit(stale ? 1 : 0);
  }
}

module.exports = { sliceRules, buildMarpRules, buildLayouts, buildScenarios, THEMES_FROM, THEMES_TO };
if (require.main === module) main();
