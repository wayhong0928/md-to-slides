'use strict';

const fs = require('fs');
const path = require('path');
const { runMarp, themeSetArgs } = require('../../steps/render-html');

const THEMES_DIR = path.resolve(__dirname, '..', '..', '..', 'themes');
const TOLERANCE_PX = 2;

function candidateBrowsers() {
  const env = process.env;
  const list = [];
  if (process.platform === 'win32') {
    for (const base of [env.PROGRAMFILES, env['PROGRAMFILES(X86)'], env.LOCALAPPDATA]) {
      if (!base) continue;
      list.push(path.join(base, 'Google', 'Chrome', 'Application', 'chrome.exe'));
      list.push(path.join(base, 'Microsoft', 'Edge', 'Application', 'msedge.exe'));
    }
  } else if (process.platform === 'darwin') {
    list.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
    list.push('/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge');
  } else {
    for (const dir of (env.PATH || '').split(path.delimiter)) {
      for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge']) {
        list.push(path.join(dir, name));
      }
    }
  }
  return list;
}

// 依序找：CHROME_PATH → 系統上的 Chrome 或 Edge。CHROME_PATH 有設但不存在時不退而求其次，直接回報。
function findBrowser() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv) {
    return fs.existsSync(fromEnv)
      ? { path: fromEnv }
      : { error: `CHROME_PATH 指到的瀏覽器不存在：${fromEnv}` };
  }
  const found = candidateBrowsers().find((p) => fs.existsSync(p));
  return found ? { path: found } : { error: '找不到 Chrome 或 Edge（可用 CHROME_PATH 指定）' };
}

function loadPuppeteer() {
  try {
    return require('puppeteer-core');
  } catch (_) {
    return null;
  }
}

function measureInPage() {
  // 有 ![bg] 背景圖的頁，Marp 會多產生 background 和 pseudo 兩個 section，不是投影片本身（content 才是）。
  const slides = document.querySelectorAll(
    'section:not([data-marpit-advanced-background="background"]):not([data-marpit-advanced-background="pseudo"])'
  );
  return [...slides].map((section) => {
    const box = section.getBoundingClientRect();
    const scale = section.offsetWidth ? box.width / section.offsetWidth : 1;
    let worst = null;
    for (const el of section.querySelectorAll('*')) {
      if (['STYLE', 'SCRIPT', 'BR'].includes(el.tagName)) continue;
      // 內嵌 <svg> 裡的圖形被 svg 自己的範圍裁掉，不算超框；<svg> 元素本身還是會量。
      const ownerSvg = el.closest('svg');
      if (ownerSvg && ownerSvg !== el && section.contains(ownerSvg)) continue;
      const b = el.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) continue;
      const over = Math.max(b.right - box.right, b.bottom - box.bottom, box.left - b.left, box.top - b.top) / scale;
      if (!worst || over > worst.over) {
        worst = { over, tag: el.tagName.toLowerCase(), cls: el.getAttribute('class') || '' };
      }
    }
    return worst;
  });
}

// R1 超框：用 Marp 產生 HTML，在瀏覽器裡量每一頁，內容元素的邊界超出投影片範圍就算。
async function checkOverflow(doc, ctx) {
  const skip = (reason) => ({ findings: [], skipped: { rule: 'R1', reason } });

  const browser = findBrowser();
  if (browser.error) return skip(browser.error);

  const puppeteer = loadPuppeteer();
  if (!puppeteer) return skip('沒有安裝 puppeteer-core（請先 npm install）');

  const inputDir = path.dirname(path.resolve(ctx.file));
  const htmlFile = path.join(inputDir, `.md-to-slides-check-${process.pid}.html`);
  const themeFiles = fs
    .readdirSync(THEMES_DIR)
    .filter((f) => f.endsWith('.css'))
    .map((f) => path.join(THEMES_DIR, f));

  let instance = null;
  try {
    const result = runMarp(
      [path.resolve(ctx.file), '--output', htmlFile, ...themeSetArgs([...themeFiles, ...(ctx.themeSets || []).map((p) => path.resolve(p))]), '--html', '--allow-local-files', '--no-stdin'],
      { stdio: 'pipe', encoding: 'utf-8' }
    );
    if (result.error || result.status !== 0) {
      return skip(`Marp 產生 HTML 失敗：${(result.error && result.error.message) || (result.stderr || '').trim().split('\n').pop()}`);
    }

    // PUPPETEER_ARGS（README 的 Docker／CI 說明用的同一個變數）原樣帶進瀏覽器。
    const extraArgs = (process.env.PUPPETEER_ARGS || '').split(/\s+/).filter(Boolean);
    instance = await puppeteer.launch({ executablePath: browser.path, headless: true, args: extraArgs });
    const page = await instance.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`file:///${htmlFile.replace(/\\/g, '/')}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready); // 字型載完才量，避免換字型造成的行高差
    const sections = await page.evaluate(measureInPage);

    const findings = [];
    sections.forEach((worst, index) => {
      if (!worst || worst.over <= TOLERANCE_PX) return;
      const slide = doc.slides[index];
      findings.push({
        rule: 'R1',
        severity: 'error',
        page: index + 1,
        // 頁數對不上時（例如 Marp 的分頁和文字解析不同），行號不可信，寧可不給。
        line: slide && sections.length === doc.slides.length ? slide.firstContentLine : null,
        message: `內容超出投影片 ${Math.round(worst.over)}px（<${worst.tag}${worst.cls ? ` class="${worst.cls}"` : ''}>）`,
      });
    });
    return { findings, skipped: null };
  } catch (err) {
    return skip(`瀏覽器執行失敗：${err.message}`);
  } finally {
    if (instance) await instance.close().catch(() => {});
    fs.rmSync(htmlFile, { force: true });
  }
}

module.exports = { checkOverflow, findBrowser };
