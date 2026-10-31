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
| **內建 20 個主題、`--theme-set` 自訂主題** | ❌  |     ✅     |
| **相對路徑圖片（HTML、PDF、PPTX）**       | ❌  |     ✅     |
| **`check` 匯出前版面檢查（R1–R5）**       | ❌  |     ✅     |
| **填空範本起手包（12 個場合）**           | ❌  |     ✅     |

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

> **環境需求**：Node.js v22+  
> **完整架構說明**：見 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Installation

### 系統需求

| 軟體    | 版本     | 驗證指令  |
| ------- | -------- | --------- |
| Node.js | v22.0.0+ | `node -v` |
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
| `--theme-set <path>` | 額外的主題 CSS 檔或資料夾，可重複（內建 20 個主題一律可用） | —               |
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

# 檢查每個主題的文字對比 / 產生縮圖總表（要 Chrome 或 Edge）
npm run contrast
npm run thumbnails

# 每個主題配每個版型、每個場合配推薦主題，全部跑一次 check（要 Chrome 或 Edge）
npm run matrix

# 匯出前檢查
npm run check -- data/slides.md

# 驗證場合範本 / 產生填空範本起手包 / 產生樣式畫廊
npm run scenarios
npm run starter
npm run site

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

內建 20 個主題，卡片、統計數字、提示框、流程圖等元件都已經寫好，frontmatter 只要一行：

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
| `campus` | 淡綠白 | 學院綠卡片 | 課堂報告、校內發表 |
| `lab` | 白 | 細格線，色盲友善的色盤 | 研究成果、數據報告 |
| `notebook` | 方格紙 | 螢光筆底線，楷體標題 | 學習筆記、讀書會 |
| `chalkboard` | 墨綠 | 黑板底搭粉筆黃 | 讀書會、課堂導讀 |
| `pastel` | 粉彩 | 圓角大 | 活動企劃、社團招生 |
| `consulting` | 白 | 深藍，左側色條 | 顧問提案、分析報告 |
| `civic` | 白 | 黑灰，章節序號加粗 | 計畫書、要列印的文件 |
| `contract` | 淺灰 | 表格加框線 | 合約、報價說明 |
| `brand` | 白 | 大色塊，品牌色改一個 token 就換 | 品牌簡介、產品簡報 |
| `atelier` | 灰褐 | 細字，留白多 | 品牌簡介、作品集 |
| `blueprint` | 深藍 | 藍圖格線與白線 | 系統架構、技術計畫 |
| `terminal` | 黑 | 綠字，全部用等寬字型 | 開發者 demo、CLI 教學 |

字型照下面的順序找，找到第一個裝了的就用：

| 平台 | 內文 | 襯線標題（scholar、editorial） |
| ---- | ---- | ---- |
| Windows | 微軟正黑體 | Georgia（英數）、新細明體（中文） |
| macOS | 蘋方（PingFang TC） | Georgia（英數）、宋體（Songti TC） |
| Linux | Noto Sans CJK TC（要先裝 `fonts-noto-cjk`） | Noto Serif CJK TC |

notebook 的標題用楷體，Windows 是標楷體，macOS 找 BiauKai 或 Kaiti TC，Linux 要另外裝 AR PL UKai，都沒有就用襯線字。terminal 的內文用等寬字型，但 Consolas 沒有中文字，中文由系統的後備字型顯示，不會真的等寬。

macOS 那一列是照字型清單推的，沒有在 Mac 上實測。classic 的字型清單是 `'Helvetica Neue', '微軟正黑體', sans-serif`，沒有 Noto 備援，在 Linux 上中文用哪個字型由系統的 sans-serif 設定決定。

換主題只換外觀，版型與 class 名稱都不變，同一份 Markdown 可以直接換 `theme:` 重新輸出。`npm run thumbnails` 會把 20 個主題的前幾頁排成 `output/thumbnails/all.png` 對照。

