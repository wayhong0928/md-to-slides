'use strict';

// 場合範本載入器：讀 scenarios/<id>.md。
// 每筆是 frontmatter（id、name_zh、themes、sections）加上「## 填空版」「## 範例版」兩個 fenced block，
// 讀法跟版型目錄一樣（標題後第一個 fence，外層可以是三個以上的反引號）。

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { extractSection } = require('../catalog');

const DEFAULT_DIR = path.resolve(__dirname, '..', '..', 'scenarios');
const REQUIRED_FIELDS = ['id', 'name_zh', 'themes', 'sections'];

// 回傳 { scenario, problems }；problems 是字串陣列，空陣列表示讀得懂。
function parseScenario(text, file) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return { scenario: null, problems: ['開頭沒有 frontmatter（---）'] };
  const end = lines.indexOf('---', 1);
  if (end < 0) return { scenario: null, problems: ['frontmatter 沒有收尾的 ---'] };

  let meta;
  try {
    meta = yaml.load(lines.slice(1, end).join('\n'));
  } catch (err) {
    return { scenario: null, problems: [`frontmatter 不是合法的 YAML：${err.message.split('\n')[0]}`] };
  }
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    return { scenario: null, problems: ['frontmatter 不是欄位清單'] };
  }

  const problems = [];
  const body = lines.slice(end + 1);
  const blank = extractSection(body, '## 填空版');
  const example = extractSection(body, '## 範例版');
  if (!blank.found) problems.push('缺少「## 填空版」區塊');
  else if (blank.text === null) problems.push('「## 填空版」後面沒有完整的程式碼區塊');
  if (!example.found) problems.push('缺少「## 範例版」區塊');
  else if (example.text === null) problems.push('「## 範例版」後面沒有完整的程式碼區塊');

  return { scenario: { ...meta, file, blank: blank.text, example: example.text }, problems };
}

// 回傳 { dir, scenarios, problems }，scenarios 依檔名排序。
function loadScenarios(dir = DEFAULT_DIR) {
  const problems = [];
  const scenarios = [];
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : [];
  for (const f of files) {
    const { scenario, problems: p } = parseScenario(fs.readFileSync(path.join(dir, f), 'utf-8'), f);
    p.forEach((message) => problems.push({ file: f, message }));
    if (scenario) scenarios.push(scenario);
  }
  return { dir, scenarios, problems };
}

// 依分頁線切頁：程式碼區塊外、單獨一行的 ---。回傳每頁的文字。
function splitPages(markdown) {
  const pages = [[]];
  let fence = null;
  for (const line of markdown.split(/\r?\n/)) {
    const mark = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (mark && mark[1][0] === fence.char && mark[1].length >= fence.len && /^ {0,3}(`{3,}|~{3,})\s*$/.test(line)) fence = null;
    } else if (mark) {
      fence = { char: mark[1][0], len: mark[1].length };
    } else if (/^---\s*$/.test(line)) {
      pages.push([]);
      continue;
    }
    pages[pages.length - 1].push(line);
  }
  return pages.map((p) => p.join('\n'));
}

module.exports = { DEFAULT_DIR, REQUIRED_FIELDS, parseScenario, loadScenarios, splitPages };
