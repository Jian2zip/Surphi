# Surphi

Surphi is an interactive philosophy website that maps the development of sexuality-related thought from classical philosophy to modern critical theory.

The experience is designed around:

- an Obsidian-inspired relation tree
- liquid-glass panels and floating nodes
- Apple-like transition rhythm for content reveals
- a curated path from Plato and Aristotle to Sade, Bataille, and Foucault

## Files

- `index.html` : main page structure
- `styles.css` : visual system, layout, motion, and glass effects
- `script.js` : interactive relation tree and content switching

## 歐陸哲學 1990–2020s 專區

`continental/` 是獨立專區，以 26 篇高影響力期刊論文簡介 1990 年代至 2020 年代歐陸哲學的觀念發展與衍伸，共分七條思潮：解構的倫理—政治轉向、生命政治、政治的回歸、性別與新唯物論、思辨實在論、殖民性與死亡政治、人類世與技術。

- `continental/index.html` : 專區頁面（思潮圖譜、時間軸、思潮章節、選文方法與書目）
- `continental/data.js` : 思潮、論文、思潮間衍伸關係與十年敘事的資料；修改內容只需編輯此檔
- `continental/app.js` : 圖譜、時間軸、論文導讀抽屜與書目的渲染與互動
- `continental/styles.css` : 沿用主站液態玻璃風格的專區樣式

選文規則：只收期刊論文（含期刊刊出的譯文），出版於 1990–2021 年。書目於 2026-11-06 以 Crossref 與出版者頁面核對，引用數為當日 Crossref 數字。單篇導讀可用 `continental/index.html#paper:<id>` 直接連結，例如 `#paper:mbembe-2003`。

## Open Locally

Open `index.html` in a browser to view the site.

## Theme

Surphi presents philosophy as a living knowledge map rather than a static textbook timeline. The visual language emphasizes continuity, tension, and conceptual inheritance across thinkers.