- 不寫 `theme:` 的簡報照 Marp 預設處理，不會套任何內建主題。
- 顏色、字型、字級、圓角是 CSS 變數（`--theme-primary`、`--theme-font` 等，共 53 個，說明在 [themes/TOKENS.md](themes/TOKENS.md)），要換配色可以在 frontmatter 的 `style:` 覆寫，或用 `--theme-set` 加自己的主題。
- `brand` 的標題、連結和強調字都用 `--theme-brand` 這個顏色，在 frontmatter 加一行 `style: section { --theme-brand: #17603a; }` 就整份換色。淡底和文字色不會跟著變，換成很淺的顏色時字會看不清楚，可以先到樣式畫廊的主題頁試色，那裡會算對比。
- `themes/<主題>.css` 由 `themes/src/` 合併產生，改了 `themes/src/` 之後執行 `npm run themes`；`npm run themes -- --check` 比對產物是不是最新，也會檢查每個主題的 token 有沒有宣告齊全。
- `npm run contrast` 對每個主題的 49 組前景與背景配對算對比，一般文字要 4.5、大字要 3。classic 有 15 組沿用舊色的例外，登記在 `themes/TOKENS.md`，其他 19 個主題全部達標。
- `npm run matrix` 把 35 個版型的範例各放一頁拼成一份簡報，每個主題 build 一次並跑 `check`，共 700 組，接著檢查每個場合配推薦主題的 26 組起手包。有一組出現 error、對比不過或有規則沒檢查就 exit 1，找不到瀏覽器也算失敗。在本機跑大約 6 分鐘。CI 在 push 到 main 或手動執行時由 Ubuntu 的 smoke-build 工作跑，PR 不跑。

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
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/midnight.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/campus.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/lab.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/notebook.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/chalkboard.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/pastel.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/consulting.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/civic.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/contract.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/brand.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/atelier.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/blueprint.css",
    "https://cdn.jsdelivr.net/gh/wayhong0928/md-to-slides@main/themes/terminal.css"
  ],
  "markdown.marp.html": "all"
}
```

陣列裡列了 20 個主題，簡報的 `theme:` 寫哪個就用哪個；只用其中幾個的話，刪掉不需要的網址即可。

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

起手包是一個用 VS Code 打開就能用的資料夾。裡面的 `slides.md` 照場合排好了頁面，要填的地方寫成 `【填：…】`，可以自己填，也可以交給 GitHub Copilot、Codex 或 Claude Code 照資料夾裡的規則填。目前有 12 個場合：

| 場合 id | 場合 | 推薦主題 | 頁數 |
| ---- | ---- | ---- | ---- |
| `thesis-defense` | 論文口試／計畫書口試 | scholar、lab | 14 |
| `course-report` | 課堂期中、期末報告 | classic、campus | 13 |
| `workshop` | 工作坊教學 | classroom、midnight | 12 |
| `business-proposal` | 商業提案 | mono、consulting | 11 |
| `tech-talk` | 技術分享 | midnight、terminal、blueprint | 11 |
| `book-club` | 讀書會導讀 | chalkboard、notebook | 11 |
| `project-plan` | 專案計畫書 | civic、boardroom | 12 |
| `results-report` | 成果報告 | boardroom、lab | 12 |
| `startup-pitch` | 新創募資 | pitch、mono | 13 |
| `product-launch` | 產品簡報 | pitch、brand | 11 |
| `brand-intro` | 品牌簡介 | brand、editorial、atelier | 11 |
| `contract-quote` | 合約與報價說明 | contract、mono | 11 |

```bash
npm run starter                                           # 12 個場合與推薦主題的 26 個組合，輸出到 output/starters/
npm run starter -- --zip                                  # 同上，每份另外打包成 zip
npm run starter -- course-report                          # 一個場合，每個推薦主題各一份（課堂報告是 classic、campus 兩份）
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
├── CLAUDE.md                        # 標題加 @AGENTS.md 匯入，讓 Claude Code 透過匯入讀到規則
├── .vscode/settings.json            # 讓 Marp for VS Code 認得 themes/ 的 20 個主題並顯示 HTML
└── themes/                          # 20 個主題的 CSS
```

會讀規則檔的工具：

- GitHub Copilot（VS Code）：專案層級的指示檔可以是 `.github/copilot-instructions.md` 或 `AGENTS.md`。兩份都讀到時同樣的規則會出現兩次，官方建議移除重複的指示。見 [Use custom instructions in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)。
- Codex：開工前讀 `AGENTS.md`，從專案根目錄一路讀到工作目錄，合計上限預設 32 KiB。起手包的 `AGENTS.md` 約 8 KB。見 [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。
- Claude Code：讀起手包的 `CLAUDE.md`，再透過裡面的 `@AGENTS.md` 匯入規則。官方文件寫 v2.1.277 以上在工作目錄和上層目錄都沒有 `CLAUDE.md` 時會直接讀 `AGENTS.md`，而且 `~/.claude/CLAUDE.md` 不算在內；但在一台 Windows 電腦上用 v2.1.302 測試（`claude -p --setting-sources project,local`），資料夾放在家目錄底下的 `AppData\Local\Temp` 裡時，`AGENTS.md` 沒有被讀到。官方文件另外列了幾種只讀 `CLAUDE.md` 的情況，例如從 v2.1.276 以前升級後的第一個工作階段。這次是什麼原因還沒確認，所以起手包多放這個 `CLAUDE.md`。官方文件說用 `CLAUDE.md` 匯入 `AGENTS.md` 不會讓它讀兩次。見 [How Claude remembers your project](https://code.claude.com/docs/en/memory#agents-md)。

在 VS Code 打開時，要開整個資料夾，不要只開 `slides.md`，`.vscode/settings.json` 才會生效。VS Code 問要不要信任這個資料夾時選信任。沒有信任的資料夾裡，Marp for VS Code 只提供基本預覽，HTML 元件一律不顯示，`themes/` 的自訂主題也不會載入（見 [Marp for VS Code 的 Workspace Trust 說明](https://github.com/marp-team/marp-vscode#workspace-trust)）。

`contract-quote` 的填空版和範例版第一頁都寫著「這是說明用簡報，不是法律文件」，產生的 `AGENTS.md` 開頭也多一段同樣的提醒。其他場合要加這類提醒，在場合檔的 frontmatter 加 `notice` 欄位即可。

起手包裡沒有 `check`。要檢查版面，可以把填好的 `slides.md` 拿回本工具跑 `npm run check`，或至少在 VS Code 搜尋 `【填：`，確認都填完了。

場合範本放在 `scenarios/<id>.md`，一個檔案有 frontmatter（場合 id、中文名、推薦主題、每段用哪些版型與幾頁）和「填空版」「範例版」兩段。`npm run scenarios` 會檢查版型 id 都在目錄裡、頁數等於各段加總、用到的 class 屬於列出的版型、填空版的佔位都寫成 `【填：…】`、範例版沒有 `【`，有 `notice` 的場合兩版的第一頁都要有那段文字。規則檔的來源是 `starter/rules.md`，版型清單由產生腳本從 `catalog/` 填入。

### 樣式畫廊（site）

`npm run site` 會在 `output/site/` 產生一個靜態網站，有三頁：

- 場合範本（`index.html`）：選場合和主題，看整份範例版，下載對應的起手包 zip。12 個場合配 20 個主題，共 240 份。
- 版型（`layouts.html`）：35 個版型各一張卡片，可以換主題預覽，按「複製語法」複製骨架。
- 主題（`themes.html`）：看主題的預覽和 53 個 token 的值，寫成 `var()` 的 token 會列出它指到的顏色。可以複製一段 VS Code 設定，直接套用這個 repo 的主題。選 `brand` 時多一個品牌色欄位，挑了顏色預覽就跟著換，對比不夠的配對會列出來，下面那行 `style:` 可以複製貼進 frontmatter。

打開網站時，場合範本頁先選商業提案（配 mono），版型頁和主題頁先選 classic。網址帶 `?scenario=…&theme=…` 就打開指定的組合。

預覽是 build 時用 marp-core 渲染好的投影片，瀏覽器裡不跑 Marp。起手包 zip 跟 `npm run starter -- <場合> --theme <主題> --zip` 產生的檔案逐位元相同。

網站用 fetch 讀 `data/` 底下的檔案，直接點兩下 HTML 打開會讀不到，要用本機 http 伺服器開，例如：

```bash
npm run site
python -m http.server 8000 --directory output/site   # 再開 http://localhost:8000/
```

主題頁的 VS Code 設定用 jsDelivr 的網址，版本固定在產生網站時的 commit（CI 用 `GITHUB_SHA`，本機用 `git rev-parse HEAD`）。在本機產生的話，那個 commit 要先 push，jsDelivr 才抓得到。設定裡的 `markdown.marp.html` 只在信任的工作區生效，見上一節的 Workspace Trust 說明。

`.github/workflows/pages.yml` 把網站部署到 GitHub Pages，只能手動執行。第一次用之前，要先到 repo 的 Settings → Pages 把 Source 設成 GitHub Actions。網站會在 `https://<帳號>.github.io/md-to-slides/` 底下，頁面裡的網址都是相對路徑。

