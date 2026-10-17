---
id: terminal
name_zh: 終端機
name_en: Terminal
pack: teaching
purpose: 仿終端機視窗顯示指令與輸出，旁邊用編號圈列出重點
scenes: [指令教學, 開發者示範, 錯誤訊息說明]
classes: [columns, column, term, bar, u, p, b, c, ok, er, dim, mark, note-list, "n", num]
aliases: {}
---

## 骨架

```markdown
# 【填：標題，這段指令做了什麼】

<div class="columns">
<div class="column">
<div class="term" style="background:#1e1e1e;border-left:none;padding:0;margin:0;font-size:inherit;color:#d4d4d4;">
<div class="bar"><i></i><i></i><i></i> 【填：終端機視窗名稱】</div>
<pre><span class="u">【填：使用者】</span> <span class="p">【填：目錄】</span> <span class="b">【填：分支】</span>
$ <span class="c">【填：指令】</span>
<span class="ok">【填：成功的輸出】</span>
<span class="er">【填：錯誤的輸出】</span>
<span class="dim">【填：次要提示】</span> <span class="mark">【填：要強調的部分】</span></pre>
</div>
</div>
<div class="column">
<div class="note-list">
<div class="n"><b class="num">1</b><span>【填：第一個重點】</span></div>
<div class="n"><b class="num">2</b><span>【填：第二個重點】</span></div>
<div class="n"><b class="num">3</b><span>【填：第三個重點】</span></div>
</div>
</div>
</div>
```

## 範例

```markdown
# 提交前先看一下目前的狀態

<div class="columns">
<div class="column">
<div class="term" style="background:#1e1e1e;border-left:none;padding:0;margin:0;font-size:inherit;color:#d4d4d4;">
<div class="bar"><i></i><i></i><i></i> 終端機</div>
<pre><span class="u">xiaoming@demo</span> <span class="p">~/rain-notes</span> <span class="b">(main)</span>
$ <span class="c">git status</span>
<span class="ok">On branch main</span>
<span class="er">modified: report.md</span>
<span class="dim">no changes added to commit</span> <span class="mark">git add</span></pre>
</div>
</div>
<div class="column">
<div class="note-list">
<div class="n"><b class="num">1</b><span>綠色表示目前所在的分支</span></div>
<div class="n"><b class="num">2</b><span>紅色是已修改、還沒暫存的檔案</span></div>
<div class="n"><b class="num">3</b><span>用 git add 把檔案放進暫存區</span></div>
</div>
</div>
</div>
```
