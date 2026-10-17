---
marp: true
theme: classic
paginate: true
---

<!-- _class: cover -->

<div class="cover-title">版型目錄一覽</div>
<div class="cover-subtitle">共 35 個版型，每頁示範一個，內容全部虛構</div>
<hr>
<div class="cover-meta">由 npm run showcase 從 catalog/ 產生，不要直接修改這個檔案</div>

---

<!-- 版型 appendix-divider（附錄分隔頁） -->

<!-- _class: appendix-divider -->

# 附錄

調查問卷與原始資料

---

<!-- 版型 closing（結尾頁） -->

<!-- _class: thankyou -->

# 謝謝聆聽

歡迎提問｜xiaoming.wang@example.com

---

<!-- 版型 cover（封面） -->

<!-- _class: cover -->

<div class="cover-title">校園雨水回收的可行性初探</div>
<div class="cover-subtitle">虛構大學環境社「永續校園」專題期中報告</div>
<hr>
<div class="cover-meta">王小明｜2026-10-17</div>

---

<!-- 版型 section（章節頁） -->

<!-- _class: section-slide -->

<div class="section-label">PART 2</div>

# 現況調查

---

<!-- 版型 toc（目錄） -->

# 今天的內容

<div class="toc-grid">
<div class="toc-item"><span class="no">01</span><span class="t">研究動機<small>為什麼要談雨水回收</small></span><span class="pg">p.3</span></div>
<div class="toc-item"><span class="no">02</span><span class="t">現況調查<small>三棟大樓的用水紀錄</small></span><span class="pg">p.8</span></div>
<div class="toc-item"><span class="no">03</span><span class="t">方案比較<small>兩種蓄水設計</small></span><span class="pg">p.14</span></div>
<div class="toc-item"><span class="no">04</span><span class="t">下一步<small>試辦時程</small></span><span class="pg">p.21</span></div>
<div class="toc-item extra"><span class="no">附</span><span class="t">調查問卷</span><span class="pg">p.25</span></div>
</div>

---

<!-- 版型 callout（提示框） -->

# 清洗水槽前先確認三件事

<div class="tip">清洗選在連續晴天的前一天，水槽乾得快。</div>
<div class="warning">進入水槽前要先通風，並有第二人在場。</div>
<div class="danger">不要用含氯清潔劑，會傷害水槽內襯。</div>

---

<!-- 版型 code（程式碼） -->

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

---

<!-- 版型 conclusion-bar（結論列） -->

# 試辦成本可以控制

- 設備費約三十萬，由環境社與總務處分攤
- 維護由志工輪值，每月兩小時
- 第一年只裝一棟，效果不好隨時停止

<div class="conclusion">先小規模試辦，用一個學期的數據再決定要不要擴大。</div>

---

<!-- 版型 diagram（圖解） -->

# 雨水回收讓兩個系統接起來

<svg class="loop-svg" viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
<rect x="40" y="170" width="220" height="100" rx="12" fill="#eaf4fb" stroke="#2980b9" stroke-width="2"/>
<text x="150" y="228" text-anchor="middle" font-size="24">屋頂集水</text>
<rect x="540" y="170" width="220" height="100" rx="12" fill="#eafaf1" stroke="#27ae60" stroke-width="2"/>
<text x="650" y="228" text-anchor="middle" font-size="24">廁所用水</text>
<line x1="260" y1="220" x2="540" y2="220" stroke="#445566" stroke-width="3"/>
<text x="400" y="205" text-anchor="middle" font-size="20">過濾後供水</text>
</svg>

---

<!-- 版型 flow-horizontal（橫向流程） -->

# 雨水從屋頂到馬桶要經過三關

<div class="hflow">
<div class="hbox red"><b>集水</b><span>屋頂與落水管收集雨水</span></div>
<div class="harrow">➜</div>
<div class="hbox yellow"><b>過濾</b><span>初期雨水捨棄，再過濾雜質</span></div>
<div class="harrow">➜</div>
<div class="hbox gray"><b>供水</b><span>加壓送到廁所水箱</span></div>
</div>

<div class="hflow big">
<div class="hbox bad"><b>改善前</b><span>落水管直接排進雨水溝</span></div>
<div class="harrow">➜</div>
<div class="hbox good"><b>改善後</b><span>雨水先進水槽，再供沖廁</span></div>
</div>

<div class="cloud-bar">缺水時自動切換回自來水。</div>

---

<!-- 版型 four-cards（四格卡片） -->

# 評估雨水回收要看四件事