### Claude Code plugin

這個 repo 同時是 Claude Code 的 plugin marketplace，裡面有一個 plugin（`plugin/`），內含簡報 skill `make-slides`。裝好以後，在 Claude Code 說「幫我做一份簡報」，它會先問場合、聽眾、時長與輸出形式，依場合排整份簡報的骨架，再從 35 個版型排每一頁。輸出分兩條路：

- Marp 路線：產出 md-to-slides 的 Marp Markdown，20 個主題任選，交付前跑 `check`。
- 大綱路線：產出純文字大綱，交給 Claude Slides 或 Claude Design 渲染，外觀由你在 claude.ai 的設計系統決定。

安裝（照 Claude Code 官方 plugin 文件的寫法）：

```text
/plugin marketplace add wayhong0928/md-to-slides
/plugin install md-to-slides@md-to-slides
```

或在終端機執行 `claude plugin marketplace add wayhong0928/md-to-slides` 與 `claude plugin install md-to-slides@md-to-slides`。裝好後也可以直接叫用 `/md-to-slides:make-slides`。

Marp 路線要轉成 PDF、HTML、PPTX，或交付前跑 `check`，需要 clone 本 repo 並 `npm install`；`check` 的超框檢查（R1）要電腦上有 Chrome 或 Edge。沒有 repo 時，skill 會改做文字檢查並明講沒跑 `check`。細節見 [plugin/README.md](plugin/README.md)。

