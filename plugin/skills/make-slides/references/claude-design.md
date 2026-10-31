# Claude Slides 與 Claude Design 路線

查詢日 2026-10-31。兩者官方都標為 beta，行為與方案限制可能改，用之前以官方頁面為準。

## 兩者是什麼、該用哪個

claude.ai 的 artifact 有幾種範本，跟簡報有關的是兩種。

| 範本 | 做什麼 | Claude Code 指令 |
|---|---|---|
| Claude Slides | 逐頁的簡報，可在 claude.ai 編輯、播放、匯出 | `/slides` |
| Claude Design | 視覺稿、可互動原型、一頁式文件、海報 | `/design` |

2026 年 4 月 Claude Design 推出時，簡報也算在它的範圍；9 月起簡報改由 Claude Slides 負責。所以這個 skill 的規則是，逐頁播放的簡報交給 Claude Slides，一頁式提案或海報交給 Claude Design。

官方原文：

- 「Claude Design lets you create designs, interactive prototypes, one-pagers, and other visual work by chatting with Claude.」（[Get started with Claude Design](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)）
- 「Update, September 2026: Claude Design now works inside any conversation with Claude, including Claude Code and the Artifacts tab, in beta on paid plans. Slide decks have their own starting point in Claude Slides.」（[Claude Design now stays on brand for daily work](https://claude.com/blog/claude-design-stays-on-brand-for-daily-work)）
- 「Claude can start an artifact from one of the templates on your claude.ai account: Claude Slides for a presentation, Claude Design for a visual design, or Claude Docs for a document other people will read and edit.」（[Claude Code 文件 artifacts 頁](https://code.claude.com/docs/en/artifacts#start-from-a-slides-design-or-docs-template)）

## 能不能接收大綱或 Markdown

- 文字大綱可以。Claude Slides 的官方教學寫「Paste in rough notes, or use dictation or voice mode to talk through what you want to say. Ask Claude for an outline, correct it, then ask for the deck.」（[Making slides and presentations with Claude](https://academy.claude.com/tutorials/using-claude-design-for-presentations-and-slide-decks)）
- 檔案附件可以，官方列的格式是 DOCX、PPTX、XLSX：「Start from a text prompt, upload images and documents (DOCX, PPTX, XLSX), or point Claude at your codebase.」（[Introducing Claude Design](https://www.anthropic.com/news/claude-design-anthropic-labs)）
- Markdown 檔能不能當附件，官方頁面沒有寫，查不到。所以這個 skill 一律把大綱當純文字貼進對話或當指令的 brief，不附 `.md` 檔，也不交 Marp 語法。

## 外觀怎麼來

外觀由使用者在 claude.ai 設定的設計系統決定，大綱裡不寫顏色、字型、class。

- 「Claude uses your organization's default. If there is no default, it asks which design system to use. To use a different one for this deck, choose it in the message box under + > Design system before you send the request.」（Claude Slides 教學，同上）
- 沒有設計系統時：「attach a deck or brand file and ask Claude to match its look.」（同上）
- 設計系統的方案限制：「Design systems are in beta on Pro, Max, Team and Enterprise plans. They aren't available on the Free plan.」（[Setting up a design system in Claude](https://academy.claude.com/tutorials/create-a-design-system-with-claude)）
- 可以用名稱指定設計系統裡的元件：「If you know a component exists in your brand's system, mention it by name: "Use the Primary Button component" or "Apply the Card layout pattern."」（Get started with Claude Design，同上）

## 好的 brief 包含什麼

官方對 Claude Design 的說法是「A good prompt includes the goal (what you're building), the layout (how things should be arranged), the content (what information to display), and the audience (who will use it).」（Get started with Claude Design，同上）。大綱範例照這四項排：目的、聽眾、逐頁內容、逐頁版面。

## 匯出

- Claude Slides：PDF、可在瀏覽器播放的 `.html`、單頁 `.png`、PowerPoint（保留字型或換成通用字型兩種），連了 Google Drive 可送到 Google Slides。轉成 PowerPoint 時「Charts, icons and shapes become pictures. Slide transitions and skipped slides are left out.」（Claude Slides 教學，同上）
- Claude Design：「Download as .zip」「Export as PDF」「Export as PPTX」「Export to Google Slides」「Export as standalone HTML」，另可送到 Canva 等工具或交給 Claude Code（Get started with Claude Design，同上）。用 `/design` 做的畫布，Claude Code 文件寫「You can export each artboard as PNG or PDF.」（[Claude Code 文件 artifacts 頁](https://code.claude.com/docs/en/artifacts#draft-a-design-canvas)）

## 在 Claude Code 裡的條件

`/slides` 與 `/design` 都要 Claude Code v2.1.265 以上、可以用 artifact 的工作階段，而且帳號開了對應範本。官方原文：「Templates are in beta. They're on by default on Pro, Max, Ultra, and Team plans. On Enterprise plans, an Owner turns each template on under Organization settings > Artifacts. If your organization has the Slides template turned off, `/slides` doesn't appear; if it has the Design template turned off, `/design` doesn't draft designs. Both commands require Claude Code v2.1.265 or later and a session where artifacts are available.」（[Claude Code 文件 artifacts 頁](https://code.claude.com/docs/en/artifacts#start-from-a-slides-design-or-docs-template)）

指令不能用的時候，把大綱交給使用者，請他在 claude.ai 對話裡貼上。

## 已知限制

- 「Claude Design doesn't have version history yet.」（Get started with Claude Design，同上）
- 「Two or more people editing a design project at the same time is still basic and may not work reliably.」（同上）
- 用量跟 Claude 其他功能共用：「Claude Design counts toward the same usage limits as the rest of Claude.」（同上）
