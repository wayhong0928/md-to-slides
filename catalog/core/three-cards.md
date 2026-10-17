---
id: three-cards
name_zh: 三欄卡片
name_en: Three Cards
pack: core
purpose: 三張並排的卡片，每張有名稱、定位與一段說明
scenes: [三種做法介紹, 推薦清單, 方案選項]
classes: [tri, card, card-blue, card-green, card-orange, who, k]
aliases: {}
---

## 骨架

```markdown
# 【填：標題，結論式】

<div class="tri">
<div class="card card-blue"><h3>【填：名稱一】</h3><p class="who">【填：一句定位】</p><b class="k">【填：小標】</b><p>【填：說明，30 字內】</p></div>
<div class="card card-green"><h3>【填：名稱二】</h3><p class="who">【填：一句定位】</p><b class="k">【填：小標】</b><p>【填：說明，30 字內】</p></div>
<div class="card card-orange"><h3>【填：名稱三】</h3><p class="who">【填：一句定位】</p><b class="k">【填：小標】</b><p>【填：說明，30 字內】</p></div>
</div>
```

## 範例

```markdown
# 三種回收方式，成本差很多

<div class="tri">
<div class="card card-blue"><h3>屋頂集水</h3><p class="who">適合舊大樓</p><b class="k">優點</b><p>不必動地基，兩週可完工。</p></div>
<div class="card card-green"><h3>地面導流</h3><p class="who">適合操場旁</p><b class="k">優點</b><p>可兼作生態池，維護費低。</p></div>
<div class="card card-orange"><h3>地下水槽</h3><p class="who">適合新建工程</p><b class="k">注意</b><p>需配合施工期，成本最高。</p></div>
</div>
```
