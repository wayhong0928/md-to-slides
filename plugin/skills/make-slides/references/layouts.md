<!-- 由 npm run skill 從 catalog/ 產生，不要直接修改這個檔案 -->

# 版型目錄

共 35 個版型。Marp 路線照「骨架」複製，把 `【填：…】` 換成內容；大綱路線（Claude Slides／Claude Design）只用「中文名」「英文名」「用途」描述版面，不要帶 class。

| id | 中文名 | 英文名 | 包 | 用途 |
|---|---|---|---|---|
| `appendix-divider` | 附錄分隔頁 | Appendix Divider | 結構頁 | 正文結束後、附錄開始前的分隔頁，深色底 |
| `closing` | 結尾頁 | Closing | 結構頁 | 簡報最後一頁，致謝或提示問答 |
| `cover` | 封面 | Cover | 結構頁 | 簡報第一頁，放標題、副標題與講者資訊 |
| `section` | 章節頁 | Section Divider | 結構頁 | 章節之間的過場頁，大標題加章節編號 |
| `toc` | 目錄 | Table of Contents | 結構頁 | 列出各章節與起始頁碼，兩欄排列，附錄用淡色標示 |
| `callout` | 提示框 | Callout | 核心版型 | 綠、黃、紅三種提示框，分別放小技巧、注意事項、禁止事項 |
| `code` | 程式碼 | Code | 核心版型 | 一段程式碼加重點說明，字級縮小以容納較長的程式 |
| `conclusion-bar` | 結論列 | Conclusion Bar | 核心版型 | 頁面底部的一句話結論，提醒觀眾這頁要記住什麼 |
| `diagram` | 圖解 | Diagram | 核心版型 | 內嵌 SVG 畫的圖解，寬度撐滿頁面；複雜圖改放 Mermaid 區塊 |
| `flow-horizontal` | 橫向流程 | Horizontal Flow | 核心版型 | 由左到右的方塊加箭頭，可加一條說明列；加大版用來並列前後對照 |
| `four-cards` | 四格卡片 | Four Cards | 核心版型 | 兩列兩欄共四張卡片，每張帶色條，適合四個構面或四個步驟 |
| `loop-cycle` | 迴圈圖 | Loop Row | 核心版型 | 一列膠囊步驟加箭頭，最後用迴轉箭頭表示重複，重點步驟反白 |
| `quote-note` | 引言與附註 | Quote and Note | 核心版型 | 一段引言配出處，下方補一兩點附註 |
| `references` | 參考資料 | References | 核心版型 | 兩欄分類列出參考文獻或資料來源，字級小而清楚 |
| `resource-wall` | 資源牆 | Resource Wall | 核心版型 | 兩欄大頭貼加名稱、網址與一句推薦語，適合推薦頻道、作者或工具 |
| `screenshot` | 截圖 | Screenshot | 核心版型 | 一頁一張圖，加一句說明與來源；圖還沒準備好時用虛線框佔位 |
| `stat-boxes` | 數字方塊 | Stat Boxes | 核心版型 | 一排大數字加說明，最多五個，顏色可區分類別 |
| `syntax-compare` | 語法對照 | Syntax Compare | 核心版型 | 兩欄對照表，左欄是原始寫法，右欄是結果或說明 |
| `table` | 表格 | Table | 核心版型 | 標準 Markdown 表格，表頭用主題色，偶數列淡灰底 |
| `three-cards` | 三欄卡片 | Three Cards | 核心版型 | 三張並排的卡片，每張有名稱、定位與一段說明 |
| `thumbnail-wall` | 縮圖牆 | Thumbnail Wall | 核心版型 | 四欄 16:9 縮圖，每張下方放標題連結與來源，適合列出多個影片或網頁 |
| `timeline` | 時間軸 | Timeline | 核心版型 | 依時間順序列出三到六個事件 |
| `two-column` | 雙欄對照 | Two Columns | 核心版型 | 左右兩欄並排，適合前後對照、優缺點、兩種做法 |
| `construct-badges` | 構念徽章 | Construct Badges | 學術包 | 用五種顏色的小徽章標示不同構念，後面接一句說明 |
| `hypothesis-list` | 假說列表 | Hypothesis List | 學術包 | 逐條列出假說，用勾與叉標示是否獲得支持，後面附一句證據 |
| `operational-definition` | 操作型定義 | Operational Definition | 學術包 | 每個構念一個淡藍底方塊，上方放構念徽章，下方寫怎麼測量 |
| `research-questions` | 研究問題 | Research Questions | 學術包 | 每個研究問題一張左側紅條的卡片，編號加一句問題 |
| `variable-model` | 變數模型圖 | Variable Model | 學術包 | 自變數、中介變數、依變數的關係圖，下方可補調節變數說明（用橫向流程的元件組成） |
| `classroom-exercise` | 課堂練習 | Classroom Exercise | 教學包 | 計時膠囊加上三個步驟與一條完成標準，讓學員知道做到什麼程度算完成 |
| `given-when-then` | Given／When／Then | Given When Then | 教學包 | 三格帶箭頭的情境描述：前提、動作、預期結果，每格下方可附一個例子 |
| `ladder` | 階梯 | Ladder | 教學包 | 由淺到深的四個層級，左側色條從綠到紅，表示難度或風險逐級升高 |
| `prompt-breakdown` | Prompt 拆解 | Prompt Breakdown | 教學包 | 把一段提示詞拆成角色、目標、背景、限制、格式、範例六個彩色標籤，每列一句內容 |
| `pyramid` | 金字塔 | Pyramid | 教學包 | 三層由窄到寬的金字塔，頂層紅、中層橘、底層綠，表示優先順序或比例 |
| `step-pills` | 步驟膠囊 | Step Pills | 教學包 | 編號圓圈加指令加對 AI 說的話，一列一個步驟 |
| `terminal` | 終端機 | Terminal | 教學包 | 仿終端機視窗顯示指令與輸出，旁邊用編號圈列出重點 |

