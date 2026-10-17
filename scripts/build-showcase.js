'use strict';

// npm run showcase            從 catalog/ 重新產生 examples/showcase.md
// npm run showcase -- --check 只比對 examples/showcase.md 是不是最新，不一致 exit 1
// showcase 是產物，內容來自每個版型的「範例」區塊，依 pack、檔名排序，前面加一頁封面說明。

const fs = require('fs');
const path = require('path');
const { loadCatalog } = require('../src/catalog');

const OUTPUT = path.resolve(__dirname, '..', 'examples', 'showcase.md');

const FRONTMATTER = ['---', 'marp: true', 'theme: classic', 'paginate: true', '---'].join('\n');

function buildShowcase(catalog) {
  const intro = [
    '<!-- _class: cover -->',
    '',
    '<div class="cover-title">版型目錄一覽</div>',
    `<div class="cover-subtitle">共 ${catalog.entries.length} 個版型，每頁示範一個，內容全部虛構</div>`,
    '<hr>',
    '<div class="cover-meta">由 npm run showcase 從 catalog/ 產生，不要直接修改這個檔案</div>',
  ].join('\n');

  const pages = [intro];
  for (const e of catalog.entries) {
    // 純文字註解，標出這頁是哪個版型；不用半形冒號，避免被 Marp 當成指令
    pages.push(`<!-- 版型 ${e.id}（${e.name_zh}） -->\n\n${e.example.replace(/\s+$/, '')}`);
  }
  return `${FRONTMATTER}\n\n${pages.join('\n\n---\n\n')}\n`;
}

function main(argv) {
  const check = argv.includes('--check');
  const catalog = loadCatalog();
  if (catalog.problems.length) {
    for (const p of catalog.problems) console.error(`${p.file}  ${p.message}`);
    console.error('目錄有問題，先執行 npm run catalog 看詳細錯誤');
    return 1;
  }
  const next = buildShowcase(catalog);

  if (check) {
    const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf-8').replace(/\r\n/g, '\n') : null;
    if (current === next) {
      console.log('examples/showcase.md 是最新的');
      return 0;
    }
    console.error(
      current === null
        ? 'examples/showcase.md 不存在，請執行 npm run showcase'
        : 'examples/showcase.md 跟 catalog/ 不一致，請執行 npm run showcase 重新產生'
    );
    return 1;
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, next, 'utf-8');
  console.log(`已產生 examples/showcase.md（${catalog.entries.length + 1} 頁）`);
  return 0;
}

module.exports = { buildShowcase, main, OUTPUT };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
