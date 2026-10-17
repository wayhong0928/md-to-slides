---
id: code
name_zh: 程式碼
name_en: Code
pack: core
purpose: 一段程式碼加重點說明，字級縮小以容納較長的程式
scenes: [程式教學, 技術分享, 設定說明]
classes: [codecol, dense]
aliases: {}
---

## 骨架

````markdown
<!-- _class: codecol dense -->

# 【標題：這段程式在做什麼】

```【語言，例如 python】
【程式碼，十行內】
```

- 【重點說明】
- 【重點說明】
````

## 範例

````markdown
<!-- _class: codecol dense -->

# 十行算出一個月的集水量

```python
area = 820          # 屋頂面積（平方公尺）
rain_mm = 150       # 當月降雨量（毫米）
coef = 0.8          # 集水效率
liters = area * rain_mm * coef
print(f"{liters:,.0f} 公升")
```

- 面積乘降雨量得到體積，再乘集水效率
- 輸出加上千分位，方便閱讀
````