skill 的 `references/marp-rules.md`、`layouts.md`、`scenarios.md` 由 `npm run skill` 從 `catalog/`、`scenarios/`、`starter/rules.md` 產生，跟起手包的 `AGENTS.md` 同源，不要手改；改了來源之後重跑 `npm run skill`，`npm run skill -- --check` 只比對不寫檔。

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
│   ├── site/                      # 樣式畫廊的 marp-core 渲染
│   └── steps/
│       ├── preprocess-mermaid.js  # Mermaid block → PNG
│       └── render-html.js         # 本機圖片複製與改寫 + HTML 渲染
│
├── themes/
│   ├── src/                       # _base.css（版型）、<主題>.css（token）×20
│   ├── <主題>.css                 # 產生的單檔主題 ×20（進版控）
│   └── TOKENS.md                  # 53 個 token 與主題自己加的 token、對比配對表、classic 例外
│
├── catalog/                       # 版型目錄（35 個版型＋_utilities.md）
├── scenarios/                     # 場合範本 ×12（填空版＋範例版）
├── starter/                       # 起手包的規則來源 rules.md 與 prompts.md
├── site/                          # 樣式畫廊的頁面（3 頁 HTML、site.css、site.js）
├── examples/
│   └── showcase.md                # 由 npm run showcase 產生
│
├── .claude-plugin/
│   └── marketplace.json           # Claude Code marketplace，列出 plugin/
├── plugin/                        # Claude Code plugin：簡報 skill make-slides
│   ├── .claude-plugin/plugin.json
│   ├── README.md
│   └── skills/make-slides/        # SKILL.md、references/（三份由 npm run skill 產生）、範例
│
├── scripts/
│   ├── build-themes.js            # 合併主題
│   ├── validate-catalog.js        # 驗證版型目錄
│   ├── build-showcase.js          # 產生 examples/showcase.md
│   ├── check-contrast.js          # 每個主題的 WCAG 對比檢查
│   ├── check-matrix.js            # 主題 × 版型與場合推薦組合的全組合檢查（要 Chrome）
│   ├── build-thumbnails.js        # 每個主題的縮圖總表（要 Chrome）
│   ├── validate-scenarios.js      # 驗證場合範本
│   ├── build-starter.js           # 產生起手包
│   ├── build-site.js              # 產生樣式畫廊
│   ├── build-skill.js             # 產生 plugin 的三份 reference
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
│   ├── ci.yml              # GitHub Actions CI（Ubuntu、Windows × Node 22、24）
│   └── pages.yml           # 部署樣式畫廊到 GitHub Pages（手動執行）
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
nvm install 22 && nvm use 22
```

---

## Roadmap

- **v1**：Markdown → HTML / PDF / PPTX，固定讀取 `content.md`
- **v2**：任意路徑輸入、Mermaid 圖表渲染、單一 data/ 資料區
- **v2.1**：`classic` 主題與 `--theme-set`、相對路徑圖片、`check` 匯出前檢查、CI 加 Windows
- **v2.2**：版型目錄 `catalog/`（35 個版型）、`examples/showcase.md`、`check` 的 R4 依目錄給相近 class 建議
- **v2.3**：8 個內建主題、53 個 `--theme-*` token、`npm run contrast`、`npm run thumbnails`
- **v2.4**：5 個場合的填空範本起手包（`npm run starter`）、`npm run scenarios`、`check` 的 R5 分成兩級
- **v2.5**：樣式畫廊（`npm run site`，場合範本、版型、主題三頁）、手動執行的 GitHub Pages 部署
- **v2.6**：主題增加到 20 個、場合增加到 12 個、`npm run matrix` 全組合檢查、畫廊的品牌色欄位
- **v2.8**（當前）：Claude Code plugin（簡報 skill `make-slides`）、`npm run skill`、Node 最低版本升到 22

---

## References

- [Marp CLI](https://github.com/marp-team/marp-cli)
- [Mermaid](https://mermaid.js.org/)
- [mermaid-js/mermaid-cli](https://github.com/mermaid-js/mermaid-cli)
- [Puppeteer Troubleshooting](https://pptr.dev/troubleshooting)

---

## Architecture

- [Architecture](docs/ARCHITECTURE.md)
