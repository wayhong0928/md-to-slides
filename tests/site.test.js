'use strict';

// 樣式畫廊（SDD-v2.5）：渲染模組、npm run site 的產出、三頁在瀏覽器裡的行為。
// 瀏覽器測試把網站掛在 /md-to-slides/ 底下（跟 GitHub Pages 一樣），找不到瀏覽器時失敗而不是略過。

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadCatalog } = require('../src/catalog');
const { loadScenarios, splitPages } = require('../src/scenarios');
const { listThemes } = require('../src/starter');
const { createRenderer } = require('../src/site/render');
const { findBrowser } = require('../src/check/rules/r1-overflow');
const { listRequiredTokens } = require('../scripts/build-themes');
const { buildSite } = require('../scripts/build-site');
const { mkTmp } = require('./_helpers');

const ROOT = path.resolve(__dirname, '..');
const BASE = '/md-to-slides/';
const catalog = loadCatalog();
const { scenarios } = loadScenarios();
const themes = listThemes();
const out = mkTmp('md-to-slides-site-');
const baseline = mkTmp('md-to-slides-site-starter-');
const built = buildSite({ out });

test.after(() => {
  fs.rmSync(out, { recursive: true, force: true });
  fs.rmSync(baseline, { recursive: true, force: true });
});

const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');
const listFiles = (dir) => fs.readdirSync(path.join(out, dir)).sort();

test('render：8 個主題都渲染得出來，投影片數等於頁數，CSS 跟內容無關', () => {
  const render = createRenderer();
  assert.equal(themes.length, 8);
  for (const theme of themes) {
    const css = new Set();
    for (const s of scenarios) {
      const r = render(s.example, theme);
      assert.equal(r.slides, splitPages(s.example).length, `${s.id}/${theme}`);
      assert.match(r.html, new RegExp(`data-theme="${theme}"`));
      css.add(r.css);
    }
    assert.equal(css.size, 1, `${theme} 的 CSS 隨內容改變`);
  }
  assert.throws(() => render('# x', 'no-such-theme'), /找不到主題/);
});

test('npm run site：檔案數，starters/ 只有 zip', () => {
  assert.deepEqual(built.problems, []);
  assert.equal(listFiles('.').filter((f) => f.endsWith('.html')).length, 3);
  assert.equal(listFiles('data/css').length, themes.length);
  assert.equal(scenarios.reduce((n, s) => n + listFiles(`data/scenarios/${s.id}`).length, 0), scenarios.length * themes.length);
  assert.equal(listFiles('data/layouts').length, themes.length);
  assert.equal(listFiles('data/themes').length, themes.length);
  const starters = listFiles('starters');
  assert.equal(starters.length, scenarios.length * themes.length);
  for (const name of starters) {
    assert.match(name, /\.zip$/);
    assert.equal(fs.statSync(path.join(out, 'starters', name)).isFile(), true, `${name} 不是檔案`);
  }
  const site = JSON.parse(fs.readFileSync(path.join(out, 'data', 'site.json'), 'utf-8'));
  assert.equal(site.layouts.length, catalog.entries.length);
  assert.equal(site.tokens.length, listRequiredTokens(path.join(ROOT, 'themes')).length);
});

test('AC-2：40 個 zip 跟 npm run starter -- --theme <主題> --zip 的產出逐位元相同', () => {
  for (const theme of themes) {
    const dir = path.join(baseline, theme);
    const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'build-starter.js'), '--theme', theme, '--zip', '--out', dir], {
      cwd: ROOT,
      encoding: 'utf-8',
    });
    assert.equal(r.status, 0, r.stderr);
    for (const s of scenarios) {
      const name = `${s.id}-${theme}.zip`;
      assert.equal(sha256(fs.readFileSync(path.join(out, 'starters', name))), sha256(fs.readFileSync(path.join(dir, name))), name);
    }
  }
});

test('主題設定片段：jsDelivr 網址固定在 commit，開啟 html', () => {
  const site = JSON.parse(fs.readFileSync(path.join(out, 'data', 'site.json'), 'utf-8'));
  assert.match(built.commit, /^[0-9a-f]{40}$/);
  for (const t of site.themes) {
    const snippet = JSON.parse(t.snippet);
    assert.deepEqual(snippet['markdown.marp.themes'], [`https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@${built.commit}/themes/${t.id}.css`]);
    assert.equal(snippet['markdown.marp.html'], 'all');
    assert.equal(Object.keys(t.values).length >= listRequiredTokens(path.join(ROOT, 'themes')).length, true, `${t.id} 的 token 值不齊`);
  }
});

