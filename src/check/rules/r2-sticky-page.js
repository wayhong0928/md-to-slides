'use strict';

// R2 黏頁：以 < 開頭的 HTML 行，下一行直接接 ---、中間沒有空行。
// Markdown 會把這條 --- 吃進 HTML 區塊，兩頁就黏成一頁。
function checkStickyPage(doc) {
  return doc.sticky.map((hit) => ({
    rule: 'R2',
    severity: 'error',
    page: hit.page,
    line: hit.line,
    message: `第 ${hit.htmlLine} 行是 HTML，下一行直接接 ---，分頁線會被吃掉，這頁和下一頁會黏在一起。在 --- 前面加一個空行。`,
  }));
}

module.exports = { checkStickyPage };
