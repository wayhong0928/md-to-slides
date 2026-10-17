---
id: stat-boxes
name_zh: 數字方塊
name_en: Stat Boxes
pack: core
purpose: 一排大數字加說明，最多五個，顏色可區分類別
scenes: [成果摘要, 數據亮點, 關鍵指標]
classes: [stat-grid, stat-box, stat-num, stat-label, green, orange, red, purple]
aliases: {}
---

## 骨架

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

## 範例

```markdown
# 一個學期的試辦成果

<div class="stat-grid">
<div class="stat-box"><span class="stat-num">1,240</span><span class="stat-label">公升／月 集水量</span></div>
<div class="stat-box green"><span class="stat-num">36%</span><span class="stat-label">沖廁用水替代率</span></div>
<div class="stat-box orange"><span class="stat-num">12</span><span class="stat-label">志工參與人數</span></div>
<div class="stat-box red"><span class="stat-num">2</span><span class="stat-label">水質異常次數</span></div>
<div class="stat-box purple"><span class="stat-num">4.3</span><span class="stat-label">滿意度（滿分 5）</span></div>
</div>
```
