---
id: tech-talk
name_zh: 技術分享
themes: [midnight]
sections:
  - title: 開場
    slides: 2
    layouts: [cover, toc]
  - title: 問題
    slides: 3
    layouts: [section, conclusion-bar, diagram]
  - title: 做法
    slides: 3
    layouts: [section, code, terminal]
  - title: 成效
    slides: 1
    layouts: [stat-boxes]
  - title: 收尾
    slides: 2
    layouts: [references, closing]
---

## 填空版

````markdown
<!-- _class: cover -->

<div class="cover-title">【填：分享題目，一句話講解決了什麼，20 字內】</div>
<div class="cover-subtitle">【填：場合，例如團隊技術分享會】</div>
<hr>
<div class="cover-meta">【填：講者姓名】｜【填：日期】</div>

---

# 今天的內容

<div class="toc-grid">
<div class="toc-item"><span class="no">01</span><span class="t">問題<small>【填：一句說明】</small></span><span class="pg">p.3</span></div>
<div class="toc-item"><span class="no">02</span><span class="t">做法<small>【填：一句說明】</small></span><span class="pg">p.6</span></div>
<div class="toc-item"><span class="no">03</span><span class="t">成效<small>【填：一句說明】</small></span><span class="pg">p.9</span></div>
<div class="toc-item extra"><span class="no">附</span><span class="t">參考資料</span><span class="pg">p.10</span></div>
</div>

---

<!-- _class: section-slide -->

<div class="section-label">PART 1</div>

# 問題

---

# 【填：標題，結論式，說出問題有多嚴重】

- 【填：現象，例如某件事要花多久】
- 【填：影響，誰被卡住】
- 【填：為什麼以前沒處理】

<div class="conclusion">【填：結論，一句話講要解決的問題，20 字內】</div>

---

# 【填：標題，結論式，說出圖要傳達的關係】

<svg class="loop-svg" viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
<rect x="40" y="170" width="220" height="100" rx="12" fill="#eaf4fb" stroke="#2980b9" stroke-width="2"/>
<text x="150" y="228" text-anchor="middle" font-size="24">【填：節點一】</text>
<rect x="540" y="170" width="220" height="100" rx="12" fill="#eafaf1" stroke="#27ae60" stroke-width="2"/>
<text x="650" y="228" text-anchor="middle" font-size="24">【填：節點二】</text>
<line x1="260" y1="220" x2="540" y2="220" stroke="#445566" stroke-width="3"/>
<text x="400" y="205" text-anchor="middle" font-size="20">【填：關係】</text>
</svg>

---

<!-- _class: section-slide -->

<div class="section-label">PART 2</div>

# 做法

---

<!-- _class: codecol dense -->

# 【填：標題，這段程式在做什麼】

```【填：語言，例如 python】
【填：程式碼，十行內】
```

- 【填：重點說明】
- 【填：重點說明】

---

# 【填：標題，這段指令做了什麼】

<div class="columns">
<div class="column">
<div class="term" style="background:#1e1e1e;border-left:none;padding:0;margin:0;font-size:inherit;color:#d4d4d4;">
<div class="bar"><i></i><i></i><i></i> 【填：終端機視窗名稱】</div>
<pre>$ <span class="c">【填：指令】</span>
<span class="ok">【填：成功的輸出】</span>
<span class="dim">【填：灰色小字，補充說明輸出】</span> <span class="mark">【填：用重點色標出的關鍵字】</span></pre>
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

---

# 【填：標題，結論式，說出數字代表什麼】

<div class="stat-grid">
<div class="stat-box"><span class="stat-num">【填：數字】</span><span class="stat-label">【填：改善前】</span></div>
<div class="stat-box green"><span class="stat-num">【填：數字】</span><span class="stat-label">【填：改善後】</span></div>
<div class="stat-box orange"><span class="stat-num">【填：數字】</span><span class="stat-label">【填：其他指標】</span></div>
</div>

---

<!-- _class: refs -->

# 參考資料

<div class="refgrid">
<div>
<h4>【填：分類一，例如官方文件】</h4>
<ul>
<li>【填：文件名稱。網址。】</li>
<li>【填：文件名稱。網址。】</li>
</ul>
</div>
<div>
<h4>【填：分類二，例如延伸閱讀】</h4>
<ul>
<li>【填：作者（年份）。標題。出處。】</li>
<li>【填：作者（年份）。標題。出處。】</li>
</ul>
</div>
</div>

---

<!-- _class: thankyou -->

# Q &amp; A

【填：聯絡方式或程式碼位置】
````

## 範例版

