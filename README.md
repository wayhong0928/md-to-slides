# md-to-slides

> 以 Markdown 為單一來源，一鍵輸出 HTML、PDF、PPTX — 支援 Mermaid 圖表、內建與自訂主題、CJK 中文字型

![alt text](image.png)

---

## Features

| 功能                                      | v1  | v2.4（當前） |
| ----------------------------------------- | :-: | :--------: |
| Markdown → HTML 投影片（Marp slide deck） | ✅  |     ✅     |
| Markdown → PDF (16:9 簡報)                | ✅  |     ✅     |
| Markdown → PPTX (可編輯簡報)              | ✅  |     ✅     |
| YAML front matter 的 `style:` 樣式       | ✅  |     ✅     |
| **指定任意檔案路徑轉檔**                  | ❌  |     ✅     |
| **Mermaid 圖表渲染**                      | ❌  |     ✅     |
| CJK 中文字型支援                          | ✅  |     ✅     |
| **內建 8 個主題、`--theme-set` 自訂主題** | ❌  |     ✅     |
| **相對路徑圖片（HTML、PDF、PPTX）**       | ❌  |     ✅     |
| **`check` 匯出前版面檢查（R1–R5）**       | ❌  |     ✅     |
| **填空範本起手包（5 個場合）**            | ❌  |     ✅     |

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
| `--theme-set <path>` | 額外的主題 CSS 檔或資料夾，可重複（內建 8 個主題一律可用） | —               |
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

# 檢查 8 個主題的文字對比 / 產生縮圖總表（要 Chrome 或 Edge）
npm run contrast
npm run thumbnails

# 匯出前檢查
npm run check -- data/slides.md

# 驗證場合範本 / 產生填空範本起手包
npm run scenarios
npm run starter

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

### 主題

內建 8 個主題，卡片、統計數字、提示框、流程圖等元件都已經寫好，frontmatter 只要一行：

```markdown
---
marp: true
theme: scholar
---
```

| 主題 | 底色 | 特色 | 適合場合 |
| ---- | ---- | ---- | ---- |
| `classic` | 淺灰白 | 原本的預設外觀，2.3.0 輸出的 39 張截圖與 2.2.0 逐位元相同 | 沿用舊簡報 |
| `scholar` | 米色 | 襯線標題 | 論文口試、研討會 |
| `classroom` | 淡黃 | 字大、圓角大 | 上課、教學 |
| `mono` | 白 | 圓角為 0，陰影改成細框線，無裝飾圖 | 要列印或黑白輸出 |
| `boardroom` | 深藍 | 深色底搭金色 | 對主管或客戶報告 |
| `pitch` | 淡紫白 | 紫色強調 | 提案、比賽 |
| `editorial` | 暖米色 | 襯線標題，磚紅強調 | 讀書會、分享會 |
| `midnight` | 近黑 | 深色底搭青綠色 | 技術分享、暗室投影 |

字型照下面的順序找，找到第一個裝了的就用：

| 平台 | 內文 | 襯線標題（scholar、editorial） |
| ---- | ---- | ---- |
| Windows | 微軟正黑體 | Georgia（英數）、新細明體（中文） |
| macOS | 蘋方（PingFang TC） | Georgia（英數）、宋體（Songti TC） |
| Linux | Noto Sans CJK TC（要先裝 `fonts-noto-cjk`） | Noto Serif CJK TC |

macOS 那一列是照字型清單推的，沒有在 Mac 上實測。classic 的字型清單是 `'Helvetica Neue', '微軟正黑體', sans-serif`，沒有 Noto 備援，在 Linux 上中文用哪個字型由系統的 sans-serif 設定決定。

換主題只換外觀，版型與 class 名稱都不變，同一份 Markdown 可以直接換 `theme:` 重新輸出。`npm run thumbnails` 會把 8 個主題的前幾頁排成 `output/thumbnails/all.png` 對照。

- 不寫 `theme:` 的簡報照 Marp 預設處理，不會套任何內建主題。
- 顏色、字型、字級、圓角是 CSS 變數（`--theme-primary`、`--theme-font` 等，共 53 個，說明在 [themes/TOKENS.md](themes/TOKENS.md)），要換配色可以在 frontmatter 的 `style:` 覆寫，或用 `--theme-set` 加自己的主題。
- `themes/<主題>.css` 由 `themes/src/` 合併產生，改了 `themes/src/` 之後執行 `npm run themes`；`npm run themes -- --check` 比對產物是不是最新，也會檢查每個主題的 token 有沒有宣告齊全。
- `npm run contrast` 對每個主題的 49 組前景與背景配對算對比，一般文字要 4.5、大字要 3。classic 有 15 組沿用舊色的例外，登記在 `themes/TOKENS.md`。

#### 在 VS Code 預覽（Marp for VS Code）

在 `.vscode/settings.json` 加上：

```json
{
  "markdown.marp.themes": [
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/classic.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/scholar.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/classroom.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/mono.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/boardroom.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/pitch.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/editorial.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/midnight.css"
  ],
  "markdown.marp.html": "all"
}
```

