'use strict';

// R5 未填佔位：程式碼區塊、HTML 註解、行內程式碼以外出現【…】。
// 【填：…】是 2.4 起的佔位格式，報 warning（strict 變 error）；
// 其他【…】可能是舊格式的佔位，也可能是來源標示這類真實內容，只報 info。
function checkPlaceholder(doc, ctx) {
  const severity = ctx.strict ? 'error' : 'warning';
  const findings = [];

  doc.info.forEach((entry, index) => {
    if (entry.kind !== 'text') return;
    for (const m of entry.visible.matchAll(/【[^】]*】/g)) {
      const filled = m[0].startsWith('【填：');
      findings.push({
        rule: 'R5',
        severity: filled ? severity : 'info',
        page: entry.page,
        line: index + 1,
        message: filled ? `還沒填的佔位：${m[0]}` : `可能是舊格式的佔位：${m[0]}`,
      });
    }
  });

  return findings;
}

module.exports = { checkPlaceholder };
