<!-- 由 npm run skill 從 starter/rules.md 產生，不要直接修改這個檔案 -->

# Marp 路線的規則

這份規則跟 md-to-slides 起手包的 `AGENTS.md` 由同一份來源產生。起手包裡說的 `slides.md`，在這裡就是你正在寫的簡報檔。

## 不能改的東西

- 不要改任何 `class="…"`、`<!-- _class: … -->`，也不要自己發明新的 class。主題只認得下面「可用版型」列出的 class。
- 不要改檔案開頭兩條 `---` 之間的 frontmatter。唯一的例外是使用者要求換主題時，改 `theme:` 那一行。
- 不要改 HTML 標籤的巢狀結構，只換標籤裡的文字。

## 寫法

- 標題 25 字內，最好寫成一句結論，讓觀眾只看標題就知道這頁要講什麼。
- 每頁條列最多 5 點，每點 30 字內。內容太多就拆成兩頁。
- `</div>` 後面一定要空一行再接下一段 Markdown 或 `---`，否則 Marp 會把後面的內容當成 HTML，整頁跑版或跟下一頁黏在一起。
- 人名、公司名、數字只用使用者給的資料。使用者沒給的，留下 `【填：…】` 並告訴使用者還缺什麼，不要自己編。

## 可用主題

frontmatter 的 `theme:` 可以填下列任一個，主題的 CSS 在 md-to-slides repo 的 `themes/`，plugin 沒有附，這裡只列各主題的特色：

- `atelier`：灰褐、細字、大量留白，品牌簡介與作品集
- `blueprint`：深藍底藍圖格線、白線，系統架構與技術計畫
- `boardroom`：深藍底搭金色，對主管或客戶報告
- `brand`：白底大色塊，改一行 --theme-brand 就換品牌色
- `campus`：淡綠白、學院綠卡片，課堂報告與校內發表
- `chalkboard`：墨綠黑板底、粉筆黃，讀書會與課堂導讀
- `civic`：白底黑灰、章節序號加粗，計畫書與要列印的文件
- `classic`：淺灰白，原本的預設外觀
- `classroom`：淡黃底、字大，上課與教學
- `consulting`：白底深藍、左側色條，顧問提案與分析報告
- `contract`：淺灰、表格加框線，合約與報價說明
- `editorial`：暖米色、襯線標題，讀書會與分享會
- `lab`：白底細格線、色盲友善色盤，研究成果與數據報告
- `midnight`：近黑底搭青綠色，技術分享與暗室投影
- `mono`：白底、無圓角與裝飾，要列印或黑白輸出
- `notebook`：方格紙、螢光筆、楷體標題，學習筆記與讀書會
- `pastel`：粉彩、大圓角，活動企劃與社團招生
- `pitch`：淡紫白、紫色強調，提案與比賽
- `scholar`：米色、襯線標題，論文口試與研討會
- `terminal`：黑底綠字、全部等寬字型，開發者 demo 與 CLI 教學

## 可用版型

每種版型列出 id、中文名、用途和它用到的 class。

