'use strict';

const fs = require('fs');
const path = require('path');
const { preprocessMermaid } = require('../steps/preprocess-mermaid');
const { renderHtml, runMarp, themeSetArgs } = require('../steps/render-html');

// 套件自帶的主題（classic 等），每次 build 都會加進 --theme-set。
// 逐檔傳入 themes/*.css 而不是整個資料夾：Marp 會遞迴掃資料夾，掃到 themes/src/_base.css 會警告。
const BUILTIN_THEMES_DIR = path.resolve(__dirname, '..', '..', 'themes');

function getBuiltinThemeFiles() {
  return fs
    .readdirSync(BUILTIN_THEMES_DIR)
    .filter((file) => file.endsWith('.css'))
    .sort()
    .map((file) => path.join(BUILTIN_THEMES_DIR, file));
}

function maybeBreakpoint(label) {
  const breakpoint = process.env.MARKDOWN_TOOL_BREAKPOINT;
  if (breakpoint === '1' || breakpoint === label) {
    debugger;
  }
}

function parseArgs(argv) {
  const args = { input: null, out: 'output', stem: null, formats: ['html', 'pdf', 'pptx'], themeSets: [] };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      args.help = true;
    } else if ((a === '--out' || a === '-o') && argv[i + 1]) {
      args.out = argv[++i];
    } else if ((a === '--stem' || a === '-s') && argv[i + 1]) {
      args.stem = argv[++i];
    } else if (a === '--format' && argv[i + 1]) {
      args.formats = argv[++i].split(',').map((f) => f.trim().toLowerCase());
    } else if (a === '--theme-set' && argv[i + 1]) {
      args.themeSets.push(argv[++i]);
    } else if (!a.startsWith('-')) {
      positional.push(a);
    }
  }

  args.input = positional[0] || null;
  return args;
}

function printHelp() {
  console.log(`
md-to-slides — Build CLI

用法：
  node build.js [options] <input.md>

Options:
  --out,  -o <dir>       輸出目錄（預設 output）
  --stem, -s <name>      輸出檔名主幹（預設取自輸入檔名）
  --format   <formats>   輸出格式，逗號分隔：html,pdf,pptx（預設全部）
  --theme-set <path>     額外的主題 CSS 檔或資料夾，可重複（內建 8 個主題一律可用）
  --help, -h             顯示說明

範例：
  node build.js content.md
  node build.js data/slides.md --out output/slides
  node build.js data/note.md --format html
  node build.js data/report.md -s report -o output/report
  node build.js data/slides.md --theme-set my-themes
`.trim());
}

// 失敗時用 throw 而不是 process.exit：main 的 finally 才有機會刪掉暫存檔。
function run(marpArgs, label) {
  console.log(`\n▶ ${label}`);
  const result = runMarp(marpArgs);
  if (result.error || result.status !== 0) {
    if (result.error) console.error(`❌ 執行失敗：${result.error.message}`);
    throw new Error(`失敗：${label}`);
  }
}

function validateFormats(formats) {
  const allowed = new Set(['html', 'pdf', 'pptx']);
  const invalid = formats.filter((f) => !allowed.has(f));
  if (invalid.length > 0) {
    throw new Error(`不支援的格式：${invalid.join(', ')}`);
  }
}

function main(argv) {
  const args = parseArgs(argv);

  if (args.help) {
    printHelp();
    return;
  }

  if (!args.input) {
    console.error('❌ 請指定輸入檔案。\n   用法：node build.js <input.md> [options]');
    console.error('   說明：node build.js --help');
    process.exit(1);
  }

  if (!fs.existsSync(args.input)) {
    console.error(`❌ 找不到輸入檔：${args.input}`);
    process.exit(1);
  }

  try {
    validateFormats(args.formats);
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }

  const userThemeSets = args.themeSets.map((p) => path.resolve(p));
  const missingTheme = userThemeSets.find((p) => !fs.existsSync(p));
  if (missingTheme) {
    console.error(`❌ 找不到 --theme-set 指定的路徑：${missingTheme}`);
    process.exit(1);
  }
  const themeSets = [...getBuiltinThemeFiles(), ...userThemeSets];

  const stem = args.stem || path.basename(args.input, path.extname(args.input));
  const outputDir = args.out;
  // 暫存檔放在輸入檔旁邊：相對路徑的圖片、內嵌 HTML 才找得到；檔名帶 pid，並行 build 不會互相覆蓋。
  const inputDir = path.dirname(path.resolve(args.input));
  const tempName = `.md-to-slides-${stem.replace(/[\\/:*?"<>|]/g, '_')}-${process.pid}.md`;
  const tempMd = path.join(inputDir, tempName);
  const diagramsDir = path.join(outputDir, 'assets', 'diagrams');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log('╔═══════════════════════════════════════════╗');
  console.log('║          md-to-slides  Build CLI          ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`📥 輸入：${args.input}`);
  console.log(`📤 輸出：${outputDir}/${stem}.*`);
  console.log(`🖨  格式：${args.formats.join(', ')}`);

  const cleanup = () => fs.rmSync(tempMd, { force: true });
  const onSigint = () => {
    cleanup();
    process.exit(130);
  };
  process.once('SIGINT', onSigint);

  let failed = false;
  try {
    maybeBreakpoint('build-cli:before-preprocess');

    console.log('\n▶ Mermaid 前處理');
    try {
      preprocessMermaid({
        input: args.input,
        output: tempMd,
        diagramsDir,
      });
    } catch (err) {
      throw new Error(`Mermaid 前處理失敗：${err.message}`);
    }

    if (args.formats.includes('html')) {
      maybeBreakpoint('build-cli:before-html');
      console.log(`\n▶ HTML → ${outputDir}/${stem}.html`);
      try {
        renderHtml({ inputFile: tempMd, outputDir, stem, themeSets });
      } catch (err) {
        throw new Error(`HTML 渲染失敗：${err.message}`);
      }
    }

    for (const format of ['pdf', 'pptx']) {
      if (!args.formats.includes(format)) continue;
      maybeBreakpoint(`build-cli:before-${format}`);
      run(
        [
          tempMd,
          '-o',
          `${outputDir}/${stem}.${format}`,
          ...themeSetArgs(themeSets),
          '--allow-local-files',
          '--html',
          '--no-stdin',
        ],
        `${format.toUpperCase().padEnd(4)} → ${outputDir}/${stem}.${format}`
      );
    }
  } catch (err) {
    console.error(`❌ ${err.message}`);
    failed = true;
  } finally {
    cleanup();
    process.removeListener('SIGINT', onSigint);
  }

  if (failed) process.exit(1);

  console.log('\n╔═══════════════════════════════════════════╗');
  console.log(`║  ✅ 完成！輸出位置：${outputDir}/`);
  console.log('╚═══════════════════════════════════════════╝');
}

module.exports = {
  BUILTIN_THEMES_DIR,
  getBuiltinThemeFiles,
  parseArgs,
  validateFormats,
  main,
};

if (require.main === module) {
  main(process.argv.slice(2));
}
