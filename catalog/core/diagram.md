---
id: diagram
name_zh: 圖解
name_en: Diagram
pack: core
purpose: 內嵌 SVG 畫的圖解，寬度撐滿頁面；複雜圖改放 Mermaid 區塊
scenes: [架構圖, 概念圖, 關係圖]
classes: [loop-svg]
aliases: {}
---

## 骨架

```markdown
# 【標題：結論式，說出圖要傳達的關係】

<svg class="loop-svg" viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
<rect x="40" y="170" width="220" height="100" rx="12" fill="#eaf4fb" stroke="#2980b9" stroke-width="2"/>
<text x="150" y="228" text-anchor="middle" font-size="24">【節點一】</text>
<rect x="540" y="170" width="220" height="100" rx="12" fill="#eafaf1" stroke="#27ae60" stroke-width="2"/>
<text x="650" y="228" text-anchor="middle" font-size="24">【節點二】</text>
<line x1="260" y1="220" x2="540" y2="220" stroke="#445566" stroke-width="3"/>
<text x="400" y="205" text-anchor="middle" font-size="20">【關係】</text>
</svg>
```

## 範例

```markdown
# 雨水回收讓兩個系統接起來

<svg class="loop-svg" viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
<rect x="40" y="170" width="220" height="100" rx="12" fill="#eaf4fb" stroke="#2980b9" stroke-width="2"/>
<text x="150" y="228" text-anchor="middle" font-size="24">屋頂集水</text>
<rect x="540" y="170" width="220" height="100" rx="12" fill="#eafaf1" stroke="#27ae60" stroke-width="2"/>
<text x="650" y="228" text-anchor="middle" font-size="24">廁所用水</text>
<line x1="260" y1="220" x2="540" y2="220" stroke="#445566" stroke-width="3"/>
<text x="400" y="205" text-anchor="middle" font-size="20">過濾後供水</text>
</svg>
```
