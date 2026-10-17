---
id: prompt-breakdown
name_zh: Prompt 拆解
name_en: Prompt Breakdown
pack: teaching
purpose: 把一段提示詞拆成角色、目標、背景、限制、格式、範例六個彩色標籤，每列一句內容
scenes: [提示詞教學, AI 工作坊, 寫作指引]
classes: [prompt, wide, pr, tag, tx, b, g, o, p, r, k]
aliases: {}
---

## 骨架

```markdown
# 【填：標題，好的提示詞有哪幾個部分】

<div class="prompt wide">
<div class="pr"><span class="tag b">【填：角色】</span><span class="tx">【填：你要 AI 扮演誰】</span></div>
<div class="pr"><span class="tag g">【填：目標】</span><span class="tx">【填：你要它完成什麼】</span></div>
<div class="pr"><span class="tag o">【填：背景】</span><span class="tx">【填：它需要知道的前提】</span></div>
<div class="pr"><span class="tag p">【填：限制】</span><span class="tx">【填：不能做什麼、字數上限】</span></div>
<div class="pr"><span class="tag r">【填：格式】</span><span class="tx">【填：輸出的樣子】</span></div>
<div class="pr"><span class="tag k">【填：範例】</span><span class="tx">【填：給它一個參考答案】</span></div>
</div>
```

## 範例

```markdown
# 一個好提示詞有六個部分

<div class="prompt wide">
<div class="pr"><span class="tag b">角色</span><span class="tx">你是校園永續專題的助教</span></div>
<div class="pr"><span class="tag g">目標</span><span class="tx">幫我檢查報告大綱是否完整</span></div>
<div class="pr"><span class="tag o">背景</span><span class="tx">這是大二的期中報告，題目是雨水回收</span></div>
<div class="pr"><span class="tag p">限制</span><span class="tx">只指出缺漏，不要改寫內容</span></div>
<div class="pr"><span class="tag r">格式</span><span class="tx">用條列，每點不超過 30 字</span></div>
<div class="pr"><span class="tag k">範例</span><span class="tx">缺少：研究限制的說明</span></div>
</div>
```
