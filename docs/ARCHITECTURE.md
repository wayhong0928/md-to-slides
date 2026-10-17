# 專案架構說明 (v2.4)

## 目錄結構

```
md-to-slides/
├── src/                      # 核心模組（生產程式碼）
│   ├── cli/
│   │   ├── build-cli.js      # CLI 入口 - 參數解析 + 建置流程編排
│   │   └── check-cli.js      # check 指令入口
│   ├── check/
│   │   ├── index.js                 # checkFile、splitSlides
│   │   └── rules/                   # R1–R5，每條規則一個檔案
│   ├── catalog/
│   │   └── index.js                 # 讀取版型目錄（loadCatalog 等），check 與腳本共用
│   ├── scenarios/
│   │   └── index.js                 # 讀取場合範本（loadScenarios、splitPages）
│   ├── starter/
│   │   ├── index.js                 # 組出起手包的檔案清單、寫資料夾
│   │   └── zip.js                   # 不加依賴的 zip 寫入（deflate＋CRC32）
│   └── steps/
│       ├── preprocess-mermaid.js    # 前置處理：Mermaid block → PNG
│       └── render-html.js           # 本機圖片複製與改寫、Marp 呼叫、HTML 輸出
│
├── themes/
│   ├── src/                  # _base.css（版型與元件，只用 var(--theme-*)）、<主題>.css（token）×8
│   ├── <主題>.css            # scripts/build-themes.js 產生的單檔主題 ×8
│   └── TOKENS.md             # 53 個 token、49 組對比配對、classic 例外表
│
├── catalog/                  # 版型目錄：<包名>/<id>.md ×35＋_utilities.md
├── scenarios/                # 場合範本：<id>.md ×5
├── starter/                  # 起手包規則來源 rules.md、prompts.md
├── examples/
│   └── showcase.md           # 由 scripts/build-showcase.js 產生，每個版型一頁
│
├── scripts/
│   ├── build-themes.js       # 合併主題；--check 比對產物是不是最新
│   ├── validate-catalog.js   # 驗證版型目錄
│   ├── build-showcase.js     # 產生 examples/showcase.md；--check 比對是不是最新
│   ├── check-contrast.js     # 每個主題的 WCAG 對比檢查；--tokens 指定另一份 TOKENS.md
│   ├── build-thumbnails.js   # 8 個主題的縮圖總表（puppeteer-core，要 Chrome 或 Edge）
│   ├── validate-scenarios.js # 驗證場合範本
│   ├── build-starter.js      # 產生起手包資料夾與 zip
│   └── run-tests.js
│
├── tests/                    # 測試套件
│   ├── build-cli.test.js            # CLI 參數解析單元測試
│   ├── preprocess-mermaid.test.js   # Mermaid 前處理單元測試
│   ├── integration.test.js          # 整合測試 (PDF/HTML 完整流程)
│   ├── smoke-html-build.test.js     # HTML 煙霧測試
│   └── fixtures/                    # 測試資料
│       ├── no-mermaid.md
│       ├── one-mermaid.md
│       ├── duplicate-mermaid-blocks.md
│       └── invalid-mermaid.md
│
├── docs/                     # 文件
│   ├── ARCHITECTURE.md      # 本文件 - 專案結構說明
│
├── data/                     # Markdown 資料目錄
│
├── output/                   # 建置產物（自動生成）
├── .github/workflows/        # CI/CD 流程
│   └── ci.yml               # GitHub Actions 工作流程
│
├── package.json             # 依賴定義 + npm scripts
├── package-lock.json        # 依賴鎖定檔
├── .gitignore               # Git 忽略清單
├── CHANGELOG.md             # 版本歷史 (維護者指南)
├── RELEASE.md               # 發布指南 (維護者指南)
└── README.md                # 主入口文件
```

---

## 建置流程 (v2.1)

### 單檔轉檔流程

````
<任意 input.md>  (例：data/report.md)
         │
         ▼
