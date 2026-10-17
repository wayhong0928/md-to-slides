---
id: toc
name_zh: 目錄
name_en: Table of Contents
pack: structure
purpose: 列出各章節與起始頁碼，兩欄排列，附錄用淡色標示
scenes: [長簡報, 課程講義, 口試簡報]
classes: [toc-grid, toc-item, "no", t, pg, extra]
aliases: {}
---

## 骨架

```markdown
# 【目錄標題，例如「今天的內容」】

<div class="toc-grid">
<div class="toc-item"><span class="no">01</span><span class="t">【章節名稱】<small>【一句說明】</small></span><span class="pg">p.【頁碼】</span></div>
<div class="toc-item"><span class="no">02</span><span class="t">【章節名稱】<small>【一句說明】</small></span><span class="pg">p.【頁碼】</span></div>
<div class="toc-item"><span class="no">03</span><span class="t">【章節名稱】<small>【一句說明】</small></span><span class="pg">p.【頁碼】</span></div>
<div class="toc-item"><span class="no">04</span><span class="t">【章節名稱】<small>【一句說明】</small></span><span class="pg">p.【頁碼】</span></div>
<div class="toc-item extra"><span class="no">附</span><span class="t">【附錄名稱】</span><span class="pg">p.【頁碼】</span></div>
</div>
```

## 範例

```markdown
# 今天的內容

<div class="toc-grid">
<div class="toc-item"><span class="no">01</span><span class="t">研究動機<small>為什麼要談雨水回收</small></span><span class="pg">p.3</span></div>
<div class="toc-item"><span class="no">02</span><span class="t">現況調查<small>三棟大樓的用水紀錄</small></span><span class="pg">p.8</span></div>
<div class="toc-item"><span class="no">03</span><span class="t">方案比較<small>兩種蓄水設計</small></span><span class="pg">p.14</span></div>
<div class="toc-item"><span class="no">04</span><span class="t">下一步<small>試辦時程</small></span><span class="pg">p.21</span></div>
<div class="toc-item extra"><span class="no">附</span><span class="t">調查問卷</span><span class="pg">p.25</span></div>
</div>
```