## 附錄分隔頁（`appendix-divider`）

- 用途：正文結束後、附錄開始前的分隔頁，深色底
- 適用情境：口試簡報、研究報告、長簡報
- class：`appendix-divider`

```markdown
<!-- _class: appendix-divider -->

# 附錄

【填：附錄內容的一句說明】
```

## 結尾頁（`closing`）

- 用途：簡報最後一頁，致謝或提示問答
- 適用情境：課堂報告、工作坊、研究提案
- class：`thankyou`

```markdown
<!-- _class: thankyou -->

# 【填：謝謝聆聽】

【填：聯絡方式或問答提示】
```

## 封面（`cover`）

- 用途：簡報第一頁，放標題、副標題與講者資訊
- 適用情境：課堂報告、研究提案、工作坊
- class：`cover`、`cover-title`、`cover-subtitle`、`cover-meta`

```markdown
<!-- _class: cover -->

<div class="cover-title">【填：簡報標題，一句話講主題，20 字內】</div>
<div class="cover-subtitle">【填：副標題，對象與場合】</div>
<hr>
<div class="cover-meta">【填：講者姓名】｜【填：日期】</div>
```

## 章節頁（`section`）

- 用途：章節之間的過場頁，大標題加章節編號
- 適用情境：長簡報、課程講義、口試簡報
- class：`section-slide`、`section-label`

```markdown
<!-- _class: section-slide -->

<div class="section-label">【填：章節編號，例如 PART 1】</div>

# 【填：章節標題】
```

## 目錄（`toc`）

- 用途：列出各章節與起始頁碼，兩欄排列，附錄用淡色標示
- 適用情境：長簡報、課程講義、口試簡報
- class：`toc-grid`、`toc-item`、`no`、`t`、`pg`、`extra`

```markdown
# 【填：目錄標題，例如「今天的內容」】

<div class="toc-grid">
<div class="toc-item"><span class="no">01</span><span class="t">【填：章節名稱】<small>【填：一句說明】</small></span><span class="pg">p.【填：頁碼】</span></div>
<div class="toc-item"><span class="no">02</span><span class="t">【填：章節名稱】<small>【填：一句說明】</small></span><span class="pg">p.【填：頁碼】</span></div>
<div class="toc-item"><span class="no">03</span><span class="t">【填：章節名稱】<small>【填：一句說明】</small></span><span class="pg">p.【填：頁碼】</span></div>
<div class="toc-item"><span class="no">04</span><span class="t">【填：章節名稱】<small>【填：一句說明】</small></span><span class="pg">p.【填：頁碼】</span></div>
<div class="toc-item extra"><span class="no">附</span><span class="t">【填：附錄名稱】</span><span class="pg">p.【填：頁碼】</span></div>
</div>
```

