# 專案架構說明 (v2.1)

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
│   └── steps/
│       ├── preprocess-mermaid.js    # 前置處理：Mermaid block → PNG
│       └── render-html.js           # 本機圖片複製與改寫、Marp 呼叫、HTML 輸出
│
├── themes/
│   ├── src/                  # _base.css（版型與元件）、classic.css（token）
│   └── classic.css           # scripts/build-themes.js 產生的單檔主題
│
├── scripts/
│   ├── build-themes.js       # 合併主題；--check 比對產物是不是最新
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
├── assets/                   # 靜態資源
│   ├── css/                 # 自訂樣式檔
│   ├── fonts/               # 中文字型
│   └── diagrams/            # Mermaid 渲染 PNG (自動生成)
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
- 生成 PNG 存儲於 `assets/diagrams/diagram-N.png`

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
