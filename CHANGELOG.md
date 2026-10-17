# 更動日誌

## [2.6.0] - 2026-10-17

### 新增
- 12 個內建主題：`campus`、`lab`、`notebook`、`chalkboard`、`pastel`、`consulting`、`civic`、`contract`、`brand`、`atelier`、`blueprint`、`terminal`，加上原本的 8 個共 20 個。版型和 class 名稱不變，每個主題都宣告全部 53 個 token，`npm run contrast` 全部達標
- `brand` 的標題、連結和強調字都讀 `--theme-brand`，frontmatter 加一行 `style: section { --theme-brand: #xxxxxx; }` 就整份換色。這個 token 登記在 `themes/TOKENS.md` 新的「主題自己加的 token」表
- 7 個場合：讀書會導讀、專案計畫書、成果報告、新創募資、產品簡報、品牌簡介、合約與報價說明，加上原本的 5 個共 12 個，場合與推薦主題的組合從 6 個變成 26 個
- 場合檔可以加選填的 `notice` 欄位，有的話填空版和範例版的第一頁都要有那段文字，產生的 `AGENTS.md` 開頭也多一段提醒。目前只有合約與報價說明用，寫明它是說明用簡報，不是法律文件
- `npm run matrix`：每個主題 build 一份含 35 個版型範例的簡報並跑 `check`，共 700 組，再檢查 26 組起手包。有 error、對比不過、有規則沒檢查或找不到瀏覽器都 exit 1。`tests/matrix.test.js` 只用一個主題測判定，完整的檢查在 CI 的 Ubuntu 工作跑
- 樣式畫廊的主題頁選 `brand` 時多一個品牌色欄位，挑了顏色預覽跟著換，對比不夠的配對會列出名稱與數值，另給一行可以複製的 `style:`

### 改動
- 原本 4 個場合多了推薦主題：論文口試加 lab、課堂報告加 campus、商業提案加 consulting、技術分享加 terminal 和 blueprint。`npm run starter -- <場合>` 會為每個推薦主題各產生一份，課堂報告從 1 份變 2 份
- 起手包帶的主題 CSS、`AGENTS.md` 的主題清單和 `.vscode/settings.json` 都變成 20 個主題，所以每份起手包的 zip 都跟 2.5.0 不同
- `npm run contrast` 會先解析 `var(--theme-…)` 再算對比，循環引用或引用沒宣告的 token 都算失敗
- 樣式畫廊有 240 份場合預覽和 240 份起手包 zip。token 表裡寫成 `var()` 的值列出解析後的顏色，色塊也用那個顏色
- 樣式畫廊打開時，場合範本頁先選商業提案（配 mono），版型頁和主題頁先選 classic。2.5.0 是清單裡的第一個
- CI 的 Ubuntu 工作多一步跑 `npm run matrix`，時限從 25 分鐘放寬到 45 分鐘。起手包 zip、畫廊的主題 CSS 與預覽的數量改成從場合和主題算，不再寫死。PDF 字型檢查多了 notebook 和 terminal
- 測試的數字更新到 20 個主題、12 個場合、26 個組合，主題清單與部分檔案數改成從資料算。`tests/starter.test.js` 開瀏覽器跑 `check` 時只測每個場合的第一個推薦主題，其他組合由 `npm run matrix` 檢查

### 不變
- `build`、`check` 的參數與輸出，原本 8 個主題的 CSS 和版型 class 都跟 2.5.0 相同

---
## [2.5.0] - 2026-10-17

### 新增
- 樣式畫廊：`npm run site` 在 `output/site/` 產生靜態網站，有場合範本、版型、主題三頁。預覽是 build 時用 marp-core 渲染好的投影片，主題 CSS 每個主題一份。場合範本頁可以下載 5 個場合配 8 個主題共 40 份起手包 zip，版型頁可以複製 35 個版型的骨架，主題頁列出 53 個 token 的值，另給一段 VS Code 設定，主題網址用 jsDelivr，版本固定在產生網站時的 commit
- `.github/workflows/pages.yml` 把樣式畫廊部署到 GitHub Pages，只能手動執行
- CI 的 Ubuntu 工作多一步，產生樣式畫廊並核對頁面、主題 CSS、場合預覽和 zip 的數量
- `tests/site.test.js` 檢查產生的檔案、zip 跟 `npm run starter` 的產出逐位元相同，並用瀏覽器實際打開三頁，測切換、下載、複製、375px 寬的畫面，以及淺色和深色的文字對比

### 改動
- `src/starter/index.js` 抽出 `starterZip()`，只產生 zip 的內容、不寫資料夾，給樣式畫廊用。它和 `npm run starter -- --zip` 共用產生檔案與打包的函式（`starterFiles()`、`zipFiles()`），場合檔與主題相同時，產生的 zip 跟 2.4.0 逐位元相同。論文口試範例這版有改，它的 zip 會跟 2.4.0 不同
- devDependencies 加上 `@marp-team/marp-core` ^4.3.0。它原本就由 marp-cli 帶進來，安裝的版本沒變
- 論文口試範例把取還便利性改成控制變數，RQ1 只問車況品質，研究問題跟假說對得上
- README 的 Claude Code 段落改寫讀不到 `AGENTS.md` 的說明