## 提示框（`callout`）

- 用途：綠、黃、紅三種提示框，分別放小技巧、注意事項、禁止事項
- 適用情境：操作說明、注意事項、風險提醒
- class：`tip`、`warning`、`danger`

```markdown
# 【填：標題，結論式】

<div class="tip">【填：小技巧，做了會更好的事】</div>
<div class="warning">【填：注意，容易忽略的條件】</div>
<div class="danger">【填：禁止，做了會出問題的事】</div>
```

## 程式碼（`code`）

- 用途：一段程式碼加重點說明，字級縮小以容納較長的程式
- 適用情境：程式教學、技術分享、設定說明
- class：`codecol`、`dense`

````markdown
<!-- _class: codecol dense -->

# 【填：標題，這段程式在做什麼】

```【填：語言，例如 python】
【填：程式碼，十行內】
```

- 【填：重點說明】
- 【填：重點說明】
````

## 結論列（`conclusion-bar`）

- 用途：頁面底部的一句話結論，提醒觀眾這頁要記住什麼
- 適用情境：每頁收尾、小結、重點整理
- class：`conclusion`

```markdown
# 【填：標題】

- 【填：論點一】
- 【填：論點二】
- 【填：論點三】

<div class="conclusion">【填：結論，一句話講這頁要觀眾記住什麼，20 字內】</div>
```

## 圖解（`diagram`）

- 用途：內嵌 SVG 畫的圖解，寬度撐滿頁面；複雜圖改放 Mermaid 區塊
- 適用情境：架構圖、概念圖、關係圖
- class：`loop-svg`

```markdown
# 【填：標題，結論式，說出圖要傳達的關係】

<svg class="loop-svg" viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
<rect x="40" y="170" width="220" height="100" rx="12" fill="#eaf4fb" stroke="#2980b9" stroke-width="2"/>
<text x="150" y="228" text-anchor="middle" font-size="24">【填：節點一】</text>
<rect x="540" y="170" width="220" height="100" rx="12" fill="#eafaf1" stroke="#27ae60" stroke-width="2"/>
<text x="650" y="228" text-anchor="middle" font-size="24">【填：節點二】</text>
<line x1="260" y1="220" x2="540" y2="220" stroke="#445566" stroke-width="3"/>
<text x="400" y="205" text-anchor="middle" font-size="20">【填：關係】</text>
</svg>
```

## 橫向流程（`flow-horizontal`）

- 用途：由左到右的方塊加箭頭，可加一條說明列；加大版用來並列前後對照
- 適用情境：流程介紹、系統架構、前後對照
- class：`hflow`、`hbox`、`harrow`、`big`、`red`、`yellow`、`gray`、`bad`、`good`、`cloud-bar`

```markdown
# 【填：標題，結論式，說出流程的重點】

<div class="hflow">
<div class="hbox red"><b>【填：步驟一】</b><span>【填：說明】</span></div>
<div class="harrow">➜</div>
<div class="hbox yellow"><b>【填：步驟二】</b><span>【填：說明】</span></div>
<div class="harrow">➜</div>
<div class="hbox gray"><b>【填：步驟三】</b><span>【填：說明】</span></div>
</div>

<div class="hflow big">
<div class="hbox bad"><b>【填：改善前】</b><span>【填：問題的樣子】</span></div>
<div class="harrow">➜</div>
<div class="hbox good"><b>【填：改善後】</b><span>【填：解決後的樣子】</span></div>
</div>

<div class="cloud-bar">【填：補充，流程以外的共同條件或環境】</div>
```

## 四格卡片（`four-cards`）

- 用途：兩列兩欄共四張卡片，每張帶色條，適合四個構面或四個步驟
- 適用情境：四個構面、四個重點、分類說明
- class：`columns`、`column`、`card`、`card-blue`、`card-green`、`card-red`、`card-orange`

