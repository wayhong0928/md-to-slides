'use strict';

// Merge themes/src/_base.css with each themes/src/<name>.css (tokens) into a
// self-contained themes/<name>.css that can be used as-is by Marp CLI and VS Code.
//
//   node scripts/build-themes.js            write themes/<name>.css
//   node scripts/build-themes.js --check    exit 1 if a generated file is missing or stale
//   --root <dir>                            use <dir>/themes instead of the repo's themes/

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { check: false, root: path.resolve(__dirname, '..') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--check') args.check = true;
    else if (argv[i] === '--root' && argv[i + 1]) args.root = path.resolve(argv[++i]);
  }
  return args;
}

const normalize = (text) => text.replace(/\r\n/g, '\n');

function listThemeNames(srcDir) {
  return fs
    .readdirSync(srcDir)
    .filter((file) => file.endsWith('.css') && !file.startsWith('_'))
    .map((file) => path.basename(file, '.css'))
    .sort();
}

function buildTheme(name, srcDir) {
  const tokens = normalize(fs.readFileSync(path.join(srcDir, `${name}.css`), 'utf-8')).trim();
  const base = normalize(fs.readFileSync(path.join(srcDir, '_base.css'), 'utf-8')).trim();
  return [
    `/* @theme ${name} */`,
    '/* 這個檔案由 scripts/build-themes.js 產生，請改 themes/src/ 再執行 npm run themes。 */',
    "@import 'default';",
    '',
    tokens,
    '',
    base,
    '',
  ].join('\n');
}

// themes/TOKENS.md 列出的全部 token 名稱：從開頭到「固定不換」那段之前，每個表格列第一欄的 `--theme-xxx`。
function listRequiredTokens(themesDir) {
  const file = path.join(themesDir, 'TOKENS.md');
  if (!fs.existsSync(file)) return null;
  const text = normalize(fs.readFileSync(file, 'utf-8'));
  const end = text.indexOf('## 固定不換');
  const head = end < 0 ? text : text.slice(0, end);
  const names = [];
  for (const m of head.matchAll(/^\|\s*`(--theme-[a-z0-9-]+)`\s*\|/gm)) names.push(m[1]);
  return [...new Set(names)];
}

function declaredTokens(css) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return new Set([...withoutComments.matchAll(/(--theme-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
}

function main(argv) {
  const { check, root } = parseArgs(argv);
  const themesDir = path.join(root, 'themes');
  const srcDir = path.join(themesDir, 'src');

  if (!fs.existsSync(path.join(srcDir, '_base.css'))) {
    console.error(`找不到 ${path.join(srcDir, '_base.css')}`);
    return 1;
  }

  const names = listThemeNames(srcDir);
  const problems = [];

  for (const name of names) {
    const target = path.join(themesDir, `${name}.css`);
    const expected = buildTheme(name, srcDir);

    if (check) {
      if (!fs.existsSync(target)) {
        problems.push(`${name}.css 不存在`);
      } else if (normalize(fs.readFileSync(target, 'utf-8')) !== expected) {
        problems.push(`${name}.css 已過期（themes/src/ 改過但沒重跑 npm run themes）`);
      }
    } else {
      fs.writeFileSync(target, expected, 'utf-8');
      console.log(`✓ themes/${name}.css`);
    }
  }

  if (check) {
    const required = listRequiredTokens(themesDir);
    if (!required || required.length === 0) {
      problems.push('themes/TOKENS.md 不存在或沒有列出 token，無法檢查 token 是否齊全');
    } else {
      for (const name of names) {
        const declared = declaredTokens(fs.readFileSync(path.join(srcDir, `${name}.css`), 'utf-8'));
        const missing = required.filter((token) => !declared.has(token));
        if (missing.length > 0) {
          problems.push(`${name}.css 缺少 ${missing.length} 個 token：${missing.join(', ')}`);
        }
      }
    }
    if (problems.length > 0) {
      problems.forEach((p) => console.error(`✗ ${p}`));
      return 1;
    }
    console.log(`✓ ${names.length} 個主題的產物都是最新的，token 都齊（${required.length} 個）`);
  }
  return 0;
}

module.exports = { buildTheme, listThemeNames, listRequiredTokens, main };

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