<div class="columns">
<div class="column"><div class="card card-blue"><h3>集水量</h3><p>屋頂面積乘以年降雨量。</p></div></div>
<div class="column"><div class="card card-green"><h3>用途</h3><p>沖廁與澆灌，不直接飲用。</p></div></div>
</div>
<div class="columns" style="margin-top: 12px;">
<div class="column"><div class="card card-red"><h3>風險</h3><p>水質變化與蚊蟲孳生。</p></div></div>
<div class="column"><div class="card card-orange"><h3>成本</h3><p>設備與每年維護費。</p></div></div>
</div>

---

<!-- 版型 loop-cycle（迴圈圖） -->

# 每個月重複一次檢查

<div class="loop-row">
<span class="step-pill">採樣</span><span class="step-arrow">➜</span>
<span class="step-pill hl">化驗水質</span><span class="step-arrow">➜</span>
<span class="step-pill">調整濾材</span><span class="step-arrow">↺</span>
</div>

<div class="loop-note">每輪的化驗結果都和上個月比較，連續兩次異常才更換設備。</div>

---

<!-- 版型 quote-note（引言與附註） -->

# 受訪者最在意的是維護

<div class="quote">水槽裝好以後沒人管，一個夏天就長蚊子了。<small>受訪者 A（虛構），總務處職員</small></div>

- 維護責任歸屬不清，是第一個被提到的問題
- 方案要附上每月清洗的分工表

---

<!-- 版型 references（參考資料） -->

<!-- _class: refs -->

# 參考資料

<div class="refgrid">
<div>
<h4>集水與水質</h4>
<ul>
<li>李小華（2023）。屋頂集水水質的季節變化。虛構環境期刊，12(3)，45–58。</li>
<li>陳大文（2022）。校園用水調查方法。虛構工程學報，8(1)，1–15。</li>
</ul>
</div>
<div>
<h4>政策與案例</h4>
<ul>
<li>虛構市政府（2024）。雨水利用補助要點。https://example.com/policy</li>
<li>林小美（2021）。大專院校節水案例彙編。虛構出版社。</li>
</ul>
</div>
</div>

---

<!-- 版型 resource-wall（資源牆） -->

<!-- _class: shot -->

# 兩個值得追蹤的環境頻道

<div class="shot-wrap"><div class="rgrid">
<figure><img class="av" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='%23c0cdd8'/%3E%3C/svg%3E"><figcaption>王小明的永續筆記<span>example.com/xiaoming</span></figcaption></figure>
<figure><img class="av" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='%23c0cdd8'/%3E%3C/svg%3E"><figcaption>李小華的水資源課<span>example.com/xiaohua</span></figcaption></figure>
</div></div>

---

<!-- 版型 screenshot（截圖） -->

<!-- _class: shot -->

# 儀表板顯示用水量逐月上升

<div class="shot-wrap"><div class="shot-todo shot-big">截圖 16:9：虛構的用水量儀表板</div></div>

<p class="shot-cap">六月到九月的用水量增加了三成。</p>
<p class="shot-src">來源：虛構總務處用水儀表板，2026-10-01</p>

---

<!-- 版型 stat-boxes（數字方塊） -->

# 一個學期的試辦成果

<div class="stat-grid">
<div class="stat-box"><span class="stat-num">1,240</span><span class="stat-label">公升／月 集水量</span></div>
<div class="stat-box green"><span class="stat-num">36%</span><span class="stat-label">沖廁用水替代率</span></div>
<div class="stat-box orange"><span class="stat-num">12</span><span class="stat-label">志工參與人數</span></div>
<div class="stat-box red"><span class="stat-num">2</span><span class="stat-label">水質異常次數</span></div>
<div class="stat-box purple"><span class="stat-num">4.3</span><span class="stat-label">滿意度（滿分 5）</span></div>
</div>

---

<!-- 版型 syntax-compare（語法對照） -->

# 三種常用的 Markdown 標記

<table class="mdpair">
<tr><th>寫法</th><th>呈現結果</th></tr>
<tr><td>**重點**</td><td>粗體強調</td></tr>
<tr><td>- 項目</td><td>項目符號清單</td></tr>
<tr><td>[說明](網址)</td><td>超連結</td></tr>
</table>

---

<!-- 版型 table（表格） -->

# 三棟大樓的月用水量差距大

| 大樓 | 屋頂面積（平方公尺） | 月用水量（度） | 沖廁占比 |
|---|---|---|---|
| 甲棟 | 820 | 310 | 42% |
| 乙棟 | 640 | 255 | 38% |
| 丙棟 | 1,050 | 420 | 47% |

