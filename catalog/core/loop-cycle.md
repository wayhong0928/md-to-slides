---
id: loop-cycle
name_zh: 迴圈圖
name_en: Loop Row
pack: core
purpose: 一列膠囊步驟加箭頭，最後用迴轉箭頭表示重複，重點步驟反白
scenes: [循環流程, 迭代開發, 工作節奏]
classes: [loop-row, step-pill, step-arrow, hl, loop-note]
aliases: {}
---

## 骨架

```markdown
# 【標題：結論式，說出循環的重點】

<div class="loop-row">
<span class="step-pill">【步驟一】</span><span class="step-arrow">➜</span>
<span class="step-pill hl">【重點步驟】</span><span class="step-arrow">➜</span>
<span class="step-pill">【步驟三】</span><span class="step-arrow">↺</span>
</div>

<div class="loop-note">【說明：為什麼要重複，或每一輪改變了什麼】</div>
```

## 範例

```markdown
# 每個月重複一次檢查

<div class="loop-row">
<span class="step-pill">採樣</span><span class="step-arrow">➜</span>
<span class="step-pill hl">化驗水質</span><span class="step-arrow">➜</span>
<span class="step-pill">調整濾材</span><span class="step-arrow">↺</span>
</div>

<div class="loop-note">每輪的化驗結果都和上個月比較，連續兩次異常才更換設備。</div>
```
