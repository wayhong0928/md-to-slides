---
id: step-pills
name_zh: 步驟膠囊
name_en: Step Pills
pack: teaching
purpose: 編號圓圈加指令加對 AI 說的話，一列一個步驟
scenes: [操作步驟, 指令教學, 人機對話示範]
classes: [steps, st, "n", cmd, say]
aliases: {}
---

## 骨架

```markdown
# 【標題：完成這件事的步驟】

<div class="steps">
<div class="st"><div class="n">1</div><div class="cmd">【指令或操作】</div><div class="cmd say">【對 AI 說的話或說明】</div></div>
<div class="st"><div class="n">2</div><div class="cmd">【指令或操作】</div><div class="cmd say">【對 AI 說的話或說明】</div></div>
<div class="st"><div class="n">3</div><div class="cmd">【指令或操作】</div><div class="cmd say">【對 AI 說的話或說明】</div></div>
</div>
```

## 範例

```markdown
# 三步建立一份新報告

<div class="steps">
<div class="st"><div class="n">1</div><div class="cmd">mkdir rain-report</div><div class="cmd say">先建立一個資料夾放這份報告</div></div>
<div class="st"><div class="n">2</div><div class="cmd">cd rain-report</div><div class="cmd say">進入資料夾</div></div>
<div class="st"><div class="n">3</div><div class="cmd">code report.md</div><div class="cmd say">用編輯器開啟，開始寫第一頁</div></div>
</div>
```