---

<!-- 版型 three-cards（三欄卡片） -->

# 三種回收方式，成本差很多

<div class="tri">
<div class="card card-blue"><h3>屋頂集水</h3><p class="who">適合舊大樓</p><b class="k">優點</b><p>不必動地基，兩週可完工。</p></div>
<div class="card card-green"><h3>地面導流</h3><p class="who">適合操場旁</p><b class="k">優點</b><p>可兼作生態池，維護費低。</p></div>
<div class="card card-orange"><h3>地下水槽</h3><p class="who">適合新建工程</p><b class="k">注意</b><p>需配合施工期，成本最高。</p></div>
</div>

---

<!-- 版型 thumbnail-wall（縮圖牆） -->

<!-- _class: shot -->

# 四支影片帶你看懂雨水回收

<div class="shot-wrap"><div class="rgrid c4">
<figure><img class="th" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%23dfe6ec'/%3E%3C/svg%3E"><figcaption><a class="vt" href="https://example.com/v1">集水原理</a><span>example.com</span></figcaption></figure>
<figure><img class="th" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%23dfe6ec'/%3E%3C/svg%3E"><figcaption><a class="vt" href="https://example.com/v2">過濾設備</a><span>example.com</span></figcaption></figure>
<figure><img class="th" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%23dfe6ec'/%3E%3C/svg%3E"><figcaption><a class="vt" href="https://example.com/v3">校園案例</a><span>example.com</span></figcaption></figure>
<figure><img class="th" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%23dfe6ec'/%3E%3C/svg%3E"><figcaption><a class="vt" href="https://example.com/v4">維護須知</a><span>example.com</span></figcaption></figure>
</div></div>

---

<!-- 版型 timeline（時間軸） -->

# 試辦計畫分四個階段

<div class="timeline">
<div class="tl-step"><div class="tl-dot">1</div><div class="tl-label"><strong>11 月</strong><span>提案與經費申請</span></div></div>
<div class="tl-step"><div class="tl-dot">2</div><div class="tl-label"><strong>12 月</strong><span>設備採購</span></div></div>
<div class="tl-step"><div class="tl-dot">3</div><div class="tl-label"><strong>2 月</strong><span>安裝與試運轉</span></div></div>
<div class="tl-step"><div class="tl-dot">4</div><div class="tl-label"><strong>6 月</strong><span>成果檢討</span></div></div>
</div>

---

<!-- 版型 two-column（雙欄對照） -->

# 兩種蓄水設計各有取捨

<div class="columns">
<div class="column">

### 地下水槽

- 不佔地面空間
- 施工費用較高

</div>
<div class="column">

### 屋頂水塔

- 施工簡單
- 需要加固樓板

</div>
</div>

---

<!-- 版型 construct-badges（構念徽章） -->

# 本研究涵蓋五個構念

<p><span class="construct-badge">環境態度</span> 對保護環境的重視程度</p>
<p><span class="construct-badge-red">使用阻力</span> 覺得設備麻煩或不值得</p>
<p><span class="construct-badge-green">節水意圖</span> 未來願意主動節水的程度</p>
<p><span class="construct-badge-orange">社會規範</span> 周遭的人是否期待節水</p>
<p><span class="construct-badge-purple">自我效能</span> 相信自己做得到的程度</p>

---

<!-- 版型 hypothesis-list（假說列表） -->

# 四條假說中三條獲得支持

<ul class="lst">
<li><span class="y">✔</span><b>H1</b>環境態度正向預測節水意圖<span>β = 0.41，p &lt; .001</span></li>
<li><span class="y">✔</span><b>H2</b>使用阻力負向預測節水意圖<span>β = −0.28，p = .004</span></li>
<li><span class="y">✔</span><b>H3</b>社會規範正向預測節水意圖<span>β = 0.19，p = .031</span></li>
<li><span class="x">✘</span><b>H4</b>自我效能調節態度的效果<span>交互作用不顯著，p = .27</span></li>
</ul>

---

<!-- 版型 operational-definition（操作型定義） -->

# 兩個構念都用五點量表測量

<div class="opdef"><span class="construct-badge">環境態度</span><br>改編自虛構量表，共 6 題，1 分非常不同意到 5 分非常同意，取平均分數。</div>
<div class="opdef"><span class="construct-badge">節水意圖</span><br>自編 4 題，問未來三個月是否願意參與回收設備維護，取平均分數。</div>

---

<!-- 版型 research-questions（研究問題） -->

# 本研究要回答三個問題

