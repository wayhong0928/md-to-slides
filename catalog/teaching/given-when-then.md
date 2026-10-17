---
id: given-when-then
name_zh: Given／When／Then
name_en: Given When Then
pack: teaching
purpose: 三格帶箭頭的情境描述：前提、動作、預期結果，每格下方可附一個例子
scenes: [需求說明, 測試案例, 情境教學]
classes: [gwt, g, w, t, k, ex]
aliases: {}
---

## 骨架

```markdown
# 【標題：這個情境要驗證什麼】

<div class="gwt">
<div class="g"><b class="k">GIVEN</b><span>【前提：事情發生前的狀態】</span><div class="ex">【例子】</div></div>
<div class="w"><b class="k">WHEN</b><span>【動作：使用者做了什麼】</span><div class="ex">【例子】</div></div>
<div class="t"><b class="k">THEN</b><span>【結果：預期看到什麼】</span><div class="ex">【例子】</div></div>
</div>
```

## 範例

```markdown
# 水槽滿了就要自動排水

<div class="gwt">
<div class="g"><b class="k">GIVEN</b><span>水槽水位已達九成滿</span><div class="ex">水位計顯示 90%</div></div>
<div class="w"><b class="k">WHEN</b><span>又下了一場大雨</span><div class="ex">每小時雨量 30 毫米</div></div>
<div class="t"><b class="k">THEN</b><span>溢流閥開啟，多餘的水排入雨水溝</span><div class="ex">水位維持在 95% 以下</div></div>
</div>
```
