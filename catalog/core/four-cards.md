---
id: four-cards
name_zh: 四格卡片
name_en: Four Cards
pack: core
purpose: 兩列兩欄共四張卡片，每張帶色條，適合四個構面或四個步驟
scenes: [四個構面, 四個重點, 分類說明]
classes: [columns, column, card, card-blue, card-green, card-red, card-orange]
aliases: {}
---

## 骨架

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

## 範例

```markdown
# 評估雨水回收要看四件事

<div class="columns">
<div class="column"><div class="card card-blue"><h3>集水量</h3><p>屋頂面積乘以年降雨量。</p></div></div>
<div class="column"><div class="card card-green"><h3>用途</h3><p>沖廁與澆灌，不直接飲用。</p></div></div>
</div>
<div class="columns" style="margin-top: 12px;">
<div class="column"><div class="card card-red"><h3>風險</h3><p>水質變化與蚊蟲孳生。</p></div></div>
<div class="column"><div class="card card-orange"><h3>成本</h3><p>設備與每年維護費。</p></div></div>
</div>
```
