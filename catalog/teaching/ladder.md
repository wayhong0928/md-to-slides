---
id: ladder
name_zh: 階梯
name_en: Ladder
pack: teaching
purpose: 由淺到深的四個層級，左側色條從綠到紅，表示難度或風險逐級升高
scenes: [程度分級, 風險等級, 學習路徑]
classes: [ladder, rung, r0, r1, r2, r3]
aliases: {}
---

## 骨架

```markdown
# 【標題：四個層級的共同標準】

<div class="ladder">
<div class="rung r0"><b>【層級 0：名稱】</b> <span>【說明】</span></div>
<div class="rung r1"><b>【層級 1：名稱】</b> <span>【說明】</span></div>
<div class="rung r2"><b>【層級 2：名稱】</b> <span>【說明】</span></div>
<div class="rung r3"><b>【層級 3：名稱】</b> <span>【說明】</span></div>
</div>
```

## 範例

```markdown
# 水質風險分成四級

<div class="ladder">
<div class="rung r0"><b>第 0 級：清澈</b> <span>可用於澆灌，不需處理</span></div>
<div class="rung r1"><b>第 1 級：微濁</b> <span>增加過濾頻率，一週後複測</span></div>
<div class="rung r2"><b>第 2 級：混濁</b> <span>停止使用，清洗水槽</span></div>
<div class="rung r3"><b>第 3 級：異味</b> <span>通報總務處，全面檢修</span></div>
</div>
```