陣列裡列了 8 個主題，簡報的 `theme:` 寫哪個就用哪個；只用其中幾個的話，刪掉不需要的網址即可。

`@main` 會跟著最新版更新，想固定版本可以把 `@main` 換成某個 commit 的雜湊值。`markdown.marp.themes` 也可以填工作區裡的相對路徑，例如 `themes/classic.css`。`markdown.marp.html` 設成 `all` 才會渲染簡報裡的內嵌 HTML（卡片、流程圖都是 HTML），請只對自己信任的檔案這樣設。

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
| R4 未定義 class | `class="…"`、`<!-- _class: … -->` 用到的 class，在主題和 frontmatter `style:` 裡都沒有。內建主題以版型目錄為準，會附上相近的 class；用到舊名 `col` 只提醒改成 `column` | warning（舊名是 info） |
| R5 未填佔位 | 程式碼區塊和 HTML 註解以外出現 `【填：…】`；其他形式的 `【…】` 可能是舊格式的佔位，也可能是內文本來就有的括號，只提醒 | `【填：…】` 是 warning（`--strict` 變 error），其他是 info |

- 每一條發現都印出頁碼、行號、規則和說明；有 error 時 exit code 是 1，用法錯誤是 2。info 只是提醒，不影響 exit code，加 `--strict` 也一樣。
- `--strict` 讓 `【填：…】` 的 R5 變 error（其他 `【…】` 仍是 info），`--no-browser` 跳過 R1，`--theme-set <路徑>` 指定額外的主題。
- R1 需要瀏覽器，不會另外下載。有設環境變數 `CHROME_PATH` 就只用它指定的瀏覽器，路徑不存在時不會改找別的；沒設才找系統上的 Chrome 或 Edge。找不到時會印出「R1 沒有檢查」，這不等於通過。
- R1 會在輸入檔旁邊產生一個暫存 HTML，量完就刪，所以簡報要放在可寫入的資料夾。

### 版型目錄（catalog）

`catalog/` 收了 35 個版型，分成 structure（5）、core（18）、academic（5）、teaching（7）四包，每個版型一個檔案，內容是名稱、用途、適用情境、用到的 class、可複製的骨架和一個完整範例。`themes/src/_base.css` 裡不屬於任何版型的 class，列在 `catalog/_utilities.md`。

- 找版型：先開 `examples/showcase.md`（36 頁，第一頁是說明，之後每頁示範一個版型），用 classic 主題轉成 HTML 或 PDF 看效果，再到 `catalog/<包名>/<id>.md` 找對應檔案。
- 複製骨架：打開該檔案的「骨架」區塊，整段貼進簡報，把 `【填：…】` 換成自己的內容，`【填：` 後面的文字是這一格要填什麼的提示。骨架只有一頁，不含 `---` 分頁線。
- 同一組 class 的細節（哪些 class 搭配、哪個是舊名）寫在檔案開頭的欄位裡。

```bash
npm run catalog                 # 驗證目錄的欄位、骨架與 classes 是否一致、class 是否都在 _base.css 有定義
npm run showcase                # 從目錄重新產生 examples/showcase.md
npm run showcase -- --check     # 只比對 examples/showcase.md 是不是最新
```

examples/showcase.md 是產物，不要直接修改，改 `catalog/` 之後重新執行 `npm run showcase`。

### 填空範本起手包（starter）

起手包是一個用 VS Code 打開就能用的資料夾。裡面的 `slides.md` 照場合排好了頁面，要填的地方寫成 `【填：…】`，可以自己填，也可以交給 GitHub Copilot、Codex 或 Claude Code 照資料夾裡的規則填。目前有 5 個場合：

| 場合 id | 場合 | 推薦主題 | 頁數 |
| ---- | ---- | ---- | ---- |
| `thesis-defense` | 論文口試／計畫書口試 | scholar | 14 |
| `course-report` | 課堂期中、期末報告 | classic | 13 |
| `workshop` | 工作坊教學 | classroom、midnight | 12 |
| `business-proposal` | 商業提案 | mono | 11 |
| `tech-talk` | 技術分享 | midnight | 11 |

```bash
npm run starter                                           # 6 個場合與推薦主題的組合，輸出到 output/starters/
npm run starter -- --zip                                  # 同上，每份另外打包成 zip
npm run starter -- thesis-defense --theme midnight --zip  # 只產生一份，主題可以不是推薦的那個
npm run scenarios                                         # 驗證 scenarios/ 的場合檔
```

產生的資料夾長這樣：

```text
thesis-defense-scholar/
├── slides.md                        # 要填的範本
├── example.md                       # 同一份範本填好虛構內容的樣子
├── prompts.md                       # 可以直接複製的 prompt：起手、換主題、加一頁、精簡文字、新手與專業視角審查
├── AGENTS.md                        # 給 AI 的常駐規則：可用版型、每頁字數上限、不能改的地方
├── .github/copilot-instructions.md  # 跟 AGENTS.md 逐位元相同
├── .vscode/settings.json            # 讓 Marp for VS Code 認得 themes/ 的 8 個主題並顯示 HTML
└── themes/                          # 8 個主題的 CSS
```

