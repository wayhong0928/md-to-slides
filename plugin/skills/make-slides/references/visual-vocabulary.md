# 視覺用語字典

兩個用途。寫給 Claude Slides／Claude Design 的大綱時，用這裡的通用詞描述版面；使用者講了一個設計詞你不確定指什麼時，在這裡對到版型或元件。

詞的出處分三類，標在每張表上面。有官方出處的照官方名稱寫，業界通用說法沒有單一權威來源的會註明。

## 1. 整頁版面

左欄是寫大綱時用的描述，中間是 PowerPoint 的版面名稱，右欄是 Marp 路線對應的版型（`layouts.md`）。

PowerPoint 名稱的出處是 Microsoft 的[套用投影片版面配置](https://support.microsoft.com/en-us/office/apply-a-slide-layout-158e6dba-e53e-479b-a6fc-caab72609689)與 [PpSlideLayout 列舉](https://learn.microsoft.com/en-us/office/vba/api/powerpoint.ppslidelayout)。標「業界說法」的沒有 PowerPoint 內建版面，是簡報設計常見的叫法。

| 大綱裡怎麼寫 | PowerPoint 名稱 | Marp 版型 |
|---|---|---|
| 封面：大標題、副標、講者 | Title Slide | 封面（`cover`） |
| 章節過場：章節編號加大標題 | Section Header | 章節頁（`section`） |
| 目錄：章節與頁碼 | 業界說法（agenda） | 目錄（`toc`） |
| 標題加三到五點條列 | Title and Content | 不用 class，直接寫 `#` 標題加條列 |
| 條列加底部一句結論 | 業界說法 | 結論列（`conclusion-bar`） |
| 左右兩欄對照 | Two objects、Comparison | 雙欄對照（`two-column`） |
| 一排三張卡片 | 業界說法（three-column cards） | 三欄卡片（`three-cards`） |
| 兩列兩欄四張卡片 | 業界說法（2×2 grid） | 四格卡片（`four-cards`） |
| 一排兩到四個大數字 | 業界說法（big number、KPI row） | 數字方塊（`stat-boxes`） |
| 由左到右的步驟加箭頭 | 業界說法（process） | 橫向流程（`flow-horizontal`）、步驟膠囊（`step-pills`） |
| 時間軸 | 業界說法（timeline） | 時間軸（`timeline`） |
| 重複的循環 | 業界說法（cycle） | 迴圈圖（`loop-cycle`） |
| 金字塔、層級 | 業界說法（pyramid） | 金字塔（`pyramid`）、階梯（`ladder`） |
| 一句引言加出處 | 業界說法（quote slide） | 引言與附註（`quote-note`） |
| 一張圖加說明 | Picture with Caption | 截圖（`screenshot`） |
| 很多張小圖排成牆 | 業界說法（gallery、grid） | 縮圖牆（`thumbnail-wall`）、資源牆（`resource-wall`） |
| 全版圖片、文字壓在圖上 | 業界說法（full-bleed image） | 沒有對應版型，Marp 用 `![bg](圖檔)` |
| 資料表 | Table | 表格（`table`） |
| 程式碼加重點說明 | 業界說法 | 程式碼（`code`）、終端機（`terminal`）、語法對照（`syntax-compare`） |
| 結尾致謝、問答 | 業界說法（closing） | 結尾頁（`closing`） |

## 2. 頁內元件

設計系統裡常見的元件名。寫大綱時，使用者的設計系統有同名元件就直接叫名字（官方建議的寫法，見 `claude-design.md`）。

出處是 Apple 的 [Human Interface Guidelines：Components](https://developer.apple.com/design/human-interface-guidelines/components) 與 Android 的 [Compose 元件清單](https://developer.android.com/develop/ui/compose/components)（Material 3 元件的實作清單；Material 3 官網是動態頁面，抓不到文字，改用這份）。中文名是本檔的譯法，不是官方譯名。

### 簡報裡用得到的

| 中文 | Apple HIG | Material 3 | 投影片上的用法 | Marp 對應 |
|---|---|---|---|---|
| 卡片 | Boxes | Card | 一個概念一張卡 | `three-cards`、`four-cards`、`card-gray`、`card-purple` |
| 標籤、膠囊 | Labels、Token fields | Chip、Badges | 標示類別或狀態 | `construct-badges`、`step-pills` |
| 圖表 | Charts | 沒有獨立元件 | 數據頁 | `diagram`、`stat-boxes` |
| 進度指示 | Progress indicators、Gauges | Progress indicators | 專案進度、完成率 | `timeline` |
| 分隔線 | 沒有獨立元件 | Divider | 段落之間 | 沒有 class；要分段通常直接換頁 |
| 清單與表格 | Lists and tables | 沒有獨立元件 | 條列、比較表 | `table` |
| 分頁標籤 | Tab views、Tab bars | Tabs | 截圖示意介面時才用 | 沒有 |
| 提示訊息 | Alerts | Snackbar、Dialog | 注意事項、警告 | `callout` |
| 圖片 | Image views | 沒有獨立元件 | 截圖、照片 | `screenshot`、`shot-img` |
| 圖文組合 | Lockups | 沒有獨立元件 | 圖示加一行字的固定組合 | `three-cards` 卡片標題前加圖示 |

### 介面草圖才會用到的

用 Claude Design 畫介面或一頁式網頁時，用這些名稱描述元件。

- 導覽：Sidebars／Navigation drawer（側欄）、Tab bars／Navigation bar（底部分頁列）、Navigation rail（窄側欄）、Toolbars／Top app bar（頂部工具列）、Search fields／Search bar（搜尋框）
- 動作：Buttons／Button（按鈕）、Floating action button（浮動按鈕）、Menus（選單）、Segmented controls／Segmented button（分段按鈕）
- 輸入：Text fields（輸入框）、Toggles／Switch（開關）、Sliders（滑桿）、Pickers／Time picker（選擇器）、Checkbox（核取方塊）、Radio button（單選鈕）
- 彈出層：Sheets／Bottom sheets（底部面板）、Popovers／Tooltip（浮動說明）、Alerts／Dialog（對話框）
- 輪播：Page controls（頁點）、Carousel（輪播）

## 3. 版面與字的用語

業界通用說法，沒有單一權威來源。

| 詞 | 意思 | 什麼時候提 |
|---|---|---|
| 留白（whitespace） | 元素之間不放東西的空間 | 嫌擠的時候，先刪字再加留白 |
| 對齊（alignment） | 元素靠同一條線排 | 卡片、數字方塊要上緣對齊 |
| 層級（hierarchy） | 標題、內文、註解的大小與粗細差距 | 觀眾不知道先看哪裡時 |
| 強調色（accent color） | 只用在重點的一個顏色 | 一頁只強調一處 |
| 網格（grid） | 決定欄寬與間距的隱形格線 | 多頁要對齊時 |
| 出血（full-bleed） | 圖片延伸到頁面邊緣 | 封面、章節頁 |
| 安全邊界（safe area） | 內容不超出的內縮範圍 | 投影機會裁邊時 |
| 字重（font weight） | 字的粗細 | 層級不夠時調字重，不是調顏色 |

## 4. 動態

Marp 輸出的 PDF 與 PPTX 沒有動畫。下面的詞只在使用者要做網頁版簡報或一頁式網頁時用得到，業界通用說法。

| 詞 | 意思 |
|---|---|
| 捲動觸發（scroll-triggered） | 元素捲進畫面時播一次進場動畫；多個元素依序進場叫 stagger |
| 捲動連動（scroll-linked） | 動畫進度跟著捲動位置走，例如進度條 |
| 視差（parallax） | 背景與前景用不同速度捲動 |
| 黏住（sticky） | 元素捲到某處後固定不動，常見於章節標題 |
| 捲動吸附（scroll snap） | 捲動停下時自動對齊到最近一頁 |
| 減少動態（`prefers-reduced-motion`） | 使用者在系統設定要求少動畫時，網頁要關掉或簡化動畫 |