```markdown
# 【填：標題，結論式】

<div class="columns">
<div class="column"><div class="card card-blue"><h3>【填：卡片一】</h3><p>【填：說明】</p></div></div>
<div class="column"><div class="card card-green"><h3>【填：卡片二】</h3><p>【填：說明】</p></div></div>
</div>
<div class="columns" style="margin-top: 12px;">
<div class="column"><div class="card card-red"><h3>【填：卡片三】</h3><p>【填：說明】</p></div></div>
<div class="column"><div class="card card-orange"><h3>【填：卡片四】</h3><p>【填：說明】</p></div></div>
</div>
```

## 迴圈圖（`loop-cycle`）

- 用途：一列膠囊步驟加箭頭，最後用迴轉箭頭表示重複，重點步驟反白
- 適用情境：循環流程、迭代開發、工作節奏
- class：`loop-row`、`step-pill`、`step-arrow`、`hl`、`loop-note`

```markdown
# 【填：標題，結論式，說出循環的重點】

<div class="loop-row">
<span class="step-pill">【填：步驟一】</span><span class="step-arrow">➜</span>
<span class="step-pill hl">【填：重點步驟】</span><span class="step-arrow">➜</span>
<span class="step-pill">【填：步驟三】</span><span class="step-arrow">↺</span>
</div>

<div class="loop-note">【填：說明，為什麼要重複，或每一輪改變了什麼】</div>
```

## 引言與附註（`quote-note`）

- 用途：一段引言配出處，下方補一兩點附註
- 適用情境：引用文獻、受訪者原話、名言開場
- class：`quote`

```markdown
# 【填：標題，這段引言要說明什麼】

<div class="quote">【填：引言原文，一到兩句】<small>【填：出處，作者、年份或來源】</small></div>

- 【填：附註一，這句話為什麼重要】
- 【填：附註二，和本研究的關係】
```

## 參考資料（`references`）

- 用途：兩欄分類列出參考文獻或資料來源，字級小而清楚
- 適用情境：參考文獻、資料來源、延伸閱讀
- class：`refs`、`refgrid`

```markdown
<!-- _class: refs -->

# 參考資料

<div class="refgrid">
<div>
<h4>【填：分類一】</h4>
<ul>
<li>【填：作者（年份）。標題。出處。】</li>
<li>【填：作者（年份）。標題。出處。】</li>
</ul>
</div>
<div>
<h4>【填：分類二】</h4>
<ul>
<li>【填：作者（年份）。標題。出處。】</li>
<li>【填：作者（年份）。標題。出處。】</li>
</ul>
</div>
</div>
```

## 資源牆（`resource-wall`）

- 用途：兩欄大頭貼加名稱、網址與一句推薦語，適合推薦頻道、作者或工具
- 適用情境：推薦清單、講者介紹、工具資源
- class：`shot`、`shot-wrap`、`rgrid`、`av`

```markdown
<!-- _class: shot -->

# 【填：標題，這組推薦的共同點】

<div class="shot-wrap"><div class="rgrid">
<figure><img class="av" src="images/【填：頭像一】.png"><figcaption>【填：名稱】<span>【填：網址】</span></figcaption></figure>
<figure><img class="av" src="images/【填：頭像二】.png"><figcaption>【填：名稱】<span>【填：網址】</span></figcaption></figure>
</div></div>
```

## 截圖（`screenshot`）

- 用途：一頁一張圖，加一句說明與來源；圖還沒準備好時用虛線框佔位
- 適用情境：操作示範、介面說明、資料來源展示
- class：`shot`、`shot-wrap`、`shot-todo`、`shot-big`、`shot-cap`、`shot-src`

```markdown
<!-- _class: shot -->

# 【填：標題，這張圖要讓觀眾看到什麼】

<div class="shot-wrap"><div class="shot-todo shot-big">【填：截圖 16:9，操作畫面或資料來源，圖準備好後換成 img】</div></div>

<p class="shot-cap">【填：一句話說明圖的重點】</p>
<p class="shot-src">【填：來源，網站或文件名稱、擷取日期】</p>
```

## 數字方塊（`stat-boxes`）

