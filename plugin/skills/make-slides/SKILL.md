---
name: make-slides
description: 做簡報時用。依場合挑整份骨架（課堂報告、論文口試、工作坊、商業提案、技術分享、讀書會、產品簡報、新創募資、成果報告、專案計畫書、品牌簡介、合約與報價說明），從 35 個版型排每一頁，輸出兩種之一：md-to-slides 的 Marp Markdown（20 個主題，交付前跑 check），或交給 Claude Slides／Claude Design 的大綱加版面詞彙。使用者說「做簡報」「投影片」「slides」「deck」「Marp」「一頁式提案」，或要把筆記、報告整理成簡報時叫用。
---

# 做簡報

這個 skill 決定整份簡報怎麼排（場合骨架、每頁用哪個版型），再交給適合的工具渲染。外觀由輸出端決定，Marp 路線用 md-to-slides 的主題。另一條路線只交一份大綱（以下稱大綱路線），由 Claude Slides 或 Claude Design 渲染，外觀用使用者在 claude.ai 的設計系統。

## 1. 先問四件事

一次問完，使用者已經講過的就不再問。

1. **場合**：對應 `references/scenarios.md` 的 12 個場合之一。都不像的話，挑最接近的一個再增刪段落，並告訴使用者你拿哪個當底。
2. **聽眾**：誰在聽、他們已經知道什麼。決定用詞深淺與要不要放背景頁。
3. **時長**：粗估一頁一到兩分鐘。超過場合預設頁數時，照段落比例加頁，不要把同一頁塞滿。
4. **輸出**：
   - Marp Markdown：要 PDF、HTML、PPTX 檔，或要放進 git 版控、之後自己改文字。
   - Claude Slides：要在 claude.ai 直接編輯、簡報、匯出 PowerPoint，外觀跟著團隊的設計系統。
   - Claude Design：一頁式提案、海報、介面草圖這類不是逐頁播放的視覺稿。

另外確認使用者給了哪些素材（筆記、數字、人名）。沒給的不要編，Marp 路線留 `【填：…】`，大綱路線寫「（待補：…）」，最後列出缺什麼。

## 2. 排骨架

1. 讀 `references/scenarios.md`，取該場合的段落、頁數與版型。
2. 每一頁先寫一句結論式標題，只看標題要讀得懂整個故事。寫法與降噪規則見 `references/writing.md`。
3. 標題定了再挑版型。版型的用途與骨架在 `references/layouts.md`；一頁講一件事，版型配內容的形狀（比較用雙欄對照、數字用數字方塊、步驟用橫向流程或時間軸），不要為了版面多樣而換版型。
4. 把頁序列給使用者看一次（頁碼、標題、版型），使用者同意再往下寫。使用者說直接做就跳過。

## 3. Marp 路線

1. frontmatter 固定寫：

   ```yaml
   ---
   marp: true
   theme: <主題 id>
   paginate: true
   ---
   ```

   主題預設用場合的第一個推薦主題，20 個主題的特色在 `references/marp-rules.md` 的「可用主題」。
2. 每頁從 `references/layouts.md` 複製骨架，只換文字。規則在 `references/marp-rules.md`，最常出錯的三條如下：
   - 不改、不發明 class，只用目錄裡有的。
   - `</div>` 後面空一行再接 `---` 或下一段 Markdown。
   - 標題 25 字內，每頁條列最多 5 點，每點 30 字內。
3. 交付前跑 `check`。md-to-slides 的 repo 在哪裡，照這個順序找：目前資料夾的 `package.json` 名稱是 `md-to-slides`；使用者告訴你的路徑；都沒有就請使用者 `git clone https://github.com/wayhong0928/md-to-slides` 後 `npm install`。

   ```bash
   node <repo>/src/cli/check-cli.js <簡報.md>
   ```

   - 有 error 就修到沒有再交。R1（超框）要 Chrome 或 Edge，找不到時輸出會寫「R1 沒有檢查」，這不算通過，要跟使用者講。
   - 真的沒有 repo 時，至少自己搜一次 `【填：`，並確認每個 `</div>` 後面都有空行，回報時寫明沒跑 `check`。
4. 告訴使用者怎麼看成品：
   - 轉檔：在 repo 跑 `npm run build -- <簡報.md> --format html,pdf`。非互動的 shell 直接呼叫 `marp` 時一律加 `--no-stdin`，PDF 要加 `--html`。
   - VS Code 預覽：照 repo README「在 VS Code 預覽」一節設定 `markdown.marp.themes` 與 `markdown.marp.html`，資料夾要按信任。

## 4. 大綱路線（Claude Slides／Claude Design）

這條路線只交內容與版面意圖，外觀交給使用者在 claude.ai 的設計系統。官方說明與出處在 `references/claude-design.md`。

1. 寫一份大綱，格式照 `references/examples/` 裡 `outline-` 開頭的兩份範例：簡報目的、聽眾、時長、整份的語氣，接著逐頁寫標題、要點、版面。
2. 版面用 `references/visual-vocabulary.md` 的通用詞描述，例如「左右兩欄對照」「一排三個大數字」「由左到右四步流程」。不寫 Marp 的 class、主題名或 CSS，也不指定顏色與字型，那是設計系統的事。
3. 交付方式：
   - 在 Claude Code 裡，簡報用 `/slides`、一頁式或海報用 `/design`，把大綱當 brief 給它。這兩個指令要 Claude Code v2.1.265 以上，帳號要開放對應範本。
   - 指令不能用時，把大綱交給使用者，請他在 claude.ai 的對話裡貼上並說「照這份大綱做一份簡報」。
4. 數字、人名、引文照使用者給的原文寫進大綱，並提醒使用者在 claude.ai 生成後再核對一次，渲染端可能改寫文字。

## 5. 寫作規則

- 標題寫結論，不寫主題詞。「研究結果」改成「通勤時間每多 10 分鐘，滿意度少 0.3 分」。
- 一頁一件事。內容太多就拆頁，不縮字級。
- 頁面上不放導覽、撰寫說明、「本頁將介紹」這類文字；圖片來源可以留一行小字。
- 繁體中文用台灣用語。

## 參考檔

| 檔案 | 什麼時候讀 | 來源 |
|---|---|---|
| `references/scenarios.md` | 第 2 步挑骨架 | 由 `scenarios/` 產生 |
| `references/layouts.md` | 排版型、Marp 複製骨架 | 由 `catalog/` 產生 |
| `references/marp-rules.md` | Marp 路線的完整規則與主題清單 | 由 `starter/rules.md` 產生，跟起手包的 `AGENTS.md` 同源 |
| `references/writing.md` | 寫標題、刪字、檢查張數 | 手寫 |
| `references/visual-vocabulary.md` | 大綱路線描述版面；使用者講的設計詞你不確定指什麼時 | 手寫 |
| `references/claude-design.md` | 大綱路線的官方說明與限制 | 手寫，附官方出處 |
| `references/examples/` | 想看完整成品時 | 手寫，全部虛構 |