[src/cli/build-cli.js]  ← 統一入口
    ├─ 解析 --out / --stem / --format / --theme-set 參數
    ├─ 驗證輸入檔案與格式
    ├─ 組出 --theme-set：themes/*.css（內建）＋使用者指定的路徑
    └─ 調度 preprocess-mermaid.js 與轉檔工具；結束時（成功或失敗）刪除暫存檔
         │
         ▼
[src/steps/preprocess-mermaid.js]
    ├─ extractMermaidBlocks()  ← 掃描 ```mermaid 區塊
    ├─ renderDiagram()         ← mmdc (Mermaid CLI) 轉 PNG
    ├─ replaceMermaidBlocksWithImages()  ← 替換為 ![image](path)，路徑相對於暫存檔所在資料夾
    └─ 輸出：<輸入檔資料夾>/.md-to-slides-<stem>-<pid>.md + <out>/assets/diagrams/*.png
         │
         ▼
<輸入檔資料夾>/.md-to-slides-<stem>-<pid>.md
    │
    ├─→ [marp-cli --theme-set] ──→ <out>/report.pdf    (PDF 簡報)
    ├─→ [marp-cli --theme-set] ──→ <out>/report.pptx   (PPTX 簡報)
    │
    └─→ [src/steps/render-html.js]
         ├─ rewriteLocalImages()      ← 本機圖片複製到 <out>/assets/images/ 並改寫路徑
         ├─ Marp CLI --theme-set      ← 轉換 Markdown → HTML
         └─ 複製 assets/ 目錄
            │
            ▼
            <out>/report.html (靜態 HTML 網頁)

刪除暫存檔 ✓
````

暫存檔放在輸入檔旁邊，是為了讓 PDF、PPTX 裡的相對路徑圖片和內嵌 HTML 解析得到；檔名帶 pid，同時 build 不會互相覆蓋。

### check 流程

````
<input.md>
    │
    ▼
[src/cli/check-cli.js] → [src/check/index.js] checkFile()
    ├─ parseDocument()      ← 切頁、標出程式碼區塊／HTML 註解／frontmatter
    ├─ R2 黏頁、R3 破圖、R4 未定義 class、R5 未填佔位   （純文字，不需要瀏覽器）
    └─ R1 超框              ← Marp 輸出 HTML（暫存在輸入檔旁邊），puppeteer-core 量每頁
    │
    ▼
findings（頁碼、行號、規則、等級、說明）＋ skipped（沒檢查的規則與原因）
````

### 版型目錄

版型目錄是版型的單一來源。`catalog/<包名>/<id>.md` 每檔一個版型，包名是 structure、core、academic、teaching 其中之一。檔案由 YAML frontmatter 加兩個區塊組成。

- frontmatter 欄位：`id`（英文 kebab-case，要跟檔名一致）、`name_zh`、`name_en`、`pack`（要跟所在資料夾一致）、`purpose`、`scenes`、`classes`、`aliases`（舊名對新名，沒有就寫 `{}`）。
- 「## 骨架」：一頁的可複製內容，包在程式碼區塊裡；骨架本身含程式碼區塊時，外層改用四個反引號。骨架用到的 class 必須跟 `classes` 完全相同。
- 「## 範例」：一頁填好虛構內容的完整例子，用到的 class 必須是 `classes` 的子集。骨架和範例都不能有 `---` 分頁線。
- `catalog/_utilities.md` 有「工具 class」和「未歸版型的元件」兩段，每個項目用反引號標出 class 名稱。

`npm run catalog`（`scripts/validate-catalog.js`）逐檔檢查上面的規則，並確認「所有版型的 classes＋_utilities.md 兩段＋別名舊名」的集合，跟 `themes/src/_base.css` 解析出來的 class 集合完全相同。任何一邊多或少都 exit 1，並指出是哪個檔案的哪個問題。`src/catalog/index.js` 的 `loadCatalog()` 在目錄存在時不丟例外，檔案層級的問題收在回傳的 `problems`；目錄不存在會丟 `ENOENT`，R4 接住後退回解析主題 CSS。

`npm run showcase`（`scripts/build-showcase.js`）把每個版型的範例依包別、檔名排序接成 `examples/showcase.md`，頁與頁之間 `---` 前後各留一個空行，避免 R2 黏頁。

### 主題與 token

`themes/src/_base.css` 只寫結構，所有顏色、陰影、內距、字型和裝飾圖都讀 `var(--theme-*)`。唯一保留固定值的是 `.term` 終端機視窗（8 行），它刻意不跟著主題換色。每個 `themes/src/<主題>.css` 在一個 `section { }` 區塊宣告全部 53 個 token，`scripts/build-themes.js` 把基底和 token 合併成 `themes/<主題>.css` 並加上 `@theme` 標記。

- `npm run themes -- --check` 除了比對產物是不是最新，也讀 `themes/TOKENS.md` 的 token 表，主題少宣告就 exit 1。`_base.css` 新增 token 時要同時登記到 TOKENS.md，否則這項檢查抓不到，訊息格式是「X.css 缺少 N 個 token：…」。
- `npm run contrast`（`scripts/check-contrast.js`）依 `themes/TOKENS.md` 的 49 組配對算 WCAG 對比，一般文字門檻 4.5、大字 3。classic 沿用舊色，有 15 組低於門檻，登記在 TOKENS.md 的例外表；腳本會用現在的算值核對例外表，數值對不上也算失敗。
- classic 的每個 token 值等於 2.2.0 寫死的值。`legacy-compat` 的基準 `legacy-col.html` 內嵌 classic.css，改了 classic.css 就要重產。
- 標題字型單獨用 `--theme-font-heading`，等寬字型分內文（`--theme-font-mono`）和標籤（`--theme-font-mono-label`）兩個。
- CI 的 Ubuntu 工作裝 `fonts-noto-cjk`，建 scholar、classroom、midnight 的 PDF，用 `pdffonts` 確認有嵌入 Noto 字型。

### R4 與版型目錄

R4 判斷 class 有沒有定義時分兩種主題。內建主題（repo 的 `themes/`）以版型目錄為準，已定義的 class 是所有版型的 `classes`、`_utilities.md` 兩段和別名舊名，加上 Marp 的 `lead`、`invert` 與 frontmatter `style:`。第三方主題（`--theme-set` 或輸入檔旁的 CSS）照舊解析 CSS，不給建議。

- 用到別名舊名（目前只有 `col`，新名 `column`）是 info，只提醒改名，不影響 exit code，輸出照舊。
- 找不到的 class 仍是 warning，內建主題會再附最多 3 個編輯距離 2 以內的目錄 class 和中文名；距離必須小於兩個名稱中較短的長度，舊名不當建議。一個 class 屬於多個版型時，中文名先取包別在前的版型（structure、core、academic、teaching），同包再取 `classes` 最少的，都一樣照目錄順序，例如 `column` 對到雙欄對照、`hflow` 對到橫向流程。
- 目錄讀不到或有問題時，R4 退回解析主題 CSS，check 不會因此失敗。
- 輸出依頁碼、行號、規則代號排序，同一條規則再依 error、warning、info；`check-cli.js` 只有 info 大於 0 才在摘要加「N 個 info」。

### R5 的兩級佔位

佔位的正式格式是 `【填：…】`，`【填：` 後面寫這一格要填什麼。R5 對程式碼區塊和 HTML 註解以外的 `【…】` 分兩級。以 `【填：` 開頭的是 warning，加 `--strict` 變 error；其他的 `【…】` 可能是 2.3.0 以前的舊格式佔位，也可能是內文本來就有的括號（例如書名、資料來源），一律是 info。版型目錄的骨架在 2.4.0 全部改成新格式（275 處，第一個全形冒號換成逗號，例如 `【標題：A】` 變成 `【填：標題，A】`）。

### 場合範本與起手包

`scenarios/<id>.md` 一個檔案是一個場合。frontmatter 有 `id`、`name_zh`、`themes`（推薦主題）、`sections`（每段的標題、頁數、用到的版型 id），內文有「## 填空版」「## 範例版」兩段，各是一份用 `---` 分頁的完整簡報，不含 frontmatter。`src/scenarios/index.js` 的 `splitPages()` 切頁時略過程式碼區塊裡的 `---`。

`npm run scenarios`（`scripts/validate-scenarios.js`）逐檔檢查：欄位齊全、id 是 kebab-case 且等於檔名、主題的 CSS 存在、`sections` 的版型都在目錄裡、兩段的頁數都等於 `slides` 加總、兩段用到的 class 都屬於列出的版型或工具 class、填空版至少有一個佔位而且全部是 `【填：…】`、範例版沒有 `【`。

`src/starter/index.js` 把一個場合和一個主題組成起手包。`slides.md`、`example.md` 是填空版、範例版前面加上 `marp: true`、`theme:`、`paginate: true` 的 frontmatter；`AGENTS.md` 與 `.github/copilot-instructions.md` 都由 `starter/rules.md` 產生，`{{THEMES}}`、`{{LAYOUTS}}` 換成主題清單與目錄的版型表，兩檔逐位元相同；`CLAUDE.md` 只有標題、一句說明和 `@AGENTS.md`，給沒有直接讀 `AGENTS.md` 的 Claude Code 工作階段（在一台 Windows 電腦上用 v2.1.302 測試時遇過，原因還沒確認）；`.vscode/settings.json` 用相對路徑列出 8 個主題並設 `markdown.marp.html: "all"`。範本讀進來時一律把 CRLF 轉成 LF。產生資料夾時只覆寫起手包自己的檔案，不清空資料夾。zip 用 `zlib.deflateRawSync` 加自己算的 CRC32，時間戳固定，同樣的內容每次產生的 zip 逐位元相同。CI 的 Ubuntu 工作會產生 6 份 zip 並用 `unzip -t` 檢查。

---

## 核心模組說明

### src/cli/build-cli.js

**職責**：CLI 參數解析 + 建置流程編排

```javascript
// 匯出函式
parseArgs(args); // 解析 --out, --stem, --format 等參數
validateFormats(formats); // 驗證格式合法性
main(cliOptions); // 主要建置邏輯
```

**使用方式**：

```bash
node src/cli/build-cli.js data/slides.md --out myoutput --format pdf
npm run build -- data/report.md --format html,pdf
```

### src/steps/preprocess-mermaid.js

**職責**：Mermaid block 前處理 (block → PNG)

````javascript
// 關鍵函式
extractMermaidBlocks(content); // 掃描 ```mermaid 區塊
renderDiagram(options); // 呼叫 mmdc 轉圖
replaceMermaidBlocksWithImages(content, imagePaths); // 替換區塊
preprocessMermaid(options); // 主導出函式
````

**特色**：

- 支援多個 Mermaid 區塊的正確順序替換（避免全域副作用）
- 若渲染失敗，保留原始區塊作為降級方案
- 生成的 PNG 存到 `<out>/assets/diagrams/`

### src/steps/render-html.js

**職責**：Markdown → HTML，含本機圖片處理

```javascript
// 關鍵函式
rewriteLocalImages(content, options); // 複製本機圖片並改寫路徑
runMarp(args); // 用 node 直接執行 marp-cli（不經 shell）
themeSetArgs(themeSets); // 組出 --theme-set 參數
renderHtml(options); // 主要 HTML 渲染邏輯
```

**流程**：

1. 把 Markdown 圖片和 `<img src>` 指到的本機圖片複製到 `<out>/assets/images/`，改寫路徑（遠端網址、data URI、找不到的檔案不動）
2. 呼叫 Marp CLI 轉換 Markdown → HTML（帶 `--theme-set`）
3. 複製 `assets/` 目錄至輸出位置

---

## 測試架構

### 測試分類

| 檔案                       | 類型 | 覆蓋                       | 輸出格式              |
| -------------------------- | ---- | -------------------------- | --------------------- |
| build-cli.test.js          | 單元 | parseArgs, validateFormats | —                     |
| preprocess-mermaid.test.js | 單元 | 提取/替換 Mermaid 區塊     | —                     |
| integration.test.js        | 整合 | 完整 PDF/HTML 流程         | 🗂️ output/            |
| smoke-html-build.test.js   | 煙霧 | HTML 建置驗證              | 🗂️ output/test-smoke/ |
| themes.test.js             | 單元 | 主題產生與 `--check`       | —                     |
| theme-set.test.js          | 整合 | `--theme-set`、三種格式    | 暫存資料夾            |
| temp-file.test.js          | 整合 | 暫存檔位置、並行、失敗清理 | 暫存資料夾            |
| relative-image.test.js     | 整合 | 本機圖片、PDF/PPTX 找得到圖 | 暫存資料夾            |
| legacy-compat.test.js      | 整合 | 舊稿輸出與 2.0 基準一致    | 暫存資料夾            |
| check.test.js              | 單元 | splitSlides、R2–R5         | —                     |
| check-cli.test.js          | 整合 | `check` 指令、R1、exit code | —                     |
| scenarios.test.js          | 單元 | 場合範本驗證擋得下的錯誤   | 暫存資料夾            |
| starter.test.js            | 整合 | 6 個起手包的內容、build、check、zip | 暫存資料夾    |

### 執行方式

```bash
# 運行所有測試
npm test

# 檢查測試產物
ls -la output/
```

### Fixtures（測試資料）

- `no-mermaid.md`：純文字，無 Mermaid 區塊
- `one-mermaid.md`：單一 Mermaid 區塊
- `duplicate-mermaid-blocks.md`：多個 Mermaid 區塊（測試順序正確性）
- `invalid-mermaid.md`：不合法 Mermaid 語法（測試錯誤處理）
- `theme-classic.md`、`legacy-inline-style.md`、`relative-image/`、`check-bad.md`、`check-good.md`：主題、舊稿相容、相對路徑圖片、check 的測試資料（內容都是虛構的）
- `baseline/legacy-inline-style.html`：2.0 對 `legacy-inline-style.md` 的輸出，舊稿相容測試拿它比對；Marp 升級後輸出變動時需要重新產生

---

## npm Scripts

| 指令                   | 用途                                     |
| ---------------------- | ---------------------------------------- |
| `npm run build`        | 直接叫用 CLI（需提供檔案路徑）           |
| `npm run build:html`   | 僅輸出 HTML                              |
| `npm run build:pdf`    | 僅輸出 PDF                               |
| `npm run build:pptx`   | 僅輸出 PPTX                              |
| `npm run build:all`    | 轉檔 content.md 到三種格式               |
| `npm run build:sample` | 快速預覽 content.example.md              |
| `npm test`             | 執行所有測試                             |
| `npm run themes`       | 合併 themes/src/ 產生 themes/<name>.css；加 `-- --check` 只比對 |
| `npm run check`        | 匯出前檢查 R1–R5（`-- <檔案>`）          |
| `npm run catalog`      | 驗證版型目錄                             |
| `npm run showcase`     | 產生 examples/showcase.md；加 `-- --check` 只比對 |
| `npm run contrast`     | 檢查 8 個主題的文字對比                  |
| `npm run scenarios`    | 驗證場合範本                             |
| `npm run starter`      | 產生起手包到 output/starters/；加 `-- --zip` 另外打包 |
| `npm run thumbnails`   | 產生 output/thumbnails/（要 Chrome 或 Edge） |
| `npm run clean`        | 清除 output/, assets/diagrams/, 臨時檔等 |
| `npm run audit`        | 完整依賴檢查（含 dev）                   |
| `npm run audit:prod`   | 正式環境依賴檢查                         |

---

## 安全性設定

### npm Overrides (package.json)

v2.0 通過 `overrides` 固定特定依賴版本，確保 0 vulnerabilities：

```json
{
  "overrides": {
    "@mermaid-js/mermaid-cli": {
      "puppeteer": {
        "tar-fs": "2.1.4",
        "ws": "8.17.1"
      }
    }
  }
}
```

**驗證方式**：

```bash
npm run audit:prod
# 預期輸出：found 0 vulnerabilities
```

---

## 環境需求

| 軟體    | 版本    | 驗證      |
| ------- | ------- | --------- |
| Node.js | ≥18.0.0 | `node -v` |
| npm     | ≥9.0.0  | `npm -v`  |

### 中文字型支援

- **macOS**：通常內建
- **Windows**：通常內建
- **Linux (Ubuntu/Debian)**：

```bash
sudo apt-get install fonts-noto-cjk fonts-noto-cjk-extra
```

---

## 相關文件

- [README.md](../README.md) — 使用者指南
- [.github/workflows/ci.yml](../.github/workflows/ci.yml) — CI/CD 工作流
