'use strict';

const fs = require('fs');
const path = require('path');

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
function findThemeCss(name, ctx) {
  const dirs = [BUILTIN_THEMES_DIR, ...(ctx.themeSets || []), path.dirname(path.resolve(ctx.file))];
  for (const target of dirs) {
    const files = target === path.dirname(path.resolve(ctx.file))
      ? fs.readdirSync(target).filter((f) => f.endsWith('.css')).map((f) => path.join(target, f))
      : listCssFiles(target);
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf-8');
      const meta = text.match(/\/\*\s*@theme\s+([^\s*]+)\s*\*\//);
      if (meta && meta[1] === name) return text;
    }
  }
  return null;
}

// R4 未定義 class：class="…" 和 <!-- _class: … --> 用到的 class，
// 在套用的主題 CSS 和 frontmatter style: 裡都找不到。
function checkUndefinedClass(doc, ctx) {
  const theme = doc.fields.theme;
  const defined = new Set(MARP_BUILTIN_CLASSES);

  if (theme && !MARP_BUILTIN_THEMES.has(theme)) {
    const css = findThemeCss(theme, ctx);
    if (css === null) {
      return {
        findings: [],
        skipped: { rule: 'R4', reason: `找不到主題「${theme}」的 CSS（可用 --theme-set 指定），沒有檢查 class` },
      };
    }
    classesDefinedIn(css).forEach((c) => defined.add(c));
  }
  if (doc.fields.style) classesDefinedIn(doc.fields.style.text).forEach((c) => defined.add(c));

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
    if (defined.has(u.name)) continue;
    const key = `${u.line}:${u.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    findings.push({
      rule: 'R4',
      severity: 'warning',
      page: u.page,
      line: u.line,
      message: `class「${u.name}」在主題 CSS 和 frontmatter style 裡都找不到`,
    });
  }
  return { findings, skipped: null };
}

module.exports = { checkUndefinedClass, classesDefinedIn };
