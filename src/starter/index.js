'use strict';

// 起手包產生器：讀場合範本、版型目錄、主題，組出一個可以直接用 VS Code 打開的資料夾。
// 結構見 README 的「填空範本起手包（starter）」：slides.md、example.md、themes/、.vscode/settings.json、
// .github/copilot-instructions.md、AGENTS.md、CLAUDE.md、prompts.md。

const fs = require('fs');
const path = require('path');
const { loadCatalog } = require('../catalog');
const { loadScenarios } = require('../scenarios');
const { createZip } = require('./zip');

const ROOT = path.resolve(__dirname, '..', '..');
const STARTER_DIR = path.join(ROOT, 'starter');
const THEMES_DIR = path.join(ROOT, 'themes');

// 主題的底色與適合場合，跟 README 的主題表一致
const THEME_NOTES = {
  boardroom: '深藍底搭金色，對主管或客戶報告',
  classic: '淺灰白，原本的預設外觀',
  classroom: '淡黃底、字大，上課與教學',
  editorial: '暖米色、襯線標題，讀書會與分享會',
  midnight: '近黑底搭青綠色，技術分享與暗室投影',
  mono: '白底、無圓角與裝飾，要列印或黑白輸出',
  pitch: '淡紫白、紫色強調，提案與比賽',
  scholar: '米色、襯線標題，論文口試與研討會',
};

function listThemes(themesDir = THEMES_DIR) {
  return fs
    .readdirSync(themesDir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => path.basename(f, '.css'))
    .sort();
}

function renderLayouts(catalog) {
  const rows = catalog.entries.map((e) => {
    const classes = e.classes.length ? e.classes.map((c) => `\`${c}\``).join('、') : '（Markdown 表格，不用 class）';
    return `| \`${e.id}\` | ${e.name_zh} | ${e.purpose} | ${classes} |`;
  });
  const tools = [...catalog.utilities.tools.flatMap((u) => u.classes)].map((c) => `\`${c}\``).join('、');
  return ['| id | 中文名 | 用途 | class |', '|---|---|---|---|', ...rows, '', `每種版型都能搭配的工具 class：${tools}。`].join('\n');
}

function renderThemes(themes) {
  return themes.map((t) => `- \`${t}\`${THEME_NOTES[t] ? `：${THEME_NOTES[t]}` : ''}`).join('\n');
}

// 產生 AGENTS.md 的內容（也是 .github/copilot-instructions.md 的內容）
// Windows 上 git 可能把範本轉成 CRLF，一律轉回 LF，起手包裡的檔案不會混用換行
const readTemplate = (name) => fs.readFileSync(path.join(STARTER_DIR, name), 'utf-8').replace(/\r\n/g, '\n');

function renderRules({ catalog = loadCatalog(), themes = listThemes() } = {}) {
  const template = readTemplate('rules.md');
  return template.replace('{{LAYOUTS}}', renderLayouts(catalog)).replace('{{THEMES}}', renderThemes(themes));
}

const CLAUDE_MD = '# Claude Code 專案指示\n\n規則寫在 AGENTS.md，跟 .github/copilot-instructions.md 是同一份，這裡用匯入的方式讀進來。\n\n@AGENTS.md\n';

const frontmatter = (theme) => `---\nmarp: true\ntheme: ${theme}\npaginate: true\n---\n\n`;

// 回傳 [{ name, data }]，name 是相對於起手包資料夾的路徑（用 / 分隔），依名稱排序
function starterFiles(scenario, theme, { catalog = loadCatalog(), themesDir = THEMES_DIR } = {}) {
  const themes = listThemes(themesDir);
  if (!themes.includes(theme)) throw new Error(`找不到主題「${theme}」`);
  const rules = renderRules({ catalog, themes });
  const settings = {
    'markdown.marp.themes': themes.map((t) => `themes/${t}.css`),
    'markdown.marp.html': 'all',
  };
  const files = [
    { name: 'slides.md', data: frontmatter(theme) + scenario.blank.trimEnd() + '\n' },
    { name: 'example.md', data: frontmatter(theme) + scenario.example.trimEnd() + '\n' },
    { name: 'AGENTS.md', data: rules },
    // 在一台 Windows 電腦上用 Claude Code 2.1.302 測試，資料夾在家目錄底下時沒有讀到 AGENTS.md（原因還沒確認），
    // 所以另外放一份只匯入 AGENTS.md 的 CLAUDE.md。官方文件說保留匯入不會讓 AGENTS.md 讀兩次。
    { name: 'CLAUDE.md', data: CLAUDE_MD },
    { name: '.github/copilot-instructions.md', data: rules },
    { name: 'prompts.md', data: readTemplate('prompts.md') },
    { name: '.vscode/settings.json', data: JSON.stringify(settings, null, 2) + '\n' },
    ...themes.map((t) => ({ name: `themes/${t}.css`, data: fs.readFileSync(path.join(themesDir, `${t}.css`)) })),
  ];
  return files
    .map((f) => ({ name: f.name, data: Buffer.isBuffer(f.data) ? f.data : Buffer.from(f.data, 'utf-8') }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// zip 裡的檔案都放在 <場合>-<主題>/ 底下，解開就是一個資料夾
const zipFiles = (name, files) => createZip(files.map((f) => ({ name: `${name}/${f.name}`, data: f.data })));

// 只產生 zip 的內容，不寫資料夾（樣式畫廊用）。回傳 { name, data }
function starterZip(scenario, theme, { catalog } = {}) {
  const name = `${scenario.id}-${theme}`;
  return { name, data: zipFiles(name, starterFiles(scenario, theme, { catalog })) };
}

// 產生一個起手包資料夾（out/<場合>-<主題>/），zip 為 true 時另外寫 out/<場合>-<主題>.zip。
// 回傳 { name, dir, zip, files }
function buildStarter(scenario, theme, { outDir, zip = false, catalog } = {}) {
  const name = `${scenario.id}-${theme}`;
  const dir = path.join(outDir, name);
  const files = starterFiles(scenario, theme, { catalog });
  // 只覆寫，不先清空資料夾：資料夾裡使用者自己加的檔案不會被刪
  for (const f of files) {
    const target = path.join(dir, ...f.name.split('/'));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, f.data);
  }
  let zipPath = null;
  if (zip) {
    zipPath = path.join(outDir, `${name}.zip`);
    fs.writeFileSync(zipPath, zipFiles(name, files));
  }
  return { name, dir, zip: zipPath, files: files.map((f) => f.name) };
}

// 全部場合與各自推薦主題的組合
function allCombos(loaded = loadScenarios()) {
  return loaded.scenarios.flatMap((s) => s.themes.map((theme) => ({ scenario: s, theme })));
}

module.exports = { renderRules, starterFiles, starterZip, buildStarter, allCombos, listThemes, THEME_NOTES };
