---
id: variable-model
name_zh: 變數模型圖
name_en: Variable Model
pack: academic
purpose: 自變數、中介變數、依變數的關係圖，下方可補調節變數說明（用橫向流程的元件組成）
scenes: [研究架構, 理論模型, 假說推導]
classes: [hflow, hcol, hbox, harrow, blue, orange, green, hback]
aliases: {}
---

## 骨架

```markdown
# 【填：標題，研究架構，說出主要關係】

<div class="hflow">
<div class="hcol">
<div class="hbox blue"><b>【填：自變數一】</b><span>【填：操作型定義簡述】</span></div>
<div class="hbox blue"><b>【填：自變數二】</b><span>【填：操作型定義簡述】</span></div>
</div>
<div class="harrow">➜</div>
<div class="hbox orange"><b>【填：中介變數】</b><span>【填：說明】</span></div>
<div class="harrow">➜</div>
<div class="hbox green"><b>【填：依變數】</b><span>【填：說明】</span></div>
</div>

<div class="hback">【填：調節變數，說明它調節哪一段關係】</div>
```

## 範例

```markdown
# 志工參與度透過維護品質影響水質

<div class="hflow">
<div class="hcol">
<div class="hbox blue"><b>志工人數</b><span>每月輪值人次</span></div>
<div class="hbox blue"><b>清洗頻率</b><span>每月清洗次數</span></div>
</div>
<div class="harrow">➜</div>
<div class="hbox orange"><b>維護品質</b><span>檢核表得分</span></div>
<div class="harrow">➜</div>
<div class="hbox green"><b>水質穩定度</b><span>濁度與酸鹼值</span></div>
</div>

<div class="hback">調節變數：季節（雨季與乾季會改變維護品質對水質的效果）</div>
```
