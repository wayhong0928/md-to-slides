'use strict';

const fs = require('fs');
const { parseDocument } = require('./rules/_shared');
const { checkOverflow } = require('./rules/r1-overflow');
const { checkStickyPage } = require('./rules/r2-sticky-page');
const { checkMissingImage } = require('./rules/r3-missing-image');
const { checkUndefinedClass } = require('./rules/r4-undefined-class');
const { checkPlaceholder } = require('./rules/r5-placeholder');

function splitSlides(content) {
  return parseDocument(content).slides;
}

// info 只是提醒，不影響 exit code，連 --strict 也一樣。
const SEVERITY_ORDER = { error: 0, warning: 1, info: 2 };

// options: { browser = true, strict = false, themeSets = [] }
// 回傳 { file, findings, skipped }；skipped 列出沒檢查的規則和原因，不能當成通過。
async function checkFile(file, options = {}) {
  const { browser = true, strict = false, themeSets = [] } = options;
  const content = fs.readFileSync(file, 'utf-8');
  const doc = parseDocument(content);
  const ctx = { file, strict, themeSets };

  const findings = [...checkStickyPage(doc, ctx), ...checkMissingImage(doc, ctx), ...checkPlaceholder(doc, ctx)];
  const skipped = [];

  const r4 = checkUndefinedClass(doc, ctx);
  findings.push(...r4.findings);
  if (r4.skipped) skipped.push(r4.skipped);

  if (browser) {
    const r1 = await checkOverflow(doc, ctx);
    findings.push(...r1.findings);
    if (r1.skipped) skipped.push(r1.skipped);
  } else {
    skipped.push({ rule: 'R1', reason: '指定了 --no-browser' });
  }

  findings.sort(
    (a, b) =>
      (a.page || 0) - (b.page || 0) ||
      (a.line || 0) - (b.line || 0) ||
      a.rule.localeCompare(b.rule) ||
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  return { file, findings, skipped };
}

module.exports = { checkFile, splitSlides };
