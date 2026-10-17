# md-to-slides

> 以 Markdown 為單一來源，一鍵輸出 HTML、PDF、PPTX — 支援 Mermaid 圖表、自訂 CSS 注入、CJK 中文字型

![alt text](image.png)

---

## Features

| 功能                                      | v1  | v2（當前） |
| ----------------------------------------- | :-: | :--------: |
| Markdown → HTML 投影片（Marp slide deck） | ✅  |     ✅     |
| Markdown → PDF (16:9 簡報)                | ✅  |     ✅     |
| Markdown → PPTX (可編輯簡報)              | ✅  |     ✅     |
| YAML front matter 樣式萃取與注入          | ✅  |     ✅     |
| **指定任意檔案路徑轉檔**                  | ❌  |     ✅     |
| **Mermaid 圖表渲染**                      | ❌  |     ✅     |
| CJK 中文字型支援                          | ✅  |     ✅     |
| **`classic` 內建主題、`--theme-set` 自訂主題** | ❌  |     ✅     |
| **相對路徑圖片（HTML、PDF、PPTX）**       | ❌  |     ✅     |
| **`check` 匯出前版面檢查（R1–R5）**       | ❌  |     ✅     |

---

## Quick Start

```bash
# 1. 安裝依賴（含 Mermaid CLI）
npm install

# 2. 透過 npm script 快速轉檔
npm run build -- data/slides.md

# 或直接呼叫 CLI
node src/cli/build-cli.js data/slides.md

# 輸出至 output/slides.html, output/slides.pdf, output/slides.pptx
```

> **環境需求**：Node.js v18+  
> **完整架構說明**：見 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Installation

### 系統需求

| 軟體    | 版本     | 驗證指令  |
| ------- | -------- | --------- |
| Node.js | v18.0.0+ | `node -v` |
| npm     | v9.0.0+  | `npm -v`  |

### Linux / macOS 額外依賴

Marp 與 Mermaid CLI 底層皆使用 Puppeteer（headless Chromium），部分 Linux 環境需額外安裝：

```bash
# Ubuntu / Debian — CJK 字型 + Chromium 系統依賴
sudo apt-get update && sudo apt-get install -y \
  fonts-noto-cjk fonts-noto-cjk-extra \
  libnss3 libatk-bridge2.0-0 libcups2 \
  libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2

# macOS（通常內建中文字型，有問題時使用）
brew install --cask font-noto-sans-cjk
```

### 安裝套件

```bash
npm install
```

| 套件                      | 版本    | 用途                  |
| ------------------------- | ------- | --------------------- |
| `@marp-team/marp-cli`     | ^4.2.3  | Markdown → PDF / PPTX |
| `@mermaid-js/mermaid-cli` | ^10.9.1 | Mermaid 圖表 → PNG    |
| `puppeteer-core`          | ^24.40.0 | `check` 的 R1 超框量測 |

---

## Usage

### 基本指令

```bash
# 轉換指定檔案（全格式輸出）
npm run build -- <input.md> [options]

# 或直接使用 CLI
node src/cli/build-cli.js <input.md> [options]

# 範例：轉換 data/ 下的檔案
npm run build -- data/slides.md
npm run build -- data/report.md --out output/report --stem report

# 僅輸出特定格式
npm run build:html -- data/note.md
npm run build -- data/note.md --format pdf,pptx

# 清除所有建置產出
npm run clean
```

### Options

| 參數                | 說明                                  | 預設值          |
| ------------------- | ------------------------------------- | --------------- |
| `--out, -o <dir>`   | 輸出目錄                              | `output`        |
| `--stem, -s <name>` | 輸出檔名主幹                          | 取自輸入檔名    |
| `--format <list>`   | 輸出格式（逗號分隔：`html,pdf,pptx`） | `html,pdf,pptx` |
| `--theme-set <path>` | 額外的主題 CSS 檔或資料夾，可重複（內建 `classic` 一律可用） | —               |
| `--help, -h`        | 顯示說明                              | —               |

### npm scripts 捷徑

