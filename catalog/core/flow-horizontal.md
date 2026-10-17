---
id: flow-horizontal
name_zh: 橫向流程
name_en: Horizontal Flow
pack: core
purpose: 由左到右的方塊加箭頭，可加一條說明列；加大版用來並列前後對照
scenes: [流程介紹, 系統架構, 前後對照]
classes: [hflow, hbox, harrow, big, red, yellow, gray, bad, good, cloud-bar]
aliases: {}
---

## 骨架

```markdown
# 【標題：結論式，說出流程的重點】

<div class="hflow">
<div class="hbox red"><b>【步驟一】</b><span>【說明】</span></div>
<div class="harrow">➜</div>
<div class="hbox yellow"><b>【步驟二】</b><span>【說明】</span></div>
<div class="harrow">➜</div>
<div class="hbox gray"><b>【步驟三】</b><span>【說明】</span></div>
</div>

<div class="hflow big">
<div class="hbox bad"><b>【改善前】</b><span>【問題的樣子】</span></div>
<div class="harrow">➜</div>
<div class="hbox good"><b>【改善後】</b><span>【解決後的樣子】</span></div>
</div>

<div class="cloud-bar">【補充：流程以外的共同條件或環境】</div>
```

## 範例

```markdown
# 雨水從屋頂到馬桶要經過三關

<div class="hflow">
<div class="hbox red"><b>集水</b><span>屋頂與落水管收集雨水</span></div>
<div class="harrow">➜</div>
<div class="hbox yellow"><b>過濾</b><span>初期雨水捨棄，再過濾雜質</span></div>
<div class="harrow">➜</div>
<div class="hbox gray"><b>供水</b><span>加壓送到廁所水箱</span></div>
</div>

<div class="hflow big">
<div class="hbox bad"><b>改善前</b><span>落水管直接排進雨水溝</span></div>
<div class="harrow">➜</div>
<div class="hbox good"><b>改善後</b><span>雨水先進水槽，再供沖廁</span></div>
</div>

<div class="cloud-bar">缺水時自動切換回自來水。</div>
```
