---
id: hypothesis-list
name_zh: 假說列表
name_en: Hypothesis List
pack: academic
purpose: 逐條列出假說，用勾與叉標示是否獲得支持，後面附一句證據
scenes: [研究假說, 結果摘要, 口試簡報]
classes: [lst, "y", "x"]
aliases: {}
---

## 骨架

```markdown
# 【標題：假說檢定的整體結果】

<ul class="lst">
<li><span class="y">✔</span><b>H1</b>【假說敘述】<span>【證據：係數與顯著性】</span></li>
<li><span class="y">✔</span><b>H2</b>【假說敘述】<span>【證據：係數與顯著性】</span></li>
<li><span class="x">✘</span><b>H3</b>【假說敘述】<span>【證據：係數與顯著性】</span></li>
</ul>
```

## 範例

```markdown
# 四條假說中三條獲得支持

<ul class="lst">
<li><span class="y">✔</span><b>H1</b>環境態度正向預測節水意圖<span>β = 0.41，p &lt; .001</span></li>
<li><span class="y">✔</span><b>H2</b>使用阻力負向預測節水意圖<span>β = −0.28，p = .004</span></li>
<li><span class="y">✔</span><b>H3</b>社會規範正向預測節水意圖<span>β = 0.19，p = .031</span></li>
<li><span class="x">✘</span><b>H4</b>自我效能調節態度的效果<span>交互作用不顯著，p = .27</span></li>
</ul>
```