- 用途：一排大數字加說明，最多五個，顏色可區分類別
- 適用情境：成果摘要、數據亮點、關鍵指標
- class：`stat-grid`、`stat-box`、`stat-num`、`stat-label`、`green`、`orange`、`red`、`purple`

```markdown
# 【填：標題，結論式，說出數字代表什麼】

<div class="stat-grid">
<div class="stat-box"><span class="stat-num">【填：數字】</span><span class="stat-label">【填：說明】</span></div>
<div class="stat-box green"><span class="stat-num">【填：數字】</span><span class="stat-label">【填：說明】</span></div>
<div class="stat-box orange"><span class="stat-num">【填：數字】</span><span class="stat-label">【填：說明】</span></div>
<div class="stat-box red"><span class="stat-num">【填：數字】</span><span class="stat-label">【填：說明】</span></div>
<div class="stat-box purple"><span class="stat-num">【填：數字】</span><span class="stat-label">【填：說明】</span></div>
</div>
```

## 語法對照（`syntax-compare`）

- 用途：兩欄對照表，左欄是原始寫法，右欄是結果或說明
- 適用情境：語法教學、指令速查、標記語言介紹
- class：`mdpair`

```markdown
# 【填：標題，這組語法的重點】

<table class="mdpair">
<tr><th>【填：寫法】</th><th>【填：呈現結果或說明】</th></tr>
<tr><td>【填：語法一】</td><td>【填：說明一】</td></tr>
<tr><td>【填：語法二】</td><td>【填：說明二】</td></tr>
<tr><td>【填：語法三】</td><td>【填：說明三】</td></tr>
</table>
```

## 表格（`table`）

- 用途：標準 Markdown 表格，表頭用主題色，偶數列淡灰底
- 適用情境：數據整理、方案比較、規格對照
- class：不用 class（Markdown 表格）

```markdown
# 【填：標題，結論式，說出表格要證明什麼】

| 【填：項目】 | 【填：欄位 A】 | 【填：欄位 B】 | 【填：欄位 C】 |
|---|---|---|---|
| 【填：列一】 | 【填：內容】 | 【填：內容】 | 【填：內容】 |
| 【填：列二】 | 【填：內容】 | 【填：內容】 | 【填：內容】 |
| 【填：列三】 | 【填：內容】 | 【填：內容】 | 【填：內容】 |
```

## 三欄卡片（`three-cards`）

- 用途：三張並排的卡片，每張有名稱、定位與一段說明
- 適用情境：三種做法介紹、推薦清單、方案選項
- class：`tri`、`card`、`card-blue`、`card-green`、`card-orange`、`who`、`k`

```markdown
# 【填：標題，結論式】

<div class="tri">
<div class="card card-blue"><h3>【填：名稱一】</h3><p class="who">【填：一句定位】</p><b class="k">【填：小標】</b><p>【填：說明，30 字內】</p></div>
<div class="card card-green"><h3>【填：名稱二】</h3><p class="who">【填：一句定位】</p><b class="k">【填：小標】</b><p>【填：說明，30 字內】</p></div>
<div class="card card-orange"><h3>【填：名稱三】</h3><p class="who">【填：一句定位】</p><b class="k">【填：小標】</b><p>【填：說明，30 字內】</p></div>
</div>
```

## 縮圖牆（`thumbnail-wall`）

- 用途：四欄 16:9 縮圖，每張下方放標題連結與來源，適合列出多個影片或網頁
- 適用情境：推薦影片、參考網站、案例一覽
- class：`shot`、`shot-wrap`、`rgrid`、`c4`、`th`、`vt`

```markdown
<!-- _class: shot -->

# 【填：標題，這組資源的共同點】

<div class="shot-wrap"><div class="rgrid c4">
<figure><img class="th" src="images/【填：縮圖一】.png"><figcaption><a class="vt" href="【填：網址】">【填：標題】</a><span>【填：來源】</span></figcaption></figure>
<figure><img class="th" src="images/【填：縮圖二】.png"><figcaption><a class="vt" href="【填：網址】">【填：標題】</a><span>【填：來源】</span></figcaption></figure>
<figure><img class="th" src="images/【填：縮圖三】.png"><figcaption><a class="vt" href="【填：網址】">【填：標題】</a><span>【填：來源】</span></figcaption></figure>
<figure><img class="th" src="images/【填：縮圖四】.png"><figcaption><a class="vt" href="【填：網址】">【填：標題】</a><span>【填：來源】</span></figcaption></figure>
</div></div>
```

