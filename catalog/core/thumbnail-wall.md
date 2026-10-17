---
id: thumbnail-wall
name_zh: 縮圖牆
name_en: Thumbnail Wall
pack: core
purpose: 四欄 16:9 縮圖，每張下方放標題連結與來源，適合列出多個影片或網頁
scenes: [推薦影片, 參考網站, 案例一覽]
classes: [shot, shot-wrap, rgrid, c4, th, vt]
aliases: {}
---

## 骨架

```markdown
<!-- _class: shot -->

# 【填：標題，這組資源的共同點】

<div class="shot-wrap"><div class="rgrid c4">
<figure><img class="th" src="images/【填：縮圖一】.png"><figcaption><a class="vt" href="【填：網址】">【填：標題】</a><span>【填：來源】</span></figcaption></figure>
<figure><img class="th" src="images/【填：縮圖二】.png"><figcaption><a class="vt" href="【填：網址】">【填：標題】</a><span>【填：來源】</span></figcaption></figure>
<figure><img class="th" src="images/【填：縮圖三】.png"><figcaption><a class="vt" href="【填：網址】">【填：標題】</a><span>【填：來源】</span></figcaption></figure>
<figure><img class="th" src="images/【填：縮圖四】.png"><figcaption><a class="vt" href="【填：網址】">【填：標題】</a><span>【填：來源】</span></figcaption></figure>
</div></div>
```

## 範例

```markdown
<!-- _class: shot -->

# 四支影片帶你看懂雨水回收

<div class="shot-wrap"><div class="rgrid c4">
<figure><img class="th" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%23dfe6ec'/%3E%3C/svg%3E"><figcaption><a class="vt" href="https://example.com/v1">集水原理</a><span>example.com</span></figcaption></figure>
<figure><img class="th" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%23dfe6ec'/%3E%3C/svg%3E"><figcaption><a class="vt" href="https://example.com/v2">過濾設備</a><span>example.com</span></figcaption></figure>
<figure><img class="th" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%23dfe6ec'/%3E%3C/svg%3E"><figcaption><a class="vt" href="https://example.com/v3">校園案例</a><span>example.com</span></figcaption></figure>
<figure><img class="th" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%23dfe6ec'/%3E%3C/svg%3E"><figcaption><a class="vt" href="https://example.com/v4">維護須知</a><span>example.com</span></figcaption></figure>
</div></div>
```
