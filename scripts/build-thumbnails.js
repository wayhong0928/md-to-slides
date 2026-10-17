'use strict';

// 縮圖總表：把 examples/showcase.md 的 theme: 換成每個內建主題，用 Marp 產生 HTML，
// 用 puppeteer-core 開 Chrome 逐頁截圖，再排成格狀 PNG。
//
//   node scripts/build-thumbnails.js               輸出到 output/thumbnails/
//   node scripts/build-thumbnails.js --out <dir>   改輸出資料夾
//
// 輸出：
//   output/thumbnails/<id>.png   該主題 showcase 的每一頁（6 欄）
//   output/thumbnails/all.png    每個主題各取前 6 頁的對照總表
//
// 要有 Chrome 或 Edge（沿用 npm run check 的找法，可用 CHROME_PATH 指定）。找不到就印出原因並 exit 1。
// 這個腳本要瀏覽器、跑得慢，所以不放進 npm test。

const fs = require('fs');
const os = require('os');
const path = require('path');
const { runMarp, themeSetArgs } = require('../src/steps/render-html');
const { findBrowser } = require('../src/check/rules/r1-overflow');
const { listThemeNames } = require('./build-themes');

const ROOT = path.resolve(__dirname, '..');
const THUMB_WIDTH = 320; // 每張縮圖的寬（拼圖時）
const SHOT_WIDTH = 640; // 截圖時的投影片寬（16:9，高 360）
const COLUMNS = 6;
const ALL_PAGES = 6;

function parseArgs(argv) {
  const args = { out: path.join(ROOT, 'output', 'thumbnails') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out' && argv[i + 1]) args.out = path.resolve(argv[++i]);
  }
  return args;
}

function loadPuppeteer() {
  try {
    return require('puppeteer-core');
  } catch (_) {
    return null;
  }
}

function themeOrder(names) {
  // classic 排第一，其餘照字母順序
  return ['classic', ...names.filter((n) => n !== 'classic')].filter((n) => names.includes(n));
}

function renderThemeHtml(id, showcase, workDir) {
  const md = path.join(workDir, `showcase-${id}.md`);
  const html = path.join(workDir, `showcase-${id}.html`);
  fs.writeFileSync(md, showcase.replace(/^theme:\s*\S+/m, `theme: ${id}`), 'utf-8');
  const themeFiles = fs
    .readdirSync(path.join(ROOT, 'themes'))
    .filter((f) => f.endsWith('.css'))
    .map((f) => path.join(ROOT, 'themes', f));
  const result = runMarp(
    [md, '--output', html, '--template', 'bare', ...themeSetArgs(themeFiles), '--html', '--allow-local-files', '--no-stdin'],
    { stdio: 'pipe', encoding: 'utf-8' }
  );
  if (result.error || result.status !== 0) {
    throw new Error(`Marp 產生 ${id} 的 HTML 失敗：${(result.error && result.error.message) || (result.stderr || '').trim().split('\n').pop()}`);
  }
  return html;
}

