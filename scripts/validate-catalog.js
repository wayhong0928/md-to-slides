'use strict';

// npm run catalog [-- <目錄路徑>] [--css <_base.css 路徑>]
// 驗證版型目錄：欄位齊全、id 不重複、pack 合法、骨架用到的 class 與 classes 一致、
// 所有 class 都在 _base.css 有定義，而且「版型 classes＋_utilities.md 兩段＋別名舊名」跟 _base.css 的 class 集合完全相同。
// 有錯誤時 exit 1，並逐筆指出是哪個檔案的哪個問題。

const fs = require('fs');
const path = require('path');
const { loadCatalog, definedClasses, classesUsedIn, PACKS, REQUIRED_FIELDS } = require('../src/catalog');
const { classesDefinedIn } = require('../src/check/rules/r4-undefined-class');

const DEFAULT_CSS = path.resolve(__dirname, '..', 'themes', 'src', '_base.css');
const ID_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const fmt = (set) => [...set].sort().map((c) => `「${c}」`).join('、');
const diff = (a, b) => new Set([...a].filter((x) => !b.has(x)));

// 回傳錯誤陣列 [{ file, message }]
function validateCatalog(catalog, baseClasses) {
  const errors = catalog.problems.map((p) => ({ file: p.file, message: p.message }));
  const add = (file, message) => errors.push({ file, message });

  const seen = new Map();
  for (const e of catalog.entries) {
    const file = e.file;

    for (const field of REQUIRED_FIELDS) {
      if (e[field] === undefined || e[field] === null || e[field] === '') add(file, `缺少欄位 ${field}`);
    }
    if (typeof e.id === 'string') {
      if (!ID_PATTERN.test(e.id)) add(file, `id「${e.id}」不是英文 kebab-case`);
      if (seen.has(e.id)) add(file, `id「${e.id}」跟 ${seen.get(e.id)} 重複`);
      else seen.set(e.id, file);
      if (path.basename(file, '.md') !== e.id) add(file, `檔名應該是 ${e.id}.md`);
    }
    if (e.pack !== undefined) {
      if (!PACKS.includes(e.pack)) add(file, `pack「${e.pack}」不在 ${PACKS.join('、')} 裡`);
      else if (path.dirname(file) !== e.pack) add(file, `pack 是 ${e.pack}，但檔案放在 ${path.dirname(file)}/ 底下`);
    }
    if (e.scenes !== undefined && (!Array.isArray(e.scenes) || e.scenes.length === 0)) add(file, 'scenes 必須是非空清單');
    if (e.classes !== undefined && !Array.isArray(e.classes)) add(file, 'classes 必須是清單');
    if (e.aliases !== undefined && (typeof e.aliases !== 'object' || e.aliases === null || Array.isArray(e.aliases))) {
      add(file, 'aliases 必須是「舊名: 新名」的對照');
    }
    if (typeof e.skeleton === 'string' && e.skeleton.trim() === '') add(file, '骨架是空的');
    if (typeof e.example === 'string' && e.example.trim() === '') add(file, '範例是空的');

    if (Array.isArray(e.classes)) {
      const declared = new Set(e.classes.map(String));
      if (declared.size !== e.classes.length) add(file, 'classes 有重複的項目');
      for (const c of declared) {
        if (!baseClasses.has(c)) add(file, `class「${c}」在 _base.css 沒有定義`);
      }
      if (typeof e.skeleton === 'string') {
        const used = classesUsedIn(e.skeleton);
        const missing = diff(declared, used);
        const extra = diff(used, declared);
        if (missing.size) add(file, `classes 列了但骨架沒用到：${fmt(missing)}`);
        if (extra.size) add(file, `骨架用到但 classes 沒列：${fmt(extra)}`);
      }
      if (typeof e.example === 'string') {
        const extra = diff(classesUsedIn(e.example), declared);
        if (extra.size) add(file, `範例用到但 classes 沒列：${fmt(extra)}`);
      }
    }

    for (const key of ['skeleton', 'example']) {
      if (typeof e[key] !== 'string') continue;
      const lines = e[key].split(/\r?\n/);
      let fence = false;
      for (const line of lines) {
        if (/^ {0,3}(`{3,}|~{3,})/.test(line)) fence = !fence;
        if (!fence && /^---\s*$/.test(line)) {
          add(file, `${key === 'skeleton' ? '骨架' : '範例'}裡有 --- 分頁線，每筆只能寫一頁`);
          break;
        }
      }
    }

    if (e.aliases && typeof e.aliases === 'object') {
      for (const [from, to] of Object.entries(e.aliases)) {
        if (!baseClasses.has(from)) add(file, `別名舊名「${from}」在 _base.css 沒有定義`);
        if (!baseClasses.has(String(to))) add(file, `別名新名「${to}」在 _base.css 沒有定義`);
        if (Array.isArray(e.classes) && !e.classes.includes(to)) add(file, `別名新名「${to}」不在這筆的 classes 裡`);
      }
    }
  }

  for (const u of [...catalog.utilities.tools, ...catalog.utilities.components]) {
    for (const c of u.classes) {
      if (!baseClasses.has(c)) add('_utilities.md', `class「${c}」在 _base.css 沒有定義`);
    }
  }

  const defined = definedClasses(catalog);
  const notInCatalog = diff(baseClasses, defined);
  const notInCss = diff(defined, baseClasses);
  if (notInCatalog.size) add('(整體)', `_base.css 有、目錄沒有的 class：${fmt(notInCatalog)}`);
  if (notInCss.size && !errors.some((x) => /在 _base\.css 沒有定義/.test(x.message))) {
    add('(整體)', `目錄有、_base.css 沒有的 class：${fmt(notInCss)}`);
  }
  return errors;
}

function parseArgs(argv) {
  const args = { dir: null, css: DEFAULT_CSS };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--css' && argv[i + 1]) args.css = path.resolve(argv[++i]);
    else if (!argv[i].startsWith('-') && !args.dir) args.dir = path.resolve(argv[i]);
  }
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  const catalog = args.dir ? loadCatalog(args.dir) : loadCatalog();
  const baseClasses = classesDefinedIn(fs.readFileSync(args.css, 'utf-8'));
  const errors = validateCatalog(catalog, baseClasses);

  if (errors.length) {
    for (const e of errors) console.error(`${e.file}  ${e.message}`);
    console.error(`\n目錄驗證失敗：${errors.length} 個問題（${catalog.entries.length} 筆版型）`);
    return 1;
  }
  console.log(
    `目錄驗證通過：${catalog.entries.length} 筆版型，_base.css 的 ${baseClasses.size} 個 class 都有歸屬`
  );
  return 0;
}

module.exports = { validateCatalog, main };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
