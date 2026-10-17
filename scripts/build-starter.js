'use strict';

// npm run starter [-- <場合 id>] [--theme <主題 id>] [--out <資料夾>] [--zip]
// 產生填空範本起手包。不給場合就產生全部場合與各自推薦主題的組合；
// 給了場合沒給 --theme，就用該場合的每個推薦主題各產生一份。
// 預設輸出到 output/starters/。

const path = require('path');
const { loadScenarios } = require('../src/scenarios');
const { buildStarter, allCombos } = require('../src/starter');

const DEFAULT_OUT = path.resolve(__dirname, '..', 'output', 'starters');

function parseArgs(argv) {
  const args = { scenario: null, theme: null, out: DEFAULT_OUT, zip: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--theme' && argv[i + 1]) args.theme = argv[++i];
    else if (argv[i] === '--out' && argv[i + 1]) args.out = path.resolve(argv[++i]);
    else if (argv[i] === '--zip') args.zip = true;
    else if (!argv[i].startsWith('-') && !args.scenario) args.scenario = argv[i];
  }
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  const loaded = loadScenarios();
  let combos = allCombos(loaded);
  if (args.scenario) {
    const scenario = loaded.scenarios.find((s) => s.id === args.scenario);
    if (!scenario) {
      console.error(`找不到場合「${args.scenario}」，可用的有：${loaded.scenarios.map((s) => s.id).join('、')}`);
      return 1;
    }
    combos = (args.theme ? [args.theme] : scenario.themes).map((theme) => ({ scenario, theme }));
  } else if (args.theme) {
    combos = loaded.scenarios.map((scenario) => ({ scenario, theme: args.theme }));
  }

  try {
    for (const { scenario, theme } of combos) {
      const result = buildStarter(scenario, theme, { outDir: args.out, zip: args.zip });
      console.log(`${result.name}：${result.files.length} 個檔案${result.zip ? `，${path.relative(process.cwd(), result.zip)}` : ''}`);
    }
  } catch (err) {
    console.error(err.message);
    return 1;
  }
  console.log(`\n產生 ${combos.length} 份起手包，放在 ${path.relative(process.cwd(), args.out) || '.'}`);
  return 0;
}

module.exports = { main };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
