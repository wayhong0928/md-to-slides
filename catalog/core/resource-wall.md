---
id: resource-wall
name_zh: 資源牆
name_en: Resource Wall
pack: core
purpose: 兩欄大頭貼加名稱、網址與一句推薦語，適合推薦頻道、作者或工具
scenes: [推薦清單, 講者介紹, 工具資源]
classes: [shot, shot-wrap, rgrid, av]
aliases: {}
---

## 骨架

```markdown
<!-- _class: shot -->

# 【標題：這組推薦的共同點】

<div class="shot-wrap"><div class="rgrid">
<figure><img class="av" src="images/【頭像一】.png"><figcaption>【名稱】<span>【網址】</span></figcaption></figure>
<figure><img class="av" src="images/【頭像二】.png"><figcaption>【名稱】<span>【網址】</span></figcaption></figure>
</div></div>
```

## 範例

```markdown
<!-- _class: shot -->

# 兩個值得追蹤的環境頻道

<div class="shot-wrap"><div class="rgrid">
<figure><img class="av" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='%23c0cdd8'/%3E%3C/svg%3E"><figcaption>王小明的永續筆記<span>example.com/xiaoming</span></figcaption></figure>
<figure><img class="av" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='%23c0cdd8'/%3E%3C/svg%3E"><figcaption>李小華的水資源課<span>example.com/xiaohua</span></figcaption></figure>
</div></div>
```