## 時間軸（`timeline`）

- 用途：依時間順序列出三到六個事件
- 適用情境：專案進度、研究歷程、課程安排
- class：`timeline`、`tl-step`、`tl-dot`、`tl-label`

```markdown
# 【填：標題，結論式，說出時程的重點】

<div class="timeline">
<div class="tl-step"><div class="tl-dot">1</div><div class="tl-label"><strong>【填：時間點】</strong><span>【填：事件】</span></div></div>
<div class="tl-step"><div class="tl-dot">2</div><div class="tl-label"><strong>【填：時間點】</strong><span>【填：事件】</span></div></div>
<div class="tl-step"><div class="tl-dot">3</div><div class="tl-label"><strong>【填：時間點】</strong><span>【填：事件】</span></div></div>
<div class="tl-step"><div class="tl-dot">4</div><div class="tl-label"><strong>【填：時間點】</strong><span>【填：事件】</span></div></div>
</div>
```

## 雙欄對照（`two-column`）

- 用途：左右兩欄並排，適合前後對照、優缺點、兩種做法
- 適用情境：方案比較、前後對照、概念對比
- class：`columns`、`column`
- 舊名：`col` 是 `column` 的舊名

```markdown
# 【填：標題，結論式，說出這頁要比較什麼】

<div class="columns">
<div class="column">

### 【填：左欄標題】

- 【填：重點一】
- 【填：重點二】

</div>
<div class="column">

### 【填：右欄標題】

- 【填：重點一】
- 【填：重點二】

</div>
</div>
```

## 構念徽章（`construct-badges`）

- 用途：用五種顏色的小徽章標示不同構念，後面接一句說明
- 適用情境：構念介紹、量表說明、理論整理
- class：`construct-badge`、`construct-badge-red`、`construct-badge-green`、`construct-badge-orange`、`construct-badge-purple`

```markdown
# 【填：標題，這頁介紹哪幾個構念】

<p><span class="construct-badge">【填：構念一】</span> 【填：一句說明】</p>
<p><span class="construct-badge-red">【填：構念二】</span> 【填：一句說明】</p>
<p><span class="construct-badge-green">【填：構念三】</span> 【填：一句說明】</p>
<p><span class="construct-badge-orange">【填：構念四】</span> 【填：一句說明】</p>
<p><span class="construct-badge-purple">【填：構念五】</span> 【填：一句說明】</p>
```

## 假說列表（`hypothesis-list`）

- 用途：逐條列出假說，用勾與叉標示是否獲得支持，後面附一句證據
- 適用情境：研究假說、結果摘要、口試簡報
- class：`lst`、`y`、`x`

```markdown
# 【填：標題，假說檢定的整體結果】

<ul class="lst">
<li><span class="y">✔</span><b>H1</b>【填：假說敘述】<span>【填：證據，係數與顯著性】</span></li>
<li><span class="y">✔</span><b>H2</b>【填：假說敘述】<span>【填：證據，係數與顯著性】</span></li>
<li><span class="x">✘</span><b>H3</b>【填：假說敘述】<span>【填：證據，係數與顯著性】</span></li>
</ul>
```

## 操作型定義（`operational-definition`）

- 用途：每個構念一個淡藍底方塊，上方放構念徽章，下方寫怎麼測量
- 適用情境：研究方法、量表設計、口試簡報
- class：`opdef`、`construct-badge`

```markdown
# 【填：標題，這幾個構念怎麼測量】

<div class="opdef"><span class="construct-badge">【填：構念一】</span><br>【填：操作型定義，用什麼工具、幾題、怎麼計分】</div>
<div class="opdef"><span class="construct-badge">【填：構念二】</span><br>【填：操作型定義，用什麼工具、幾題、怎麼計分】</div>
```

## 研究問題（`research-questions`）

- 用途：每個研究問題一張左側紅條的卡片，編號加一句問題
- 適用情境：研究目的、研究問題、提案簡報
- class：`card-accent`

