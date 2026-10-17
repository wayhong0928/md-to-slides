# 主題 token 清單

每個主題在 `themes/src/<id>.css` 裡只改這份清單的 token（必要時在後面加一小段只改外觀的裝飾 CSS），版型與 class 全部在 `themes/src/_base.css`。改完執行 `npm run themes` 產生 `themes/<id>.css`。

- `npm run themes -- --check` 會檢查每個主題都定義了「固定不換」之前列的全部 token。
- `npm run contrast` 照下面的「對比配對表」算每個主題的 WCAG 對比。
- 下表的「classic 的值」是 classic 主題的實際值，也等於 2.2.0 以前寫死在 `_base.css` 的值。
- 要加新 token，先加到這份清單與 `themes/src/classic.css`，再補其他主題，最後重跑上面兩個指令。

## 字型

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-font` | 內文字型，後面接各平台的中文字型後備 | `'Helvetica Neue', '微軟正黑體', sans-serif` | `section` |
| `--theme-font-heading` | 標題字型（h1 到 h4），預設等於內文 | `var(--theme-font)` | `h1`、`h2`、`h3` |
| `--theme-font-mono` | 等寬字型（程式碼對照、步驟指令、檔案對照表） | `Consolas, 'Cascadia Mono', 'JetBrains Mono', monospace` | `.covlines`、`.steps`、`.cmd` |
| `--theme-font-mono-label` | 等寬字型（圖說、目錄序號、頁碼），和 font-mono 分開是為了 classic 的後備順序不變 | `'JetBrains Mono', Consolas, monospace` | `.rgrid`、`.toc-item`、`.no` |

## 字級與形狀

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-font-size` | 內文基準字級，其他字級都以 em 相對於它 | `26px` | `section` |
| `--theme-radius` | 卡片、程式碼區塊等的圓角 | `8px` | `pre`、`.card`、`.stat-box` |

## 間距

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-slide-padding` | 每頁 section 的內距 | `44px 60px` | `section` |
| `--theme-card-padding` | .card 的內距 | `14px 16px` | `.card` |

## 底色

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-bg` | 頁面底色 | `#f5f6f8` | `section`、`.section-slide`、`.cover` |
| `--theme-surface` | 卡片與面板的底色 | `#ffffff` | `.card`、`.stat-box`、`.flow-step` |
| `--theme-surface-sunken` | 佔位框的底色（略凹） | `#eef1f4` | `.shot-todo` |
| `--theme-row-alt` | 表格偶數列的底色 | `#edf0f2` | （見 `_base.css`） |
| `--theme-code-bg` | 行內程式碼與程式碼區塊的底色 | `#eef0f3` | `code`、`pre` |
| `--theme-cmd-bg` | 步驟指令框的底色 | `#f4f6f8` | `.steps`、`.cmd` |
| `--theme-opdef-bg` | 操作型定義框的底色 | `#f0f4f8` | `.opdef` |
| `--theme-placeholder-bg` | 待填佔位標記（.ph）的底色 | `#fff3cd` | `.ph` |

## 文字（含強調色上的文字）

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-text` | 內文色 | `#1a252f` | `h1`、`.tl-label`、`strong` |
| `--theme-heading` | 標題色，也是表格表頭與附錄分隔頁的底色 | `#2c3e50` | `h2`、`th`、`.tl-label` |
| `--theme-text-soft` | 次要文字（頁碼、標籤、說明） | `#445566` | `.stat-label`、`.tl-label`、`.loop-note` |
| `--theme-text-mid` | 封面副標 | `#3d4e5f` | `section`、`.cover`、`.cover-subtitle` |
| `--theme-muted` | 更淡的說明文字（來源、備註、小字） | `#5d6d7e` | `.shot-todo`、`.rgrid`、`.tri` |
| `--theme-subtle` | 最小字的來源與註記 | `#7f8c8d` | `section`、`.shot`、`.shot-src` |
| `--theme-faint` | 最淡的輔助文字與符號 | `#95a5a6` | `section`、`.section-slide`、`.section-label` |
| `--theme-code-text` | 程式碼文字色 | `#1f2937` | `code`、`pre` |
| `--theme-strong` | 粗體 strong 的顏色 | `#c0392b` | `strong` |
| `--theme-em` | 強調 em 的顏色 | `#1a6fa8` | `em` |
| `--theme-on-accent` | 放在強調色或標題色底上的文字色 | `#ffffff` | `th`、`.tl-dot`、`.step-pill` |
| `--theme-on-dark` | 放在標題色底（附錄分隔頁）上的大字 | `#ecf0f1` | `section`、`.appendix-divider`、`h1` |
| `--theme-on-dark-soft` | 放在標題色底上的小字 | `#bdc3c7` | `section`、`.appendix-divider` |

