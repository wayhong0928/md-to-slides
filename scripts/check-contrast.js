'use strict';

// WCAG 對比檢查：讀每個主題的 token，照 themes/TOKENS.md 的「對比配對表」逐對計算。
//
//   node scripts/check-contrast.js              檢查 themes/src/ 的全部主題
//   node scripts/check-contrast.js <dir>        檢查 <dir> 裡的主題 token 檔（測試用，例如 tests/fixtures/contrast-bad/）
//   --tokens <file>                             改用另一份 TOKENS.md（預設是 themes/TOKENS.md）
//
// 有未達門檻的配對就 exit 1。classic 的例外（TOKENS.md「classic 例外」表）照樣印出數值並標「例外」，
// 不讓 exit code 失敗；例外表的數值和現算不一致、或列了但其實已達標，也算失敗，避免清單過期。

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCEPTION_THEME = 'classic';

function parseArgs(argv) {
  const args = { dir: path.join(ROOT, 'themes', 'src'), tokens: path.join(ROOT, 'themes', 'TOKENS.md') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--tokens' && argv[i + 1]) args.tokens = path.resolve(argv[++i]);
    else if (!argv[i].startsWith('--')) args.dir = path.resolve(argv[i]);
  }
  return args;
}

function parseHex(value) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value).trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

// 取出 TOKENS.md 的某一段（## 標題開頭到下一個 ## 之前）裡的表格列，回傳每列的儲存格。
function tableRows(markdown, headingPattern) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((l) => /^##\s/.test(l) && headingPattern.test(l));
  if (start < 0) return [];
  const rows = [];
  for (let i = start + 1; i < lines.length && !/^##\s/.test(lines[i]); i++) {
    if (!lines[i].startsWith('|')) continue;
    const cells = lines[i].split('|').slice(1, -1).map((c) => c.trim());
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue; // 分隔列
    rows.push(cells);
  }
  return rows.slice(1); // 去掉表頭
}

const tokenName = (cell) => {
  const m = /`(--theme-[a-z0-9-]+)`/.exec(cell);
  return m ? m[1] : null;
};

function loadPairs(tokensFile) {
  const md = fs.readFileSync(tokensFile, 'utf-8');
  const pairs = tableRows(md, /對比配對表/)
    .map((c) => ({ fg: tokenName(c[0]), bg: tokenName(c[1]), min: Number(c[2]), note: c[3] || '' }))
    .filter((p) => p.fg && p.bg && Number.isFinite(p.min));
  const exceptions = tableRows(md, /classic 例外/)
    .map((c) => ({ fg: tokenName(c[0]), bg: tokenName(c[1]), value: Number(c[2]), reason: c[3] || '' }))
    .filter((e) => e.fg && e.bg && Number.isFinite(e.value));
  return { pairs, exceptions };
}

// 讀主題 token 檔裡 `--theme-xxx: value;` 的宣告（只認 section 區塊裡的頂層宣告）。
function loadTokens(file) {
  const css = fs.readFileSync(file, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = {};
  for (const m of css.matchAll(/(--theme-[a-z0-9-]+)\s*:\s*([^;]+);/g)) tokens[m[1]] = m[2].trim();
  return tokens;
}

// 把 `var(--theme-xxx)` 換成同一主題裡那個 token 的值，可以連續引用（SDD-v2.6 D3）。
// 回傳 { values, errors }：找不到的 token 和循環引用都記進 errors，對應的值是 null。
function resolveVars(tokens) {
  const values = {};
  const errors = new Set();
  const visit = (name, chain) => {
    if (name in values) return values[name];
    if (chain.includes(name)) {
      errors.add(`循環引用：${[...chain.slice(chain.indexOf(name)), name].join(' → ')}`);
      return null;
    }
    if (!(name in tokens)) {
      errors.add(`${chain[chain.length - 1]} 引用的 ${name} 沒有宣告`);
      return null;
    }
    const m = /^var\(\s*(--theme-[a-z0-9-]+)\s*\)$/.exec(tokens[name]);
    const value = m ? visit(m[1], [...chain, name]) : tokens[name];
    values[name] = value;
    return value;
  };
  for (const name of Object.keys(tokens)) visit(name, []);
  return { values, errors: [...errors] };
}

function listThemeFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.css') && !f.startsWith('_'))
    .sort()
    .map((f) => ({ name: path.basename(f, '.css'), file: path.join(dir, f) }));
}

