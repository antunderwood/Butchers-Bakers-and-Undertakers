// Shared behaviour for the front page and the directory pages: compare sliders, the map and
// its shop panel, shop cards, scroll reveals and scroll-linked effects. Needs data/directory.js
// and Leaflet loaded first; each page then calls initStreet() with the entries it shows.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const phone = matchMedia("(max-width: 720px)");
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pad = (n) => String(n).padStart(2, "0");
const header = document.querySelector(".top");
const ARROW = {
  up: '<path d="M12 19V5M6 11L12 5L18 11"/>', down: '<path d="M12 5V19M6 13L12 19L18 13"/>',
  chevron: '<path d="M6 9L12 15L18 9"/>', drag: '<path d="M8 6L2 12L8 18M16 6L22 12L16 18"/>',
  expand: '<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14"/>', close: '<path d="M18 6L6 18M6 6L18 18"/>',
  out: '<path d="M7 17L17 7M9 7H17V15"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20L16 16"/>'
};
const icon = (name, size = 12) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ARROW[name]}</svg>`;

// Wires a .compare element: drag (all pointers), hover-follow (mouse, cards only),
// arrow keys, and a springy settle back to centre. Returns the position setter.
function makeCompare(el, { follow = false } = {}) {
  const nows = el.querySelectorAll(".now");
  const divider = el.querySelector(".divider");
  const handle = el.querySelector(".handle");
  let pos = 50, dragging = false;
  function set(p) {
    pos = clamp(p, 0, 100);
    const clip = `inset(0 ${100 - pos}% 0 0)`;
    nows.forEach((n) => { n.style.clipPath = clip; });
    divider.style.left = handle.style.left = pos + "%";
    el.setAttribute("aria-valuenow", Math.round(pos));
  }
  const at = (e) => {
    const r = el.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * 100;
  };
  el.addEventListener("pointerdown", (e) => {
    el.setPointerCapture(e.pointerId);
    dragging = true;
    el.classList.remove("settle");
    el.classList.add("dragging");
    set(at(e));
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging && !(follow && e.pointerType === "mouse")) return;
    el.classList.remove("settle");
    set(at(e));
  });
  const stop = () => { dragging = false; el.classList.remove("dragging"); };
  el.addEventListener("pointerup", stop);
  el.addEventListener("pointercancel", stop);
  if (follow) {
    el.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse" || dragging) return;
      el.classList.add("settle");
      set(50);
    });
  }
  el.addEventListener("keydown", (e) => {
    const step = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    el.classList.add("settle");
    set(pos + step);
  });
  set(50);
  return set;
}

// --- Directory entries: naming, addresses and markup ---
const plainName = (e) => e.name.replace(/\s*\{[\d,]+\}/g, "");
const shortName = (e) => plainName(e).replace(/\s*\(.*?\)/g, "").trim();
const pinLabel = (e) => e.pin || e.no;
const side = (e) => GROUPS[e.group].side;
// Addresses always say which side, so a number is never read without its street
function address(e) {
  if (e.group === "langley-parade") return `${e.no} Langley Parade`;
  return (e.no ? e.no + " " : "") + "High Street, " + (e.group === "causeway-parade" ? "Causeway Parade" : `${side(e)} side`);
}
// A section as house numbers ("Nos. 1 to 87") and as a count in words, so counts never look like addresses
const sectionOf = (g) => DIRECTORY.filter((e) => e.group === g);
function numberRange(g) {
  const n = sectionOf(g).map((e) => parseInt(e.no, 10)).filter(Number.isFinite);
  return `Nos. ${Math.min(...n)} to ${Math.max(...n)}`;
}
const addressCount = (g) => `${sectionOf(g).length} addresses`;
DIRECTORY.forEach((e) => {
  e.id = `${e.no} ${shortName(e)}`.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 7).join("-");
});
// {3,6} footnote markers become superscripts naming their sources on hover
const fmt = (text) => text.replace(/\s*\{([\d,]+)\}/g, (_, ns) =>
  `<sup title="${ns.split(",").map((n) => `${n}: ${SOURCES[n]}`).join("; ").replace(/"/g, "&quot;")}">${ns.replace(/,/g, ", ")}</sup>`);
