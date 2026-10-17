'use strict';

// npm run scenarios [-- <場合資料夾>] [--catalog <目錄路徑>] [--themes <主題資料夾>]
// 驗證場合範本：欄位齊全、id 與檔名一致、sections 用到的版型都在目錄裡、推薦主題的 CSS 存在、
// 頁數等於 sections 的張數加總、用到的 class 都屬於這些版型或工具 class、
// 填空版的佔位全是【填：…】、範例版沒有【。
// 有錯誤時 exit 1，並逐筆指出是哪個檔案的哪個問題。

const fs = require('fs');
const path = require('path');
const { loadCatalog, classesUsedIn } = require('../src/catalog');
const { loadScenarios, splitPages, REQUIRED_FIELDS } = require('../src/scenarios');

const DEFAULT_THEMES = path.resolve(__dirname, '..', 'themes');
const ID_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const fmt = (items) => [...items].sort().map((c) => `「${c}」`).join('、');

// 回傳錯誤陣列 [{ file, message }]
function validateScenarios(loaded, catalog, themesDir) {
  const errors = loaded.problems.map((p) => ({ file: p.file, message: p.message }));
  const add = (file, message) => errors.push({ file, message });
  const layouts = new Map(catalog.entries.map((e) => [e.id, e]));
  const toolClasses = new Set(catalog.utilities.tools.flatMap((u) => u.classes));
  const seen = new Map();

  if (loaded.scenarios.length === 0 && loaded.problems.length === 0) add('(整體)', '沒有任何場合檔');

  for (const s of loaded.scenarios) {
    const file = s.file;
    for (const field of REQUIRED_FIELDS) {
      if (s[field] === undefined || s[field] === null || s[field] === '') add(file, `缺少欄位 ${field}`);
    }
    if (typeof s.id === 'string') {
      if (!ID_PATTERN.test(s.id)) add(file, `id「${s.id}」不是英文 kebab-case`);
      if (seen.has(s.id)) add(file, `id「${s.id}」跟 ${seen.get(s.id)} 重複`);
      else seen.set(s.id, file);
      if (path.basename(file, '.md') !== s.id) add(file, `檔名應該是 ${s.id}.md`);
    }

    if (s.themes !== undefined) {
      if (!Array.isArray(s.themes) || s.themes.length === 0) add(file, 'themes 必須是非空清單');
      else {
        for (const t of s.themes) {
          if (!fs.existsSync(path.join(themesDir, `${t}.css`))) add(file, `主題「${t}」找不到 ${t}.css`);
        }
      }
    }

    const used = new Set();
    let expected = 0;
    if (s.sections !== undefined) {
      if (!Array.isArray(s.sections) || s.sections.length === 0) add(file, 'sections 必須是非空清單');
      else {
        s.sections.forEach((sec, i) => {
          const label = `sections 第 ${i + 1} 段`;
          if (!sec || typeof sec !== 'object') return add(file, `${label}不是欄位清單`);
          if (typeof sec.title !== 'string' || !sec.title.trim()) add(file, `${label}缺少 title`);
          if (!Number.isInteger(sec.slides) || sec.slides < 1) add(file, `${label}的 slides 必須是正整數`);
          else expected += sec.slides;
          if (!Array.isArray(sec.layouts) || sec.layouts.length === 0) add(file, `${label}的 layouts 必須是非空清單`);
          else {
            for (const id of sec.layouts) {
              if (!layouts.has(id)) add(file, `${label}用到的版型「${id}」不在目錄裡`);
              else used.add(id);
            }
          }
        });
      }
    }

    const allowed = new Set(toolClasses);
    for (const id of used) layouts.get(id).classes.forEach((c) => allowed.add(c));

    for (const [key, label] of [['blank', '填空版'], ['example', '範例版']]) {
      if (typeof s[key] !== 'string') continue;
      const pages = splitPages(s[key]).length;
      if (expected && pages !== expected) add(file, `${label}有 ${pages} 頁，sections 加總是 ${expected} 頁`);
      if (used.size) {
        const extra = [...classesUsedIn(s[key])].filter((c) => !allowed.has(c));
        if (extra.length) add(file, `${label}用到的 class 不屬於 sections 列的版型或工具 class：${fmt(extra)}`);
      }
    }

    if (typeof s.blank === 'string') {
      const marks = s.blank.match(/【[^】]*】/g) || [];
      if (marks.length === 0) add(file, '填空版沒有任何【填：…】佔位');
      const wrong = [...new Set(marks.filter((m) => !m.startsWith('【填：')))];
      if (wrong.length) add(file, `填空版的佔位要寫成【填：…】：${wrong.join('、')}`);
    }
    if (typeof s.example === 'string' && s.example.includes('【')) {
      add(file, '範例版不能有【，要填成完整的虛構內容');
    }

    // 選填的 notice：起手包的 AGENTS.md 會加這段提醒，填空版與範例版的第一頁也要看得到（SDD-v2.6 D6）
    if (s.notice !== undefined) {
      if (typeof s.notice !== 'string' || !s.notice.trim()) add(file, 'notice 必須是非空字串');
      else {
        for (const [key, label] of [['blank', '填空版'], ['example', '範例版']]) {
          if (typeof s[key] !== 'string') continue;
          const first = splitPages(s[key])[0] || '';
          if (!first.includes(s.notice)) add(file, `${label}的第一頁沒有 notice 的文字「${s.notice}」`);
        }
      }
    }
  }
  return errors;
}

function parseArgs(argv) {
  const args = { dir: null, catalog: null, themes: DEFAULT_THEMES };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--catalog' && argv[i + 1]) args.catalog = path.resolve(argv[++i]);
    else if (argv[i] === '--themes' && argv[i + 1]) args.themes = path.resolve(argv[++i]);
    else if (!argv[i].startsWith('-') && !args.dir) args.dir = path.resolve(argv[i]);
  }
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  const loaded = args.dir ? loadScenarios(args.dir) : loadScenarios();
  const catalog = args.catalog ? loadCatalog(args.catalog) : loadCatalog();
  const errors = validateScenarios(loaded, catalog, args.themes);

  if (errors.length) {
    for (const e of errors) console.error(`${e.file}  ${e.message}`);
    console.error(`\n場合驗證失敗：${errors.length} 個問題（${loaded.scenarios.length} 個場合）`);
    return 1;
  }
  const combos = loaded.scenarios.reduce((n, s) => n + s.themes.length, 0);
  console.log(`場合驗證通過：${loaded.scenarios.length} 個場合，${combos} 個場合與主題組合`);
  return 0;
}

module.exports = { validateScenarios, main };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
