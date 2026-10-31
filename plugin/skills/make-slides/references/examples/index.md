# 範例一覽

七份範例的人名、品牌、書名、數字全部虛構。Marp 的五份都用 md-to-slides 的 `check` 跑過，沒有 error。

| 檔案 | 場合 | 輸出 | 主題 | 刻意示範的版型 |
|---|---|---|---|---|
| `book-club-notebook.md` | 讀書會導讀（`book-club`） | Marp | `notebook` | 金字塔（`pyramid`）取代場合預設的迴圈圖 |
| `results-report-lab.md` | 成果報告（`results-report`） | Marp | `lab` | 結尾後接附錄分隔頁（`appendix-divider`）與預算表 |
| `workshop-midnight.md` | 工作坊教學（`workshop`） | Marp | `midnight` | 終端機（`terminal`）、步驟膠囊（`step-pills`）、語法對照（`syntax-compare`）、Given／When／Then（`given-when-then`） |
| `brand-intro-atelier.md` | 品牌簡介（`brand-intro`） | Marp | `atelier` | 時間軸（`timeline`）、數字方塊（`stat-boxes`），沒有程式或學術版型 |
| `tech-talk-blueprint.md` | 技術分享（`tech-talk`） | Marp | `blueprint` | 圖解（`diagram`）、程式碼（`code`）、階梯（`ladder`）、參考資料（`references`） |
| `outline-startup-pitch-slides.md` | 新創募資（`startup-pitch`） | Claude Slides 大綱 | 使用者的設計系統 | 逐頁寫標題、要點、版面，不帶 class |
| `outline-project-plan-design.md` | 專案計畫書（`project-plan`）改成一頁式 | Claude Design 大綱 | 使用者的設計系統 | 由上到下的區塊版面；內容跟 `results-report-lab.md` 同一個專案 |

Marp 範例為了涵蓋 5 個不同主題，沒有用場合的第一推薦主題，而是用第 2 或第 3 推薦。實作時照 `SKILL.md` 的規則，預設用場合的第一個推薦主題。

## 怎麼用

- 要照著做 Marp 簡報時，看場合最接近的那份，版型骨架仍以 `layouts.md` 為準。
- 要寫大綱時，看兩份 `outline-` 範例的格式：開頭寫目的、聽眾、時長、語氣、外觀，接著逐頁或逐區塊寫內容與版面，最後列交付後要核對的地方。
- 同一份內容要兩種輸出時，比對 `results-report-lab.md` 與 `outline-project-plan-design.md`，看同樣的數字在兩條路線怎麼寫。
