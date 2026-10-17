'use strict';

// 版型目錄載入器：讀 catalog/<pack>/<id>.md 與 catalog/_utilities.md。
// 目錄是版型的唯一資料來源，畫廊、提示詞、選擇器、CLI 都從這裡讀。

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DEFAULT_DIR = path.resolve(__dirname, '..', '..', 'catalog');
const PACKS = ['structure', 'core', 'academic', 'teaching'];
const REQUIRED_FIELDS = ['id', 'name_zh', 'name_en', 'pack', 'purpose', 'scenes', 'classes', 'aliases'];

const FENCE_LINE = /^ {0,3}(`{3,})(.*)$/;

// 取出標題（`## 骨架`）之後的第一個 fenced code block，外層可以是三個以上的反引號。
function extractSection(lines, heading) {
  const start = lines.findIndex((l) => l.trim() === heading);
  if (start < 0) return { found: false, text: null };
  let i = start + 1;
  while (i < lines.length && lines[i].trim() === '') i++;
  const open = i < lines.length ? lines[i].match(FENCE_LINE) : null;
  if (!open) return { found: true, text: null };
  const size = open[1].length;
  const body = [];
  for (let j = i + 1; j < lines.length; j++) {
    const close = lines[j].match(/^ {0,3}(`{3,})\s*$/);
    if (close && close[1].length >= size) return { found: true, text: body.join('\n') };
    body.push(lines[j]);
  }
  return { found: true, text: null }; // 沒有收尾的 fence
}

// 解析一個版型檔。回傳 { entry, problems }；problems 是字串陣列，空陣列表示讀得懂。
function parseEntry(text, file) {
  const problems = [];
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return { entry: null, problems: ['開頭沒有 frontmatter（---）'] };
  const end = lines.indexOf('---', 1);
  if (end < 0) return { entry: null, problems: ['frontmatter 沒有收尾的 ---'] };

  let meta;
  try {
    meta = yaml.load(lines.slice(1, end).join('\n'));
  } catch (err) {
    return { entry: null, problems: [`frontmatter 不是合法的 YAML：${err.message.split('\n')[0]}`] };
  }
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    return { entry: null, problems: ['frontmatter 不是欄位清單'] };
  }

  const body = lines.slice(end + 1);
  const skeleton = extractSection(body, '## 骨架');
  const example = extractSection(body, '## 範例');
  if (!skeleton.found) problems.push('缺少「## 骨架」區塊');
  else if (skeleton.text === null) problems.push('「## 骨架」後面沒有完整的程式碼區塊');
  if (!example.found) problems.push('缺少「## 範例」區塊');
  else if (example.text === null) problems.push('「## 範例」後面沒有完整的程式碼區塊');

  const entry = {
    ...meta,
    file,
    skeleton: skeleton.text,
    example: example.text,
  };
  return { entry, problems };
}

// _utilities.md：兩段「## 工具 class」「## 未歸版型的元件」，每個 `- ` 項目裡用反引號包起來的是 class 名稱。
function parseUtilities(text) {
  const result = { tools: [], components: [], problems: [] };
  const lines = text.split(/\r?\n/);
  let section = null;
  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      if (heading[1] === '工具 class') section = 'tools';
      else if (heading[1] === '未歸版型的元件') section = 'components';
      else section = null;
      continue;
    }
    if (!section || !/^\s*[-*]\s/.test(line)) continue;
    const classes = [...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    if (classes.length === 0) {
      result.problems.push(`項目沒有用反引號標出 class：${line.trim()}`);
      continue;
    }
    result[section].push({ classes, text: line.replace(/^\s*[-*]\s+/, '').trim() });
  }
  return result;
}

// 取出一段 Markdown 實際用到的 class：class="…" 與 <!-- _class: … -->，略過程式碼區塊。
function classesUsedIn(markdown) {
  const used = new Set();
  const visible = [];
  let fence = null;
  for (const line of markdown.split(/\r?\n/)) {
    const open = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      const close = line.match(/^ {0,3}(`{3,}|~{3,})\s*$/);
      if (close && close[1][0] === fence.char && close[1].length >= fence.len) fence = null;
      continue;
    }
    if (open) {
      fence = { char: open[1][0], len: open[1].length };
      continue;
    }
    visible.push(line);
  }
  const text = visible.join('\n');
  for (const m of text.matchAll(/\bclass\s*=\s*(["'])(.*?)\1/gi)) {
    for (const t of m[2].split(/\s+/)) if (t) used.add(t);
  }
  for (const m of text.matchAll(/<!--\s*_?class\s*:\s*([^>]*?)\s*-->/gi)) {
    for (const t of m[1].replace(/^['"]|['"]$/g, '').split(/\s+/)) if (t) used.add(t);
  }
  return used;
}

function listEntryFiles(dir) {
  const files = [];
  for (const sub of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    const subDir = path.join(dir, sub.name);
    for (const f of fs.readdirSync(subDir).sort()) {
      if (f.endsWith('.md')) files.push(path.join(subDir, f));
    }
  }
  return files;
}

// dir 預設是 repo 的 catalog/。
// 回傳 { dir, entries, utilities, aliases, classes, problems }
//   entries    版型陣列，依 pack（structure、core、academic、teaching）再依檔名排序
//   utilities  { tools, components }，每項 { classes, text }
//   aliases    { 舊名: { to, id } }
//   classes    Map<class, 所屬版型 id 陣列>：只含版型的 classes
//   problems   [{ file, message }]：讀不懂的檔案與欄位問題都記在這裡，不丟例外
function loadCatalog(dir = DEFAULT_DIR) {
  const problems = [];
  const entries = [];
  const packRank = (p) => (PACKS.indexOf(p) < 0 ? PACKS.length : PACKS.indexOf(p));

  const files = listEntryFiles(dir);
  for (const file of files) {
    const rel = path.relative(dir, file).split(path.sep).join('/');
    const { entry, problems: p } = parseEntry(fs.readFileSync(file, 'utf-8'), rel);
    p.forEach((message) => problems.push({ file: rel, message }));
    if (entry) entries.push(entry);
  }
  entries.sort(
    (a, b) =>
      packRank(path.dirname(a.file)) - packRank(path.dirname(b.file)) ||
      path.dirname(a.file).localeCompare(path.dirname(b.file)) ||
      a.file.localeCompare(b.file)
  );

  const utilitiesFile = path.join(dir, '_utilities.md');
  let utilities = { tools: [], components: [] };
  if (fs.existsSync(utilitiesFile)) {
    const parsed = parseUtilities(fs.readFileSync(utilitiesFile, 'utf-8'));
    utilities = { tools: parsed.tools, components: parsed.components };
    parsed.problems.forEach((message) => problems.push({ file: '_utilities.md', message }));
  } else {
    problems.push({ file: '_utilities.md', message: '找不到 _utilities.md' });
  }

  const aliases = {};
  const classes = new Map();
  for (const e of entries) {
    for (const c of Array.isArray(e.classes) ? e.classes : []) {
      if (!classes.has(c)) classes.set(c, []);
      classes.get(c).push(e.id);
    }
    if (e.aliases && typeof e.aliases === 'object') {
      for (const [from, to] of Object.entries(e.aliases)) aliases[from] = { to, id: e.id };
    }
  }

  return { dir, entries, utilities, aliases, classes, problems };
}

// 目錄認定「已定義」的 class：版型的 classes、工具 class、未歸版型的元件、別名的舊名。
function definedClasses(catalog) {
  const set = new Set(catalog.classes.keys());
  for (const u of [...catalog.utilities.tools, ...catalog.utilities.components]) u.classes.forEach((c) => set.add(c));
  Object.keys(catalog.aliases).forEach((c) => set.add(c));
  return set;
}

// class 的來歷，給 check 的相近建議用：版型的中文名，或「工具 class」「未歸版型的元件」。
function describeClass(catalog, name) {
  const ids = catalog.classes.get(name);
  if (ids && ids.length) {
    // 多個版型共用時，先取包別在前的（structure、core 是基本版型，academic、teaching 是組合出來的），
    // 同包再取 classes 最少的那個，都一樣照目錄順序
    const owners = catalog.entries.filter((e) => ids.includes(e.id));
    if (!owners.length) return ids[0];
    const rank = (e) => [PACKS.indexOf(e.pack), e.classes.length];
    const entry = owners.reduce((best, e) => {
      const [a, b] = [rank(e), rank(best)];
      return a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? e : best;
    });
    return entry.name_zh;
  }
  if (catalog.utilities.tools.some((u) => u.classes.includes(name))) return '工具 class';
  if (catalog.utilities.components.some((u) => u.classes.includes(name))) return '未歸版型的元件';
  if (catalog.aliases[name]) return '舊名';
  return '';
}

module.exports = {
  DEFAULT_DIR,
  PACKS,
  REQUIRED_FIELDS,
  loadCatalog,
  parseEntry,
  extractSection,
  parseUtilities,
  classesUsedIn,
  definedClasses,
  describeClass,
};