### 不變
- `build`、`check`、`starter` 的參數，`build`、`check` 的輸出，8 個主題和版型 class 都跟 2.4.0 相同

---
## [2.4.0] - 2026-10-17

### 新增
- 填空範本起手包：`npm run starter` 產生 5 個場合（論文口試、課堂報告、工作坊、商業提案、技術分享）與推薦主題的 6 個組合，輸出到 `output/starters/`，加 `--zip` 另外打包。每份有 `slides.md`（要填的範本）、`example.md`（填好虛構內容的樣子）、`prompts.md`（六段 prompt）、`AGENTS.md`、`.github/copilot-instructions.md`、`CLAUDE.md`、`.vscode/settings.json` 和 8 個主題的 CSS
- `AGENTS.md` 與 `.github/copilot-instructions.md` 由 `starter/rules.md` 產生，兩檔逐位元相同，版型清單從 `catalog/` 填入。`CLAUDE.md` 只用 `@AGENTS.md` 匯入同一份規則，讓沒有直接讀 `AGENTS.md` 的 Claude Code 工作階段也讀得到（在一台 Windows 電腦上用 v2.1.302 測試時遇過，原因還沒確認，見 README）
- 場合範本 `scenarios/<id>.md`，每個有填空版與範例版。`npm run scenarios` 檢查版型 id、主題、頁數、class 和佔位格式，有問題 exit 1 並指出檔案
- zip 不加依賴，用 Node 內建的 zlib 寫，同樣的內容每次產生的 zip 逐位元相同
- CI 的 Ubuntu 工作多一步，產生 6 份起手包 zip 並用 `unzip -t` 檢查

### 改動
- 佔位的正式格式改成 `【填：…】`。R5 只把 `【填：…】` 當 warning（`--strict` 變 error），其他的 `【…】` 降成 info，舊格式佔位和內文本來就有的括號不再讓 `--strict` 失敗
- 版型目錄骨架的 275 處佔位改成新格式，第一個全形冒號換成逗號，例如 `【標題：A】` 變成 `【填：標題，A】`。`examples/showcase.md` 取自範例，沒有變動

### 不變
- `build` 的參數與輸出、8 個主題、版型 class 都和 2.3.0 相同

---
## [2.3.0] - 2026-10-17

### 新增
- 7 個內建主題：`scholar`、`classroom`、`mono`、`boardroom`、`pitch`、`editorial`、`midnight`，加上原本的 `classic` 共 8 個。frontmatter 寫 `theme: <名稱>` 就能換，版型和 class 名稱完全不變，只換外觀
- 主題 token 從 classic 的一小組擴成 53 個 `--theme-*`：字型（內文、標題、等寬、等寬標籤）、字級、圓角、兩種內距、全部顏色、陰影和裝飾圖。清單與用途見 `themes/TOKENS.md`
- `npm run contrast`：對每個主題的 49 組前景與背景配對算 WCAG 對比，一般文字要 4.5、大字要 3。未達標 exit 1 並指出是哪一組。classic 有 15 組沿用舊色的例外，登記在 `themes/TOKENS.md`，腳本會核對例外的數值有沒有變
- `npm run thumbnails`：用 Chrome 把每個主題的 showcase 逐頁截圖，輸出 `output/thumbnails/<id>.png` 和 8 個主題各 6 頁的 `all.png`。要有 Chrome 或 Edge，沒有就說明原因並 exit 1
- `npm run themes -- --check` 多檢查一項：每個主題都要宣告 `themes/TOKENS.md` 表格列出的全部 token，缺的會列出名稱

### 改動
- `themes/src/_base.css` 的顏色、陰影、內距、等寬字型和裝飾圖全部改成 `var(--theme-*)`，只剩 `.term` 終端機視窗那 8 行維持固定值。標題另外多一條 `font-family: var(--theme-font-heading)`
- classic 的每個 token 值都等於原本寫死的值。用 39 張截圖（showcase 36 頁、legacy-col 1 頁、theme-classic 2 頁）逐位元比對，2.3.0 與 2.2.0 完全相同
- `tests/fixtures/baseline/legacy-col.html` 重新產生，因為它內嵌 classic.css。`legacy-compat` 的斷言沒有改，只改了測試標題與失敗訊息
- CI 的 Ubuntu 工作多裝 `fonts-noto-cjk`，用 scholar、classroom、midnight 各建一份 PDF，再用 `pdffonts` 確認有嵌入 Noto 字型，沒有就失敗

### 不變
- 沒寫 `theme:` 的簡報照舊不套任何主題。命令列參數、輸出路徑、class 名稱都和 2.2.0 相同。

### 已知限制
- classic 的 `--theme-font` 維持原本的 `'Helvetica Neue', '微軟正黑體', sans-serif`，沒有加 Noto 備援字型。加了之後在裝有 Noto Sans TC 的機器上，showcase 第 26 頁的減號（U+2212）會換字型，逐位元比對就不再相同。7 個新主題都有完整的中文備援清單。