function main(argv) {
  const args = parseArgs(argv);
  if (!fs.existsSync(args.dir)) {
    console.error(`找不到 ${args.dir}`);
    return 1;
  }
  const { pairs, exceptions } = loadPairs(args.tokens);
  if (pairs.length === 0) {
    console.error(`${args.tokens} 沒有讀到對比配對表`);
    return 1;
  }
  const themes = listThemeFiles(args.dir);
  if (themes.length === 0) {
    console.error(`${args.dir} 裡沒有主題 token 檔`);
    return 1;
  }

  let failures = 0;
  let excepted = 0;
  const unusedExceptions = new Set(exceptions.map((e) => `${e.fg}|${e.bg}`));

  for (const theme of themes) {
    const { values: tokens, errors } = resolveVars(loadTokens(theme.file));
    console.log(`\n== ${theme.name}（${pairs.length} 對）==`);
    for (const message of errors) {
      failures++;
      console.log(`  ✗ ${message}`);
    }
    let ok = 0;
    for (const pair of pairs) {
      const label = `${pair.fg.replace('--theme-', '')} / ${pair.bg.replace('--theme-', '')}`;
      const fg = parseHex(tokens[pair.fg]);
      const bg = parseHex(tokens[pair.bg]);
      if (!fg || !bg) {
        failures++;
        console.log(`  ✗ ${label.padEnd(34)} 無法讀成十六進位色碼（${pair.fg}=${tokens[pair.fg]}, ${pair.bg}=${tokens[pair.bg]}）`);
        continue;
      }
      const ratio = contrast(fg, bg);
      const shown = ratio.toFixed(2);
      if (ratio >= pair.min) {
        ok++;
        console.log(`  ✓ ${label.padEnd(34)} ${shown.padStart(6)}  ≥ ${pair.min}`);
        continue;
      }
      const exception = theme.name === EXCEPTION_THEME && exceptions.find((e) => e.fg === pair.fg && e.bg === pair.bg);
      if (exception) {
        unusedExceptions.delete(`${exception.fg}|${exception.bg}`);
        if (Math.abs(ratio - exception.value) > 0.005) {
          failures++;
          console.log(`  ✗ ${label.padEnd(34)} ${shown.padStart(6)}  < ${pair.min}  例外表寫 ${exception.value}，和現算不一致`);
        } else {
          excepted++;
          console.log(`  ○ ${label.padEnd(34)} ${shown.padStart(6)}  < ${pair.min}  例外`);
        }
      } else {
        failures++;
        console.log(`  ✗ ${label.padEnd(34)} ${shown.padStart(6)}  < ${pair.min}  ${pair.note}`);
      }
    }
    console.log(`  → ${ok}/${pairs.length} 達標`);
  }

  // 例外表列了、但 classic 這次沒有未達標（或沒有 classic）的配對。
  if (themes.some((t) => t.name === EXCEPTION_THEME)) {
    for (const key of unusedExceptions) {
      failures++;
      console.log(`\n✗ 例外表列了 ${key.replace(/\|/g, ' / ')}，但現在已達標或不在配對表裡，請從例外表刪掉`);
    }
  }

  console.log(`\n${themes.length} 個主題，${failures} 個失敗，${excepted} 個例外`);
  return failures === 0 ? 0 : 1;
}

module.exports = { contrast, parseHex, loadPairs, loadTokens, resolveVars, main };

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