function lineHTML(l) {
  if (l.startsWith("# ")) return `<li class="sub">${fmt(l.slice(2))}</li>`;
  if (l.startsWith("~ ")) return `<li class="ed">${fmt(l.slice(2))}</li>`;
  return `<li>${fmt(l)}</li>`;
}
// The first three occupants (sub-headings ride along) are the brief; the rest is Read more
function splitLines(lines) {
  let n = 0, cut = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith("# ") && ++n > 3) { cut = i; break; }
  }
  return [lines.slice(0, cut), lines.slice(cut)];
}
const paras = (text) => text.trim().split(/\n\s*\n/).map((p) => `<p>${p}</p>`).join("");
function photoHTML(photos, label) {
  if (!photos) return "";
  if (photos.length === 1) {
    return `<figure class="photo solo" style="margin:0"><img src="${photos[0]}" alt="${label}, earlier photograph"/>
      <div class="cap then-cap"><span>Then</span></div></figure>`;
  }
  return `
    <div class="photo compare" tabindex="0" role="slider" aria-label="Compare then and now: ${label}" aria-valuemin="0" aria-valuemax="100">
      <img class="then" src="${photos[0]}" alt="${label}, earlier photograph"/>
      <div class="cap then-cap"><span>Then</span></div>
      <img class="now" src="${photos[1]}" alt="${label} today"/>
      <div class="cap now"><span>Now &middot; ${label}</span></div>
      <div class="grain"></div>
      <div class="divider"></div>
      <div class="handle">${icon("drag")}</div>
    </div>`;
}
const extrasHTML = (extras) => !extras ? "" : `<div class="extras">${extras.map(([src, cap]) =>
  `<figure><img src="${src}" alt="${cap}" loading="lazy"/><figcaption>${cap}</figcaption></figure>`).join("")}</div>`;
function infoHTML(e, body) {
  return `
    <div class="info${e.no ? "" : " nonum"}">
      ${e.no ? `<span class="num" aria-hidden="true" style="--len:${e.no.length}">${e.no}</span>` : ""}
      <div class="txt">
        <h3><span>${fmt(e.name)}</span></h3>
        <p class="meta">${address(e)}</p>
        ${e.summary ? `<p class="note">${e.summary}</p>` : ""}
        ${body}
      </div>
    </div>`;
}
const list = (lines) => lines.length ? `<ol class="hist">${lines.map(lineHTML).join("")}</ol>` : "";
const tellUs = (e) => `<a class="to-tell" href="mailto:shops@allhs.org.uk?subject=${encodeURIComponent(`${address(e)}, ${shortName(e)}`)}">Know more about ${address(e)}? Email the BBU team</a>`;
// On the front page, an entry links to its directory section with it already open
let linkSections = false;
function sectionLink(e) {
  if (!linkSections) return "";
  return `<a class="to-section" href="directory.html?section=${e.group}#${e.id}"><span class="roll"><span>See all of ${GROUPS[e.group].title}</span></span>${icon("out")}</a>`;
}
function briefHTML(e) {
  const [shown] = splitLines(e.lines);
  return photoHTML(e.photos, shortName(e)) + infoHTML(e, list(shown) + `
    <button class="to-card sv-full" type="button"><span class="roll"><span>Full details</span></span>${icon("expand")}</button>
    ${sectionLink(e)}`);
}
// The full view: the whole entry at size, with its sources written out (title tooltips don't work on touch)
function fullHTML(e) {
  const used = [...new Set([e.name, ...e.lines].join(" ").match(/\{[\d,]+\}/g)?.join(",").match(/\d+/g) || [])].sort((a, b) => a - b);
  const media = photoHTML(e.photos, shortName(e)) + extrasHTML(e.extras);
  return `<div class="fl-grid${media ? "" : " text-only"}">
    ${media ? `<div class="fl-media">${media}</div>` : ""}
    <div class="fl-text">${infoHTML(e, (e.description ? `<div class="desc">${paras(e.description)}</div>` : "") + list(e.lines) +
      (used.length ? `<p class="fl-src">Sources: ${used.map((n) => `<sup>${n}</sup>&nbsp;${SOURCES[n]}`).join("; ")}</p>` : "") + tellUs(e) + "<br>" + sectionLink(e))}</div>
  </div>`;
}
function cardHTML(e) {
  const [shown, rest] = splitLines(e.lines);
  const more = rest.length || e.extras || e.description;
  return photoHTML(e.photos, shortName(e)) + infoHTML(e, list(shown) + (more ? `
    <details class="more">
      <summary><span class="lbl">Read more</span><span class="less">Read less</span>${icon("chevron")}</summary>
      <div class="desc">${e.description ? paras(e.description) : ""}${list(rest)}${extrasHTML(e.extras)}${tellUs(e)}</div>
    </details>` : "") + (e.lat ? `
    <a class="to-map" href="#${e.id}"><span class="roll"><span>Show on map</span></span>${icon("up")}</a>` : ""));
}

