'use strict';

// md-to-slides 樣式畫廊（SDD-v2.5、v2.6）。三頁共用：body 的 data-page 決定跑哪一段。
// 資料都是 npm run site 產生的靜態檔，網址一律用相對路徑（Pages 會把網站放在 /md-to-slides/ 底下）。
// 每次畫面更新完，body 的 data-rendered 會記下目前顯示的組合，給瀏覽器測試等。
// 預覽用 innerHTML 放進 marp-core 預先渲染的投影片，來源只有同一個網站裡 build 出來的檔案。

(() => {
  const $ = (selector) => document.querySelector(selector);
  const params = new URLSearchParams(location.search);

  const cache = new Map();
  function get(url, type) {
    if (!cache.has(url)) {
      const request = fetch(url).then((response) => {
        if (!response.ok) throw new Error(`${url} 回應 ${response.status}`);
        return type === 'json' ? response.json() : response.text();
      });
      request.catch(() => cache.delete(url));
      cache.set(url, request);
    }
    return cache.get(url);
  }

  function showError(err) {
    const box = $('#error');
    box.hidden = false;
    box.textContent =
      location.protocol === 'file:'
        ? '讀不到網站資料。直接用瀏覽器開檔案時，瀏覽器會擋下讀取，請在 output/site 用本機 http 伺服器開（README 的「樣式畫廊」有說明）。'
        : `讀不到網站資料（${err.message}）。`;
  }

  function setThemeCss(theme) {
    $('#theme-css').href = `data/css/${theme}.css`;
  }

  // 只保留最後一次要求的結果：快速切換時，晚回來的舊資料不會蓋掉新的
  let latest = 0;
  async function update(load, apply) {
    const ticket = ++latest;
    try {
      const data = await load();
      if (ticket !== latest) return;
      $('#error').hidden = true;
      apply(data);
    } catch (err) {
      if (ticket === latest) showError(err);
    }
  }

  function option(value, label) {
    const el = document.createElement('option');
    el.value = value;
    el.textContent = label;
    return el;
  }

  function fillThemes(select, site, recommended = []) {
    const current = select.value;
    select.replaceChildren(
      ...site.themes.map((t) => option(t.id, recommended.includes(t.id) ? `${t.id}（推薦）` : t.id))
    );
    if (current) select.value = current;
  }

  function pickTheme(site, wanted, fallback) {
    return site.themes.some((t) => t.id === wanted) ? wanted : fallback;
  }

  function setQuery(values) {
    const query = new URLSearchParams(values).toString();
    history.replaceState(null, '', `${location.pathname}?${query}`);
  }

  async function copy(text, status, fallback) {
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = '已複製';
    } catch (_) {
      status.textContent = `沒辦法自動複製，${fallback}`;
    }
  }

  // 場合範本頁
  function scenariosPage(site) {
    const scenarioSelect = $('#scenario');
    const themeSelect = $('#theme');
    const download = $('#download');
    scenarioSelect.replaceChildren(...site.scenarios.map((s) => option(s.id, s.name_zh)));

    const find = (id) => site.scenarios.find((s) => s.id === id);
    const initial = find(params.get('scenario')) || find(site.defaults.scenario) || site.scenarios[0];
    scenarioSelect.value = initial.id;
    fillThemes(themeSelect, site, initial.themes);
    themeSelect.value = pickTheme(site, params.get('theme'), initial.themes[0]);

    function show() {
      const scenario = site.scenarios.find((s) => s.id === scenarioSelect.value);
      const theme = themeSelect.value;
      const zip = `${scenario.id}-${theme}.zip`;
      setQuery({ scenario: scenario.id, theme });
      download.href = `starters/${zip}`;
      download.setAttribute('download', zip);
      update(
        () => get(`data/scenarios/${scenario.id}/${theme}.html`),
        (html) => {
          setThemeCss(theme);
          $('#preview').innerHTML = html;
          $('#summary').textContent = `${scenario.name_zh}，${theme} 主題，共 ${scenario.slides} 頁。`;
          document.body.dataset.rendered = `${scenario.id}/${theme}`;
        }
      );
    }

    scenarioSelect.addEventListener('change', () => {
      const scenario = site.scenarios.find((s) => s.id === scenarioSelect.value);
      fillThemes(themeSelect, site, scenario.themes);
      show();
    });
    themeSelect.addEventListener('change', show);
    show();
  }

  // 版型頁
  function layoutsPage(site) {
    const themeSelect = $('#theme');
    fillThemes(themeSelect, site);
    themeSelect.value = pickTheme(site, params.get('theme'), site.defaults.theme);

    const previews = new Map();
    const packs = $('#packs');
    for (const pack of site.packs) {
      const entries = site.layouts.filter((l) => l.pack === pack);
      const section = document.createElement('section');
      section.dataset.pack = pack;
      const heading = document.createElement('h2');
      heading.textContent = `${pack}（${entries.length}）`;
      const cards = document.createElement('div');
      cards.className = 'g-cards';
      for (const layout of entries) {
        const card = document.createElement('article');
        card.className = 'g-card';
        card.dataset.layout = layout.id;

        const title = document.createElement('h3');
        title.textContent = `${layout.name_zh} `;
        const id = document.createElement('code');
        id.textContent = layout.id;
        title.append(id);

        const purpose = document.createElement('p');
        purpose.textContent = layout.purpose;

        const preview = document.createElement('div');
        preview.className = 'g-preview';
        previews.set(layout.id, preview);

        const actions = document.createElement('div');
        actions.className = 'g-actions';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'g-button';
        button.textContent = '複製語法';
        const status = document.createElement('span');
        status.className = 'g-status';
        status.setAttribute('aria-live', 'polite');
        button.addEventListener('click', () => copy(layout.skeleton, status, '請展開「看語法」自己選取'));
        actions.append(button, status);

        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = '看語法';
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = layout.skeleton;
        pre.append(code);
        details.append(summary, pre);

        card.append(title, purpose, preview, actions, details);
        cards.append(card);
      }
      section.append(heading, cards);
      packs.append(section);
    }

    function show() {
      const theme = themeSelect.value;
      setQuery({ theme });
      update(
        () => get(`data/layouts/${theme}.json`, 'json'),
        (html) => {
          setThemeCss(theme);
          for (const [id, preview] of previews) preview.innerHTML = html[id] || '';
          document.body.dataset.rendered = theme;
        }
      );
    }

    themeSelect.addEventListener('change', show);
    show();
  }

  // 主題頁
  function themesPage(site) {
    const themeSelect = $('#theme');
    fillThemes(themeSelect, site);
    themeSelect.value = pickTheme(site, params.get('theme'), site.defaults.theme);
    $('#pinned').textContent = site.commit.slice(0, 7);
    $('#copy-snippet').addEventListener('click', () => copy($('#snippet').textContent, $('#snippet-status'), '請直接選取上面的設定'));
    $('#copy-brand').addEventListener('click', () => copy($('#brand-snippet').textContent, $('#brand-status'), '請直接選取上面的片段'));
    $('#brand-color').addEventListener('input', () => tune(site.themes.find((t) => t.id === themeSelect.value), $('#brand-color').value));

    function show() {
      const theme = site.themes.find((t) => t.id === themeSelect.value);
      setQuery({ theme: theme.id });
      update(
        () => get(`data/themes/${theme.id}.html`),
        (html) => {
          setThemeCss(theme.id);
          $('#note').textContent = theme.note;
          $('#theme-id').textContent = theme.id;
          $('#snippet').textContent = theme.snippet;
          $('#snippet-status').textContent = '';
          $('#preview').innerHTML = html;
          $('#tokens tbody').replaceChildren(...site.tokens.map((token) => tokenRow(token, theme.values[token.name], theme.resolved[token.name])));
          $('#tuner').hidden = !theme.tuner;
          $('#brand-style').textContent = '';
          if (theme.tuner) {
            $('#brand-color').value = theme.tuner.value;
            tune(theme, theme.tuner.value);
          }
          document.body.dataset.rendered = theme.id;
        }
      );
    }

    themeSelect.addEventListener('change', show);
    show();
  }

  // 品牌色調色欄位（SDD-v2.6 D4）：預覽換色、重算綁到品牌色的對比配對、產生可貼進 frontmatter 的 style 片段
  function tune(theme, color) {
    const { token, bound, pairs } = theme.tuner;
    $('#brand-style').textContent = `#preview section { ${token}: ${color}; }`;
    $('#brand-snippet').textContent = `style: section { ${token}: ${color}; }`;
    $('#brand-status').textContent = '';
    const value = (name) => (bound.includes(name) ? color : theme.resolved[name]);
    const low = [];
    for (const p of pairs) {
      const ratio = contrastRatio(value(p.fg), value(p.bg));
      if (ratio < p.min) low.push(`${p.fg.replace('--theme-', '')} / ${p.bg.replace('--theme-', '')} 是 ${ratio.toFixed(2)}，門檻 ${p.min}（${p.note}）`);
    }
    const box = $('#brand-warnings');
    box.className = low.length ? 'g-error' : 'g-muted';
    box.replaceChildren();
    if (!low.length) {
      box.textContent = `這個顏色跟其他 token 的 ${pairs.length} 組對比都達標。`;
    } else {
      box.append(`這個顏色有 ${low.length} 組對比不夠，投影片上的字可能看不清楚：`);
      const list = document.createElement('ul');
      for (const text of low) {
        const item = document.createElement('li');
        item.textContent = text;
        list.append(item);
      }
      box.append(list);
    }
    document.body.dataset.tuned = color;
  }

  // 跟 scripts/check-contrast.js 相同的 WCAG 公式
  function contrastRatio(a, b) {
    const rgb = (hex) => {
      let h = hex.replace('#', '');
      if (h.length === 3) h = h.split('').map((c) => c + c).join('');
      return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    };
    const lum = (hex) => {
      const [r, g, b] = rgb(hex).map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }

  // value 是主題檔裡寫的值；寫成 var() 時，色塊用解析後的 resolved，文字兩個都列
  function tokenRow(token, value = '', resolved = value) {
    const row = document.createElement('tr');
    const name = document.createElement('td');
    const code = document.createElement('code');
    code.textContent = token.name;
    name.append(code);
    const purpose = document.createElement('td');
    purpose.textContent = token.purpose;
    const cell = document.createElement('td');
    if (/^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i.test(resolved || '')) {
      const swatch = document.createElement('span');
      swatch.className = 'g-swatch';
      swatch.style.background = resolved;
      cell.append(swatch);
    }
    const text = document.createElement('code');
    text.textContent = resolved && resolved !== value ? `${value} → ${resolved}` : value;
    cell.append(text);
    row.append(name, purpose, cell);
    return row;
  }

  const pages = { scenarios: scenariosPage, layouts: layoutsPage, themes: themesPage };
  get('data/site.json', 'json').then(
    (site) => {
      $('#commit').textContent = site.commit.slice(0, 7);
      pages[document.body.dataset.page](site);
    },
    showError
  );
})();
