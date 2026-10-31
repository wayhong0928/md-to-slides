# md-to-slides plugin

一個做簡報的 Claude Code skill。依場合排整份簡報的骨架，從 35 個版型排每一頁，輸出兩種之一：

- md-to-slides 的 Marp Markdown，20 個主題任選，交付前跑 `check`
- 交給 Claude Slides 或 Claude Design 的大綱，外觀由你在 claude.ai 的設計系統決定

版型、場合骨架與 Marp 規則由 repo 的 `catalog/`、`scenarios/`、`starter/rules.md` 產生，跟起手包的 `AGENTS.md` 同源。

## 安裝

在 Claude Code 裡執行：

```text
/plugin marketplace add wayhong0928/md-to-slides
/plugin install md-to-slides@md-to-slides
```

或在終端機：

```bash
claude plugin marketplace add wayhong0928/md-to-slides
claude plugin install md-to-slides@md-to-slides
```

裝好後說「幫我做一份簡報」，或直接叫用 `/md-to-slides:make-slides`。

## Marp 路線要另外準備

skill 只負責寫 Markdown。要轉成 PDF、HTML、PPTX，或交付前跑 `check`，需要 md-to-slides 本身：

```bash
git clone https://github.com/wayhong0928/md-to-slides
cd md-to-slides
npm install
```

`check` 的超框檢查（R1）要電腦上有 Chrome 或 Edge。

## Claude Slides／Claude Design 路線的條件

`/slides` 與 `/design` 要 Claude Code v2.1.265 以上，帳號要開放 Slides 或 Design 範本（官方標為 beta）。指令不能用時，skill 會把大綱交給你，貼到 claude.ai 的對話裡即可。