---
## [2.2.0] - 2026-10-17

### 新增
- 版型目錄 `catalog/`：35 個版型，分成 structure（5）、core（18）、academic（5）、teaching（7）四包。每個版型一個檔案，有名稱、用途、適用情境、用到的 class、可複製的骨架和一個虛構內容的完整範例。`catalog/_utilities.md` 列出不屬於任何版型的工具 class 和元件，`themes/src/_base.css` 的 153 個 class 全部有歸屬
- `npm run catalog`：驗證目錄，檢查欄位、id、骨架與 classes 是否一致、class 是否都在 `_base.css` 定義，以及目錄和 `_base.css` 的 class 集合是否完全相同；有問題 exit 1 並指出檔案
- `npm run showcase`：從目錄產生 `examples/showcase.md`（36 頁，每個版型一頁）；加 `--check` 只比對產物是不是最新
- `check` 新增 info 等級的提醒，不影響 exit code，連 `--strict` 也一樣
- 新的開發依賴 `js-yaml`（固定 ^4.1.1），只用來讀版型檔案的 frontmatter

### 改動
- R4 判斷內建主題的 class 時改以版型目錄為準。用到舊名 `col` 出 info，建議改成 `column`；拼錯的 class 仍是 warning，並附上目錄裡相近的 class 與中文名。第三方主題照舊解析自己的 CSS
- `check` 的摘要行只有在 info 大於 0 時才多印「N 個 info」，沒有 info 時輸出和 2.1 相同

### 不變
- 舊簡報的輸出和 2.1.0 逐字相同，`col` 和 `column` 都繼續可用。`themes/` 沒有任何改動

---
## [2.1.0] - 2026-10-17

### 新增
- `classic` 主題：版型結構與元件 class（卡片、統計數字、提示框、流程圖等）加上顏色、字型、字級、圓角的 token，簡報 frontmatter 寫 `theme: classic` 就能用，不必再把整份 CSS 貼進每份簡報。產生的 `themes/classic.css` 是單一檔案，VS Code 和 jsDelivr 可以直接引用
- `npm run themes`：把 `themes/src/_base.css` 和各主題的 token 合併成 `themes/<name>.css`；加 `--check` 只比對產物是不是最新
- `--theme-set <路徑>`（可重複）：HTML、PDF、PPTX 三條輸出路徑都會帶上內建主題，再加上你指定的主題檔或資料夾
- `npm run check -- <檔案>`：匯出前檢查 R1 超框、R2 黏頁、R3 破圖、R4 未定義 class、R5 未填佔位；逐條印出頁碼、行號、規則和說明，有 error 時 exit code 是 1；`--json` 輸出機器可讀的格式，`--strict` 讓 R5 變 error，`--no-browser` 跳過 R1
- R1 用 `puppeteer-core` 量每一頁；找不到瀏覽器（`CHROME_PATH`、Chrome、Edge）時印出「R1 沒有檢查」，不會當成通過
- 輸出 HTML 時，把 Markdown 圖片和 `<img src>` 指到的本機圖片複製到 `<out>/assets/images/` 並改寫路徑
- CI 加上 Windows（windows-latest）

### 改動
- 暫存的 Markdown 改放在輸入檔旁邊，檔名 `.md-to-slides-<stem>-<pid>.md`，不論成功或失敗都會刪掉。相對路徑的圖片在 PDF、PPTX 裡因此找得到；同時 build 兩份簡報也不會互相覆蓋。輸入資料夾必須可以寫入
- Mermaid 圖仍輸出到 `<out>/assets/diagrams/`，暫存檔改用相對於輸入檔資料夾的路徑引用
- 呼叫 Marp 改成直接用 node 執行套件裡的 marp-cli，不經 shell，路徑含空白或中文也不會被拆開（找不到本機的 marp-cli 時才退回 `npx`）
- 沒有 `theme:` 的簡報不套任何自訂主題，輸出跟 2.0 一致

### 移除
- `render-html.js` 裡沒用到的 `extractCustomStyles`

---

## [2.0.0] - 2026-04-06

### 新增
- 任意路徑輸入：可指定 `data/` 或任何路徑下的 markdown 檔案進行轉檔
- Mermaid 圖表支援：```mermaid 區塊在 HTML/PDF/PPTX 三種格式中自動渲染
- 單一 data/ 資料區：所有 Markdown 原始檔集中管理，簡化文件結構
- 專案化架構：src/ 分層模組，便於維護和測試

### 改動
- 重構三個核心腳本為分層模組（CLI、步驟、工具函式）
- 保留根目錄腳本作為相容入口，既有命令無需改變

### 安全
- 完整 npm audit 達到 0 vulnerabilities（透過 overrides 修補 transitive 依賴）

---

## [1.0.0] - 早期版本

- 固定讀取 content.md
- 支援 HTML / PDF / PPTX 輸出
- 支援 CJK 字體與自訂 CSS 注入
