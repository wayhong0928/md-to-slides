# 更動日誌

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