````markdown
<!-- _class: cover -->

<div class="cover-title">測試從 8 分鐘縮到 2 分鐘</div>
<div class="cover-subtitle">虛構軟體公司　前端團隊技術分享會</div>
<hr>
<div class="cover-meta">鄭小傑｜2026-08-14</div>

---

# 今天的內容

<div class="toc-grid">
<div class="toc-item"><span class="no">01</span><span class="t">問題<small>每次推送都要等 8 分鐘</small></span><span class="pg">p.3</span></div>
<div class="toc-item"><span class="no">02</span><span class="t">做法<small>平行執行加只跑改到的測試</small></span><span class="pg">p.6</span></div>
<div class="toc-item"><span class="no">03</span><span class="t">成效<small>兩週的數字</small></span><span class="pg">p.9</span></div>
<div class="toc-item extra"><span class="no">附</span><span class="t">參考資料</span><span class="pg">p.10</span></div>
</div>

---

<!-- _class: section-slide -->

<div class="section-label">PART 1</div>

# 問題

---

# 每次推送等 8 分鐘，一天浪費一小時

- 單元測試 1,400 個，設定關掉了平行，全部依序跑
- 每人每天推送約 8 次
- 測試慢到大家開始跳過測試直接推送

<div class="conclusion">目標是把測試壓到 2 分鐘內</div>

---

# 平行被關掉，多顆 CPU 核心只用到一顆

<svg class="loop-svg" viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
<rect x="40" y="170" width="220" height="100" rx="12" fill="#eaf4fb" stroke="#2980b9" stroke-width="2"/>
<text x="150" y="228" text-anchor="middle" font-size="24">1,400 個測試</text>
<rect x="540" y="170" width="220" height="100" rx="12" fill="#eafaf1" stroke="#27ae60" stroke-width="2"/>
<text x="650" y="228" text-anchor="middle" font-size="24">只用到一顆核心</text>
<line x1="260" y1="220" x2="540" y2="220" stroke="#445566" stroke-width="3"/>
<text x="400" y="205" text-anchor="middle" font-size="20">一個接一個跑</text>
</svg>

---

<!-- _class: section-slide -->

<div class="section-label">PART 2</div>

# 做法

---

<!-- _class: codecol dense -->

# 刪掉一行設定，測試檔改回平行跑

```js
// vitest.config.js
export default {
  test: {
    // 以前為了共用資料庫關掉平行，這行刪掉
    // fileParallelism: false,
  },
};
```

- Vitest 預設就把測試檔分給多個 worker 同時跑
- 共用資料庫的測試要先改成各自建資料

---

# --changed 只跑受修改影響的測試

<div class="columns">
<div class="column">
<div class="term" style="background:#1e1e1e;border-left:none;padding:0;margin:0;font-size:inherit;color:#d4d4d4;">
<div class="bar"><i></i><i></i><i></i> 終端機</div>
<pre>$ <span class="c">npx vitest run --changed</span>
<span class="ok">Tests  86 passed (86)</span>
<span class="dim">其餘測試檔沒有執行</span> <span class="mark">只跑改到的部分</span></pre>
</div>
</div>
<div class="column">
<div class="note-list">
<div class="n"><b class="num">1</b><span>依 git 的修改找出受影響的測試</span></div>
<div class="n"><b class="num">2</b><span>合併前仍然跑完整一次</span></div>
<div class="n"><b class="num">3</b><span>本機開發時用，CI 照跑全部</span></div>
</div>
</div>
</div>

---

# 兩週後，平均等候降到 2 分鐘內

<div class="stat-grid">
<div class="stat-box"><span class="stat-num">8 分鐘</span><span class="stat-label">改善前</span></div>
<div class="stat-box green"><span class="stat-num">1.9 分鐘</span><span class="stat-label">改善後</span></div>
<div class="stat-box orange"><span class="stat-num">0 次</span><span class="stat-label">跳過測試的推送</span></div>
</div>

---

<!-- _class: refs -->

# 參考資料

<div class="refgrid">
<div>
<h4>官方文件</h4>
<ul>
<li>Vitest 官方文件，設定說明。vitest.dev</li>
<li>Vitest 官方文件，命令列選項。vitest.dev</li>
</ul>
</div>
<div>
<h4>團隊內部</h4>
<ul>
<li>前端團隊（2026）。測試加速紀錄。內部文件。</li>
<li>前端團隊（2026）。CI 設定說明。內部文件。</li>
</ul>
</div>
</div>

---

<!-- _class: thankyou -->

# Q &amp; A

設定檔放在團隊 wiki 的「測試」頁
````