```markdown
# 【填：標題，本研究要回答的問題】

<div class="card-accent"><b>RQ1</b>　【填：研究問題一，一句話】</div>
<div class="card-accent"><b>RQ2</b>　【填：研究問題二，一句話】</div>
<div class="card-accent"><b>RQ3</b>　【填：研究問題三，一句話】</div>
```

## 變數模型圖（`variable-model`）

- 用途：自變數、中介變數、依變數的關係圖，下方可補調節變數說明（用橫向流程的元件組成）
- 適用情境：研究架構、理論模型、假說推導
- class：`hflow`、`hcol`、`hbox`、`harrow`、`blue`、`orange`、`green`、`hback`

```markdown
# 【填：標題，研究架構，說出主要關係】

<div class="hflow">
<div class="hcol">
<div class="hbox blue"><b>【填：自變數一】</b><span>【填：操作型定義簡述】</span></div>
<div class="hbox blue"><b>【填：自變數二】</b><span>【填：操作型定義簡述】</span></div>
</div>
<div class="harrow">➜</div>
<div class="hbox orange"><b>【填：中介變數】</b><span>【填：說明】</span></div>
<div class="harrow">➜</div>
<div class="hbox green"><b>【填：依變數】</b><span>【填：說明】</span></div>
</div>

<div class="hback">【填：調節變數，說明它調節哪一段關係】</div>
```

## 課堂練習（`classroom-exercise`）

- 用途：計時膠囊加上三個步驟與一條完成標準，讓學員知道做到什麼程度算完成
- 適用情境：課堂練習、工作坊、分組活動
- class：`timer`、`flow-step`、`done`

```markdown
# 【填：標題，練習的名稱】

<span class="timer">⏱ 【填：時間，例如 10 分鐘】</span>

<div class="flow-step"><h3>【填：步驟一】</h3><p>【填：要做什麼】</p></div>
<div class="flow-step"><h3>【填：步驟二】</h3><p>【填：要做什麼】</p></div>
<div class="flow-step"><h3>【填：步驟三】</h3><p>【填：要做什麼】</p></div>

<div class="done">【填：完成標準，做到什麼程度就可以舉手】</div>
```

## Given／When／Then（`given-when-then`）

- 用途：三格帶箭頭的情境描述：前提、動作、預期結果，每格下方可附一個例子
- 適用情境：需求說明、測試案例、情境教學
- class：`gwt`、`g`、`w`、`t`、`k`、`ex`

```markdown
# 【填：標題，這個情境要驗證什麼】

<div class="gwt">
<div class="g"><b class="k">GIVEN</b><span>【填：前提，事情發生前的狀態】</span><div class="ex">【填：例子】</div></div>
<div class="w"><b class="k">WHEN</b><span>【填：動作，使用者做了什麼】</span><div class="ex">【填：例子】</div></div>
<div class="t"><b class="k">THEN</b><span>【填：結果，預期看到什麼】</span><div class="ex">【填：例子】</div></div>
</div>
```

## 階梯（`ladder`）

- 用途：由淺到深的四個層級，左側色條從綠到紅，表示難度或風險逐級升高
- 適用情境：程度分級、風險等級、學習路徑
- class：`ladder`、`rung`、`r0`、`r1`、`r2`、`r3`

```markdown
# 【填：標題，四個層級的共同標準】

<div class="ladder">
<div class="rung r0"><b>【填：層級 0，名稱】</b> <span>【填：說明】</span></div>
<div class="rung r1"><b>【填：層級 1，名稱】</b> <span>【填：說明】</span></div>
<div class="rung r2"><b>【填：層級 2，名稱】</b> <span>【填：說明】</span></div>
<div class="rung r3"><b>【填：層級 3，名稱】</b> <span>【填：說明】</span></div>
</div>
```

## Prompt 拆解（`prompt-breakdown`）

- 用途：把一段提示詞拆成角色、目標、背景、限制、格式、範例六個彩色標籤，每列一句內容
- 適用情境：提示詞教學、AI 工作坊、寫作指引
- class：`prompt`、`wide`、`pr`、`tag`、`tx`、`b`、`g`、`o`、`p`、`r`、`k`

