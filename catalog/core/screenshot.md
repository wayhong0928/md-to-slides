---
id: screenshot
name_zh: 截圖
name_en: Screenshot
pack: core
purpose: 一頁一張圖，加一句說明與來源；圖還沒準備好時用虛線框佔位
scenes: [操作示範, 介面說明, 資料來源展示]
classes: [shot, shot-wrap, shot-todo, shot-big, shot-cap, shot-src]
aliases: {}
---

## 骨架

```markdown
<!-- _class: shot -->

# 【標題：這張圖要讓觀眾看到什麼】

<div class="shot-wrap"><div class="shot-todo shot-big">【截圖 16:9：操作畫面或資料來源，圖準備好後換成 img】</div></div>

<p class="shot-cap">【一句話說明圖的重點】</p>
<p class="shot-src">【來源：網站或文件名稱、擷取日期】</p>
```

## 範例

```markdown
<!-- _class: shot -->

# 儀表板顯示用水量逐月上升

<div class="shot-wrap"><div class="shot-todo shot-big">截圖 16:9：虛構的用水量儀表板</div></div>

<p class="shot-cap">六月到九月的用水量增加了三成。</p>
<p class="shot-src">來源：虛構總務處用水儀表板，2026-10-01</p>
```
