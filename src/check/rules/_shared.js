'use strict';

// 讓每條規則共用的解析：把 Markdown 切成頁、標出程式碼區塊／HTML 註解／frontmatter，
// 並找出「--- 被 HTML 區塊吃掉」的位置。純文字處理，不需要瀏覽器。

const fs = require('fs');
const path = require('path');

const THEMATIC_BREAK = /^ {0,3}([-*_])( *\1){2,} *$/;
const FENCE_OPEN = /^ {0,3}([`~]{3,})/;

const spaces = (n) => ' '.repeat(n);

function fenceOf(line) {
  const match = line.match(FENCE_OPEN);
  return match ? { marker: match[1][0], length: match[1].length } : null;
}

function isFenceClose(line, fence) {
  const match = line.match(/^ {0,3}([`~]{3,})\s*$/);
  return Boolean(match && match[1][0] === fence.marker && match[1].length >= fence.length);
}

function maskInlineCode(text) {
  return text.replace(/`[^`]*`/g, (m) => spaces(m.length));
}

// 找出 frontmatter 的範圍（含兩條 ---）；沒有就回傳 null。
function findFrontmatter(lines) {
  if (!lines.length || lines[0].trim() !== '---') return null;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---' || lines[i].trim() === '...') return { start: 0, end: i };
  }
  return null;
}

function readFrontmatterFields(lines, fm) {
  const result = { theme: null, themeLine: null, classValue: null, classLine: null, style: null };
  if (!fm) return result;
  for (let i = fm.start + 1; i < fm.end; i++) {
    const line = lines[i];
    let m = line.match(/^theme:\s*['"]?([^\s'"#]+)/);
    if (m) {
      result.theme = m[1];
      result.themeLine = i + 1;
      continue;
    }
    m = line.match(/^class:\s*(.+?)\s*$/);
    if (m) {
      result.classValue = m[1].replace(/^['"]|['"]$/g, '');
      result.classLine = i + 1;
      continue;
    }
    m = line.match(/^style:\s*[|>][+-]?\s*$/);
    if (m) {
      const body = [];
      let j = i + 1;
      while (j < fm.end && (lines[j] === '' || /^\s/.test(lines[j]))) {
        body.push(lines[j]);
        j++;
      }
      result.style = { startLine: i + 2, text: body.join('\n') };
      i = j - 1;
    }
  }
  return result;
}

function parseDocument(content) {
  const lines = content.split(/\r?\n/);
  const fm = findFrontmatter(lines);

  const info = lines.map((raw) => ({
    raw,
    kind: 'text', // text | fence | frontmatter
    visible: raw, // 去掉 HTML 註解與行內程式碼之後的文字（長度不變）
    page: null,
    blank: raw.trim() === '',
  }));
  const comments = []; // { text, line }
  const slides = [];
  const sticky = []; // { line, htmlLine, page }

  let page = 1;
  let slideStart = fm ? fm.end + 1 : 0;
  let fence = null;
  let inComment = false;
  let commentBuf = '';
  let commentLine = 0;

  const closeSlide = (endIdx) => {
    let first = slideStart;
    while (first <= endIdx && info[first].blank) first++;
    slides.push({
      page: slides.length + 1,
      startLine: slideStart + 1,
      endLine: endIdx + 1,
      firstContentLine: Math.min(first, endIdx) + 1,
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const entry = info[i];

    if (fm && i <= fm.end) {
      entry.kind = 'frontmatter';
      continue;
    }

    entry.page = page;
    entry.startedInComment = inComment;

    if (!inComment) {
      if (fence) {
        entry.kind = 'fence';
        if (isFenceClose(line, fence)) fence = null;
        continue;
      }
      const opened = fenceOf(line);
      if (opened) {
        fence = opened;
        entry.kind = 'fence';
        continue;
      }
    }

    // 逐字掃出 HTML 註解
    let visible = '';
    let pos = 0;
    while (pos < line.length) {
      if (inComment) {
        const end = line.indexOf('-->', pos);
        if (end < 0) {
          commentBuf += `${line.slice(pos)}\n`;
          visible += spaces(line.length - pos);
          pos = line.length;
        } else {
          commentBuf += line.slice(pos, end);
          visible += spaces(end + 3 - pos);
          pos = end + 3;
          inComment = false;
          comments.push({ text: commentBuf, line: commentLine });
          commentBuf = '';
        }
      } else {
        const start = line.indexOf('<!--', pos);
        if (start < 0) {
          visible += line.slice(pos);
          pos = line.length;
        } else {
          visible += line.slice(pos, start) + spaces(4);
          inComment = true;
          commentLine = i + 1;
          commentBuf = '';
          pos = start + 4;
        }
      }
    }
    entry.visible = maskInlineCode(visible);
    entry.blank = line.trim() === '';

    // 分頁
    if (entry.startedInComment || !THEMATIC_BREAK.test(line)) continue;

    const prev = i > 0 ? info[i - 1] : null;
    const swallowed =
      /^---\s*$/.test(line) &&
      prev &&
      prev.kind === 'text' &&
      !prev.startedInComment &&
      !prev.blank &&
      /^ {0,3}<(?!!--)/.test(prev.raw) &&
      !/<\/(style|script|pre|textarea)\s*>/i.test(prev.raw);

    if (swallowed) {
      sticky.push({ line: i + 1, htmlLine: i, page });
      continue;
    }

    closeSlide(i - 1);
    page += 1;
    slideStart = i + 1;
    entry.page = null; // 分隔線本身不屬於任何一頁
  }

  if (slideStart <= lines.length - 1 || slides.length === 0) closeSlide(lines.length - 1);

  return {
    lines,
    info,
    frontmatter: fm,
    fields: readFrontmatterFields(lines, fm),
    slides,
    comments,
    sticky,
  };
}

function isRemote(ref) {
  return /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|\/\/|#)/.test(ref) && !/^[a-zA-Z]:[\\/]/.test(ref);
}

// 回傳本機路徑；遠端網址、data URI、片段、樣板語法回傳 null。
function localPathOf(ref, baseDir) {
  const cleaned = ref.trim().replace(/^<|>$/g, '').replace(/^['"]|['"]$/g, '').replace(/[?#].*$/, '');
  if (!cleaned || isRemote(cleaned) || /[{}]/.test(cleaned)) return null;
  let decoded = cleaned;
  try {
    decoded = decodeURI(cleaned);
  } catch (_) {
    // keep as is
  }
  return path.resolve(baseDir, decoded);
}

function fileExists(p) {
  try {
    return fs.statSync(p).isFile();
  } catch (_) {
    return false;
  }
}

module.exports = {
  THEMATIC_BREAK,
  fileExists,
  localPathOf,
  maskInlineCode,
  parseDocument,
};