<div class="card-accent"><b>RQ1</b>　校園使用者對雨水回收設備的接受程度如何？</div>
<div class="card-accent"><b>RQ2</b>　哪些因素和節水意圖有關？</div>
<div class="card-accent"><b>RQ3</b>　維護分工的方式是否影響設備的使用狀況？</div>

---

<!-- 版型 variable-model（變數模型圖） -->

# 志工參與度透過維護品質影響水質

<div class="hflow">
<div class="hcol">
<div class="hbox blue"><b>志工人數</b><span>每月輪值人次</span></div>
<div class="hbox blue"><b>清洗頻率</b><span>每月清洗次數</span></div>
</div>
<div class="harrow">➜</div>
<div class="hbox orange"><b>維護品質</b><span>檢核表得分</span></div>
<div class="harrow">➜</div>
<div class="hbox green"><b>水質穩定度</b><span>濁度與酸鹼值</span></div>
</div>

<div class="hback">調節變數：季節（雨季與乾季會改變維護品質對水質的效果）</div>

---

<!-- 版型 classroom-exercise（課堂練習） -->

# 練習：替水槽寫一張維護檢核表

<span class="timer">⏱ 10 分鐘</span>

<div class="flow-step"><h3>列出項目</h3><p>寫下每月要檢查的五件事。</p></div>
<div class="flow-step"><h3>排出順序</h3><p>依實際走動路線排序。</p></div>
<div class="flow-step"><h3>交換檢查</h3><p>和隔壁同學交換，找出看不懂的地方。</p></div>

<div class="done">完成標準：檢核表有五個項目，而且隔壁同學照著做得出來。</div>

---

<!-- 版型 given-when-then（Given／When／Then） -->

# 水槽滿了就要自動排水

<div class="gwt">
<div class="g"><b class="k">GIVEN</b><span>水槽水位已達九成滿</span><div class="ex">水位計顯示 90%</div></div>
<div class="w"><b class="k">WHEN</b><span>又下了一場大雨</span><div class="ex">每小時雨量 30 毫米</div></div>
<div class="t"><b class="k">THEN</b><span>溢流閥開啟，多餘的水排入雨水溝</span><div class="ex">水位維持在 95% 以下</div></div>
</div>

---

<!-- 版型 ladder（階梯） -->

# 水質風險分成四級

<div class="ladder">
<div class="rung r0"><b>第 0 級：清澈</b> <span>可用於澆灌，不需處理</span></div>
<div class="rung r1"><b>第 1 級：微濁</b> <span>增加過濾頻率，一週後複測</span></div>
<div class="rung r2"><b>第 2 級：混濁</b> <span>停止使用，清洗水槽</span></div>
<div class="rung r3"><b>第 3 級：異味</b> <span>通報總務處，全面檢修</span></div>
</div>

---

<!-- 版型 prompt-breakdown（Prompt 拆解） -->

# 一個好提示詞有六個部分

<div class="prompt wide">
<div class="pr"><span class="tag b">角色</span><span class="tx">你是校園永續專題的助教</span></div>
<div class="pr"><span class="tag g">目標</span><span class="tx">幫我檢查報告大綱是否完整</span></div>
<div class="pr"><span class="tag o">背景</span><span class="tx">這是大二的期中報告，題目是雨水回收</span></div>
<div class="pr"><span class="tag p">限制</span><span class="tx">只指出缺漏，不要改寫內容</span></div>
<div class="pr"><span class="tag r">格式</span><span class="tx">用條列，每點不超過 30 字</span></div>
<div class="pr"><span class="tag k">範例</span><span class="tx">缺少：研究限制的說明</span></div>
</div>

---

<!-- 版型 pyramid（金字塔） -->

# 節水措施依難度分三層

<div class="pyramid">
<div class="top"><b>設備改造</b>投資大，效果最明顯</div>
<div class="mid"><b>制度調整</b>用水量計費與公告</div>
<div class="bot"><b>日常習慣</b>隨手關水，人人都能做</div>
</div>

---

<!-- 版型 step-pills（步驟膠囊） -->

# 三步建立一份新報告

<div class="steps">
<div class="st"><div class="n">1</div><div class="cmd">mkdir rain-report</div><div class="cmd say">先建立一個資料夾放這份報告</div></div>
<div class="st"><div class="n">2</div><div class="cmd">cd rain-report</div><div class="cmd say">進入資料夾</div></div>
<div class="st"><div class="n">3</div><div class="cmd">code report.md</div><div class="cmd say">用編輯器開啟，開始寫第一頁</div></div>
</div>

---

<!-- 版型 terminal（終端機） -->

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
