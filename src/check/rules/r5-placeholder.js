'use strict';

// R5 未填佔位：程式碼區塊、HTML 註解、行內程式碼以外出現【…】。
function checkPlaceholder(doc, ctx) {
  const severity = ctx.strict ? 'error' : 'warning';
  const findings = [];

  doc.info.forEach((entry, index) => {
    if (entry.kind !== 'text') return;
    for (const m of entry.visible.matchAll(/【[^】]*】/g)) {
      findings.push({
        rule: 'R5',
        severity,
        page: entry.page,
        line: index + 1,
        message: `還沒填的佔位：${m[0]}`,
      });
    }
  });

  return findings;
}

module.exports = { checkPlaceholder };
