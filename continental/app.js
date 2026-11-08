/* Surphi｜歐陸哲學 1990–2020s — 互動與渲染 */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const themeById = Object.fromEntries(THEMES.map((t) => [t.id, t]));
  const paperById = Object.fromEntries(PAPERS.map((p) => [p.id, p]));
  const chronological = [...PAPERS].sort(
    (a, b) => a.year - b.year || a.author.orig.localeCompare(b.author.orig)
  );
  const papersOf = (themeId) => chronological.filter((p) => p.theme === themeId);

  const YEAR_MIN = 1988;
  const YEAR_MAX = 2023;
  const yearToPct = (y) => ((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const fmt = (n) => n.toLocaleString("en-US");
  const shortName = (p) => p.author.zh.split("—")[0];
  const linkOf = (p) => (p.doi ? `https://doi.org/${p.doi}` : p.url);
  const linkLabel = (p) => (p.doi ? `DOI ${p.doi}` : "原刊／典藏頁");
  const citesLabel = (p) => (p.cites == null ? "無 DOI，未計引用" : `Crossref 被引 ${fmt(p.cites)}`);
  const journalOf = (venue) =>
    venue
      .replace(/\s+(I\/)?\d.*$/, "")
      .replace(/\s+\(.*$/, "")
      .replace(/,\s+“.*$/, "");
  const familyFirst = (name) => {
    const parts = name.split(" ");
    const family = parts.pop();
    return parts.length ? `${family}, ${parts.join(" ")}` : family;
  };
  const styleVars = (t) => `--c:${t.color}`;

  /* ───────── Hero ───────── */

  function renderHero() {
    const years = PAPERS.map((p) => p.year);
    $("#heroCount").textContent = PAPERS.length;
    $("#heroArt").innerHTML =
      SurphiArt.figure("hero-cont") + `<div class="hero-stack" aria-hidden="true">${SurphiArt.stack("Différance")}</div>`;
    $("#heroStats").innerHTML = [
      [THEMES.length, "條思潮"],
      [PAPERS.length, "篇期刊論文"],
      [`${Math.min(...years)}–${String(Math.max(...years)).slice(2)}`, "出版年份"]
    ]
      .map(([n, label]) => `<li><strong>${n}</strong><span>${label}</span></li>`)
      .join("");
    $("#checkedDate").textContent = CROSSREF_CHECKED;
  }

  /* ───────── Thought map ───────── */

  let activeTheme = THEMES[0].id;

  function renderMap() {
    const svg = $("#mapLines");
    const ns = "http://www.w3.org/2000/svg";
    THEME_LINKS.forEach((link) => {
      const a = themeById[link.from].pos;
      const b = themeById[link.to].pos;
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
    THEMES.forEach((t, i) => {
      const node = document.createElement("button");
      node.type = "button";
      node.className = "map-node";
      node.dataset.theme = t.id;
      node.setAttribute("aria-pressed", "false");
      node.style.cssText = `${styleVars(t)};--x:${t.pos.x}%;--y:${t.pos.y}%;--delay:${-i * 1.1}s`;
      node.innerHTML = `
        <span class="node-no">${t.no} · ${t.span}</span>
        <strong>${esc(t.name)}</strong>
        <span class="node-meta">${papersOf(t.id).length} 篇論文</span>`;
      node.addEventListener("click", () => selectTheme(t.id));
      canvas.appendChild(node);
    });
  }

  function linksOf(themeId) {
    return THEME_LINKS.filter((l) => l.from === themeId || l.to === themeId).map((l) => ({
      other: l.from === themeId ? l.to : l.from,
      direction: l.from === themeId ? "衍伸至" : "源自",
      text: l.text
    }));
  }

  function selectTheme(themeId) {
    activeTheme = themeId;
    const t = themeById[themeId];
    const linked = new Set(linksOf(themeId).map((l) => l.other));

    $$(".map-node").forEach((node) => {
      const id = node.dataset.theme;
      const isActive = id === themeId;
      node.classList.toggle("active", isActive);
      node.classList.toggle("is-dim", !isActive && !linked.has(id));
      node.setAttribute("aria-pressed", String(isActive));
    });

    $$(".map-edge").forEach((edge) => {
      const on = edge.dataset.from === themeId || edge.dataset.to === themeId;
      edge.classList.toggle("is-active", on);
      edge.classList.toggle("is-dim", !on);
      edge.style.setProperty("--c", t.color);
    });

    const papers = papersOf(themeId)
      .map(
        (p) => `
        <li><button type="button" class="paper-pill" data-open="${p.id}" style="${styleVars(t)}">
          <span class="pill-year">${p.year}</span>
          <span><span class="pill-title">${esc(p.title.zh)}</span><span class="pill-author">${esc(p.author.zh)} ${esc(p.author.orig)}</span></span>
        </button></li>`
      )
      .join("");

    const links = linksOf(themeId)
      .map((l) => {
        const o = themeById[l.other];
        return `
        <li><button type="button" class="link-item" data-theme-link="${o.id}">
          <b style="${styleVars(o)}"><span class="swatch"></span>${l.direction}「${esc(o.name)}」</b>${esc(l.text)}
        </button></li>`;
      })
      .join("");

    $("#mapDetail").innerHTML = `
      <div class="detail-art">${SurphiArt.svg(t.id, t.name)}</div>
      <p class="detail-kicker" style="color:${t.color}">思潮 ${t.no} · ${t.span}</p>
      <h2>${esc(t.name)}</h2>
      <p class="detail-orig">${esc(t.orig)}</p>
      <p class="detail-intro">${esc(t.intro)}</p>
      <p class="detail-sub">收錄論文</p>
      <ul class="plain-list">${papers}</ul>
      <p class="detail-sub">與其他思潮的衍伸</p>
      <ul class="plain-list">${links}</ul>
      <a class="text-link" href="#theme-${t.id}">閱讀完整章節 ↓</a>`;
  }

  /* ───────── Timeline ───────── */

  let timelineFilter = null;

  function renderTimeline() {
    const track = $("#timelineTrack");
    const gridLines = [];
    const ticks = [];
    for (let y = 1990; y <= 2020; y += 5) {
      const decade = y % 10 === 0;
      gridLines.push(`<span class="grid-line${decade ? " is-decade" : ""}" style="--x:${yearToPct(y)}%"></span>`);
      ticks.push(`<span class="axis-tick${decade ? " is-decade" : ""}" style="--x:${yearToPct(y)}%">${y}</span>`);
    }

    const lanes = THEMES.map((t) => {
      const papers = papersOf(t.id);
      const sameYear = {};
      papers.forEach((p) => (sameYear[p.year] = (sameYear[p.year] || 0) + 1));
      const seen = {};
      const dots = papers
        .map((p, i) => {
          const n = sameYear[p.year];
          const k = (seen[p.year] = (seen[p.year] || 0) + 1) - 1;
          const offset = n > 1 ? (k - (n - 1) / 2) * 1.9 : 0;
          const side = i % 2 === 0 ? "up" : "down";
          return `
            <button type="button" class="t-dot ${side}" data-open="${p.id}" style="--x:${yearToPct(p.year) + offset}%"
              aria-label="${p.year} ${esc(p.author.zh)}${esc(p.title.zh)}">
              <span class="t-label">${esc(shortName(p))}<small>${p.year}</small></span>
            </button>`;
        })
        .join("");
      return `
        <div class="lane" data-theme="${t.id}" style="${styleVars(t)}">
          <button type="button" class="lane-label" data-filter="${t.id}"><span class="swatch"></span>${esc(t.name.split("：")[0])}</button>
          <div class="lane-track">${dots}</div>
        </div>`;
    }).join("");

    track.innerHTML = `
      <div class="timeline-grid" aria-hidden="true">${gridLines.join("")}</div>
      ${lanes}
      <div class="timeline-axis" aria-hidden="true">${ticks.join("")}</div>`;

    const chips = [`<button type="button" class="chip" data-filter="" aria-pressed="true">全部思潮</button>`]
      .concat(
        THEMES.map(
          (t) =>
            `<button type="button" class="chip" data-filter="${t.id}" aria-pressed="false" style="${styleVars(t)}"><span class="swatch"></span>${esc(t.name.split("：")[0])}</button>`
        )
      )
      .join("");
    $("#timelineFilters").innerHTML = chips;

    $("#decadeGrid").innerHTML = DECADES.map((d) => {
      const papers = chronological
        .filter((p) => p.year >= d.from && p.year <= d.to)
        .map((p) => {
          const t = themeById[p.theme];
          return `
            <li data-theme="${p.theme}"><button type="button" class="paper-pill" data-open="${p.id}" style="${styleVars(t)}">
              <span class="pill-year">${p.year}</span>
              <span><span class="pill-title">${esc(p.title.zh)}</span><span class="pill-author">${esc(p.author.zh)} · ${esc(t.name.split("：")[0])}</span></span>
            </button></li>`;
        })
        .join("");
      return `
        <article class="decade-card">
          <p class="eyebrow">${d.label}</p>
          <h3>${esc(d.title)}</h3>
          <p>${esc(d.text)}</p>
          <ul class="plain-list decade-papers">${papers}</ul>
        </article>`;
    }).join("");
  }

  function setTimelineFilter(themeId) {
    timelineFilter = themeId || null;
    $$("#timelineFilters .chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", String((chip.dataset.filter || null) === timelineFilter));
    });
    $$(".lane").forEach((lane) => {
      lane.classList.toggle("is-dim", Boolean(timelineFilter) && lane.dataset.theme !== timelineFilter);
    });
    $$(".decade-papers li").forEach((li) => {
      li.classList.toggle("is-hidden", Boolean(timelineFilter) && li.dataset.theme !== timelineFilter);
    });
  }

  /* ───────── Theme chapters ───────── */

  function renderThemes() {
    $("#themes").innerHTML = THEMES.map((t) => {
      const concepts = t.concepts
        .map(([zh, orig]) => `<li class="concept">${esc(zh)}<i>${esc(orig)}</i></li>`)
        .join("");
      const cards = papersOf(t.id)
        .map(
          (p) => `
          <button type="button" class="paper-card" data-open="${p.id}" style="${styleVars(t)}">
            <span class="card-meta"><span class="card-year">${p.year}</span><span class="card-journal">${esc(journalOf(p.venue))}</span></span>
            <span class="card-author">${esc(p.author.zh)} <span>${esc(p.author.orig)}</span></span>
            <span class="card-title">${esc(p.title.zh)}</span>
            <span class="card-orig">${esc(p.title.orig)}</span>
            <span class="card-question">${esc(p.question)}</span>
            <span class="card-foot"><span>${citesLabel(p)}</span><b>閱讀導讀 →</b></span>
          </button>`
        )
        .join("");
      return `
        <section class="theme-section glass-panel reveal" id="theme-${t.id}" style="${styleVars(t)}" aria-labelledby="theme-title-${t.id}">
          <div class="theme-header">
            <div>
              <p class="theme-no"><span class="swatch"></span>思潮 ${t.no}</p>
              <h2 id="theme-title-${t.id}">${esc(t.name)}</h2>
              <p class="theme-orig">${esc(t.orig)}</p>
              <span class="theme-span">${t.span} · ${papersOf(t.id).length} 篇</span>
              ${SurphiArt.figure(t.id, t.name, "theme-art")}
            </div>
            <div class="theme-body">
              <p>${esc(t.intro)}</p>
              <p class="theme-legacy">${esc(t.legacy)}</p>
              <ul class="concept-list" aria-label="關鍵概念">${concepts}</ul>
            </div>
          </div>
          <div class="paper-grid">${cards}</div>
        </section>`;
    }).join("");
  }

  /* ───────── Bibliography ───────── */

  function renderBibliography() {
    $("#bibliography").innerHTML = chronological
      .map((p) => {
        const href = linkOf(p);
        const shown = p.doi ? `https://doi.org/${p.doi}` : href;
        return `
          <li>${esc(familyFirst(p.author.orig))}. “${esc(p.title.orig)}.” <em>${esc(p.venue)}</em>.
            <a href="${esc(href)}" target="_blank" rel="noopener">${esc(shown)}</a>
            <button type="button" class="biblio-open" data-open="${p.id}">導讀</button>
          </li>`;
      })
      .join("");
  }

  /* ───────── Drawer ───────── */

  const drawer = $("#paperDrawer");
  const drawerInner = $("#drawerInner");
  let lastFocus = null;

  function openPaper(id) {
    const p = paperById[id];
    if (!p) return;
    const t = themeById[p.theme];
    const idx = chronological.indexOf(p);
    const prev = chronological[idx - 1];
    const next = chronological[idx + 1];

    const concepts = p.concepts
      .map(([zh, orig]) => `<li class="concept">${esc(zh)}${zh !== orig ? `<i>${esc(orig)}</i>` : ""}</li>`)
      .join("");
    const links = p.links
      .map((l) => {
        const q = paperById[l.id];
        const qt = themeById[q.theme];
        return `
          <li><button type="button" class="paper-pill" data-open="${q.id}" style="${styleVars(qt)}">
            <span class="pill-year">${q.year}</span>
            <span><span class="pill-title">${esc(q.title.zh)}</span><span class="pill-author">${esc(l.type)} · ${esc(q.author.zh)}</span></span>
          </button></li>`;
      })
      .join("");
    const navButton = (q, dir) =>
      q
        ? `<button type="button" data-open="${q.id}"><small>${dir === "prev" ? "← 上一篇" : "下一篇 →"}</small>${q.year} ${esc(q.author.zh)}${esc(q.title.zh)}</button>`
        : "";

    drawerInner.style.cssText = styleVars(t);
    drawerInner.innerHTML = `
      <div class="drawer-top">
        <a class="chip" href="#theme-${t.id}" data-close style="${styleVars(t)}"><span class="swatch"></span>思潮 ${t.no}｜${esc(t.name)}</a>
        <button type="button" class="close-button" data-close aria-label="關閉導讀">×</button>
      </div>
      <div class="drawer-art" aria-hidden="true">${SurphiArt.svg(t.id)}</div>
      <p class="drawer-meta"><b>${p.year}</b>${esc(p.author.zh)} · ${esc(p.author.orig)}</p>
      <h2 id="drawerTitle">${esc(p.title.zh)}</h2>
      <p class="drawer-orig">${esc(p.title.orig)}</p>

      <div class="cite-box">
        <p><em>${esc(p.venue)}</em></p>
        ${p.note ? `<p class="cite-note">${esc(p.note)}</p>` : ""}
        <div class="cite-actions">
          <a href="${esc(linkOf(p))}" target="_blank" rel="noopener">前往原刊 ↗</a>
          <span class="cite-count">${esc(linkLabel(p))} · ${citesLabel(p)}${p.cites == null ? "" : `（${CROSSREF_CHECKED}）`}</span>
        </div>
      </div>

      <div class="drawer-section">
        <p class="drawer-label">核心問題</p>
        <p class="drawer-question">${esc(p.question)}</p>
      </div>
      <div class="drawer-section">
        <p class="drawer-label">主要論點</p>
        <ol class="drawer-points">${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
      </div>
      <div class="drawer-section">
        <p class="drawer-label">關鍵概念</p>
        <ul class="concept-list">${concepts}</ul>
      </div>
      <div class="drawer-section">
        <p class="drawer-label">影響與延伸</p>
        <p class="drawer-impact">${esc(p.impact)}</p>
      </div>
      ${
        links
          ? `<div class="drawer-section"><p class="drawer-label">對話關係</p><ul class="plain-list">${links}</ul></div>`
          : ""
      }
      <nav class="drawer-nav" aria-label="依年份瀏覽">${navButton(prev, "prev")}${navButton(next, "next")}</nav>`;

    drawerInner.scrollTop = 0;
    if (!drawer.open) {
      lastFocus = document.activeElement;
      drawer.showModal();
      document.body.classList.add("drawer-open");
    }
    $(".close-button", drawerInner).focus({ preventScroll: true });
    const hash = `#paper:${p.id}`;
    if (location.hash !== hash) history.replaceState(null, "", hash);
  }

  function closeDrawer() {
    if (drawer.open) drawer.close();
  }

  drawer.addEventListener("close", () => {
    document.body.classList.remove("drawer-open");
    if (location.hash.startsWith("#paper:")) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  });

  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) closeDrawer();
  });

  /* ───────── Event delegation ───────── */

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open]");
    if (opener) {
      openPaper(opener.dataset.open);
      return;
    }
    const closer = e.target.closest("[data-close]");
    if (closer) {
      closeDrawer();
      return;
    }
    const themeLink = e.target.closest("[data-theme-link]");
    if (themeLink) {
      selectTheme(themeLink.dataset.themeLink);
      return;
    }
    const filter = e.target.closest("[data-filter]");
    if (filter) {
      const id = filter.dataset.filter;
      setTimelineFilter(id && id === timelineFilter && filter.classList.contains("lane-label") ? null : id);
    }
  });

  function openFromHash() {
    const m = location.hash.match(/^#paper:([\w-]+)$/);
    if (m && paperById[m[1]]) openPaper(m[1]);
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
      { threshold: 0.08 }
    );
    targets.forEach((el) => observer.observe(el));
  }

  /* ───────── Init ───────── */

  renderHero();
  renderMap();
  selectTheme(activeTheme);
  renderTimeline();
  renderThemes();
  renderBibliography();
  setupReveal();
  openFromHash();
})();