## 邊框與線

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-border` | 一般邊框 | `#d5dce4` | `section`、`.cover`、`.shot-img` |
| `--theme-border-dashed` | 虛線邊框（佔位框） | `#9aa5b1` | `.shot-todo` |
| `--theme-line` | 時間軸線、數線與分隔虛線 | `#c0cdd8` | `.tl-step`、`.gwt`、`.ex` |
| `--theme-divider` | 清單列之間的細線 | `#eef1f4` | `.lst`、`.pol`、`.row` |
| `--theme-divider-soft` | 表格列之間的細線 | `#e5e9ee` | `.mdpair`、`td`、`th` |

## 強調與語意色

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-primary` | 主色：h3、連結、強調條、大數字 | `#2980b9` | `h3`、`.card-blue`、`.stat-num` |
| `--theme-green` | 語意色：提示、成功 | `#27ae60` | `.card-green`、`.stat-box`、`.green` |
| `--theme-red` | 語意色：危險、錯誤 | `#e74c3c` | `.card-red`、`.danger`、`.hbox` |
| `--theme-orange` | 語意色：注意、警告 | `#e67e22` | `.card-orange`、`.warning`、`.hbox` |
| `--theme-purple` | 第四個強調色 | `#8e44ad` | `.card-purple`、`.stat-box`、`.purple` |
| `--theme-gray` | 中性強調（灰色卡片頂線、灰色標籤） | `#6b7c8d` | `.card-gray`、`.tag`、`.k` |
| `--theme-yellow` | 黃色線條裝飾 | `#f1c40f` | `.hbox`、`.yellow`、`.ladder` |
| `--theme-amber` | 術語列的粗體字 | `#b9770e` | `.term` |
| `--theme-orange-deep` | 橘色大數字（比 orange 深） | `#d4710a` | `.stat-box`、`.orange`、`.stat-num` |
| `--theme-red-deep` | 深紅：大數字、紅色標籤、待填標記文字 | `#c0392b` | `.stat-box`、`.red`、`.stat-num` |

## 淡底

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-primary-tint` | 主色淡底（結論框、步驟膠囊、引言） | `#eaf4fb` | `.step-pill`、`.conclusion`、`.cloud-bar` |
| `--theme-green-tint` | 綠色淡底（提示框、成功區） | `#eafaf1` | `.tip`、`.hbox`、`.good` |
| `--theme-red-tint` | 紅色淡底（危險框、錯誤區） | `#fdedec` | `.danger`、`.hbox`、`.bad` |
| `--theme-orange-tint` | 橘色淡底（警告框、術語列） | `#fef9e7` | `.warning`、`.term` |

