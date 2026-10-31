'use strict';

// v2.8 簡報 skill（SDD-v2.8 T3、T6）：產物是最新的、規則跟起手包 AGENTS.md 同源、SKILL.md 符合官方限制、範例通過 check。

const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const yaml = require('js-yaml');
const { repoRoot, runNode, runCheck, normalizeNewlines } = require('./_helpers');
const { loadScenarios } = require('../src/scenarios');
const { starterFiles, listThemes } = require('../src/starter');
const { sliceRules, THEMES_FROM, THEMES_TO } = require('../scripts/build-skill');

const SKILL_DIR = path.join(repoRoot, 'plugin', 'skills', 'make-slides');
const REFS = path.join(SKILL_DIR, 'references');
const EXAMPLES = path.join(REFS, 'examples');
const read = (p) => normalizeNewlines(fs.readFileSync(p, 'utf-8'));

test('npm run skill -- --check：三份產生的 reference 都是最新的', async () => {
  const r = await runNode('scripts/build-skill.js', ['--check']);
  assert.equal(r.code, 0, r.output);
});

test('AC-2：marp-rules.md 的規則段落跟 12 個場合起手包的 AGENTS.md 相同（除了 plugin 沒有 themes/ 的那一句）', () => {
  const skillRules = sliceRules(read(path.join(REFS, 'marp-rules.md')));
  assert.ok(skillRules.includes(THEMES_TO), 'marp-rules.md 沒有 plugin 專用的主題說明句');
  assert.ok(!skillRules.includes(THEMES_FROM), 'marp-rules.md 還留著指向 themes/ 的句子');
  for (const s of loadScenarios().scenarios) {
    const agents = starterFiles(s, s.themes[0]).find((f) => f.name === 'AGENTS.md');
    assert.ok(agents, `${s.id} 的起手包沒有 AGENTS.md`);
    const expected = sliceRules(normalizeNewlines(agents.data.toString('utf-8'))).replace(THEMES_FROM, THEMES_TO);
    assert.equal(expected, skillRules, `${s.id} 不同源`);
  }
});

test('SKILL.md：name 跟資料夾同名、description 加 when_to_use 不超過 1,536 字元、全文 500 行內', () => {
  const text = read(path.join(SKILL_DIR, 'SKILL.md'));
  const lines = text.split('\n');
  assert.equal(lines[0], '---');
  const meta = yaml.load(lines.slice(1, lines.indexOf('---', 1)).join('\n'));
  assert.equal(meta.name, 'make-slides');
  assert.ok(`${meta.description}${meta.when_to_use || ''}`.length <= 1536);
  assert.ok(lines.length < 500, `SKILL.md 有 ${lines.length} 行`);
});

test('SKILL.md 提到的 references 檔案都存在', () => {
  const text = read(path.join(SKILL_DIR, 'SKILL.md'));
  const refs = [...new Set(text.match(/references\/[\w.-]+\.md/g))];
  assert.ok(refs.length >= 6);
  for (const r of refs) assert.ok(fs.existsSync(path.join(SKILL_DIR, r)), `${r} 不存在`);
});

test('plugin.json 與 marketplace.json 的名稱一致，來源指向 ./plugin', () => {
  const plugin = JSON.parse(read(path.join(repoRoot, 'plugin', '.claude-plugin', 'plugin.json')));
  const market = JSON.parse(read(path.join(repoRoot, '.claude-plugin', 'marketplace.json')));
  const entry = market.plugins.find((p) => p.name === plugin.name);
  assert.ok(entry, 'marketplace.json 沒有列出這個 plugin');
  assert.equal(entry.source, './plugin');
  assert.equal(plugin.version, require('../package.json').version);
});

const marpExamples = fs.readdirSync(EXAMPLES).filter((f) => f.endsWith('.md') && read(path.join(EXAMPLES, f)).startsWith('---\nmarp: true'));

test('Marp 範例至少 3 份，主題都存在', () => {
  assert.ok(marpExamples.length >= 3, `只有 ${marpExamples.length} 份`);
  const themes = listThemes();
  for (const f of marpExamples) {
    const theme = read(path.join(EXAMPLES, f)).match(/^theme: (\S+)$/m)[1];
    assert.ok(themes.includes(theme), `${f} 的主題 ${theme} 不存在`);
  }
});

for (const f of marpExamples) {
  test(`範例 ${f} 通過 check（--no-browser，R1 交給 CI 有瀏覽器的那一步）`, async () => {
    const r = await runCheck([path.join(EXAMPLES, f), '--no-browser']);
    assert.equal(r.code, 0, r.output);
  });
}

test('大綱範例不帶 Marp class、主題名或色碼', () => {
  const outlines = fs.readdirSync(EXAMPLES).filter((f) => f.startsWith('outline-'));
  assert.ok(outlines.length >= 2);
  const themes = listThemes();
  for (const f of outlines) {
    const text = read(path.join(EXAMPLES, f));
    assert.doesNotMatch(text, /class=|_class:|#[0-9a-fA-F]{6}\b/, `${f} 帶了 class 或色碼`);
    for (const t of themes) assert.doesNotMatch(text, new RegExp(`\\b${t}\\b`), `${f} 提到主題 ${t}`);
  }
});
