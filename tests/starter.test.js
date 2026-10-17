'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadCatalog } = require('../src/catalog');
const { checkFile } = require('../src/check');
const { buildStarter, allCombos, listThemes } = require('../src/starter');
const { crc32, createZip } = require('../src/starter/zip');
const { mkTmp, runBuild } = require('./_helpers');

const catalog = loadCatalog();
const outDir = mkTmp('md-to-slides-starter-');
const combos = allCombos();
const built = combos.map(({ scenario, theme }) => buildStarter(scenario, theme, { outDir, zip: true, catalog }));

test.after(() => fs.rmSync(outDir, { recursive: true, force: true }));

const read = (dir, name) => fs.readFileSync(path.join(dir, name), 'utf-8');

test('產生 6 個組合，每份都有起手包的 8 種檔案與 zip', () => {
  assert.equal(built.length, 6);
  for (const b of built) {
    for (const name of ['slides.md', 'example.md', 'AGENTS.md', 'CLAUDE.md', 'prompts.md', '.github/copilot-instructions.md', '.vscode/settings.json']) {
      assert.equal(fs.existsSync(path.join(b.dir, name)), true, `${b.name} 缺少 ${name}`);
    }
    assert.match(read(b.dir, 'CLAUDE.md'), /^@AGENTS\.md$/m);
    assert.equal(fs.readdirSync(path.join(b.dir, 'themes')).length, listThemes().length);
    assert.equal(fs.existsSync(b.zip), true);
  }
});

test('AGENTS.md 小於 32 KiB、跟 copilot-instructions.md 逐位元相同，版型清單等於目錄', () => {
  const ids = new Set(catalog.entries.map((e) => e.id));
  for (const b of built) {
    const agents = fs.readFileSync(path.join(b.dir, 'AGENTS.md'));
    assert.ok(agents.length < 32 * 1024, `${b.name} 的 AGENTS.md 有 ${agents.length} bytes`);
    assert.deepEqual(agents, fs.readFileSync(path.join(b.dir, '.github', 'copilot-instructions.md')));
    const text = agents.toString('utf-8');
    assert.equal(text.includes('{{'), false, '還有沒替換的標記');
    const listed = new Set([...text.matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((m) => m[1]));
    assert.deepEqual([...listed].sort(), [...ids].sort());
  }
});

test('prompts.md 有六段 prompt', () => {
  const headings = [...read(built[0].dir, 'prompts.md').matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  assert.deepEqual(headings, ['起手', '換主題', '加一頁某種版型', '精簡文字', '新手視角審查', '專業視角審查']);
});

test('.vscode/settings.json 是合法 JSON，列的主題路徑都存在，並開啟 html', () => {
  for (const b of built) {
    const settings = JSON.parse(read(b.dir, '.vscode/settings.json'));
    assert.equal(settings['markdown.marp.html'], 'all');
    const themes = settings['markdown.marp.themes'];
    assert.equal(themes.length, 8);
    for (const t of themes) assert.equal(fs.existsSync(path.join(b.dir, t)), true, `${b.name} 找不到 ${t}`);
  }
});

test('6 個組合的 slides.md 與 example.md 都能 build 成 HTML', async () => {
  for (const b of built) {
    for (const name of ['slides.md', 'example.md']) {
      const stem = `${b.name}-${path.basename(name, '.md')}`;
      const result = await runBuild([path.join(b.dir, name), '--format', 'html', '--out', outDir, '--stem', stem]);
      assert.equal(result.code, 0, `${b.name}/${name}\n${result.output}`);
      assert.equal(fs.existsSync(path.join(outDir, `${stem}.html`)), true);
    }
  }
});

test('check（開瀏覽器）：example.md 沒有 error，slides.md 只有 R5 的 warning，兩者都沒有略過的規則', async () => {
  for (const b of built) {
    const example = await checkFile(path.join(b.dir, 'example.md'));
    assert.deepEqual(example.skipped, [], `${b.name}/example.md 有規則沒檢查：${JSON.stringify(example.skipped)}`);
    const errors = example.findings.filter((f) => f.severity === 'error');
    assert.deepEqual(errors, [], `${b.name}/example.md`);

    const slides = await checkFile(path.join(b.dir, 'slides.md'));
    assert.deepEqual(slides.skipped, [], `${b.name}/slides.md 有規則沒檢查：${JSON.stringify(slides.skipped)}`);
    const other = slides.findings.filter((f) => !(f.rule === 'R5' && f.severity === 'warning'));
    assert.deepEqual(other, [], `${b.name}/slides.md`);
    assert.ok(slides.findings.length > 0, `${b.name}/slides.md 應該有未填的佔位`);
  }
});

test('zip：CRC32 標準值正確，同樣的內容產生的 zip 逐位元相同', () => {
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
  const files = [{ name: 'a/b.txt', data: Buffer.from('中文內容\n'.repeat(20)) }];
  assert.deepEqual(createZip(files), createZip(files));
  const again = buildStarter(combos[0].scenario, combos[0].theme, { outDir: mkTmp('md-to-slides-starter-again-'), zip: true, catalog });
  assert.deepEqual(fs.readFileSync(again.zip), fs.readFileSync(built[0].zip));
  fs.rmSync(path.dirname(again.dir), { recursive: true, force: true });
});