## 陰影

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-shadow` | 卡片陰影 | `0 2px 8px rgba(0,0,0,.08)` | `.card`、`.stat-box`、`.shot-img` |
| `--theme-shadow-flat` | 迴圈列的陰影 | `0 2px 8px rgba(0,0,0,.06)` | `.loop-row` |
| `--theme-shadow-thin` | 細陰影（流程步驟、階梯列） | `0 1px 4px rgba(0,0,0,.06)` | `.flow-step`、`.ladder`、`.rung` |
| `--theme-shadow-row` | 細陰影（提示列、步驟列） | `0 1px 4px rgba(0,0,0,.08)` | `.prompt`、`.pr`、`.steps` |

## 裝飾（`--theme-deco-image`）

| token | 用途 | classic 的值 | 用到的 class |
|---|---|---|---|
| `--theme-deco-image` | 一般頁的背景裝飾（url() 或 none） | `url("data:image/svg+xml,…")`（主色寫在 data-URL 裡） | （見 `_base.css`） |

## 固定不換（終端機視窗）

`.term` 的終端機視窗（`_base.css` 的 `.term`、`.term .bar`、`.term pre` 到 `.term .mark` 那一組）模擬編輯器外觀，所有主題用同一組顏色與字型，不開 token。包含底色 `#1e1e1e`、字色 `#d4d4d4`、標題列 `#3c3c3c`、紅黃綠三個圓點，以及 `.u`、`.p`、`.b`、`.c`、`.ok`、`.er`、`.dim`、`.mark` 的語法色。

## 主題自己加的 token

這一節的 token 只有某個主題用，不算進上面的必備清單，`npm run themes -- --check` 不檢查它們。主題裡的 token 可以寫成 `var(--theme-…)` 引用同一個主題的另一個 token，`npm run contrast` 會先解析再算對比，循環引用或引用沒宣告的 token 會報錯。

| token | 主題 | 用途 |
|---|---|---|
| `--theme-brand` | brand | 品牌色。`--theme-primary`、`--theme-heading`、`--theme-em` 都寫成 `var(--theme-brand)`，簡報 frontmatter 加 `style: section { --theme-brand: #xxxxxx; }` 就能整份換色 |

## 對比配對表

文字 token 對底色 token，每一對一個門檻。一般文字 4.5，大字 3（WCAG 的大字是 24px 以上，或 18.66px 以上加粗，例如標題與 `.stat-num`）。只當裝飾、不承載文字的顏色（邊框、底線、圓點）不列。`npm run contrast` 讀這張表。

