---
marp: true
theme: midnight
paginate: true
---

<!-- _class: cover -->

<div class="cover-title">用 Git 幫期末報告留版本</div>
<div class="cover-subtitle">九十分鐘入門工作坊｜帶自己的筆電</div>
<hr>
<div class="cover-meta">講師 阿哲｜週六下午</div>

---

# 今天的內容

<div class="toc-grid">
<div class="toc-item"><span class="no">01</span><span class="t">為什麼要留版本<small>報告改壞了怎麼回去</small></span><span class="pg">p.3</span></div>
<div class="toc-item"><span class="no">02</span><span class="t">三個指令<small>add、commit、log</small></span><span class="pg">p.5</span></div>
<div class="toc-item"><span class="no">03</span><span class="t">練習一<small>存第一個版本</small></span><span class="pg">p.7</span></div>
<div class="toc-item"><span class="no">04</span><span class="t">回到舊版本<small>restore 與 switch</small></span><span class="pg">p.8</span></div>
<div class="toc-item"><span class="no">05</span><span class="t">練習二<small>救回刪掉的段落</small></span><span class="pg">p.11</span></div>
</div>

---

<!-- _class: section-slide -->

<div class="section-label">PART 1</div>

# 為什麼要留版本

---

# 三種留版本的方法，只有 Git 記得改了哪裡

<div class="tri">
<div class="card card-blue"><h3>另存新檔</h3><p class="who">報告_最終版_真的最終.docx</p><b class="k">問題</b><p>檔名越來越長，不知道差在哪</p></div>
<div class="card card-green"><h3>雲端版本紀錄</h3><p class="who">雲端硬碟自動保存</p><b class="k">問題</b><p>每次存檔都算一版，找不到想要的那版</p></div>
<div class="card card-orange"><h3>Git</h3><p class="who">自己決定什麼時候存一版</p><b class="k">好處</b><p>每版附一句說明，能比對差異</p></div>
</div>

---

# 存一個版本只要三步

<div class="steps">
<div class="st"><div class="n">1</div><div class="cmd">git add report.md</div><div class="cmd say">把這個檔案放進「要存的清單」</div></div>
<div class="st"><div class="n">2</div><div class="cmd">git commit -m "寫完第二章"</div><div class="cmd say">存成一個版本，附一句說明</div></div>
<div class="st"><div class="n">3</div><div class="cmd">git log --oneline</div><div class="cmd say">看目前存了哪些版本</div></div>
</div>

---

# 存完之後，log 會列出每一版的說明

<div class="columns">
<div class="column">
<div class="term" style="background:#1e1e1e;border-left:none;padding:0;margin:0;font-size:inherit;color:#d4d4d4;">
<div class="bar"><i></i><i></i><i></i> 終端機</div>
<pre><span class="u">student</span> <span class="p">~/期末報告</span> <span class="b">main</span>
$ <span class="c">git log --oneline</span>
<span class="ok">a3f9c21 寫完第二章</span>
<span class="ok">7be0d45 第一章改用新數據</span>
<span class="dim">1c2e8aa 建立報告大綱</span> <span class="mark">← 第一版</span></pre>
</div>
</div>
<div class="column">
<div class="note-list">
<div class="n"><b class="num">1</b><span>最上面是最新的版本</span></div>
<div class="n"><b class="num">2</b><span>前七碼是版本代號，回到舊版時會用到</span></div>
<div class="n"><b class="num">3</b><span>說明寫做了什麼，不要寫「更新」</span></div>
</div>
</div>
</div>

---

# 練習一：幫自己的報告存第一個版本

<span class="timer">⏱ 10 分鐘</span>

<div class="flow-step"><h3>建立資料夾</h3><p>在報告資料夾執行 git init</p></div>
<div class="flow-step"><h3>存第一版</h3><p>add 再 commit，說明寫「建立報告大綱」</p></div>
<div class="flow-step"><h3>改一段再存</h3><p>隨便改一句話，再存第二版</p></div>

<div class="done">git log 看得到兩行，就可以舉手</div>

---

<!-- _class: section-slide -->

<div class="section-label">PART 2</div>

# 回到舊版本

---

# 想看或想回去，用的指令不一樣

<table class="mdpair">
<tr><th>指令</th><th>做什麼</th></tr>
<tr><td>git diff</td><td>看還沒存的修改</td></tr>
<tr><td>git restore report.md</td><td>丟掉還沒存的修改，回到上一版</td></tr>
<tr><td>git switch --detach 7be0d45</td><td>暫時切到舊版本看看，不會刪掉新的</td></tr>
<tr><td>git switch main</td><td>從舊版本回到最新</td></tr>
</table>

---

# 怎麼確認自己真的救回來了

<div class="gwt">
<div class="g"><b class="k">GIVEN</b><span>第三章寫到一半，還沒存版本</span><div class="ex">report.md 有改動</div></div>
<div class="w"><b class="k">WHEN</b><span>不小心刪掉一整段，然後執行 restore</span><div class="ex">git restore report.md</div></div>
<div class="t"><b class="k">THEN</b><span>檔案回到上一次 commit 的樣子</span><div class="ex">刪掉的段落回來了，沒存的修改也一起不見</div></div>
</div>

---

# 練習二：救回刪掉的段落

<span class="timer">⏱ 15 分鐘</span>

<div class="flow-step"><h3>先存一版</h3><p>確認 git status 顯示沒有修改</p></div>
<div class="flow-step"><h3>刪掉一段</h3><p>刪掉報告裡任一段，存檔</p></div>
<div class="flow-step"><h3>救回來</h3><p>用 git diff 確認刪了什麼，再用 restore 救回</p></div>

<div class="done">段落回來、git status 又顯示沒有修改，就完成了</div>

---

<!-- _class: thankyou -->

# 回家先幫報告存一版

有問題在課程群組發問，附上 git status 的輸出