async function shootSlides(browser, htmlFile) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: SHOT_WIDTH, height: Math.round((SHOT_WIDTH * 9) / 16), deviceScaleFactor: 1 });
    await page.goto(`file:///${htmlFile.replace(/\\/g, '/')}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const slides = await page.$$('svg[data-marpit-svg]');
    const shots = [];
    for (const slide of slides) {
      shots.push((await slide.screenshot({ type: 'png' })).toString('base64'));
    }
    return shots;
  } finally {
    await page.close();
  }
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function thumbCell(b64, label) {
  return `<figure><img src="data:image/png;base64,${b64}" width="${THUMB_WIDTH}"><figcaption>${esc(label)}</figcaption></figure>`;
}

const PAGE_CSS = `
body { margin: 0; padding: 16px; background: #e5e7eb; font-family: 'Microsoft JhengHei', 'PingFang TC', 'Noto Sans CJK TC', sans-serif; }
h1 { font-size: 22px; margin: 0 0 12px; color: #111827; }
.grid { display: grid; gap: 10px; }
figure { margin: 0; }
figure img { display: block; border: 1px solid #9ca3af; }
figcaption { font-size: 11px; color: #4b5563; margin-top: 2px; }
.row { display: grid; grid-template-columns: 96px repeat(${ALL_PAGES}, ${THUMB_WIDTH}px); gap: 10px; align-items: start; margin-bottom: 10px; }
.row .id { font-size: 18px; font-weight: 700; color: #111827; padding-top: 8px; }
`;

async function composeSheet(browser, html, width, outFile) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width, height: 800, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.screenshot({ path: outFile, type: 'png', fullPage: true });
  } finally {
    await page.close();
  }
}

async function main(argv) {
  const { out } = parseArgs(argv);

  const found = findBrowser();
  if (found.error) {
    console.error(`無法產生縮圖：${found.error}`);
    return 1;
  }
  const puppeteer = loadPuppeteer();
  if (!puppeteer) {
    console.error('無法產生縮圖：沒有安裝 puppeteer-core（請先 npm install）');
    return 1;
  }

  const showcasePath = path.join(ROOT, 'examples', 'showcase.md');
  const showcase = fs.readFileSync(showcasePath, 'utf-8');
  const ids = themeOrder(listThemeNames(path.join(ROOT, 'themes', 'src')));
  fs.mkdirSync(out, { recursive: true });
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'md-to-slides-thumbs-'));

  const extraArgs = (process.env.PUPPETEER_ARGS || '').split(/\s+/).filter(Boolean);
  let browser = null;
  try {
    browser = await puppeteer.launch({ executablePath: found.path, headless: true, args: extraArgs });
    const perTheme = {};
    for (const id of ids) {
      const htmlFile = renderThemeHtml(id, showcase, workDir);
      perTheme[id] = await shootSlides(browser, htmlFile);
      if (perTheme[id].length === 0) throw new Error(`${id} 沒有截到任何一頁`);

      const cells = perTheme[id].map((b64, i) => thumbCell(b64, `${id} p.${i + 1}`)).join('');
      const html = `<!doctype html><meta charset="utf-8"><style>${PAGE_CSS}.grid{grid-template-columns:repeat(${COLUMNS},${THUMB_WIDTH}px)}</style><h1>${esc(id)}（${perTheme[id].length} 頁）</h1><div class="grid">${cells}</div>`;
      const file = path.join(out, `${id}.png`);
      await composeSheet(browser, html, COLUMNS * THUMB_WIDTH + (COLUMNS - 1) * 10 + 32, file);
      console.log(`✓ ${path.relative(ROOT, file)}（${perTheme[id].length} 頁，${fs.statSync(file).size} bytes）`);
    }

    const rows = ids
      .map(
        (id) =>
          `<div class="row"><div class="id">${esc(id)}</div>${perTheme[id]
            .slice(0, ALL_PAGES)
            .map((b64, i) => thumbCell(b64, `p.${i + 1}`))
            .join('')}</div>`
      )
      .join('');
    const allHtml = `<!doctype html><meta charset="utf-8"><style>${PAGE_CSS}</style><h1>${ids.length} 個主題，每個取 showcase 前 ${ALL_PAGES} 頁</h1>${rows}`;
    const allFile = path.join(out, 'all.png');
    await composeSheet(browser, allHtml, 96 + ALL_PAGES * THUMB_WIDTH + ALL_PAGES * 10 + 32, allFile);
    console.log(`✓ ${path.relative(ROOT, allFile)}（${ids.length} 個主題各 ${ALL_PAGES} 頁，${fs.statSync(allFile).size} bytes）`);
    return 0;
  } catch (err) {
    console.error(`產生縮圖失敗：${err.message}`);
    return 1;
  } finally {
    if (browser) await browser.close().catch(() => {});
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

module.exports = { main };

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
