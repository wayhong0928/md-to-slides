'use strict';

const fs = require('fs');
const { checkFile } = require('../check');

function parseArgs(argv) {
  const args = { file: null, json: false, strict: false, browser: true, themeSets: [], help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--json') args.json = true;
    else if (a === '--strict') args.strict = true;
    else if (a === '--no-browser') args.browser = false;
    else if (a === '--theme-set' && argv[i + 1]) args.themeSets.push(argv[++i]);
    else if (!a.startsWith('-') && !args.file) args.file = a;
  }
  return args;
}

function printHelp(stream = console.log) {
  stream(`
md-to-slides — check

用法：
  node src/cli/check-cli.js <input.md> [options]

Options:
  --json             輸出機器可讀的 JSON
  --strict           R5（未填佔位）從 warning 變成 error
  --no-browser       不開瀏覽器，跳過 R1（超框）
  --theme-set <path> 額外的主題 CSS 檔或資料夾，可重複
  --help, -h         顯示說明

exit code：0 沒有 error；1 有 error；2 用法錯誤（info 只是提醒，不影響 exit code）
`.trim());
}

function formatText(result) {
  const lines = [];
  for (const f of result.findings) {
    const page = f.page ? `p.${f.page}` : 'p.-';
    const line = f.line ? `L${f.line}` : 'L-';
    lines.push(`${page}  ${line}  ${f.rule}  ${f.severity}  ${f.message}`);
  }
  for (const s of result.skipped) lines.push(`${s.rule} 沒有檢查：${s.reason}`);

  const errors = result.findings.filter((f) => f.severity === 'error').length;
  const warnings = result.findings.filter((f) => f.severity === 'warning').length;
  const infos = result.findings.filter((f) => f.severity === 'info').length;
  if (result.findings.length === 0 && result.skipped.length === 0) {
    lines.push('全部通過：R1–R5 沒有發現問題。');
  } else {
    const tail = result.skipped.length > 0 ? `；${result.skipped.map((s) => s.rule).join('、')} 沒有檢查，不能當成通過` : '';
    // info 是 0 時不印，避免改動 2.1 既有的輸出
    const infoPart = infos > 0 ? `、${infos} 個 info` : '';
    lines.push(`${errors} 個 error、${warnings} 個 warning${infoPart}${tail}`);
  }
  return lines.join('\n');
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return 0;
  }
  if (!args.file) {
    console.error('❌ 請指定要檢查的 Markdown 檔。\n');
    printHelp(console.error);
    return 2;
  }
  if (!fs.existsSync(args.file)) {
    console.error(`❌ 找不到檔案：${args.file}`);
    return 2;
  }

  const result = await checkFile(args.file, {
    browser: args.browser,
    strict: args.strict,
    themeSets: args.themeSets,
  });

  console.log(args.json ? JSON.stringify(result, null, 2) : formatText(result));
  return result.findings.some((f) => f.severity === 'error') ? 1 : 0;
}

module.exports = { parseArgs, formatText, main };

if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (err) => {
      console.error(`❌ ${err.message}`);
      process.exitCode = 2;
    }
  );
}