| id | 中文名 | 用途 | class |
|---|---|---|---|
| `appendix-divider` | 附錄分隔頁 | 正文結束後、附錄開始前的分隔頁，深色底 | `appendix-divider` |
| `closing` | 結尾頁 | 簡報最後一頁，致謝或提示問答 | `thankyou` |
| `cover` | 封面 | 簡報第一頁，放標題、副標題與講者資訊 | `cover`、`cover-title`、`cover-subtitle`、`cover-meta` |
| `section` | 章節頁 | 章節之間的過場頁，大標題加章節編號 | `section-slide`、`section-label` |
| `toc` | 目錄 | 列出各章節與起始頁碼，兩欄排列，附錄用淡色標示 | `toc-grid`、`toc-item`、`no`、`t`、`pg`、`extra` |
| `callout` | 提示框 | 綠、黃、紅三種提示框，分別放小技巧、注意事項、禁止事項 | `tip`、`warning`、`danger` |
| `code` | 程式碼 | 一段程式碼加重點說明，字級縮小以容納較長的程式 | `codecol`、`dense` |
| `conclusion-bar` | 結論列 | 頁面底部的一句話結論，提醒觀眾這頁要記住什麼 | `conclusion` |
| `diagram` | 圖解 | 內嵌 SVG 畫的圖解，寬度撐滿頁面；複雜圖改放 Mermaid 區塊 | `loop-svg` |
| `flow-horizontal` | 橫向流程 | 由左到右的方塊加箭頭，可加一條說明列；加大版用來並列前後對照 | `hflow`、`hbox`、`harrow`、`big`、`red`、`yellow`、`gray`、`bad`、`good`、`cloud-bar` |
| `four-cards` | 四格卡片 | 兩列兩欄共四張卡片，每張帶色條，適合四個構面或四個步驟 | `columns`、`column`、`card`、`card-blue`、`card-green`、`card-red`、`card-orange` |
| `loop-cycle` | 迴圈圖 | 一列膠囊步驟加箭頭，最後用迴轉箭頭表示重複，重點步驟反白 | `loop-row`、`step-pill`、`step-arrow`、`hl`、`loop-note` |
| `quote-note` | 引言與附註 | 一段引言配出處，下方補一兩點附註 | `quote` |
| `references` | 參考資料 | 兩欄分類列出參考文獻或資料來源，字級小而清楚 | `refs`、`refgrid` |
| `resource-wall` | 資源牆 | 兩欄大頭貼加名稱、網址與一句推薦語，適合推薦頻道、作者或工具 | `shot`、`shot-wrap`、`rgrid`、`av` |
| `screenshot` | 截圖 | 一頁一張圖，加一句說明與來源；圖還沒準備好時用虛線框佔位 | `shot`、`shot-wrap`、`shot-todo`、`shot-big`、`shot-cap`、`shot-src` |
| `stat-boxes` | 數字方塊 | 一排大數字加說明，最多五個，顏色可區分類別 | `stat-grid`、`stat-box`、`stat-num`、`stat-label`、`green`、`orange`、`red`、`purple` |
| `syntax-compare` | 語法對照 | 兩欄對照表，左欄是原始寫法，右欄是結果或說明 | `mdpair` |
| `table` | 表格 | 標準 Markdown 表格，表頭用主題色，偶數列淡灰底 | （Markdown 表格，不用 class） |
| `three-cards` | 三欄卡片 | 三張並排的卡片，每張有名稱、定位與一段說明 | `tri`、`card`、`card-blue`、`card-green`、`card-orange`、`who`、`k` |
| `thumbnail-wall` | 縮圖牆 | 四欄 16:9 縮圖，每張下方放標題連結與來源，適合列出多個影片或網頁 | `shot`、`shot-wrap`、`rgrid`、`c4`、`th`、`vt` |
| `timeline` | 時間軸 | 依時間順序列出三到六個事件 | `timeline`、`tl-step`、`tl-dot`、`tl-label` |
| `two-column` | 雙欄對照 | 左右兩欄並排，適合前後對照、優缺點、兩種做法 | `columns`、`column` |
| `construct-badges` | 構念徽章 | 用五種顏色的小徽章標示不同構念，後面接一句說明 | `construct-badge`、`construct-badge-red`、`construct-badge-green`、`construct-badge-orange`、`construct-badge-purple` |
| `hypothesis-list` | 假說列表 | 逐條列出假說，用勾與叉標示是否獲得支持，後面附一句證據 | `lst`、`y`、`x` |
| `operational-definition` | 操作型定義 | 每個構念一個淡藍底方塊，上方放構念徽章，下方寫怎麼測量 | `opdef`、`construct-badge` |
| `research-questions` | 研究問題 | 每個研究問題一張左側紅條的卡片，編號加一句問題 | `card-accent` |
| `variable-model` | 變數模型圖 | 自變數、中介變數、依變數的關係圖，下方可補調節變數說明（用橫向流程的元件組成） | `hflow`、`hcol`、`hbox`、`harrow`、`blue`、`orange`、`green`、`hback` |
| `classroom-exercise` | 課堂練習 | 計時膠囊加上三個步驟與一條完成標準，讓學員知道做到什麼程度算完成 | `timer`、`flow-step`、`done` |
| `given-when-then` | Given／When／Then | 三格帶箭頭的情境描述：前提、動作、預期結果，每格下方可附一個例子 | `gwt`、`g`、`w`、`t`、`k`、`ex` |
| `ladder` | 階梯 | 由淺到深的四個層級，左側色條從綠到紅，表示難度或風險逐級升高 | `ladder`、`rung`、`r0`、`r1`、`r2`、`r3` |
| `prompt-breakdown` | Prompt 拆解 | 把一段提示詞拆成角色、目標、背景、限制、格式、範例六個彩色標籤，每列一句內容 | `prompt`、`wide`、`pr`、`tag`、`tx`、`b`、`g`、`o`、`p`、`r`、`k` |
| `pyramid` | 金字塔 | 三層由窄到寬的金字塔，頂層紅、中層橘、底層綠，表示優先順序或比例 | `pyramid`、`top`、`mid`、`bot` |
| `step-pills` | 步驟膠囊 | 編號圓圈加指令加對 AI 說的話，一列一個步驟 | `steps`、`st`、`n`、`cmd`、`say` |
| `terminal` | 終端機 | 仿終端機視窗顯示指令與輸出，旁邊用編號圈列出重點 | `columns`、`column`、`term`、`bar`、`u`、`p`、`b`、`c`、`ok`、`er`、`dim`、`mark`、`note-list`、`n`、`num` |

每種版型都能搭配的工具 class：`small`、`ph`、`shot-img`、`card-gray`、`card-purple`。
