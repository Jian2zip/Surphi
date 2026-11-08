# Surphi

Surphi is an interactive philosophy website. The main page maps how Western philosophy has thought about eros, pleasure, desire and sex, from Plato to Foucault; a second section (`continental/`) introduces continental philosophy from the 1990s to the 2020s.

Open `index.html` in a browser to view the site. No build step is needed.

## 性哲學關係圖譜（首頁）

以 25 個文本（21 部原典＋4 篇高影響力論文）簡介西方性哲學，分為六個時期：古希臘、希臘化與羅馬、基督教與中世紀、啟蒙、19 世紀、二十世紀法國思想。

- `index.html` : 首頁（關係圖譜、時間長廊、時期章節、選文方法與出處）
- `data.js` : 時期、文本、時期間承繼關係；修改內容只需編輯此檔
- `script.js` : 圖譜、時間長廊、導讀抽屜與出處的渲染與互動
- `styles.css` : 海報風樣式（紅色滿版 hero、黑體標題＋紅色手寫點綴、撕紙邊緣與紙紋，深色模式跟隨系統），版面架構與 `continental/styles.css` 一致
- `art.js` : 兩頁共用的抽象二創畫，每個時期／思潮一幅，由 SVG 程式生成、不使用外部圖片；新增時期或思潮時，在 `MOTIFS` 加入同 id 的構圖

原典附標準引用位置（Stephanus、Bekker、康德學院版 AA 等）與公開全文連結（Project Gutenberg、New Advent、維基文庫、Korpora）；研究論文附 DOI 與 2026-11-08 的 Crossref 被引次數。涉及性暴力或病理化語言的文本加註內容提示。單篇導讀可用 `index.html#text:<id>` 直接連結，例如 `#text:lacan-1963`。

## 歐陸哲學 1990–2020s 專區

`continental/` 是獨立專區，以 26 篇高影響力期刊論文簡介 1990 年代至 2020 年代歐陸哲學的觀念發展與衍伸，共分七條思潮：解構的倫理—政治轉向、生命政治、政治的回歸、性別與新唯物論、思辨實在論、殖民性與死亡政治、人類世與技術。

- `continental/index.html` : 專區頁面（思潮圖譜、時間軸、思潮章節、選文方法與書目）
- `continental/data.js` : 思潮、論文、思潮間衍伸關係與十年敘事的資料；修改內容只需編輯此檔
- `continental/app.js` : 圖譜、時間軸、論文導讀抽屜與書目的渲染與互動
- `continental/styles.css` : 沿用主站海報風的專區樣式

選文規則：只收期刊論文（含期刊刊出的譯文），出版於 1990–2021 年。書目於 2026-11-06 以 Crossref 與出版者頁面核對，引用數為當日 Crossref 數字。單篇導讀可用 `continental/index.html#paper:<id>` 直接連結，例如 `#paper:mbembe-2003`。

## Theme

Surphi presents philosophy as a living knowledge map rather than a static textbook timeline. The visual language emphasizes continuity, tension, and conceptual inheritance across thinkers.
