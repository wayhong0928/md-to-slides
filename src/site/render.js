'use strict';

// 樣式畫廊的預覽：build 時在 Node 端用 marp-core 把 Markdown 加上指定主題渲染成 HTML 與 CSS，
// 網頁切換主題時換掉這兩份就好，不在瀏覽器裡跑 marp-core（SDD-v2.5 D1）。
// marp-core 是 marp-cli 用的同一份，預覽跟 npm run build 的結果一致。

const fs = require('fs');
const path = require('path');
const { Marp } = require('@marp-team/marp-core');

const THEMES_DIR = path.resolve(__dirname, '..', '..', 'themes');

const stripFrontmatter = (markdown) => markdown.replace(/\r\n/g, '\n').replace(/^---\n[\s\S]*?\n---\n/, '');

// 回傳 render(markdown, theme) → { html, css, slides }。markdown 原本的 frontmatter 會被換掉，
// 只留 theme 與 paginate，跟起手包的 slides.md 一樣。
function createRenderer({ themesDir = THEMES_DIR } = {}) {
  const marp = new Marp({ html: true, inlineSVG: true, script: false });
  const names = [];
  for (const file of fs.readdirSync(themesDir).filter((f) => f.endsWith('.css')).sort()) {
    const theme = marp.themeSet.add(fs.readFileSync(path.join(themesDir, file), 'utf-8'));
    names.push(theme.name);
  }
  return function render(markdown, theme) {
    if (!names.includes(theme)) throw new Error(`找不到主題「${theme}」`);
    const { html, css } = marp.render(`---\ntheme: ${theme}\npaginate: true\n---\n\n${stripFrontmatter(markdown)}`);
    const slides = (html.match(/<svg data-marpit-svg/g) || []).length;
    return { html, css, slides };
  };
}

module.exports = { createRenderer, stripFrontmatter };