| 文字 | 底色 | 門檻 | 用在哪裡 |
|---|---|---|---|
| `--theme-text` | `--theme-bg` | 4.5 | 內文 |
| `--theme-text` | `--theme-surface` | 4.5 | 卡片內文 |
| `--theme-heading` | `--theme-bg` | 3 | h2、時間軸標籤（粗體大字） |
| `--theme-heading` | `--theme-surface` | 4.5 | 引言、圖說 |
| `--theme-text-soft` | `--theme-bg` | 4.5 | 頁碼、次要說明 |
| `--theme-text-soft` | `--theme-surface` | 4.5 | .stat-label |
| `--theme-text-mid` | `--theme-bg` | 4.5 | 封面副標 |
| `--theme-muted` | `--theme-bg` | 4.5 | 小字說明 |
| `--theme-muted` | `--theme-surface` | 4.5 | 卡片內小字、引言出處 |
| `--theme-muted` | `--theme-surface-sunken` | 4.5 | .shot-todo 佔位框 |
| `--theme-subtle` | `--theme-bg` | 4.5 | .small、.shot-src |
| `--theme-faint` | `--theme-bg` | 4.5 | .section-label、目錄附加序號 |
| `--theme-faint` | `--theme-surface` | 4.5 | .lst .x、.covlines 行號 |
| `--theme-primary` | `--theme-bg` | 4.5 | h3、連結 |
| `--theme-primary` | `--theme-surface` | 4.5 | 卡片內的 h3、連結 |
| `--theme-green` | `--theme-bg` | 3 | .stat-num、.lst .y（粗體大字） |
| `--theme-green` | `--theme-surface` | 3 | .gwt b.k |
| `--theme-red` | `--theme-bg` | 3 | .stat-num |
| `--theme-red` | `--theme-surface` | 3 | .gwt b.k |
| `--theme-orange` | `--theme-bg` | 3 | .stat-num |
| `--theme-orange` | `--theme-surface` | 3 | .gwt b.k |
| `--theme-purple` | `--theme-bg` | 3 | .stat-num |
| `--theme-purple` | `--theme-surface` | 3 | .gwt b.k |
| `--theme-strong` | `--theme-bg` | 4.5 | strong 粗體 |
| `--theme-em` | `--theme-bg` | 4.5 | em 強調 |
| `--theme-red-deep` | `--theme-bg` | 3 | .stat-box.red .stat-num |
| `--theme-red-deep` | `--theme-red-tint` | 3 | .pol .big span |
| `--theme-red-deep` | `--theme-placeholder-bg` | 4.5 | .ph 待填標記 |
| `--theme-orange-deep` | `--theme-bg` | 3 | .stat-box.orange .stat-num |
| `--theme-amber` | `--theme-orange-tint` | 4.5 | .term b 術語列粗體 |
| `--theme-text` | `--theme-primary-tint` | 4.5 | .conclusion、.step-pill、blockquote |
| `--theme-text` | `--theme-green-tint` | 4.5 | .tip、.done、.ladder .r0 |
| `--theme-text` | `--theme-orange-tint` | 4.5 | .warning、.term 術語列 |
| `--theme-text` | `--theme-red-tint` | 4.5 | .danger、.hbox.bad |
| `--theme-text` | `--theme-surface-sunken` | 4.5 | 佔位框內的一般文字 |
| `--theme-text` | `--theme-row-alt` | 4.5 | 表格偶數列 |
| `--theme-text` | `--theme-cmd-bg` | 4.5 | .steps .cmd |
| `--theme-text` | `--theme-opdef-bg` | 4.5 | .opdef |
| `--theme-code-text` | `--theme-code-bg` | 4.5 | code、pre |
| `--theme-on-accent` | `--theme-primary` | 4.5 | .tl-dot、.tag.b、.construct-badge |
| `--theme-on-accent` | `--theme-green` | 4.5 | .tag.g、.pyramid .bot |
| `--theme-on-accent` | `--theme-red` | 4.5 | .pyramid .top、.construct-badge-red |
| `--theme-on-accent` | `--theme-orange` | 4.5 | .timer、.tag.o、.pyramid .mid |
| `--theme-on-accent` | `--theme-purple` | 4.5 | .tag.p |
| `--theme-on-accent` | `--theme-gray` | 4.5 | .tag.k |
| `--theme-on-accent` | `--theme-red-deep` | 4.5 | .tag.r |
| `--theme-on-accent` | `--theme-heading` | 4.5 | th 表頭、table.models th |
| `--theme-on-dark` | `--theme-heading` | 3 | 附錄分隔頁標題（大字） |
| `--theme-on-dark-soft` | `--theme-heading` | 4.5 | 附錄分隔頁內文 |

## classic 例外

classic 的值不能改（改了舊稿的外觀就變了），所以下列配對未達門檻但照樣保留。`npm run contrast` 對 classic 印出數值並標「例外」，不算失敗。清單由腳本輸出整理，數值和現算不一致、或列了但已達標，腳本會報錯。其他 19 個主題沒有例外。classic 要不要另出一版改善對比，是之後的決定。

| 文字 | 底色 | 對比 | 為什麼不改 |
|---|---|---|---|
| `--theme-subtle` | `--theme-bg` | 3.22 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-faint` | `--theme-bg` | 2.37 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-faint` | `--theme-surface` | 2.56 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-primary` | `--theme-bg` | 3.98 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-primary` | `--theme-surface` | 4.30 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-green` | `--theme-bg` | 2.66 | 門檻 3；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-green` | `--theme-surface` | 2.87 | 門檻 3；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-orange` | `--theme-bg` | 2.63 | 門檻 3；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-orange` | `--theme-surface` | 2.85 | 門檻 3；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-amber` | `--theme-orange-tint` | 3.49 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-on-accent` | `--theme-primary` | 4.30 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-on-accent` | `--theme-green` | 2.87 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-on-accent` | `--theme-red` | 3.82 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-on-accent` | `--theme-orange` | 2.85 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
| `--theme-on-accent` | `--theme-gray` | 4.29 | 門檻 4.5；改了 classic 的外觀會變，逐像素不變優先 |