會讀規則檔的工具：

- GitHub Copilot（VS Code）：專案層級的指示檔可以是 `.github/copilot-instructions.md` 或 `AGENTS.md`。兩份都讀到時同樣的規則會出現兩次，官方建議移除重複的指示。見 [Use custom instructions in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)。
- Codex：開工前讀 `AGENTS.md`，從專案根目錄一路讀到工作目錄，合計上限預設 32 KiB。起手包的 `AGENTS.md` 約 8 KB。見 [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。
- Claude Code（v2.1.277 以上）：工作目錄和它的上層目錄都沒有 `CLAUDE.md`、`.claude/CLAUDE.md`、`CLAUDE.local.md` 時，直接讀 `AGENTS.md`。起手包放進已經有 `CLAUDE.md` 的資料夾底下，Claude Code 就只讀 `CLAUDE.md`，要在那份 `CLAUDE.md` 加一行 `@AGENTS.md` 匯入。`~/.claude/CLAUDE.md` 不影響這個判斷。見 [How Claude remembers your project](https://code.claude.com/docs/en/memory#agents-md)。

在 VS Code 打開時，要開整個資料夾，不要只開 `slides.md`，`.vscode/settings.json` 才會生效。VS Code 問要不要信任這個資料夾時選信任。沒有信任的資料夾裡，Marp for VS Code 只提供基本預覽，HTML 元件一律不顯示，`themes/` 的自訂主題也不會載入（見 [Marp for VS Code 的 Workspace Trust 說明](https://github.com/marp-team/marp-vscode#workspace-trust)）。

起手包裡沒有 `check`。要檢查版面，可以把填好的 `slides.md` 拿回本工具跑 `npm run check`，或至少在 VS Code 搜尋 `【填：`，確認都填完了。

場合範本放在 `scenarios/<id>.md`，一個檔案有 frontmatter（場合 id、中文名、推薦主題、每段用哪些版型與幾頁）和「填空版」「範例版」兩段。`npm run scenarios` 會檢查版型 id 都在目錄裡、頁數等於各段加總、用到的 class 屬於列出的版型、填空版的佔位都寫成 `【填：…】`、範例版沒有 `【`。規則檔的來源是 `starter/rules.md`，版型清單由產生腳本從 `catalog/` 填入。

---

## Project Structure

```text
md-to-slides/
├── src/
│   ├── cli/
│   │   ├── build-cli.js           # 統一 CLI 入口
│   │   └── check-cli.js           # check 指令入口
│   ├── check/                     # R1–R5 檢查規則
│   ├── catalog/                   # 讀取版型目錄（check 與腳本共用）
│   ├── scenarios/                 # 讀取場合範本
│   ├── starter/                   # 產生起手包資料夾與 zip
│   └── steps/
│       ├── preprocess-mermaid.js  # Mermaid block → PNG
│       └── render-html.js         # 本機圖片複製與改寫 + HTML 渲染
│
├── themes/
│   ├── src/                       # _base.css（版型）、<主題>.css（token）×8
│   ├── <主題>.css                 # 產生的單檔主題 ×8（進版控）
│   └── TOKENS.md                  # 53 個 token 的說明、對比配對表、classic 例外
│
├── catalog/                       # 版型目錄（35 個版型＋_utilities.md）
├── scenarios/                     # 場合範本 ×5（填空版＋範例版）
├── starter/                       # 起手包的規則來源 rules.md 與 prompts.md
├── examples/
│   └── showcase.md                # 由 npm run showcase 產生
│
├── scripts/
│   ├── build-themes.js            # 合併主題
│   ├── validate-catalog.js        # 驗證版型目錄
│   ├── build-showcase.js          # 產生 examples/showcase.md
│   ├── check-contrast.js          # 8 個主題的 WCAG 對比檢查
│   ├── build-thumbnails.js        # 8 個主題的縮圖總表（要 Chrome）
│   ├── validate-scenarios.js      # 驗證場合範本
│   ├── build-starter.js           # 產生起手包
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
- **v2.1**：`classic` 主題與 `--theme-set`、相對路徑圖片、`check` 匯出前檢查、CI 加 Windows
- **v2.2**：版型目錄 `catalog/`（35 個版型）、`examples/showcase.md`、`check` 的 R4 依目錄給相近 class 建議
- **v2.3**（當前）：8 個內建主題、53 個 `--theme-*` token、`npm run contrast`、`npm run thumbnails`

---

## References

- [Marp CLI](https://github.com/marp-team/marp-cli)
- [Mermaid](https://mermaid.js.org/)
- [mermaid-js/mermaid-cli](https://github.com/mermaid-js/mermaid-cli)
- [Puppeteer Troubleshooting](https://pptr.dev/troubleshooting)

---

## Architecture

- [Architecture](docs/ARCHITECTURE.md)