// ---- 瀏覽器 ----

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.zip': 'application/zip',
};

// 只回應 /md-to-slides/ 底下的請求，其他一律 404 並記下來：頁面用了絕對路徑就會被抓到
function serve(root, misses) {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) || 'index.html' : null;
    const file = rel === null ? null : path.join(root, ...rel.split('/'));
    if (!file || !file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      if (pathname !== '/favicon.ico') misses.push(pathname);
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// 從元素往上找第一個不透明的背景色，算 WCAG 對比
function contrastsInPage(selectors) {
  const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const background = (el) => {
    for (let node = el; node; node = node.parentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c.length >= 3 && (c.length < 4 || c[3] > 0)) return c;
    }
    return [255, 255, 255];
  };
  const results = [];
  for (const selector of selectors) {
    for (const el of document.querySelectorAll(selector)) {
      if (el.closest('.marpit') || !el.textContent.trim() || el.offsetParent === null) continue;
      const a = lum(parse(getComputedStyle(el).color));
      const b = lum(background(el));
      results.push({ selector, text: el.textContent.trim().slice(0, 20), ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) });
    }
  }
  return results;
}

test('瀏覽器：三頁的切換、下載、複製、375px 寬與對比（AC-1）', async (t) => {
  const browserInfo = findBrowser();
  assert.ok(browserInfo.path, `找不到瀏覽器，沒辦法跑樣式畫廊的測試：${browserInfo.error}`);
  const puppeteer = require('puppeteer-core');
  const args = (process.env.PUPPETEER_ARGS || '').split(/\s+/).filter(Boolean);
  const browser = await puppeteer.launch({ executablePath: browserInfo.path, headless: true, args });
  const misses = [];
  const server = await serve(out, misses);
  const origin = `http://127.0.0.1:${server.address().port}`;
  const url = (page, query = '') => `${origin}${BASE}${page}${query}`;
  await browser.defaultBrowserContext().overridePermissions(origin, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);

  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));
  const waitRendered = (value) => page.waitForFunction((v) => document.body.dataset.rendered === v, { timeout: 15000 }, value);
  // Windows 的剪貼簿會把換行轉成 CRLF，比對前轉回 LF
  const readClipboard = async () => (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n');
  const themeCss = () => page.$eval('#theme-css', (link) => ({ href: link.getAttribute('href'), loaded: Boolean(link.sheet) }));

  try {
    await t.test('場合範本頁：切場合與主題，預覽頁數、樣式與下載的 zip 都對', async () => {
      const first = scenarios[0];
      await page.goto(url('index.html'), { waitUntil: 'load' });
      await waitRendered(`${first.id}/${first.themes[0]}`);
      const combos = [
        ...themes.map((theme) => ({ scenario: first, theme })),
        ...scenarios.slice(1).map((scenario) => ({ scenario, theme: themes[themes.length - 1] })),
      ];
      for (const { scenario, theme } of combos) {
        if ((await page.$eval('#scenario', (s) => s.value)) !== scenario.id) await page.select('#scenario', scenario.id);
        if ((await page.$eval('#theme', (s) => s.value)) !== theme) await page.select('#theme', theme);
        const key = `${scenario.id}/${theme}`;
        await waitRendered(key);
        await page.waitForFunction(() => Boolean(document.querySelector('#theme-css').sheet));
        const css = await themeCss();
        assert.equal(css.href, `data/css/${theme}.css`, key);
        const slides = await page.$$eval('#preview .marpit > svg', (svgs) => svgs.length);
        assert.equal(slides, splitPages(scenario.example).length, key);
        assert.equal(new URL(page.url()).search, `?scenario=${scenario.id}&theme=${theme}`);

        const link = await page.$eval('#download', (a) => ({ href: a.getAttribute('href'), download: a.getAttribute('download') }));
        const zip = `${scenario.id}-${theme}.zip`;
        assert.deepEqual(link, { href: `starters/${zip}`, download: zip });
        const fetched = await page.evaluate(async (href) => {
          const data = await (await fetch(href)).arrayBuffer();
          const digest = await crypto.subtle.digest('SHA-256', data);
          return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
        }, link.href);
        assert.equal(fetched, sha256(fs.readFileSync(path.join(out, 'starters', zip))), zip);
      }
      // 網址帶查詢字串可以直接分享
      const last = scenarios[scenarios.length - 1];
      await page.goto(url('index.html', `?scenario=${last.id}&theme=mono`), { waitUntil: 'load' });
      await waitRendered(`${last.id}/mono`);
      const recommended = await page.$$eval('#theme option', (opts) => opts.filter((o) => o.textContent.includes('（推薦）')).map((o) => o.value));
      assert.deepEqual(recommended.sort(), [...last.themes].sort());
    });

    await t.test('版型頁：35 張卡片，複製語法等於骨架，切主題後每張都有預覽', async () => {
      await page.goto(url('layouts.html', '?theme=classic'), { waitUntil: 'load' });
      await waitRendered('classic');
      assert.equal(await page.$$eval('.g-card', (cards) => cards.length), catalog.entries.length);
      const packs = [...new Set(catalog.entries.map((e) => e.pack))];
      assert.deepEqual(await page.$$eval('section[data-pack]', (s) => s.map((x) => x.dataset.pack)), packs);
      for (const entry of catalog.entries) {
        await page.click(`.g-card[data-layout="${entry.id}"] button`);
        await page.waitForFunction((id) => document.querySelector(`.g-card[data-layout="${id}"] .g-status`).textContent !== '', {}, entry.id);
        assert.equal(await page.$eval(`.g-card[data-layout="${entry.id}"] .g-status`, (s) => s.textContent), '已複製', entry.id);
        assert.equal(await readClipboard(), entry.skeleton.replace(/\r\n/g, '\n'), entry.id);
      }
      await page.select('#theme', 'midnight');
      await waitRendered('midnight');
      assert.equal((await themeCss()).href, 'data/css/midnight.css');
      const empty = await page.$$eval('.g-card', (cards) => cards.filter((c) => !c.querySelector('.g-preview .marpit > svg')).map((c) => c.dataset.layout));
      assert.deepEqual(empty, []);
    });

    await t.test('主題頁：token 表列數、設定片段固定 commit、複製設定、預覽 6 頁', async () => {
      const required = listRequiredTokens(path.join(ROOT, 'themes'));
      assert.equal(required.length, 53);
      for (const theme of themes) {
        await page.goto(url('themes.html', `?theme=${theme}`), { waitUntil: 'load' });
        await waitRendered(theme);
        const names = await page.$$eval('#tokens tbody tr td:first-child', (cells) => cells.map((c) => c.textContent));
        assert.deepEqual(names, required, theme);
        const values = await page.$$eval('#tokens tbody tr td:last-child', (cells) => cells.map((c) => c.textContent.trim()));
        assert.equal(values.filter((v) => !v).length, 0, `${theme} 有 token 沒有值`);
        const snippet = await page.$eval('#snippet', (pre) => pre.textContent);
        assert.ok(snippet.includes(`@${built.commit}/themes/${theme}.css`), theme);
        assert.equal(await page.$$eval('#preview .marpit > svg', (svgs) => svgs.length), 6, theme);
      }
      await page.click('#copy-snippet');
      await page.waitForFunction(() => document.querySelector('#snippet-status').textContent === '已複製');
      assert.equal(await readClipboard(), await page.$eval('#snippet', (pre) => pre.textContent));
    });

    const pages = [
      ['index.html', `${scenarios[0].id}/${scenarios[0].themes[0]}`],
      ['layouts.html', themes[0]],
      ['themes.html', themes[0]],
    ];

    await t.test('375px 寬時三頁都沒有橫向捲動', async () => {
      await page.setViewport({ width: 375, height: 800 });
      for (const [file, rendered] of pages) {
        await page.goto(url(file), { waitUntil: 'load' });
        await waitRendered(rendered);
        const { scroll, inner } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: window.innerWidth }));
        assert.ok(scroll <= inner, `${file} 的 scrollWidth ${scroll} 大於視窗 ${inner}`);
      }
      await page.setViewport({ width: 1280, height: 800 });
    });

    await t.test('淺色、深色模式的文字對比都在 4.5 以上', async () => {
      const selectors = ['h1', 'h2', 'h3', 'p', 'label', 'nav a', '.brand', '.g-button', 'button', 'th', 'td', 'summary', 'footer', 'footer a'];
      for (const scheme of ['light', 'dark']) {
        await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
        for (const [file, rendered] of pages) {
          await page.goto(url(file), { waitUntil: 'load' });
          await waitRendered(rendered);
          const results = await page.evaluate(contrastsInPage, selectors);
          assert.ok(results.length > 0, file);
          const low = results.filter((r) => r.ratio < 4.5).map((r) => `${r.selector}「${r.text}」${r.ratio.toFixed(2)}`);
          assert.deepEqual(low, [], `${scheme} ${file}`);
        }
      }
      await page.emulateMediaFeatures([]);
    });

    await t.test('沒有讀不到的檔案，也沒有頁面錯誤', () => {
      assert.deepEqual(misses, []);
      assert.deepEqual(pageErrors, []);
    });
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
});
