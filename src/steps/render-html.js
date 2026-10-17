'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function maybeBreakpoint(label) {
  const breakpoint = process.env.MARKDOWN_TOOL_BREAKPOINT;
  if (breakpoint === '1' || breakpoint === label) {
    debugger;
  }
}

// 直接用 node 執行套件裡的 marp-cli，不經過 shell：路徑含空白或中文也不會被拆開。
// 找不到本機套件時退回 npx。
function getMarpInvocation() {
  try {
    const pkgPath = require.resolve('@marp-team/marp-cli/package.json');
    const pkg = require(pkgPath);
    const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin && pkg.bin.marp;
    if (bin) {
      return { command: process.execPath, prefix: [path.join(path.dirname(pkgPath), bin)], shell: false };
    }
  } catch (_) {
    // fall through to npx
  }
  return { command: 'npx', prefix: ['marp'], shell: process.platform === 'win32' };
}

function runMarp(args, options = {}) {
  const { command, prefix, shell } = getMarpInvocation();
  return spawnSync(command, [...prefix, ...args], { stdio: 'inherit', shell, ...options });
}

function themeSetArgs(themeSets = []) {
  return themeSets.length > 0 ? ['--theme-set', ...themeSets] : [];
}

function copyDir(src, dest, options = {}) {
  const { ignoreTopLevelDirs = new Set() } = options;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (ignoreTopLevelDirs.has(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function isLocalReference(ref) {
  if (!ref) return false;
  if (/^[a-zA-Z]:[\\/]/.test(ref)) return true; // Windows 磁碟機路徑
  if (/^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|\/\/|#)/.test(ref)) return false; // 網址、data URI、片段
  if (/[{}]/.test(ref)) return false; // 樣板語法
  return true;
}

function fenceOf(line) {
  const match = line.match(/^ {0,3}([`~]{3,})/);
  return match ? { marker: match[1][0], length: match[1].length } : null;
}

function maskInlineCode(line) {
  return line.replace(/`[^`]*`/g, (m) => ' '.repeat(m.length));
}

// 把 Markdown 圖片語法和 HTML <img src> 指到的本機圖片複製到 <outputDir>/assets/images/，
// 並改寫路徑。遠端網址、data URI 不動；找不到的檔案原樣保留（交給 check 的 R3 提醒）。
// 已經在 <outputDir>/assets/diagrams/ 底下的 Mermaid 圖不複製，只把路徑改成相對於輸出資料夾。
function rewriteLocalImages(content, options) {
  const { baseDir, outputDir, logger = console } = options;
  const imagesDir = path.join(outputDir, 'assets', 'images');
  const diagramsDir = path.resolve(outputDir, 'assets', 'diagrams');
  const copied = new Map(); // 來源絕對路徑 -> 輸出檔名
  const usedNames = new Map(); // 輸出檔名 -> 來源絕對路徑

  function resolveLocal(raw) {
    const cleaned = raw.trim().replace(/^<|>$/g, '').replace(/[?#].*$/, '');
    if (!isLocalReference(cleaned)) return null;
    let decoded = cleaned;
    try {
      decoded = decodeURI(cleaned);
    } catch (_) {
      // keep as is
    }
    const abs = path.resolve(baseDir, decoded);
    try {
      return fs.statSync(abs).isFile() ? abs : null;
    } catch (_) {
      return null;
    }
  }

  function newPath(raw) {
    const abs = resolveLocal(raw);
    if (!abs) return null;

    const relToDiagrams = path.relative(diagramsDir, abs);
    if (relToDiagrams && !relToDiagrams.startsWith('..') && !path.isAbsolute(relToDiagrams)) {
      return `assets/diagrams/${relToDiagrams.split(path.sep).join('/')}`;
    }

    if (!copied.has(abs)) {
      const ext = path.extname(abs);
      const safeBase = path.basename(abs, ext).replace(/[\s()#?%"'<>\\/]/g, '_');
      let name = `${safeBase}${ext}`;
      if (usedNames.has(name) && usedNames.get(name) !== abs) {
        const hash = crypto.createHash('sha1').update(abs).digest('hex').slice(0, 8);
        name = `${safeBase}-${hash}${ext}`;
      }
      fs.mkdirSync(imagesDir, { recursive: true });
      fs.copyFileSync(abs, path.join(imagesDir, name));
      copied.set(abs, name);
      usedNames.set(name, abs);
    }
    return `assets/images/${copied.get(abs)}`;
  }

  const mdImage = /(!\[[^\]]*\]\(\s*)(<[^>]*>|[^)\s]+)/g;
  const htmlImg = /(<img\b[^>]*?\bsrc\s*=\s*)(["'])(.*?)\2/gi;

  const lines = content.split('\n');
  let inFrontmatter = lines[0] && lines[0].trim() === '---';
  let fence = null;

  const out = lines.map((line, index) => {
    if (inFrontmatter) {
      if (index > 0 && line.trim() === '---') inFrontmatter = false;
      return line;
    }
    const f = fenceOf(line);
    if (fence) {
      if (f && f.marker === fence.marker && f.length >= fence.length && /^\s*[`~]+\s*$/.test(line)) fence = null;
      return line;
    }
    if (f) {
      fence = f;
      return line;
    }

    // 行內程式碼不改寫：用空白遮住它們找出位置，再只替換沒被遮住的範圍。
    const masked = maskInlineCode(line);
    const edits = [];
    for (const m of masked.matchAll(mdImage)) {
      const start = m.index + m[1].length;
      edits.push({ start, end: start + m[2].length });
    }
    for (const m of masked.matchAll(htmlImg)) {
      const start = m.index + m[1].length + 1;
      edits.push({ start, end: start + m[3].length });
    }
    edits.sort((a, b) => b.start - a.start);
    let result = line;
    for (const edit of edits) {
      const replacement = newPath(line.slice(edit.start, edit.end));
      if (replacement) {
        result = result.slice(0, edit.start) + replacement + result.slice(edit.end);
      }
    }
    return result;
  });

  if (copied.size > 0) logger.log(`   ✓ 已複製 ${copied.size} 張本機圖片到 ${imagesDir}`);
  return out.join('\n');
}

function renderHtml(options) {
  const {
    inputFile,
    outputDir = 'output',
    stem = 'portfolio',
    themeSets = [],
    logger = console,
  } = options;

  const outputHtml = path.join(outputDir, `${stem}.html`);

  logger.log('🚀 開始執行 HTML 靜態文件渲染管線...');
  logger.log(`📥 輸入：${inputFile}`);
  logger.log(`📤 輸出：${outputHtml}\n`);

  maybeBreakpoint('render-html:start');

  if (!fs.existsSync(inputFile)) {
    throw new Error(`找不到輸入檔：${inputFile}`);
  }
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  logger.log('-> [1/3] 複製本機圖片並改寫路徑...');
  const original = fs.readFileSync(inputFile, 'utf-8');
  const rewritten = rewriteLocalImages(original, {
    baseDir: path.dirname(path.resolve(inputFile)),
    outputDir,
    logger,
  });

  // 改寫後的內容另存在輸入檔旁邊（檔名同樣以 .md-to-slides- 開頭），用完一定刪掉。
  const marpInput =
    rewritten === original
      ? inputFile
      : path.join(path.dirname(inputFile), `${path.basename(inputFile, '.md')}.html.md`);

  try {
    if (marpInput !== inputFile) fs.writeFileSync(marpInput, rewritten, 'utf-8');

    logger.log('-> [2/3] 以 Marp 產出 slide deck HTML...');
    const result = runMarp([
      marpInput,
      '--output',
      outputHtml,
      ...themeSetArgs(themeSets),
      '--allow-local-files',
      '--html',
      '--no-stdin',
    ]);
    if (result.error || result.status !== 0) {
      if (result.error) {
        throw new Error(result.error.message);
      }
      throw new Error(`marp exited with code ${result.status}`);
    }
  } finally {
    if (marpInput !== inputFile) fs.rmSync(marpInput, { force: true });
  }

  logger.log('-> [3/3] 複製 assets/ 資料夾...');
  if (fs.existsSync('assets')) {
    // Keep rendered diagrams generated under output/assets/diagrams as the source of truth.
    copyDir('assets', path.join(outputDir, 'assets'), { ignoreTopLevelDirs: new Set(['diagrams']) });
    logger.log('   ✓ assets 資料夾已複製');
  }

  logger.log('\n✅ HTML 渲染完成！');
  logger.log(`   📂 輸出位置：${outputHtml}`);

  return outputHtml;
}

function main(argv) {
  const inputFile = argv[0] || 'content.md';
  const outputDir = argv[1] || 'output';
  const stem = argv[2] || 'portfolio';

  try {
    renderHtml({ inputFile, outputDir, stem });
  } catch (err) {
    console.error('❌ 渲染過程發生錯誤:', err.message);
    process.exit(1);
  }
}

module.exports = {
  copyDir,
  getMarpInvocation,
  renderHtml,
  rewriteLocalImages,
  runMarp,
  themeSetArgs,
  main,
};

if (require.main === module) {
  main(process.argv.slice(2));
}
