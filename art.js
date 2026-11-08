/* Surphi｜抽象二創畫
   每個時期／思潮一幅以 SVG 生成的抽象畫，從該時期的核心概念出發再創作。
   沒有外部圖片：構圖由固定種子的亂數產生，每次載入都一樣。
   用色固定為印刷品配色（紅、粉、墨、紙），不隨深淺色模式改變。
   兩頁共用：首頁以 <script src="art.js">、專區以 <script src="../art.js"> 載入。 */
(() => {
  "use strict";

  const W = 300;
  const H = 380;
  let serial = 0;

  /* ───────── 亂數與幾何小工具 ───────── */

  function seeded(key) {
    let h = 1779033703 ^ key.length;
    for (let i = 0; i < key.length; i++) {
      h = Math.imul(h ^ key.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }

  const f = (n) => Math.round(n * 10) / 10;

  /* 四邊都是撕紙鋸齒的紙片 */
  function scrap(rng, x, y, w, h, amp = 4, step = 9) {
    const pts = [];
    const jag = () => (rng() - 0.5) * 2 * amp;
    for (let i = 0; i <= w; i += step) pts.push([x + i, y + jag()]);
    for (let i = 0; i <= h; i += step) pts.push([x + w + jag(), y + i]);
    for (let i = w; i >= 0; i -= step) pts.push([x + i, y + h + jag()]);
    for (let i = h; i >= 0; i -= step) pts.push([x + jag(), y + i]);
    return "M" + pts.map(([a, b]) => `${f(a)} ${f(b)}`).join("L") + "Z";
  }

  /* 只有一邊撕開的紙（用於大色塊） */
  function tornEdge(rng, y, amp = 10, step = 12, below = true) {
    const pts = [];
    for (let x = 0; x <= W + step; x += step) pts.push([x, y + (rng() - 0.5) * 2 * amp]);
    const end = below ? H : 0;
    return `M0 ${end}L` + pts.map(([a, b]) => `${f(a)} ${f(b)}`).join("L") + `L${W} ${end}Z`;
  }

  const rect = (cls, x, y, w, h, extra = "") =>
    `<rect class="${cls}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${extra}/>`;
  const circle = (cls, cx, cy, r, extra = "") =>
    `<circle class="${cls}" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${extra}/>`;
  const path = (cls, d, extra = "") => `<path class="${cls}" d="${d}"${extra}/>`;
  const hand = (text, x, y, size, rot = 0, cls = "hand") =>
    `<text class="${cls}" x="${x}" y="${y}" font-size="${size}" transform="rotate(${rot} ${x} ${y})">${text}</text>`;

  /* ───────── 各幅構圖 ───────── */

  const MOTIFS = {
    /* 首頁 hero：阿里斯托芬的「另一半」——被劈開的圓人 */
    "hero-sex": {
      after: "Aristophanes in Plato, Symposium",
      word: "the other half",
      draw(rng, u) {
        let s = rect("p", 0, 0, W, H);
        s += path("w", scrap(rng, 22, 30, 256, 318, 5));
        s += `<circle cx="132" cy="176" r="96" fill="url(#ht${u})"/>`;
        s += path("r", "M132 80 A96 96 0 0 0 132 272 Z");
        s += path("k", "M168 98 A96 96 0 0 1 168 290 Z");
        s += rect("r", 166, 96, 3, 196);
        for (let i = 0; i < 6; i++) s += rect("k", 40 + i * 9, 318, 4, 16 + rng() * 10);
        s += hand("the other half", 150, 352, 30, -4);
        return s;
      }
    },

    /* 專區 hero：1990 之後，被劃掉又重寫的格線 */
    "hero-cont": {
      after: "Derrida, Deleuze, Agamben, Mbembe …",
      word: "after 1990",
      draw(rng, u) {
        let s = rect("w", 0, 0, W, H);
        for (let i = 0; i < 9; i++) {
          const y = 40 + i * 32;
          s += rect("k", 24, y, 120 + rng() * 140, 9);
        }
        s += rect("r", 0, 210, W, 170);
        s += `<rect x="0" y="210" width="${W}" height="170" fill="url(#ht${u})" opacity="0.35"/>`;
        s += path("ks", "M30 70 L270 120 M40 150 L250 90", ' stroke-width="5"');
        s += path("w", scrap(rng, 150, 236, 120, 92, 4));
        s += hand("after 1990", 160, 296, 32, -3, "hand hand-ink");
        return s;
      }
    },

    /* 古希臘：愛欲的階梯，向上通往「美本身」 */
    greek: {
      after: "Plato, Symposium 210a–212a",
      word: "erōs",
      draw(rng, u) {
        let s = rect("p", 0, 0, W, H);
        s += circle("w", 214, 92, 62);
        s += `<circle cx="214" cy="92" r="62" fill="url(#ht${u})" opacity="0.5"/>`;
        for (let i = 0; i < 7; i++) {
          const w = 150 - i * 12;
          s += rect("r", 26 + i * 20, 330 - i * 40, w, 22 - i * 2);
        }
        s += rect("k", 26, 352, 248, 3);
        s += hand("erōs", 40, 120, 54, -8);
        return s;
      }
    },

    /* 希臘化與羅馬：原子落下，其中一顆偏斜（clinamen），以及花園的平靜地平線 */
    hellenistic: {
      after: "Lucretius, De rerum natura II",
      word: "clinamen",
      draw(rng) {
        let s = rect("w", 0, 0, W, H);
        for (let i = 0; i < 70; i++) {
          const x = 14 + rng() * 272;
          const y = 14 + rng() * 230;
          s += circle("k", x, y, 1.6 + rng() * 3.2);
        }
        s += path("rs", "M150 30 C150 120 160 170 230 236", ' stroke-width="3" stroke-dasharray="2 7"');
        s += circle("r", 230, 236, 14);
        s += path("r", tornEdge(rng, 280, 6));
        s += rect("k", 0, 330, W, 6);
        s += hand("clinamen", 28, 318, 40, -3, "hand hand-ink");
        return s;
      }
    },

    /* 基督教與中世紀：尖拱窗、墜落的斜線與一顆果實 */
    christian: {
      after: "Augustine, Confessions VIII",
      word: "concupiscentia",
      draw(rng, u) {
        let s = rect("r", 0, 0, W, H);
        s += path("w", "M70 340 L70 150 Q70 50 150 36 Q230 50 230 150 L230 340 Z");
        s += `<path d="M70 340 L70 150 Q70 50 150 36 Q230 50 230 150 L230 340 Z" fill="url(#ht${u})" opacity="0.4"/>`;
        s += rect("k", 146, 40, 6, 300);
        s += rect("k", 74, 176, 152, 6);
        s += path("k", "M40 60 L262 318 L252 326 L30 68 Z");
        s += circle("r", 196, 268, 18);
        s += path("k", "M196 250 q4 -12 12 -14", ' fill="none" stroke="#111" stroke-width="3"');
        s += hand("concupiscentia", 18, 368, 30, -2, "hand hand-paper");
        return s;
      }
    },

    /* 啟蒙：理性的格線，自然的圓從格線裡撕開 */
    enlightenment: {
      after: "Kant, Lectures on Ethics; Rousseau, Émile",
      word: "sapere aude",
      draw(rng) {
        let s = rect("w", 0, 0, W, H);
        for (let x = 20; x <= 280; x += 26) s += rect("k", x, 20, 1.2, 340);
        for (let y = 20; y <= 360; y += 26) s += rect("k", 20, y, 260, 1.2);
        s += path("r", scrap(rng, 108, 120, 150, 150, 9, 8));
        s += circle("p", 183, 195, 50);
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          s += `<line class="ks" x1="${f(183 + Math.cos(a) * 58)}" y1="${f(195 + Math.sin(a) * 58)}" x2="${f(183 + Math.cos(a) * 92)}" y2="${f(195 + Math.sin(a) * 92)}" stroke-width="2"/>`;
        }
        s += hand("sapere aude", 24, 72, 38, -5);
        return s;
      }
    },

    /* 19 世紀：意志的波浪壓過分類標本的格子 */
    nineteenth: {
      after: "Schopenhauer; Krafft-Ebing, Psychopathia Sexualis",
      word: "Wille",
      draw(rng) {
        let s = rect("p", 0, 0, W, H);
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 4; c++) {
            const x = 26 + c * 64;
            const y = 210 + r * 52;
            s += rect("w", x, y, 54, 42);
            s += rect("k", x + 6, y + 30, 22 + rng() * 20, 2);
            s += circle("k", x + 40, y + 14, 3 + rng() * 5);
          }
        }
        for (let i = 0; i < 6; i++) {
          let d = `M-10 ${40 + i * 24}`;
          for (let x = 0; x <= 320; x += 40) d += ` Q${x + 20} ${30 + i * 24 + (rng() - 0.5) * 70} ${x + 40} ${40 + i * 24}`;
          s += path(i % 2 ? "ks" : "rs", d, ` stroke-width="${i % 2 ? 2 : 7}"`);
        }
        s += hand("Wille", 196, 196, 50, -6);
        return s;
      }
    },

    /* 二十世紀：全景敞視的同心圓，與一道越過界線的紅色斜劃 */
    twentieth: {
      after: "Foucault, Préface à la transgression; Surveiller et punir",
      word: "transgression",
      draw(rng, u) {
        let s = rect("w", 0, 0, W, H);
        for (let r = 140; r > 10; r -= 18) s += circle("ks", 150, 170, r, ' stroke-width="2"');
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * Math.PI * 2;
          s += `<line class="ks" x1="${f(150 + Math.cos(a) * 32)}" y1="${f(170 + Math.sin(a) * 32)}" x2="${f(150 + Math.cos(a) * 140)}" y2="${f(170 + Math.sin(a) * 140)}" stroke-width="1"/>`;
        }
        s += circle("k", 150, 170, 26);
        s += rect("k", 0, 300, W, 16);
        s += `<rect x="0" y="316" width="${W}" height="64" fill="url(#ht${u})"/>`;
        s += path("r", "M60 372 L250 18 L270 26 L82 380 Z");
        s += hand("transgression", 16, 352, 34, -4, "hand hand-ink");
        return s;
      }
    },

    /* 解構：被劃掉的文字（sous rature）與留下的痕跡 */
    deconstruction: {
      after: "Derrida, Force of Law",
      word: "différance",
      draw(rng) {
        let s = rect("w", 0, 0, W, H);
        for (let i = 0; i < 10; i++) {
          const y = 30 + i * 30;
          const w = 90 + rng() * 170;
          s += rect(i === 4 ? "r" : "k", 22, y, w, 12);
        }
        s += path("rs", "M20 20 L280 330 M280 20 L20 330", ' stroke-width="8"');
        s += hand("différance", 70, 366, 40, -3, "hand hand-ink");
        s += rect("r", 66, 352, 160, 3);
        return s;
      }
    },

    /* 生命政治：營區格線上的人口網點，與控制的同心圈 */
    biopolitics: {
      after: "Agamben, Homo Sacer; Deleuze, Postscript",
      word: "zoē / bios",
      draw(rng, u) {
        let s = rect("r", 0, 0, W, H);
        s += `<rect x="20" y="20" width="260" height="210" fill="url(#ht${u})"/>`;
        for (let x = 20; x <= 280; x += 52) s += rect("k", x, 20, 3, 210);
        s += rect("k", 20, 20, 260, 3) + rect("k", 20, 228, 260, 3);
        for (let r = 100; r > 0; r -= 20) s += circle("ws", 150, 310, r, ' stroke-width="3"');
        s += circle("k", 150, 310, 10);
        s += hand("zoē / bios", 150, 362, 34, -4, "hand hand-paper");
        return s;
      }
    },

    /* 政治的回歸：兩塊對峙的色塊，中間是無份者的一點 */
    political: {
      after: "Mouffe; Rancière, Ten Theses on Politics",
      word: "le tort",
      draw(rng) {
        let s = rect("w", 0, 0, W, H);
        s += path("r", "M0 0 L168 0 L120 380 L0 380 Z");
        s += path("k", "M186 0 L300 0 L300 380 L138 380 Z");
        s += circle("p", 152, 196, 12);
        for (let i = 0; i < 8; i++) s += rect("w", 210 + (i % 2) * 20, 40 + i * 30, 50, 4);
        s += hand("le tort", 18, 60, 46, -6, "hand hand-ink");
        return s;
      }
    },

    /* 性別、身體與新唯物論：糾纏的有機曲線 */
    matter: {
      after: "Barad, Posthumanist Performativity",
      word: "intra-action",
      draw(rng, u) {
        let s = rect("p", 0, 0, W, H);
        const blob = (cx, cy, r, cls) => {
          let d = "";
          const n = 9;
          for (let i = 0; i <= n; i++) {
            const a = (i / n) * Math.PI * 2;
            const rr = r * (0.75 + rng() * 0.5);
            const x = cx + Math.cos(a) * rr;
            const y = cy + Math.sin(a) * rr;
            d += i === 0 ? `M${f(x)} ${f(y)}` : ` S${f(cx + Math.cos(a - 0.35) * rr * 1.1)} ${f(cy + Math.sin(a - 0.35) * rr * 1.1)} ${f(x)} ${f(y)}`;
          }
          return path(cls, d + "Z");
        };
        s += blob(120, 150, 92, "r");
        s += `<g opacity="0.85">${blob(184, 220, 84, "k")}</g>`;
        s += `<circle cx="150" cy="186" r="70" fill="url(#ht${u})" opacity="0.6"/>`;
        s += path("ws", "M30 330 C90 250 150 380 270 290", ' stroke-width="4"');
        s += hand("intra-action", 30, 362, 36, -3);
        return s;
      }
    },

    /* 思辨實在論：退隱的物，被紅色的帷幕遮去一半 */
    realism: {
      after: "Harman; Meillassoux; Latour",
      word: "withdrawn",
      draw(rng) {
        let s = rect("w", 0, 0, W, H);
        s += rect("k", 40, 50, 90, 90);
        s += circle("k", 214, 122, 54);
        s += path("k", "M70 330 L150 190 L230 330 Z");
        s += path("r", scrap(rng, 150, 20, 140, 340, 6), ' opacity="0.92"');
        s += hand("withdrawn", 24, 364, 40, -4, "hand hand-ink");
        return s;
      }
    },

    /* 殖民性與死亡政治：被撕破的地圖格線 */
    decolonial: {
      after: "Quijano; Mbembe, Necropolitics",
      word: "necropolitics",
      draw(rng, u) {
        let s = rect("r", 0, 0, W, H);
        for (let i = 0; i < 9; i++) {
          let d = `M0 ${f(30 + i * 40)}`;
          for (let x = 30; x <= 300; x += 30) d += ` L${x} ${f(30 + i * 40 + (rng() - 0.5) * 24)}`;
          s += path("ks", d, ' stroke-width="2"');
        }
        s += path("w", scrap(rng, 70, 110, 170, 150, 12, 10));
        s += `<path d="${scrap(rng, 86, 126, 138, 118, 8, 10)}" fill="url(#ht${u})"/>`;
        s += rect("k", 0, 330, W, 50);
        s += hand("necropolitics", 18, 366, 34, -2, "hand hand-paper");
        return s;
      }
    },

    /* 人類世與技術：地層與覆寫在上的電路 */
    anthropocene: {
      after: "Stiegler; Yuk Hui; Malabou",
      word: "pharmakon",
      draw(rng) {
        let s = rect("w", 0, 0, W, H);
        let y = 150;
        const cls = ["p", "r", "k", "g", "p", "r", "k"];
        cls.forEach((c, i) => {
          const h = 18 + rng() * 26;
          s += path(c, tornEdge(rng, y, 5, 14).replace(`L${W} ${H}Z`, `L${W} ${f(y + h)}L0 ${f(y + h)}Z`).replace(/^M0 380/, `M0 ${f(y + h)}`));
          y += h;
        });
        s += path("ks", "M40 40 L40 110 L120 110 L120 70 L200 70 L200 130 L260 130", ' stroke-width="4"');
        s += circle("r", 40, 40, 8) + circle("r", 260, 130, 8) + circle("k", 120, 110, 5) + circle("k", 200, 70, 5);
        s += hand("pharmakon", 150, 52, 38, -5);
        return s;
      }
    }
  };

  /* ───────── 對外介面 ───────── */

  function svg(key, label = "") {
    const m = MOTIFS[key];
    if (!m) return "";
    const u = `${key}-${++serial}`;
    const rng = seeded(key);
    const defs = `<defs><pattern id="ht${u}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle class="k" cx="3.5" cy="3.5" r="1.5"/></pattern></defs>`;
    const aria = `抽象二創：${label || m.word}，after ${m.after}`;
    return `<svg class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${aria}">${defs}${m.draw(rng, u)}</svg>`;
  }

  function figure(key, label = "", cls = "") {
    const m = MOTIFS[key];
    if (!m) return "";
    return `<figure class="art-figure ${cls}">${svg(key, label)}<figcaption>二創 · after ${m.after}</figcaption></figure>`;
  }

  /* 重複堆疊的字（呼應沙特海報的 Nauseating） */
  function stack(word, n = 9) {
    return Array.from({ length: n }, (_, i) => `<span style="--i:${i}">${word}</span>`).join("");
  }

  window.SurphiArt = { svg, figure, stack, keys: Object.keys(MOTIFS) };
})();