```bash
# 舊版相容：轉換 content.md（需存在於根目錄）
npm run build:all

# 帶參數的快速呼叫
npm run build -- data/slides.md
npm run build:html -- data/note.md

# 執行測試
npm test

# 重新產生主題 / 檢查主題產物是不是最新
npm run themes
npm run themes -- --check

# 匯出前檢查
npm run check -- data/slides.md

# 僅檢查正式環境依賴安全
npm run audit:prod
```

### 建置流程（v2.1）

````text
<input.md>  (例：data/slides.md)
    │
    ▼
[src/cli/build-cli.js]  ← 統一入口 (解析參數、驗證、組出 --theme-set)
    │
    ▼
[src/steps/preprocess-mermaid.js]  ← Mermaid block → PNG
    ├─ 掃描 ```mermaid 區塊
    ├─ 呼叫 mmdc 渲染為 PNG → <out>/assets/diagrams/
    └─ 輸出 <輸入檔資料夾>/.md-to-slides-<stem>-<pid>.md（已替換為圖片路徑）
    │
    ▼
.md-to-slides-<stem>-<pid>.md  （在輸入檔旁邊，相對路徑的圖片找得到）
    │
    ├─ [src/steps/render-html.js] ─────► <out>/<stem>.html
    │      ├─ 把本機圖片複製到 <out>/assets/images/ 並改寫路徑
    │      ├─ 由 Marp 輸出 slide deck HTML（帶 --theme-set）
    │      └─ 複製 assets/ 至輸出目錄
    │
    ├─ [marp CLI] ────────────────────► <out>/<stem>.pdf   （帶 --theme-set）
    └─ [marp CLI] ────────────────────► <out>/<stem>.pptx  （帶 --theme-set）
    │
    ▼
不論成功或失敗，都刪除暫存檔 ✓
````

### 主題（classic）

內建 `classic` 主題，卡片、統計數字、提示框、流程圖等元件都已經寫好，frontmatter 只要一行：

```markdown
---
marp: true
theme: classic
---
```

- 不寫 `theme:` 的簡報照 Marp 預設處理，不會套 `classic`。
- 顏色、字型、字級、圓角是 CSS 變數（`--theme-primary`、`--theme-font` 等），要換配色可以在 frontmatter 的 `style:` 覆寫，或用 `--theme-set` 加自己的主題。
- `themes/classic.css` 由 `themes/src/` 合併產生，改了 `themes/src/` 之後執行 `npm run themes`；`npm run themes -- --check` 只比對產物是不是最新。

#### 在 VS Code 預覽（Marp for VS Code）

在 `.vscode/settings.json` 加上：

```json
{
  "markdown.marp.themes": [
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@v2.1.0/themes/classic.css"
  ],
  "markdown.marp.html": "all"
}
```

`markdown.marp.themes` 也可以填工作區裡的相對路徑，例如 `themes/classic.css`。`markdown.marp.html` 設成 `all` 才會渲染簡報裡的內嵌 HTML（卡片、流程圖都是 HTML），請只對自己信任的檔案這樣設。

### 匯出前檢查（check）

```bash
npm run check -- data/slides.md
npm run check -- data/slides.md --json
```

| 規則 | 檢查什麼 | 等級 |
| ---- | -------- | ---- |
| R1 超框 | 用 Marp 產生 HTML，在瀏覽器裡量每一頁，內容元素超出投影片範圍 | error |
| R2 黏頁 | 以 `<` 開頭的 HTML 行，下一行直接接 `---`（Markdown 會把 `---` 吃掉，兩頁黏成一頁） | error |
| R3 破圖 | Markdown 圖片、`<img src>`、CSS `url()` 指到的本機檔案找不到 | 前兩種 error，CSS `url()` 是 warning |
| R4 未定義 class | `class="…"`、`<!-- _class: … -->` 用到的 class，在主題 CSS 和 frontmatter `style:` 裡都沒有 | warning |
| R5 未填佔位 | 程式碼區塊和 HTML 註解以外出現 `【…】` | warning（`--strict` 變 error） |

- 每一條發現都印出頁碼、行號、規則和說明；有 error 時 exit code 是 1，用法錯誤是 2。
- `--strict` 讓 R5 變 error，`--no-browser` 跳過 R1，`--theme-set <路徑>` 指定額外的主題。
- R1 需要瀏覽器，依序找環境變數 `CHROME_PATH`、系統上的 Chrome 或 Edge，不會另外下載。找不到時會印出「R1 沒有檢查」，這不等於通過。
- 想檢查的簡報放在可寫入的資料夾：R1 會在輸入檔旁邊產生一個暫存 HTML，量完就刪。

---

## Project Structure

```text
md-to-slides/
├── src/
│   ├── cli/
│   │   ├── build-cli.js           # 統一 CLI 入口
│   │   └── check-cli.js           # check 指令入口
│   ├── check/                     # R1–R5 檢查規則
│   └── steps/
│       ├── preprocess-mermaid.js  # Mermaid block → PNG
│       └── render-html.js         # 本機圖片複製與改寫 + HTML 渲染
│
├── themes/
│   ├── src/                       # _base.css（版型）、classic.css（token）
│   └── classic.css                # 產生的單檔主題（進版控）
│
├── scripts/
│   ├── build-themes.js            # 合併主題
│   └── run-tests.js
│
├── tests/                  # Node 內建 test runner 套件
│   ├── *.test.js
│   └── fixtures/          # 測試資料
│
├── docs/
│   ├── ARCHITECTURE.md    # 專案架構說明
│
├── data/                   # Markdown 原始內容
│
├── assets/                 # 靜態資源
│   ├── css/
│   ├── fonts/
│   └── diagrams/           # Mermaid 渲染 PNG（build artifact）
│
├── .github/workflows/
│   └── ci.yml              # GitHub Actions CI（Ubuntu、Windows × Node 18、22）
│
├── package.json
├── .gitignore
├── CHANGELOG.md            # 版本記錄
├── RELEASE.md              # 發佈指南
├── README.md               # 本檔案
├── content.example.md      # 格式範例
│
└── output/                 # 建置輸出（build artifact）
```

---

## Troubleshooting

### PDF/PPTX 中文顯示為方塊

```bash
# Ubuntu/Debian
sudo apt-get install -y fonts-noto-cjk