// Skip a scroll reveal, so a jump doesn't aim at the pre-reveal offset and land 48px short
function revealNow(el) {
  el.style.transition = "none";
  el.classList.add("in");
  void el.offsetWidth;
  el.style.transition = "";
}

// --- The street: map, chips, shop panel and cards for the given entries ---
let drawLeader = () => {};
function initStreet(shops, opts = {}) {
  linkSections = !!opts.linkSections;
  const mapLayout = document.getElementById("map-layout");
  const mapCard = document.getElementById("map-card");
  const mapChips = document.getElementById("map-chips");
  const pins = [], chips = [], markers = [];
  const mapped = shops.filter((e) => e.lat);

  // Leaflet on OpenStreetMap tiles; markers and chips are hover-linked
  const map = L.map("leaflet", {
    scrollWheelZoom: false, // the page scrolls past the map; zoom with the buttons, a pinch or a double-click
    dragging: !L.Browser.mobile, // on phones one finger scrolls the page, two fingers move the map
    minZoom: 15
  });
  // Front page: fit the cluster, not the outliers (no. 81 at the far south would zoom everything out
  // until the central shops overlap); outliers are a pan away and their chips still fly there
  let core = mapped;
  if (opts.fitCore && mapped.length > 3) {
    const mid = (k) => mapped.map((e) => e[k]).sort((a, b) => a - b)[mapped.length >> 1];
    const c = L.latLng(mid("lat"), mid("lng"));
    const d = mapped.map((e) => c.distanceTo([e.lat, e.lng]));
    const lim = Math.max(60, 2.5 * [...d].sort((a, b) => a - b)[d.length >> 1]);
    core = mapped.filter((e, i) => d[i] <= lim);
  }
  const home = L.latLngBounds(core.map((e) => [e.lat, e.lng]));
  map.fitBounds(home, { padding: [32, 32], maxZoom: 18 });
  if (new Set(mapped.map(side)).size > 1) {
    mapCard.insertAdjacentHTML("beforeend", '<div class="map-key" aria-hidden="true"><span><i></i>South side</span><span><i class="north"></i>North side</span></div>');
  }
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  function hot(i, on) {
    pins[i]?.classList.toggle("hot", on);
    chips[i].classList.toggle("hot", on);
  }
  function hoverLink(el, i) {
    el.addEventListener("pointerenter", () => hot(i, true));
    el.addEventListener("pointerleave", () => hot(i, false));
    el.addEventListener("focus", () => hot(i, true));
    el.addEventListener("blur", () => hot(i, false));
  }
  shops.forEach((e, i) => {
    if (e.lat) {
      const marker = L.marker([e.lat, e.lng], {
        icon: L.divIcon({ className: "pin-wrap", html: `<span class="pin side-${side(e)}">${pinLabel(e)}</span>`, iconSize: [28, 28] }),
        riseOnHover: true
      }).addTo(map).on("click", () => openShop(i));
      const el = marker.getElement();
      el.setAttribute("aria-label", `${address(e)}: ${shortName(e)}`);
      // Leaflet only opens popups on Enter, so markers need their own key handling
      el.addEventListener("keydown", (ev) => {
        if (ev.key !== "Enter" && ev.key !== " ") return;
        ev.preventDefault();
        openShop(i);
      });
      hoverLink(el, i);
      markers[i] = marker;
      pins[i] = el.firstChild;
    }
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.dataset.reveal = "";
    chip.style.setProperty("--i", Math.min(i, 8));
    chip.innerHTML = (e.no ? `<b>${e.no}</b>` : "") + shortName(e);
    chip.addEventListener("click", () => openShop(i));
    hoverLink(chip, i);
    mapChips.appendChild(chip);
    chips[i] = chip;
  });

  // Neighbouring shopfronts are metres apart, so their markers overlap at street zoom. Nudge each
  // marker that collides to the nearest free spot, with a stem and dot marking its true position.
  const SPOTS = [[0, 0], [0, -30], [0, 30], [30, 0], [-30, 0], [26, -26], [-26, -26], [26, 26], [-26, 26], [0, -58], [0, 58], [58, 0], [-58, 0]];
  function declutter() {
    const placed = [];
    markers.forEach((m, i) => {
      if (!m) return;
      const pt = map.latLngToContainerPoint(m.getLatLng());
      const [dx, dy] = SPOTS.find(([x, y]) => placed.every((q) => Math.hypot(pt.x + x - q.x, pt.y + y - q.y) > 27)) || [0, 0];
      placed.push({ x: pt.x + dx, y: pt.y + dy });
      pins[i].style.translate = dx || dy ? `${dx}px ${dy}px` : "";
      const wrap = m.getElement();
      wrap.classList.toggle("moved", !!(dx || dy));
      wrap.style.setProperty("--sl", Math.hypot(dx, dy) - 12 + "px");
      wrap.style.setProperty("--sa", Math.atan2(dy, dx) + "rad");
    });
  }
  map.on("zoomend", declutter);
  declutter();

  // Shop view: docked beside the map (a bottom sheet on phones), one shop at a time.
  // The open shop lives in the URL hash, so Back/Forward and shared links work.
  const view = document.getElementById("shop-view");
  const viewBody = view.querySelector(".sv-body");
  const viewCount = view.querySelector(".sv-count");
  const viewLive = document.getElementById("shop-live");
  let cur = -1;
  const full = document.createElement("dialog");
  full.className = "full";
  full.innerHTML = `
    <div class="sv-bar">
      <button class="sv-back fl-close" type="button">${icon("close", 14)}<span class="roll"><span>Back to map</span></span></button>
      <span class="sv-count"></span>
      <button class="sv-step fl-prev" type="button" aria-label="Previous shop along the street">${icon("chevron", 14).replace("M6 9L12 15L18 9", "M15 6L9 12L15 18")}</button>
      <button class="sv-step fl-next" type="button" aria-label="Next shop along the street">${icon("chevron", 14).replace("M6 9L12 15L18 9", "M9 6L15 12L9 18")}</button>
    </div>
    <div class="fl-body"></div>`;
  document.body.append(full);
  const fullBody = full.querySelector(".fl-body");
  function renderFull(dir = 0) {
    const e = shops[cur];
    full.setAttribute("aria-label", `${address(e)}, ${shortName(e)}`);
    full.querySelector(".sv-count").textContent = GROUPS[e.group].short;
    fullBody.style.setProperty("--dx", dir * 32 + "px");
    fullBody.innerHTML = fullHTML(e);
    fullBody.scrollTop = 0;
    const photo = fullBody.querySelector(".compare");
    if (photo) makeCompare(photo);
  }
  function openFull() {
    history.pushState(null, "", "#full-" + shops[cur].id); // Back closes it, and the view can be shared
    renderFull();
    full.showModal();
  }
  // However it closes (button, Esc, backdrop), land on the shop's map view rather than going back,
  // so closing after stepping to another shop doesn't jump the map back to the first one
  full.addEventListener("close", () => {
    if (location.hash.startsWith("#full-")) history.replaceState(null, "", "#" + shops[cur].id);
  });
  full.addEventListener("click", (ev) => { if (ev.target === full) full.close(); });
  full.querySelector(".fl-close").addEventListener("click", () => full.close());
  full.querySelector(".fl-prev").addEventListener("click", () => stepShop(-1));
  full.querySelector(".fl-next").addEventListener("click", () => stepShop(1));
  view.querySelector(".sv-expand").addEventListener("click", openFull);
  viewBody.addEventListener("click", (ev) => { if (ev.target.closest(".sv-full")) openFull(); });

  function show(i, dir = 0) {
    if (i === cur) return;
    cur = i;
    [pins, chips].forEach((els) => els.forEach((el, j) => el?.classList.toggle("is-active", j === i)));
    markers.forEach((m, j) => m.setZIndexOffset(j === i ? 1000 : 0));
    mapLayout.classList.toggle("open", i >= 0);
    view.hidden = i < 0;
    if (i < 0) return;
    const e = shops[i];
    viewCount.textContent = GROUPS[e.group].short; // a section name, not a position: the only number in view is the address
    viewLive.textContent = `${address(e)}, ${shortName(e)}: ${i + 1} of ${shops.length}`;
    viewBody.style.setProperty("--dx", dir * 32 + "px");
    viewBody.style.setProperty("--dy", dir ? "0px" : "12px");
    viewBody.innerHTML = briefHTML(e);
    const photo = viewBody.querySelector(".compare");
    if (photo) makeCompare(photo, { follow: true });
    if (e.lat) {
      const z = Math.max(map.getZoom(), 18);
      // On phones the sheet covers the bottom of the map, so aim the pin at the middle of what stays visible
      const covered = phone.matches ? Math.max(0, parseFloat(getComputedStyle(mapCard).scrollMarginTop) + mapCard.offsetHeight - (innerHeight - view.offsetHeight)) : 0;
      const at = map.unproject(map.project([e.lat, e.lng], z).add([0, covered / 2]), z);
      if (reduce) map.setView(at, z, { animate: false });
      else map.flyTo(at, z, { duration: 0.8 });
    }
    // Keep the map and the shop on screen together
    revealNow(mapCard);
    if (phone.matches) mapCard.scrollIntoView({ block: "start" });
    else {
      const r = mapLayout.getBoundingClientRect();
      if (r.top < header.offsetHeight || r.bottom > innerHeight) mapLayout.scrollIntoView({ block: "center" });
    }
  }
  // Leader line from the open shop's marker to the edge of its card. Redrawn every frame from
  // the rAF loop, so it follows flyTo, map drags, resizes and the sticky sheet as the page scrolls.
  const leader = mapLayout.querySelector(".leader");
  const [leaderLine, leaderDot] = leader.children;
  drawLeader = () => {
    const pin = pins[cur];
    let on = false;
    if (pin) {
      const box = mapLayout.getBoundingClientRect(), m = mapCard.getBoundingClientRect();
      const r = pin.getBoundingClientRect(), p = view.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      let ex, ey;
      if (p.left > x) { ex = p.left; ey = clamp(y, p.top + 28, p.bottom - 28); } // card to the right
      else if (p.top > y) { ex = clamp(x, p.left + 28, p.right - 28); ey = p.top; } // sheet below
      on = ex !== undefined && x > m.left && x < m.right && y > m.top && y < m.bottom;
      if (on) {
        const k = 18 / (Math.hypot(ex - x, ey - y) || 1); // start at the pin's edge, not over its number
        leaderLine.setAttribute("x1", x + (ex - x) * k - box.left);
        leaderLine.setAttribute("y1", y + (ey - y) * k - box.top);
        leaderLine.setAttribute("x2", ex - box.left);
        leaderLine.setAttribute("y2", ey - box.top);
        leaderDot.setAttribute("cx", ex - box.left);
        leaderDot.setAttribute("cy", ey - box.top);
      }
    }
    leader.classList.toggle("on", on);
  };
  function openShop(i) {
    if (i === cur) return;
    history.pushState(null, "", "#" + shops[i].id);
    show(i);
  }
  function stepShop(d) {
    if (opts.section && (cur + d < 0 || cur + d >= shops.length)) {
      const keys = Object.keys(GROUPS), k = keys[(keys.indexOf(opts.section) + d + keys.length) % keys.length];
      const next = DIRECTORY.filter((e) => e.group === k).at(d > 0 ? 0 : -1);
      location.href = `directory.html?section=${k}#${full.open ? "full-" : ""}${next.id}`;
      return;
    }
    const i = (cur + d + shops.length) % shops.length;
    history.replaceState(null, "", "#" + (full.open ? "full-" : "") + shops[i].id); // walking the street shouldn't fill the Back stack
    show(i, d);
    if (full.open) renderFull(d);
  }
  function closeShop() {
    const was = cur, hadFocus = view.contains(document.activeElement);
    history.pushState(null, "", location.pathname + location.search);
    show(-1);
    if (hadFocus) chips[was].focus({ preventScroll: true });
  }
  function fromHash() {
    const wantFull = location.hash.startsWith("#full-");
    const id = wantFull ? "#" + location.hash.slice(6) : location.hash;
    show(shops.findIndex((e) => "#" + e.id === id));
    if (wantFull && cur >= 0) {
      renderFull();
      if (!full.open) full.showModal();
    } else if (full.open) full.close();
    const about = location.hash.startsWith("#about-") && document.getElementById(location.hash.slice(1));
    if (!about) return;
    // Read more on the map card lands on the full history. Scroll after closing the
    // panel, since on phones the sheet leaving shortens the map section above the card.
    const more = about.querySelector(".more");
    if (more) more.open = true;
    revealNow(about);
    about.scrollIntoView({ block: "start" });
  }
  addEventListener("popstate", fromHash);
  addEventListener("hashchange", fromHash); // plain anchors: #shop-id opens it on the map, #about-shop-id jumps to its card
  addEventListener("keydown", (ev) => { if (ev.key === "Escape" && cur >= 0 && !full.open) closeShop(); }); // Esc in the full view only closes that
  view.querySelector(".sv-back").addEventListener("click", closeShop);
  view.querySelector(".sv-prev").addEventListener("click", () => stepShop(-1));
  view.querySelector(".sv-next").addEventListener("click", () => stepShop(1));

  // Cards: every entry, with its photo, first occupants and the rest under Read more
  const shopGrid = document.getElementById("shop-grid");
  shops.forEach((e, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.id = "about-" + e.id;
    card.dataset.reveal = "";
    card.style.setProperty("--i", i % 2);
    card.innerHTML = cardHTML(e);
    const photo = card.querySelector(".compare");
    if (photo) makeCompare(photo, { follow: true });
    shopGrid.appendChild(card);
  });

  initFinder();
  startEffects();
  fromHash(); // open a shop linked to directly

  // Finder: search every entry and occupant in the directory, or filter by trade. Matches on this
  // page light up on the map and in the chips; the results list covers every section.
  function initFinder() {
    const box = document.getElementById("finder");
    if (!box) return;
    box.innerHTML = `
      <label class="finder-box">${icon("search", 18)}
        <input type="search" placeholder="Search ${DIRECTORY.length} addresses and every past occupant: a name, a trade, a year" autocomplete="off" aria-label="Search the directory">
      </label>
      <div class="trades" role="group" aria-label="Filter by trade">${Object.keys(TRADES).map((t) => `<button type="button" aria-pressed="false">${t}</button>`).join("")}</div>
      <p class="finder-sum" aria-live="polite"></p>
      <ol class="finder-results"></ol>`;
    const input = box.querySelector("input"), sum = box.querySelector(".finder-sum"), results = box.querySelector(".finder-results");
    const buttons = [...box.querySelectorAll(".trades button")];
    const norm = (t) => t.replace(/\s*\{[\d,]+\}/g, "").replace(/[\u2018\u2019]/g, "'").toLowerCase();
    const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const params = new URLSearchParams(location.search);
    let trade = TRADES[params.get("t")] ? params.get("t") : "";
    input.value = params.get("q") || "";

    function apply() {
      const words = norm(input.value).split(/\s+/).filter(Boolean);
      buttons.forEach((b) => b.setAttribute("aria-pressed", b.textContent === trade));
      const active = !!(trade || words.length);
      const re = trade ? TRADES[trade] : words.length ? new RegExp(esc(words[0])) : null;
      const hits = !active ? [] : DIRECTORY.flatMap((e) => {
        const texts = [e.name, ...e.lines].map(norm);
        if (!trade && !words.every((w) => texts.some((t) => t.includes(w)))) return [];
        const k = texts.findIndex((t) => re.test(t));
        return k < 0 ? [] : [{ e, line: [e.name, ...e.lines][k].replace(/^[#~] /, "") }];
      });
      const here = new Set(hits.map((h) => shops.indexOf(h.e)).filter((i) => i >= 0));
      mapLayout.classList.toggle("filtering", active);
      pins.forEach((pin, i) => pin?.classList.toggle("match", here.has(i)));
      chips.forEach((chip, i) => { chip.hidden = active && !here.has(i); });
      const hitMapped = shops.filter((e, i) => here.has(i) && e.lat);
      if (cur < 0) {
        const b = hitMapped.length ? L.latLngBounds(hitMapped.map((e) => [e.lat, e.lng])) : home;
        if (reduce) map.fitBounds(b, { padding: [48, 48], maxZoom: 18 });
        else map.flyToBounds(b, { padding: [48, 48], maxZoom: 18, duration: 0.8 });
      }
      const label = trade || `\u201c${input.value.trim()}\u201d`;
      sum.innerHTML = !active ? "" : `${hits.length || "No"} address${hits.length === 1 ? "" : "es"} for ${label}` +
        (hits.length ? `, ${here.size} on this map` : "") + ' <button type="button">Clear</button>';
      // Snippets drop footnotes, so the highlight can only land in the occupant text
      const hl = (line) => line.replace(/\s*\{[\d,]+\}/g, "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c])
        .replace(new RegExp(trade ? TRADES[trade].source : esc(words[0] || ""), "gi"), (m) => m ? `<mark>${m}</mark>` : m);
      const q = new URLSearchParams(trade ? { t: trade } : { q: input.value.trim() });
      results.innerHTML = hits.map(({ e, line }) => `<li><a href="${shops.includes(e) ? "" : `directory.html?section=${e.group}&${q}`}#full-${e.id}">
        <b>${e.no || "\u00b7"}</b><span class="r-name">${shortName(e)}</span><span class="r-sec">${GROUPS[e.group].short}</span>
        <span class="r-line">${hl(line)}</span></a></li>`).join("");
      // Keep the search in the address bar, so it survives Back and can be shared
      const url = new URL(location.href);
      ["q", "t"].forEach((k) => url.searchParams.delete(k));
      if (active) q.forEach((v, k) => url.searchParams.set(k, v));
      history.replaceState(null, "", url);
    }
    let timer;
    input.addEventListener("input", () => { trade = ""; clearTimeout(timer); timer = setTimeout(apply, 180); });
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && (input.value || trade)) { ev.stopPropagation(); input.value = ""; trade = ""; apply(); }
    });
    buttons.forEach((b) => b.addEventListener("click", () => { trade = trade === b.textContent ? "" : b.textContent; input.value = ""; apply(); }));
    sum.addEventListener("click", (ev) => { if (ev.target.closest("button")) { input.value = ""; trade = ""; apply(); } });
    if (trade || input.value) apply();
  }
}

// Trade filters for the finder, matched against each entry's name and occupants
const TRADES = {
  Butchers: /butcher|meat/, Bakers: /baker|bakery|bread/, Undertakers: /undertaker|funeral/,
  Grocers: /grocer|provision|supply stores|supermarket|fruiterer/, Drapers: /draper|outfitter|haberdash|clothing|boutique/,
  Pubs: /public house|\bph\b|beer seller|arms\b/, Banks: /\bbank\b/, Chemists: /chemist|pharmac/,
  "Post offices": /post office/, Hairdressers: /hair|barber/, Shoes: /boot|shoe|cobbler/
};

// --- Phone menu: the header's links fold behind a button below 560px ---
const menuBtn = document.querySelector(".menu-btn");
if (menuBtn) {
  const setMenu = (open) => { header.classList.toggle("menu-open", open); menuBtn.setAttribute("aria-expanded", open); };
  menuBtn.addEventListener("click", () => setMenu(!header.classList.contains("menu-open")));
  header.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (ev) => { if (ev.key === "Escape") setMenu(false); });
}

// --- Footer sources, numbered as the directory's footnotes ---
const sourceList = document.getElementById("sources");
if (sourceList) sourceList.innerHTML = Object.values(SOURCES).map((s) => `<li>${s}</li>`).join("");

// --- Hero comparison slider (front page), with a one-off sweep that teaches the drag ---
const heroDrag = document.getElementById("hero-drag");
if (heroDrag) {
  const setHero = makeCompare(heroDrag);
  let heroTouched = false;
  ["pointerdown", "keydown"].forEach((t) => heroDrag.addEventListener(t, () => {
    heroTouched = true;
    heroDrag.classList.add("touched");
  }));
  if (!reduce) {
    const keys = [[0, 50], [1000, 24], [2200, 76], [3200, 50]];
    const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    setTimeout(() => {
      const t0 = performance.now();
      requestAnimationFrame(function sweep(now) {
        if (heroTouched) return;
        const t = Math.max(1, now - t0); // rAF timestamps can precede t0
        const i = keys.findIndex(([ms]) => ms > t);
        if (i === -1) return setHero(50);
        const [[a, va], [b, vb]] = [keys[i - 1], keys[i]];
        setHero(va + (vb - va) * ease((t - a) / (b - a)));
        requestAnimationFrame(sweep);
      });
    }, 2000);
  }
}

// --- Scroll reveals and scroll-linked effects, rAF-driven so they work regardless of scroll container ---
function startEffects() {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal], [data-in]").forEach((el) => io.observe(el));

  const heroThen = document.getElementById("hero-then");
  const fill = document.querySelector(".fill span");
  const ko = document.querySelector(".ko");
  const progress = document.querySelector(".progress");
  const darkSecs = [...document.querySelectorAll(".map-sec, .foot")];
  function tick() {
    const vh = innerHeight;
    const de = document.documentElement;
    progress.style.transform = `scaleX(${de.scrollTop / Math.max(1, de.scrollHeight - vh)})`;
    const y = header.offsetHeight / 2;
    header.classList.toggle("dark", darkSecs.some((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
    drawLeader();
    if (!reduce) {
      let r;
      if (heroThen) {
        r = heroDrag.getBoundingClientRect();
        heroThen.style.transform = `translateY(${clamp(r.top * -0.12, -90, 90)}px)`;
      }
      if (ko) {
        r = ko.getBoundingClientRect();
        ko.style.setProperty("--by", clamp(50 + (r.top / vh) * 60, 0, 100) + "%");
      }
      if (fill) {
        r = fill.parentElement.getBoundingClientRect();
        fill.style.setProperty("--p", clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3), 0, 1) * 100 + "%");
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