```markdown
# 【填：標題，好的提示詞有哪幾個部分】

<div class="prompt wide">
<div class="pr"><span class="tag b">【填：角色】</span><span class="tx">【填：你要 AI 扮演誰】</span></div>
<div class="pr"><span class="tag g">【填：目標】</span><span class="tx">【填：你要它完成什麼】</span></div>
<div class="pr"><span class="tag o">【填：背景】</span><span class="tx">【填：它需要知道的前提】</span></div>
<div class="pr"><span class="tag p">【填：限制】</span><span class="tx">【填：不能做什麼、字數上限】</span></div>
<div class="pr"><span class="tag r">【填：格式】</span><span class="tx">【填：輸出的樣子】</span></div>
<div class="pr"><span class="tag k">【填：範例】</span><span class="tx">【填：給它一個參考答案】</span></div>
</div>
```

## 金字塔（`pyramid`）

- 用途：三層由窄到寬的金字塔，頂層紅、中層橘、底層綠，表示優先順序或比例
- 適用情境：優先順序、層次結構、比例說明
- class：`pyramid`、`top`、`mid`、`bot`

```markdown
# 【填：標題，三層的共同邏輯】

<div class="pyramid">
<div class="top"><b>【填：頂層】</b>【填：說明】</div>
<div class="mid"><b>【填：中層】</b>【填：說明】</div>
<div class="bot"><b>【填：底層】</b>【填：說明】</div>
</div>
```

## 步驟膠囊（`step-pills`）

- 用途：編號圓圈加指令加對 AI 說的話，一列一個步驟
- 適用情境：操作步驟、指令教學、人機對話示範
- class：`steps`、`st`、`n`、`cmd`、`say`

```markdown
# 【填：標題，完成這件事的步驟】

<div class="steps">
<div class="st"><div class="n">1</div><div class="cmd">【填：指令或操作】</div><div class="cmd say">【填：對 AI 說的話或說明】</div></div>
<div class="st"><div class="n">2</div><div class="cmd">【填：指令或操作】</div><div class="cmd say">【填：對 AI 說的話或說明】</div></div>
<div class="st"><div class="n">3</div><div class="cmd">【填：指令或操作】</div><div class="cmd say">【填：對 AI 說的話或說明】</div></div>
</div>
```

## 終端機（`terminal`）

- 用途：仿終端機視窗顯示指令與輸出，旁邊用編號圈列出重點
- 適用情境：指令教學、開發者示範、錯誤訊息說明
- class：`columns`、`column`、`term`、`bar`、`u`、`p`、`b`、`c`、`ok`、`er`、`dim`、`mark`、`note-list`、`n`、`num`

```markdown
# 【填：標題，這段指令做了什麼】

<div class="columns">
<div class="column">
<div class="term" style="background:#1e1e1e;border-left:none;padding:0;margin:0;font-size:inherit;color:#d4d4d4;">
<div class="bar"><i></i><i></i><i></i> 【填：終端機視窗名稱】</div>
<pre><span class="u">【填：使用者】</span> <span class="p">【填：目錄】</span> <span class="b">【填：分支】</span>
$ <span class="c">【填：指令】</span>
<span class="ok">【填：成功的輸出】</span>
<span class="er">【填：錯誤的輸出】</span>
<span class="dim">【填：次要提示】</span> <span class="mark">【填：要強調的部分】</span></pre>
</div>
</div>
<div class="column">
<div class="note-list">
<div class="n"><b class="num">1</b><span>【填：第一個重點】</span></div>
<div class="n"><b class="num">2</b><span>【填：第二個重點】</span></div>
<div class="n"><b class="num">3</b><span>【填：第三個重點】</span></div>
</div>
</div>
</div>
```

## 工具 class

每種版型都能搭配：

- `small`：縮小字級並改成淡灰色，用在附註或來源
- `ph`：黃底紅字的醒目標記，用來標出還沒填的內容
- `shot-img`：一般頁面裡直接放截圖的邊框與陰影，用在不是截圖頁的投影片
- `card-gray`：卡片頂端的灰色色條，可取代 four-cards 的其他色條
- `card-purple`：卡片頂端的紫色色條，可取代 four-cards 的其他色條
