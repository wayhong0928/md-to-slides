# 更動日誌

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
