'use strict';

const path = require('path');
const { fileExists, localPathOf } = require('./_shared');

const MD_IMAGE = /!\[[^\]]*\]\(\s*(<[^>]*>|[^)\s]+)/g;
const HTML_IMG = /<img\b[^>]*?\bsrc\s*=\s*(["'])(.*?)\1/gi;
const CSS_URL = /url\(\s*(["']?)(.*?)\1\s*\)/gi;

// R3 破圖：Markdown 圖片、<img src>、CSS url() 指到的本機檔案，從輸入檔的位置找不到。
function checkMissingImage(doc, ctx) {
  const baseDir = path.dirname(path.resolve(ctx.file));
  const findings = [];

  const report = (ref, line, page, severity, kind) => {
    const abs = localPathOf(ref, baseDir);
    if (!abs || fileExists(abs)) return;
    findings.push({
      rule: 'R3',
      severity,
      page,
      line,
      message: `${kind}指到的檔案找不到：${ref}（從 ${baseDir} 找）`,
    });
  };

  doc.info.forEach((entry, index) => {
    const line = index + 1;
    if (entry.kind === 'text') {
      for (const m of entry.visible.matchAll(MD_IMAGE)) report(m[1], line, entry.page, 'error', 'Markdown 圖片');
      for (const m of entry.visible.matchAll(HTML_IMG)) report(m[2], line, entry.page, 'error', '<img src>');
    } else if (entry.kind === 'frontmatter') {
      if (doc.fields.style && line >= doc.fields.style.startLine && line < doc.fields.style.startLine + doc.fields.style.text.split('\n').length) {
        for (const m of entry.raw.matchAll(CSS_URL)) report(m[2], line, null, 'warning', 'CSS url()');
      }
    }
  });

  return findings;
}

module.exports = { checkMissingImage };