# macOS
brew install --cask font-noto-sans-cjk
```

### Marp CLI 或 mmdc 渲染失敗（Chromium/Puppeteer 錯誤）

```bash
# 安裝系統依賴
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libcups2 libxcomposite1 libxdamage1 libgbm1

# Docker / CI 環境
export PUPPETEER_ARGS='--no-sandbox --disable-setuid-sandbox'
```

### 輸入資料夾不能寫入
build 會在輸入檔旁邊放暫存檔 `.md-to-slides-<stem>-<pid>.md`（結束時刪除），`check` 的 R1 也會放一個暫存 HTML。唯讀資料夾請先複製到可寫入的位置再執行。萬一程式被強制中斷留下殘檔，檔名都以 `.md-to-slides-` 開頭，可以直接刪掉。

### Mermaid 圖表渲染失敗但流程繼續

`preprocess-mermaid.js` 採「失敗不中斷」策略：渲染失敗的圖表會保留原始 code block，其餘正常繼續。請查看 terminal 的 ❌ 訊息修正語法後重新執行。

### Node.js 版本過低

```bash
nvm install 18 && nvm use 18
```

---

## Roadmap

- **v1**：Markdown → HTML / PDF / PPTX，固定讀取 `content.md`
- **v2**：任意路徑輸入、Mermaid 圖表渲染、單一 data/ 資料區
- **v2.1**（當前）：`classic` 主題與 `--theme-set`、相對路徑圖片、`check` 匯出前檢查、CI 加 Windows

---

## References

- [Marp CLI](https://github.com/marp-team/marp-cli)
- [Mermaid](https://mermaid.js.org/)
- [mermaid-js/mermaid-cli](https://github.com/mermaid-js/mermaid-cli)
- [Puppeteer Troubleshooting](https://pptr.dev/troubleshooting)

---

## Architecture

- [Architecture](docs/ARCHITECTURE.md)
