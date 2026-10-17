# 工具 class 與未歸版型的元件

> 版型目錄之外，`themes/src/_base.css` 還定義了一些 class。這份檔案把它們全部列出，讓 `npm run catalog` 能確認「版型加這份檔案」和 `_base.css` 的 class 集合完全相同。「工具 class」「未歸版型的元件」兩段裡，每個項目用反引號標出 class 名稱，驗證腳本靠這個辨認。

## 工具 class

不依附任何版型元件，或是修飾版型但骨架沒有用到的備用寫法。

- `small`：縮小字級並改成淡灰色，用在附註或來源
- `ph`：黃底紅字的醒目標記，用來標出還沒填的內容
- `shot-img`：一般頁面裡直接放截圖的邊框與陰影，用在不是截圖頁的投影片
- `card-gray`：卡片頂端的灰色色條，可取代 four-cards 的其他色條
- `card-purple`：卡片頂端的紫色色條，可取代 four-cards 的其他色條

## 未歸版型的元件

`_base.css` 裡對不上 35 個版型的元件，整組列出（父 class 加子 class）。之後可以再決定要不要升格成版型。

- `agenda`：三欄式議程頁，加在投影片上，放大卡片內的字級
- `numline`：數線圖，子 class 有 `axis`、`zone`、`zbad`、`zok`、`pin`、`lbl`，用來標出好壞區間與刻度
- `covlines`：程式覆蓋率逐行顯示，子 class 有 `hit`、`miss`
- `chk`：打勾比較表，包在表格外層，第一欄靠左、其餘置中
- `models`：模型比較表，加在表格上，子 class 有 `sm`
- `pol`：政策對照雙欄，子 class 有 `row`、`sm`，內含大數字列
- `fig3`：三張圖並排，每張帶編號與說明
- `mdduo`：左圖右文的雙欄，子 class 有 `lab`
- `hfr`：左圖右卡片的雙欄
- `deco`：幾何裝飾層，放 SVG 當背景
