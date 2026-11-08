/* Surphi｜性哲學關係圖譜 — 互動與渲染
   架構與 continental/app.js 相同：圖譜＋側欄、時間長廊、時期章節、導讀抽屜、出處。 */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const eraById = Object.fromEntries(ERAS.map((e) => [e.id, e]));
  const textById = Object.fromEntries(TEXTS.map((t) => [t.id, t]));
  const eraOrder = Object.fromEntries(ERAS.map((e, i) => [e.id, i]));
  /* 依時期、再依年代排序；lens 論文排在該時期最後 */
  const ordered = [...TEXTS].sort(
    (a, b) =>
      eraOrder[a.era] - eraOrder[b.era] ||
      Number(Boolean(a.lens)) - Number(Boolean(b.lens)) ||
      a.year - b.year
  );
  const textsOf = (eraId) => ordered.filter((t) => t.era === eraId);

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const fmt = (n) => n.toLocaleString("en-US");
  const shortEra = (e) => e.name.split("：")[0];
  const linkOf = (t) => (t.doi ? `https://doi.org/${t.doi}` : t.url);
  const isArticle = (t) => t.kind === "論文";
  const kindLabel = (t) => (isArticle(t) ? "研究論文" : "原典");
  const kindBadge = (t) => `<span class="kind-badge${isArticle(t) ? " is-article" : ""}">${kindLabel(t)}</span>`;
  const sourceLabel = (t) => {
    if (t.doi) return t.cites == null ? `DOI ${t.doi}` : `DOI ${t.doi} · Crossref 被引 ${fmt(t.cites)}（${CROSSREF_CHECKED}）`;
    if (t.url) return "公開全文";
    return "沒有公開全文";
  };
  const footLabel = (t) => {
    if (isArticle(t)) return t.cites == null ? "期刊論文 · 無 DOI" : `Crossref 被引 ${fmt(t.cites)}`;
    return t.url ? "有公開全文" : "無公開全文";
  };
  const styleVars = (e) => `--c:${e.color}`;

  /* ───────── Hero ───────── */

  function renderHero() {
    $("#heroStats").innerHTML = [
      [ERAS.length, "個時期"],
      [TEXTS.length, "個文本"],
      ["2300", "年跨度"]
    ]
      .map(([n, label]) => `<li><strong>${n}</strong><span>${label}</span></li>`)
      .join("");
    $("#checkedDate").textContent = CROSSREF_CHECKED;
  }

  /* ───────── Relation map ───────── */

  let activeEra = ERAS[0].id;

  function renderMap() {
    const svg = $("#mapLines");
    const ns = "http://www.w3.org/2000/svg";
    ERA_LINKS.forEach((link) => {
      const a = eraById[link.from].pos;
      const b = eraById[link.to].pos;
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", a.x);
      line.setAttribute("y1", a.y);
      line.setAttribute("x2", b.x);
      line.setAttribute("y2", b.y);
      line.setAttribute("vector-effect", "non-scaling-stroke");
      line.setAttribute("class", "map-edge");
      line.dataset.from = link.from;
      line.dataset.to = link.to;
      svg.appendChild(line);
    });

    const canvas = $("#mapCanvas");
    ERAS.forEach((e, i) => {
      const node = document.createElement("button");
      node.type = "button";
      node.className = "map-node";
      node.dataset.era = e.id;
      node.setAttribute("aria-pressed", "false");
      node.style.cssText = `${styleVars(e)};--x:${e.pos.x}%;--y:${e.pos.y}%;--delay:${-i * 1.2}s`;
      node.innerHTML = `
        <span class="node-no">${e.no} · ${e.span}</span>
        <strong>${esc(e.name)}</strong>
        <span class="node-meta">${textsOf(e.id).length} 個文本</span>`;
      node.addEventListener("click", () => selectEra(e.id));
      canvas.appendChild(node);
    });
  }

  function linksOf(eraId) {
    return ERA_LINKS.filter((l) => l.from === eraId || l.to === eraId).map((l) => ({
      other: l.from === eraId ? l.to : l.from,
      direction: l.from === eraId ? "影響" : "承接",
      text: l.text
    }));
  }

  function textPill(t, sub) {
    const e = eraById[t.era];
    return `
      <li><button type="button" class="g-item" data-open="${t.id}" style="${styleVars(e)}">
        <span class="g-date">${esc(t.date)}${isArticle(t) ? " · 研究論文" : ""}</span>
        <span class="g-title">${esc(t.title.zh)}</span>
        <span class="g-author">${esc(sub || t.author.zh)}</span>
      </button></li>`;
  }

  function selectEra(eraId) {
    activeEra = eraId;
    const e = eraById[eraId];
    const linked = new Set(linksOf(eraId).map((l) => l.other));

    $$(".map-node").forEach((node) => {
      const id = node.dataset.era;
      const isActive = id === eraId;
      node.classList.toggle("active", isActive);
      node.classList.toggle("is-dim", !isActive && !linked.has(id));
      node.setAttribute("aria-pressed", String(isActive));
    });

    $$(".map-edge").forEach((edge) => {
      const on = edge.dataset.from === eraId || edge.dataset.to === eraId;
      edge.classList.toggle("is-active", on);
      edge.classList.toggle("is-dim", !on);
      edge.style.setProperty("--c", e.color);
    });

    const texts = textsOf(eraId).map((t) => textPill(t)).join("");
    const links = linksOf(eraId)
      .map((l) => {
        const o = eraById[l.other];
        return `
        <li><button type="button" class="link-item" data-era-link="${o.id}">
          <b style="${styleVars(o)}"><span class="swatch"></span>${l.direction}「${esc(shortEra(o))}」</b>${esc(l.text)}
        </button></li>`;
      })
      .join("");
    const onward =
      eraId === "twentieth"
        ? `<a class="text-link" href="continental/index.html">延伸：歐陸哲學 1990–2020s 專區 ↗</a><br>`
        : "";

    $("#mapDetail").innerHTML = `
      <p class="detail-kicker" style="color:${e.color}">時期 ${e.no} · ${e.span}</p>
      <h2>${esc(e.name)}</h2>
      <p class="detail-orig">${esc(e.orig)}</p>
      <p class="detail-intro">${esc(e.intro)}</p>
      <p class="detail-sub">收錄文本</p>
      <ul class="plain-list">${texts}</ul>
      <p class="detail-sub">與其他時期的關係</p>
      <ul class="plain-list">${links}</ul>
      ${onward}<a class="text-link" href="#era-${e.id}">閱讀完整章節 ↓</a>`;
  }

  /* ───────── Gallery ───────── */

  let galleryFilter = null;

  function renderGallery() {
    $("#galleryFilters").innerHTML = [`<button type="button" class="chip" data-filter="" aria-pressed="true">全部時期</button>`]
      .concat(
        ERAS.map(
          (e) =>
            `<button type="button" class="chip" data-filter="${e.id}" aria-pressed="false" style="${styleVars(e)}"><span class="swatch"></span>${esc(shortEra(e))}</button>`
        )
      )
      .join("");

    $("#eraBand").innerHTML = ERAS.map((e) => `<span style="${styleVars(e)}"></span>`).join("");

    $("#galleryGrid").innerHTML = ERAS.map((e) => {
      const items = textsOf(e.id)
        .filter((t) => !t.lens)
        .map((t) => textPill(t))
        .join("");
      return `
        <article class="gallery-col" data-era="${e.id}" style="${styleVars(e)}">
          <button type="button" class="gallery-head" data-filter="${e.id}"><span class="swatch"></span>${e.no}</button>
          <h3>${esc(shortEra(e))}</h3>
          <p class="gallery-span">${e.span}</p>
          <ul class="gallery-list">${items}</ul>
        </article>`;
    }).join("");
  }

  function setGalleryFilter(eraId) {
    galleryFilter = eraId || null;
    $$("#galleryFilters .chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", String((chip.dataset.filter || null) === galleryFilter));
    });
    $$(".gallery-col").forEach((col) => {
      col.classList.toggle("is-dim", Boolean(galleryFilter) && col.dataset.era !== galleryFilter);
    });
  }

  /* ───────── Era chapters ───────── */

  function renderEras() {
    $("#eras").innerHTML = ERAS.map((e) => {
      const concepts = e.concepts
        .map(([zh, orig]) => `<li class="concept">${esc(zh)}<i>${esc(orig)}</i></li>`)
        .join("");
      const cards = textsOf(e.id)
        .map(
          (t) => `
          <button type="button" class="paper-card" data-open="${t.id}" style="${styleVars(e)}">
            <span class="card-meta"><span class="card-year">${esc(t.date)}</span></span>
            <span class="card-meta">${kindBadge(t)}<span class="card-journal">${esc(t.author.orig)}</span></span>
            <span class="card-author">${esc(t.author.zh)}</span>
            <span class="card-title">${esc(t.title.zh)}</span>
            <span class="card-orig">${esc(t.title.orig)}</span>
            <span class="card-question">${esc(t.question)}</span>
            ${t.warning ? `<span class="card-warning">內容提示：${esc(t.warning)}</span>` : ""}
            <span class="card-foot"><span>${footLabel(t)}</span><b>閱讀導讀 →</b></span>
          </button>`
        )
        .join("");
      const onward =
        e.id === "twentieth"
          ? `<a class="text-link" href="continental/index.html">延伸閱讀：歐陸哲學 1990–2020s 專區 ↗</a>`
          : "";
      return `
        <section class="theme-section glass-panel reveal" id="era-${e.id}" style="${styleVars(e)}" aria-labelledby="era-title-${e.id}">
          <div class="theme-header">
            <div>
              <p class="theme-no"><span class="swatch"></span>時期 ${e.no}</p>
              <h2 id="era-title-${e.id}">${esc(e.name)}</h2>
              <p class="theme-orig">${esc(e.orig)}</p>
              <span class="theme-span">${e.span} · ${textsOf(e.id).length} 個文本</span>
            </div>
            <div class="theme-body">
              <p>${esc(e.intro)}</p>
              <p class="theme-legacy">${esc(e.legacy)}</p>
              <ul class="concept-list" aria-label="關鍵概念">${concepts}</ul>
              ${onward}
            </div>
          </div>
          <div class="paper-grid">${cards}</div>
        </section>`;
    }).join("");
  }

  /* ───────── Sources ───────── */

  function renderBibliography() {
    const byYear = [...TEXTS].sort((a, b) => a.year - b.year);
    const item = (t) => {
      const href = linkOf(t);
      const link = href
        ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(t.doi ? `https://doi.org/${t.doi}` : href)}</a>`
        : `<span>（沒有公開全文）</span>`;
      const head = isArticle(t)
        ? `${esc(t.author.orig)}. “${esc(t.title.orig)}.” <em>${esc(t.ref)}</em>.`
        : `${esc(t.author.orig)}, <em>${esc(t.title.orig)}</em>（${esc(t.date)}）. ${esc(t.ref)}.`;
      return `<li>${head} ${link} <button type="button" class="biblio-open" data-open="${t.id}">導讀</button></li>`;
    };
    $("#biblioPrimary").innerHTML = byYear.filter((t) => !isArticle(t)).map(item).join("");
    $("#biblioArticles").innerHTML = byYear.filter(isArticle).map(item).join("");
  }

  /* ───────── Drawer ───────── */

  const drawer = $("#paperDrawer");
  const drawerInner = $("#drawerInner");
  let lastFocus = null;

  function openText(id) {
    const t = textById[id];
    if (!t) return;
    const e = eraById[t.era];
    const idx = ordered.indexOf(t);
    const prev = ordered[idx - 1];
    const next = ordered[idx + 1];

    const concepts = t.concepts
      .map(([zh, orig]) => `<li class="concept">${esc(zh)}${zh !== orig ? `<i>${esc(orig)}</i>` : ""}</li>`)
      .join("");
    const links = t.links
      .map((l) => {
        const q = textById[l.id];
        return textPill(q, `${l.type} · ${q.author.zh}`);
      })
      .join("");
    const navButton = (q, dir) =>
      q
        ? `<button type="button" data-open="${q.id}"><small>${dir === "prev" ? "← 上一篇" : "下一篇 →"}</small>${esc(q.author.zh)}${esc(q.title.zh)}</button>`
        : "";
    const href = linkOf(t);

    drawerInner.style.cssText = styleVars(e);
    drawerInner.innerHTML = `
      <div class="drawer-top">
        <a class="chip" href="#era-${e.id}" data-close style="${styleVars(e)}"><span class="swatch"></span>時期 ${e.no}｜${esc(shortEra(e))}</a>
        <button type="button" class="close-button" data-close aria-label="關閉導讀">×</button>
      </div>
      <p class="drawer-meta"><b>${esc(t.date)}</b>${esc(t.author.zh)} · ${esc(t.author.orig)}　${kindBadge(t)}</p>
      <h2 id="drawerTitle">${esc(t.title.zh)}</h2>
      <p class="drawer-orig">${esc(t.title.orig)}</p>
      ${t.warning ? `<p class="drawer-warning">內容提示：${esc(t.warning)}</p>` : ""}

      <div class="cite-box">
        <p><em>${esc(t.ref)}</em></p>
        ${t.note ? `<p class="cite-note">${esc(t.note)}</p>` : ""}
        <div class="cite-actions">
          ${href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${t.doi ? "前往原刊 ↗" : "閱讀全文 ↗"}</a>` : ""}
          <span class="cite-count">${esc(sourceLabel(t))}</span>
        </div>
      </div>

      <div class="drawer-section">
        <p class="drawer-label">核心問題</p>
        <p class="drawer-question">${esc(t.question)}</p>
      </div>
      <div class="drawer-section">
        <p class="drawer-label">主要論點</p>
        <ol class="drawer-points">${t.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
      </div>
      <div class="drawer-section">
        <p class="drawer-label">關鍵概念</p>
        <ul class="concept-list">${concepts}</ul>
      </div>
      <div class="drawer-section">
        <p class="drawer-label">影響與延伸</p>
        <p class="drawer-impact">${esc(t.impact)}</p>
      </div>
      ${links ? `<div class="drawer-section"><p class="drawer-label">對話關係</p><ul class="plain-list">${links}</ul></div>` : ""}
      <nav class="drawer-nav" aria-label="依時期瀏覽">${navButton(prev, "prev")}${navButton(next, "next")}</nav>`;

    drawerInner.scrollTop = 0;
    if (!drawer.open) {
      lastFocus = document.activeElement;
      drawer.showModal();
      document.body.classList.add("drawer-open");
    }
    $(".close-button", drawerInner).focus({ preventScroll: true });
    const hash = `#text:${t.id}`;
    if (location.hash !== hash) history.replaceState(null, "", hash);
  }

  function closeDrawer() {
    if (drawer.open) drawer.close();
  }

  drawer.addEventListener("close", () => {
    document.body.classList.remove("drawer-open");
    if (location.hash.startsWith("#text:")) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  });

  drawer.addEventListener("click", (ev) => {
    if (ev.target === drawer) closeDrawer();
  });

  /* ───────── Event delegation ───────── */

  document.addEventListener("click", (ev) => {
    const opener = ev.target.closest("[data-open]");
    if (opener) {
      openText(opener.dataset.open);
      return;
    }
    const closer = ev.target.closest("[data-close]");
    if (closer) {
      closeDrawer();
      return;
    }
    const eraLink = ev.target.closest("[data-era-link]");
    if (eraLink) {
      selectEra(eraLink.dataset.eraLink);
      return;
    }
    const filter = ev.target.closest("[data-filter]");
    if (filter) {
      const id = filter.dataset.filter;
      const toggleOff = id && id === galleryFilter && filter.classList.contains("gallery-head");
      setGalleryFilter(toggleOff ? null : id);
    }
  });

  function openFromHash() {
    const m = location.hash.match(/^#text:([\w-]+)$/);
    if (m && textById[m[1]]) openText(m[1]);
  }
  window.addEventListener("hashchange", openFromHash);

  /* ───────── Reveal ───────── */

  function setupReveal() {
    const targets = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    targets.forEach((el) => observer.observe(el));
  }

  /* ───────── Init ───────── */

  renderHero();
  renderMap();
  selectEra(activeEra);
  renderGallery();
  renderEras();
  renderBibliography();
  setupReveal();
  openFromHash();
})();
