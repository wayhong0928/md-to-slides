'use strict';

const fs = require('fs');
const path = require('path');
const { loadCatalog, definedClasses, describeClass } = require('../../catalog');

const BUILTIN_THEMES_DIR = path.resolve(__dirname, '..', '..', '..', 'themes');
// Marp 內建主題（default、gaia、uncover）共通的 class。
const MARP_BUILTIN_THEMES = new Set(['default', 'gaia', 'uncover']);
const MARP_BUILTIN_CLASSES = ['lead', 'invert'];

function stripCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/url\([^)]*\)/gi, ' ')
    .replace(/(["'])(?:\\.|(?!\1).)*\1/g, ' ');
}

function classesDefinedIn(css) {
  const found = new Set();
  for (const m of stripCss(css).matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) found.add(m[1]);
  return found;
}

function listCssFiles(target) {
  try {
    const stat = fs.statSync(target);
    if (stat.isFile()) return [target];
    return fs
      .readdirSync(target, { withFileTypes: true })
      .flatMap((entry) => {
        const full = path.join(target, entry.name);
        if (entry.isDirectory()) return listCssFiles(full);
        return entry.name.endsWith('.css') ? [full] : [];
      });
  } catch (_) {
    return [];
  }
}

// 依主題名稱找 CSS：內建 themes/、--theme-set 指定的檔案或資料夾、輸入檔所在的資料夾。
// 回傳 { css, builtin }，builtin 表示這份 CSS 來自 repo 的 themes/；找不到回傳 null。
function findThemeCss(name, ctx) {
  const dirs = [BUILTIN_THEMES_DIR, ...(ctx.themeSets || []), path.dirname(path.resolve(ctx.file))];
  for (const target of dirs) {
    const files = target === path.dirname(path.resolve(ctx.file))
      ? fs.readdirSync(target).filter((f) => f.endsWith('.css')).map((f) => path.join(target, f))
      : listCssFiles(target);
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf-8');
      const meta = text.match(/\/\*\s*@theme\s+([^\s*]+)\s*\*\//);
      if (meta && meta[1] === name) {
        return { css: text, builtin: target === BUILTIN_THEMES_DIR };
      }
    }
  }
  return null;
}

// 版型目錄只載入一次。目錄讀不到或有問題時回傳 null，R4 退回解析主題 CSS，不讓 check 因此失敗。
let cachedCatalog;
function getCatalog() {
  if (cachedCatalog === undefined) {
    try {
      const catalog = loadCatalog();
      cachedCatalog = catalog.entries.length > 0 && catalog.problems.length === 0 ? catalog : null;
    } catch (_) {
      cachedCatalog = null;
    }
  }
  return cachedCatalog;
}

function editDistance(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return prev[b.length];
}

// 目錄裡編輯距離 2 以內的 class，最多 3 個。距離也不能大於等於兩邊較短那個的長度，
// 否則一兩個字母的 class 會跟所有短名稱配對。別名的舊名不當建議。
function suggestClasses(catalog, name) {
  const aliasOld = new Set(Object.keys(catalog.aliases));
  const candidates = [...definedClasses(catalog)].filter((c) => !aliasOld.has(c));
  return candidates
    .map((c) => ({ c, d: editDistance(name, c) }))
    .filter(({ c, d }) => d > 0 && d <= 2 && d < Math.min(name.length, c.length))
    .sort((x, y) => x.d - y.d || x.c.localeCompare(y.c))
    .slice(0, 3)
    .map(({ c }) => {
      const where = describeClass(catalog, c);
      return where ? `「${c}」（${where}）` : `「${c}」`;
    });
}

// R4 未定義 class：class="…" 和 <!-- _class: … --> 用到的 class，
// 在套用的主題和 frontmatter style: 裡都找不到。
// 內建主題（repo 的 themes/）以版型目錄為準，已定義的 class 是目錄所有版型的 classes、
// _utilities.md 兩段和別名舊名；用到別名舊名（例如 col）出 info，找不到的 class 附上相近的目錄 class。
// 第三方主題（--theme-set、輸入檔旁的 CSS）照舊解析 CSS，也不給建議。
function checkUndefinedClass(doc, ctx) {
  const theme = doc.fields.theme;
  const defined = new Set(MARP_BUILTIN_CLASSES);
  let catalog = null; // 只有內建主題才會設定

  if (theme && !MARP_BUILTIN_THEMES.has(theme)) {
    const found = findThemeCss(theme, ctx);
    if (found === null) {
      return {
        findings: [],
        skipped: { rule: 'R4', reason: `找不到主題「${theme}」的 CSS（可用 --theme-set 指定），沒有檢查 class` },
      };
    }
    if (found.builtin) catalog = getCatalog();
    if (catalog) definedClasses(catalog).forEach((c) => defined.add(c));
    else classesDefinedIn(found.css).forEach((c) => defined.add(c));
  }
  const styleDefined = doc.fields.style ? classesDefinedIn(doc.fields.style.text) : new Set();
  styleDefined.forEach((c) => defined.add(c));

  const used = []; // { name, line, page }
  const addTokens = (value, line, page) => {
    for (const token of value.split(/\s+/)) {
      if (!token || /[{}$]/.test(token)) continue;
      used.push({ name: token, line, page });
    }
  };

  doc.info.forEach((entry, index) => {
    if (entry.kind !== 'text') return;
    for (const m of entry.visible.matchAll(/\bclass\s*=\s*(["'])(.*?)\1/gi)) addTokens(m[2], index + 1, entry.page);
  });
  for (const comment of doc.comments) {
    const m = comment.text.match(/(?:^|\n)\s*_?class\s*:\s*([^\n]+)/);
    if (!m) continue;
    const entry = doc.info[comment.line - 1];
    addTokens(m[1].replace(/^['"]|['"]$/g, ''), comment.line, entry ? entry.page : null);
  }
  if (doc.fields.classValue) addTokens(doc.fields.classValue, doc.fields.classLine, null);

  const seen = new Set();
  const findings = [];
  for (const u of used) {
    const key = `${u.line}:${u.name}`;
    if (defined.has(u.name)) {
      const alias = catalog && !styleDefined.has(u.name) ? catalog.aliases[u.name] : null;
      if (alias && !seen.has(key)) {
        seen.add(key);
        findings.push({
          rule: 'R4',
          severity: 'info',
          page: u.page,
          line: u.line,
          message: `class「${u.name}」是舊名，建議改成「${alias.to}」`,
        });
      }
      continue;
    }
    if (seen.has(key)) continue;
    seen.add(key);
    const suggestions = catalog ? suggestClasses(catalog, u.name) : [];
    findings.push({
      rule: 'R4',
      severity: 'warning',
      page: u.page,
      line: u.line,
      message:
        `class「${u.name}」在主題 CSS 和 frontmatter style 裡都找不到` +
        (suggestions.length ? `；要找的可能是${suggestions.join('、')}` : ''),
    });
  }
  return { findings, skipped: null };
}

module.exports = { checkUndefinedClass, classesDefinedIn };
