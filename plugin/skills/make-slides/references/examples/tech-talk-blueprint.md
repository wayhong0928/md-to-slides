---
marp: true
theme: blueprint
paginate: true
---

<!-- _class: cover -->

<div class="cover-title">夜間備份從 40 分鐘縮到 6 分鐘</div>
<div class="cover-subtitle">團隊內部技術分享</div>
<hr>
<div class="cover-meta">平台組 小安｜每月技術午餐</div>

---

# 今天的內容

<div class="toc-grid">
<div class="toc-item"><span class="no">01</span><span class="t">問題<small>為什麼備份越跑越久</small></span><span class="pg">p.3</span></div>
<div class="toc-item"><span class="no">02</span><span class="t">做法<small>改成增量同步</small></span><span class="pg">p.6</span></div>
<div class="toc-item"><span class="no">03</span><span class="t">成效<small>三週的數字</small></span><span class="pg">p.9</span></div>
<div class="toc-item extra"><span class="no">附</span><span class="t">還原演練紀錄</span><span class="pg">p.14</span></div>
</div>

---

<!-- _class: section-slide -->

<div class="section-label">PART 1</div>

# 問題

---

# 備份時間跟著檔案總量長，不跟著變動量

- 每晚把 180 GB 整包壓縮再上傳
- 實際每天變動的檔案不到 3 GB
- 備份超過 30 分鐘就會撞到凌晨的報表排程

<div class="conclusion">要省時間，只能改成只傳有變的檔案</div>

---

# 舊流程每一步都在處理全部的檔案

<svg class="loop-svg" viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
<rect x="20" y="170" width="220" height="100" rx="12" fill="#eaf4fb" stroke="#2980b9" stroke-width="2"/>
<text x="130" y="228" text-anchor="middle" font-size="24">壓縮 180 GB</text>
<rect x="290" y="170" width="220" height="100" rx="12" fill="#fdf2e9" stroke="#e67e22" stroke-width="2"/>
<text x="400" y="228" text-anchor="middle" font-size="24">上傳整包</text>
<rect x="560" y="170" width="220" height="100" rx="12" fill="#eafaf1" stroke="#27ae60" stroke-width="2"/>
<text x="670" y="228" text-anchor="middle" font-size="24">刪掉 7 天前的包</text>
<line x1="240" y1="220" x2="290" y2="220" stroke="#445566" stroke-width="3"/>
<line x1="510" y1="220" x2="560" y2="220" stroke="#445566" stroke-width="3"/>
<text x="400" y="340" text-anchor="middle" font-size="22">每晚約 40 分鐘，其中 31 分鐘在壓縮</text>
</svg>

---

<!-- _class: section-slide -->

<div class="section-label">PART 2</div>

# 做法

---

<!-- _class: codecol dense -->

# 改用 rsync，只傳有變的檔案

```
#!/usr/bin/env bash
set -euo pipefail
TODAY=$(date +%F)
rsync -a --delete \
  --link-dest=/backup/latest \
  /srv/data/ "/backup/$TODAY/"
ln -sfn "/backup/$TODAY" /backup/latest
```

- `--link-dest` 讓沒變的檔案用硬連結指回前一天，不佔空間
- 每天的資料夾都是完整快照，還原時直接複製

---

# 上線前分四級驗證，越往下風險越高

<div class="ladder">
<div class="rung r0"><b>本機試跑</b> <span>用 1 GB 的測試資料跑三次</span></div>
<div class="rung r1"><b>測試機並行</b> <span>新舊兩套一起跑一週，比對檔案雜湊</span></div>
<div class="rung r2"><b>還原演練</b> <span>從新備份還原到空機器，服務能啟動</span></div>
<div class="rung r3"><b>正式切換</b> <span>停掉舊流程，保留舊備份 30 天</span></div>
</div>

---

<!-- _class: section-slide -->

<div class="section-label">PART 3</div>

# 成效

---

# 三週下來，備份時間少了八成五

<div class="stat-grid">
<div class="stat-box"><span class="stat-num">6 分</span><span class="stat-label">平均備份時間，原本 40 分</span></div>
<div class="stat-box green"><span class="stat-num">2.8 GB</span><span class="stat-label">每晚實際傳輸量</span></div>
<div class="stat-box orange"><span class="stat-num">0</span><span class="stat-label">撞到報表排程的次數</span></div>
</div>

---

<!-- _class: refs -->

# 參考資料

<div class="refgrid">
<div>
<h4>工具文件</h4>
<ul>
<li>rsync(1) 使用手冊，--link-dest 一節</li>
<li>GNU coreutils 手冊，ln 指令</li>
</ul>
</div>
<div>
<h4>團隊內部</h4>
<ul>
<li>備份流程設計文件，第 3 版</li>
<li>還原演練紀錄，附錄第 14 頁</li>
</ul>
</div>
</div>

---

<!-- _class: thankyou -->

# 謝謝

腳本放在團隊 repo 的 ops/backup 資料夾

---

<!-- _class: appendix-divider -->

# 附錄

還原演練紀錄

---

# 還原演練三次都在 15 分鐘內完成

| 日期 | 還原對象 | 花費時間 | 結果 |
|---|---|---|---|
| 第 1 週 | 單一資料夾 | 2 分鐘 | 檔案雜湊一致 |
| 第 2 週 | 整台測試機 | 14 分鐘 | 服務正常啟動 |
| 第 3 週 | 三天前的快照 | 12 分鐘 | 服務正常啟動 |
