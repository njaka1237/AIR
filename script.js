/* AIRLINK – Site d'infos : aires protégées du Sud de Madagascar */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const nf = new Intl.NumberFormat("fr-FR");
const fmtHa = (n) => n == null ? "—" : nf.format(n) + " ha";
const orDash = (v) => v == null || v === "" ? "—" : v;

/* ---------- Illustrations générées (une par aire protégée) ---------- */
function rng(seed) { let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function hills(r, base, amp, fill, op = 1) {
  let d = `M0 160 L0 ${base}`; const f = 0.02 + r() * 0.03, ph = r() * 6;
  for (let x = 0; x <= 400; x += 10) d += ` L${x} ${(base + Math.sin(x * f + ph) * amp + Math.sin(x * f * 2.3 + ph) * amp * 0.4).toFixed(1)}`;
  return `<path d="${d} L400 160 Z" fill="${fill}" opacity="${op}"/>`;
}
function mesas(r, base, fill) {
  let d = `M0 160 L0 ${base}`, x = 0;
  while (x < 400) { const w = 30 + r() * 50, h = base - r() * 38; d += ` L${x} ${h.toFixed(1)} L${(x + w).toFixed(1)} ${h.toFixed(1)}`; x += w; }
  return `<path d="${d} L400 ${base} L400 160 Z" fill="${fill}"/>`;
}
function baobab(x, y, s, c) { return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M-9 0 Q-6 -26 -4 -34 L4 -34 Q6 -26 9 0 Z"/><ellipse cx="0" cy="-38" rx="16" ry="6"/><path d="M-12 -38 L-20 -46 M12 -38 L20 -46 M0 -40 L0 -50" stroke="${c}" stroke-width="2.4" fill="none"/></g>`; }
function tree(x, y, s, c) { return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><rect x="-1.5" y="-14" width="3" height="14"/><circle cx="0" cy="-20" r="10"/><circle cx="-7" cy="-15" r="7"/><circle cx="7" cy="-15" r="7"/></g>`; }
function scene(type, id) {
  const r = rng(id), g = `g${id.replace(/[^a-z]/g, "")}`;
  const P = {
    canyon: ["#fbc56b", "#d9582b"], dry: ["#f6dc95", "#e8964a"], lake: ["#fbe3cf", "#e9a3a0"],
    gallery: ["#e3efc0", "#86c07a"], rain: ["#b6e0d0", "#3a8b74"], cape: ["#fdd9a6", "#ef8a58"]
  }[type] || ["#fbe3b0", "#e8964a"];
  let body = "";
  if (type === "canyon") body = mesas(r, 100, "#b5441f") + mesas(r, 122, "#8a2f16") + hills(r, 146, 6, "#4d1a0b");
  if (type === "dry") body = hills(r, 100, 10, "#8fa04a") + hills(r, 124, 8, "#5f7a33") + hills(r, 146, 5, "#33501f") + [60, 160, 270, 340].map(x => tree(x, 118 + r() * 14, 1 + r() * .5, "#2c4418")).join("");
  if (type === "lake") body = hills(r, 96, 8, "#b5895a") + `<ellipse cx="200" cy="130" rx="190" ry="24" fill="#7bb0cf"/><ellipse cx="200" cy="130" rx="190" ry="24" fill="none" stroke="#fff" stroke-opacity=".4"/>` + [90, 130, 175, 230, 280].map((x, i) => `<g transform="translate(${x} ${122 + (i % 2) * 6})"><circle cx="0" cy="-10" r="3" fill="#f27a9a"/><path d="M0 -8 Q-3 -2 0 0 Q3 -2 0 -8" fill="#f7a1b9"/><path d="M0 0 V10" stroke="#f27a9a" stroke-width="1.2"/></g>`).join("") + hills(r, 152, 4, "#6a4a2a");
  if (type === "gallery") body = hills(r, 96, 8, "#5aa56a") + hills(r, 122, 8, "#3a8a55") + [40, 90, 140, 200, 250, 310, 360].map(x => tree(x, 142 + r() * 6, 1.3 + r() * .5, "#1f5a35")).join("");
  if (type === "rain") body = hills(r, 86, 14, "#3f9a82", .7) + hills(r, 108, 12, "#2a7a62") + hills(r, 132, 10, "#1b5a47") + `<rect width="400" height="160" fill="url(#m${g})" opacity=".5"/>`;
  if (type === "cape") body = hills(r, 118, 6, "#a8582d") + `<rect y="132" width="400" height="30" fill="#2a6f97"/><path d="M0 138 q25 -6 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" stroke="#fff" stroke-opacity=".55" fill="none"/><g transform="translate(300 118)"><path d="M-6 0 L-4 -34 L4 -34 L6 0Z" fill="#fff"/><rect x="-5" y="-40" width="10" height="6" fill="#c4562b"/><circle cx="0" cy="-43" r="2.4" fill="#ffe27a"/></g>`;
  const sun = type === "rain" || type === "gallery" ? "" : `<circle cx="${70 + r() * 260}" cy="${46 + r() * 20}" r="22" fill="#fff6d6" opacity=".85"/>`;
  return `<svg class="scene" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration ${esc(id)}"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P[0]}"/><stop offset="1" stop-color="${P[1]}"/></linearGradient><linearGradient id="m${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="400" height="160" fill="url(#${g})"/>${sun}${body}</svg>`;
}

/* ---------- Hero : chiffres ---------- */
const totalHa = PARKS.reduce((s, p) => s + (p.area_ha || 0), 0);
const unescoCount = PARKS.filter(p => p.unesco).length;
$("#heroStats").innerHTML = [
  [PARKS.length, "aires protégées", 0], [totalHa / 1000, "milliers d'hectares", 0], [REGION_SUD.regions.length, "régions administratives", 0], [unescoCount, "site UNESCO", 0]
].map(([n, l, d]) => `<div class="hstat"><b data-count="${n}" data-dec="${d}">0</b><span>${l}</span></div>`).join("");
function count(el) {
  const t = +el.dataset.count, dec = +el.dataset.dec, t0 = performance.now();
  (function step(now) { const p = Math.min((now - t0) / 1400, 1); el.textContent = nf.format(+(t * p).toFixed(dec)); if (p < 1) requestAnimationFrame(step); })(t0);
}
$$(".hstat b").forEach(count);

/* ---------- Le Sud en bref : écosystèmes ---------- */
const ecoMap = {};
PARKS.forEach(p => (ecoMap[p.ecosystem] ||= []).push(p));
$("#eco").innerHTML = Object.entries(ecoMap).map(([k, list]) =>
  `<div><i>${list[0].emoji}</i><b>${esc(k)}</b><span>${list.map(p => esc(p.name)).join(", ")}</span></div>`).join("");

/* ---------- Filtres ---------- */
const state = { q: "", type: "Tous", region: "Toutes", sort: "name" };
const types = ["Tous", ...new Set(PARKS.map(p => p.type))];
const regions = ["Toutes", ...REGION_SUD.regions.filter(r => PARKS.some(p => p.region === r))];
function chips(el, list, key) {
  el.innerHTML = list.map(v => `<button class="chip ${state[key] === v ? "active" : ""}" data-v="${esc(v)}">${esc(v)}</button>`).join("");
  el.onclick = (e) => { const b = e.target.closest(".chip"); if (!b) return; state[key] = b.dataset.v; chips(el, list, key); render(); };
}
chips($("#fType"), types, "type");
chips($("#fRegion"), regions, "region");
$("#q").addEventListener("input", e => { state.q = e.target.value; render(); });
$("#sort").addEventListener("change", e => { state.sort = e.target.value; render(); });

function matches(p) {
  if (state.type !== "Tous" && p.type !== state.type) return false;
  if (state.region !== "Toutes" && p.region !== state.region) return false;
  if (!state.q.trim()) return true;
  const hay = norm([p.name, p.type, p.region, p.ecosystem, p.tagline, p.summary, ...p.fauna, ...p.flora, ...p.activities, ...p.highlights].join(" "));
  return norm(state.q).split(/\s+/).filter(Boolean).every(w => hay.includes(w));
}
const sorters = {
  name: (a, b) => a.name.localeCompare(b.name, "fr"),
  "area-desc": (a, b) => (b.area_ha || 0) - (a.area_ha || 0),
  "area-asc": (a, b) => (a.area_ha || 1e12) - (b.area_ha || 1e12),
  created: (a, b) => (a.created || 9999) - (b.created || 9999)
};

/* ---------- Comparaison ---------- */
const cmp = new Set();
function updateCmpBar() {
  const bar = $("#cmpbar");
  bar.hidden = cmp.size === 0;
  $("#cmpText").textContent = `${cmp.size} sélectionnée${cmp.size > 1 ? "s" : ""} (max. 3)`;
  $("#cmpOpen").disabled = cmp.size < 2;
  $("#cmpOpen").style.opacity = cmp.size < 2 ? ".5" : "1";
}

/* ---------- Grille de cartes ---------- */
function card(p, i) {
  return `<article class="park" style="animation-delay:${i * 60}ms">
    ${scene(p.scene, p.id)}
    <span class="badge">${esc(p.type)}</span>${p.unesco ? '<span class="badge unesco">🏆 UNESCO</span>' : ""}
    <div class="park-body">
      <span class="reg">${esc(p.region)} · ${esc(p.ecosystem)}</span>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.tagline)}</p>
      <div class="facts"><span>📐 ${fmtHa(p.area_ha)}</span><span>📅 ${orDash(p.created)}</span></div>
      <div class="card-actions">
        <button class="btn small" data-open="${p.id}">Voir la fiche</button>
        <label class="cmp"><input type="checkbox" data-cmp="${p.id}" ${cmp.has(p.id) ? "checked" : ""}> Comparer</label>
      </div>
    </div></article>`;
}
function render() {
  const list = PARKS.filter(matches).sort(sorters[state.sort]);
  $("#parks").innerHTML = list.map(card).join("");
  $("#count").textContent = `${list.length} aire${list.length > 1 ? "s" : ""} protégée${list.length > 1 ? "s" : ""} affichée${list.length > 1 ? "s" : ""} sur ${PARKS.length}`;
  $("#empty").hidden = list.length > 0;
}
$("#parks").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openPark(b.dataset.open); });
$("#parks").addEventListener("change", e => {
  const c = e.target.closest("[data-cmp]"); if (!c) return;
  if (c.checked) { if (cmp.size >= 3) { c.checked = false; return; } cmp.add(c.dataset.cmp); } else cmp.delete(c.dataset.cmp);
  updateCmpBar();
});
$("#cmpClear").onclick = () => { cmp.clear(); updateCmpBar(); render(); };

/* ---------- Fiche détaillée ---------- */
const list = (a) => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
let current = null, lastFocus = null;
function openPark(id, push = true) {
  const i = PARKS.findIndex(p => p.id === id); if (i < 0) return;
  const p = PARKS[i], prev = PARKS[(i - 1 + PARKS.length) % PARKS.length], next = PARKS[(i + 1) % PARKS.length];
  current = id; lastFocus = document.activeElement;
  $("#mBody").innerHTML = `
    <div class="sheet-hero">${scene(p.scene, p.id)}
      <div class="overlay"><span class="tag" style="margin:0 0 6px">${esc(p.type)}${p.unesco ? " · 🏆 UNESCO" : ""}</span>
      <h2 id="mTitle">${esc(p.name)}</h2><p>${esc(p.tagline)}</p></div></div>
    <div class="keyfacts">
      <div><small>Région</small><b>${esc(p.region)}</b></div>
      <div><small>Superficie</small><b>${fmtHa(p.area_ha)}</b></div>
      <div><small>Création</small><b>${orDash(p.created)}</b></div>
      <div><small>Altitude</small><b>${orDash(p.altitude)}</b></div>
      <div><small>Écosystème</small><b>${esc(p.ecosystem)}</b></div>
    </div>
    <div class="tabs" role="tablist">
      ${["Aperçu", "Faune & flore", "Activités", "Accès & conseils"].map((t, k) => `<button class="tab ${k ? "" : "active"}" role="tab" data-tab="${k}">${t}</button>`).join("")}
    </div>
    <div class="panel active" data-panel="0">
      <p>${esc(p.summary)}</p>
      <h3>Points forts</h3>${list(p.highlights)}
      <h3>Le saviez-vous ?</h3>${list(p.facts)}
      <h3>Sources</h3><ul>${p.sources.map(s => `<li><a href="${SOURCES[s].url}" target="_blank" rel="noopener">${esc(SOURCES[s].label)}</a></li>`).join("")}</ul>
    </div>
    <div class="panel" data-panel="1"><div class="two"><div><h3>🦎 Faune</h3>${list(p.fauna)}</div><div><h3>🌿 Flore</h3>${list(p.flora)}</div></div></div>
    <div class="panel" data-panel="2"><h3>Que faire sur place ?</h3>${list(p.activities)}</div>
    <div class="panel" data-panel="3">
      <div class="info">
        <div><small>Meilleure période</small>${esc(p.best_period)}</div>
        <div><small>Climat</small>${esc(p.climate)}</div>
        <div><small>Comment y accéder</small>${esc(p.access)}</div>
      </div>
      <h3>Conseils pratiques</h3>${list(p.practical)}
    </div>
    <div class="sheet-nav">
      <button class="btn small ghost" data-go="${prev.id}">← ${esc(prev.name)}</button>
      <button class="btn small ghost" data-go="${next.id}">${esc(next.name)} →</button>
    </div>`;
  $("#modal").hidden = false; document.body.style.overflow = "hidden";
  $("#sheet").scrollTop = 0; $("#sheet").focus();
  if (push) history.replaceState(null, "", "#" + id);
}
function closePark() {
  $("#modal").hidden = true; current = null;
  if ($("#cmpModal").hidden) document.body.style.overflow = "";
  history.replaceState(null, "", location.pathname + location.search);
  if (lastFocus) lastFocus.focus();
}
$("#mBody").addEventListener("click", e => {
  const t = e.target.closest("[data-tab]");
  if (t) { $$(".tab", $("#mBody")).forEach(x => x.classList.toggle("active", x === t)); $$(".panel", $("#mBody")).forEach(x => x.classList.toggle("active", x.dataset.panel === t.dataset.tab)); return; }
  const g = e.target.closest("[data-go]"); if (g) openPark(g.dataset.go);
});
$("#mClose").onclick = closePark;
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closePark(); });

/* ---------- Comparateur ---------- */
function openCompare() {
  const ps = [...cmp].map(id => PARKS.find(p => p.id === id));
  const rows = [
    ["Type", p => p.type], ["Région", p => p.region], ["Écosystème", p => p.ecosystem],
    ["Superficie", p => fmtHa(p.area_ha)], ["Création", p => orDash(p.created)], ["Altitude", p => orDash(p.altitude)],
    ["UNESCO", p => p.unesco ? "Oui" : "Non"], ["Faune à voir", p => p.fauna.slice(0, 4).join(", ")],
    ["Activités", p => p.activities.slice(0, 3).join(" · ")], ["Meilleure période", p => p.best_period], ["Accès", p => p.access]
  ];
  $("#cmpTable").innerHTML = `<table><thead><tr><th></th>${ps.map(p => `<th>${esc(p.name)}</th>`).join("")}</tr></thead><tbody>${rows.map(([l, f]) => `<tr><td>${l}</td>${ps.map(p => `<td>${esc(f(p))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  $("#cmpModal").hidden = false; document.body.style.overflow = "hidden";
}
$("#cmpOpen").onclick = () => { if (cmp.size >= 2) openCompare(); };
$("#cmpClose").onclick = () => { $("#cmpModal").hidden = true; document.body.style.overflow = ""; };
$("#cmpModal").addEventListener("click", e => { if (e.target.id === "cmpModal") $("#cmpClose").click(); });
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!$("#cmpModal").hidden) $("#cmpClose").click(); else if (!$("#modal").hidden) { closePark(); document.body.style.overflow = ""; }
});

/* ---------- Carte schématique ---------- */
(function map() {
  const X = lon => ((lon - 43.0) * 71.4).toFixed(1), Y = lat => ((-21.4 - lat) * 71.4).toFixed(1);
  const coast = [[43.2, -21.4], [43.37, -21.75], [43.5, -22.5], [43.67, -23.35], [43.65, -23.9], [43.95, -24.8], [44.4, -25.05], [44.9, -25.25], [45.15, -25.6], [45.55, -25.58], [46.2, -25.4], [46.7, -25.15], [47.0, -25.03], [47.3, -24.6], [47.35, -24.0], [47.6, -23.35], [47.83, -22.8], [48.0, -22.15], [48.2, -21.4]];
  const pts = coast.map(([lo, la]) => `${X(lo)},${Y(la)}`).join(" ");
  $("#map").innerHTML = `<polygon class="land" points="${pts}"/>
    <text x="14" y="318" font-size="10" fill="currentColor" opacity=".55" style="font-family:var(--body)">Carte schématique · positions approximatives</text>` +
    PARKS.map(p => `<g class="pin" tabindex="0" role="button" aria-label="${esc(p.name)}" data-open="${p.id}"><circle cx="${X(p.lon)}" cy="${Y(p.lat)}" r="8"/><text x="${+X(p.lon) + 13}" y="${+Y(p.lat) + 4}">${esc(p.name)}</text></g>`).join("");
  $("#map").addEventListener("click", e => { const g = e.target.closest("[data-open]"); if (g) openPark(g.dataset.open); });
  $("#map").addEventListener("keydown", e => { if (e.key === "Enter") { const g = e.target.closest("[data-open]"); if (g) openPark(g.dataset.open); } });
  $("#legend").innerHTML = PARKS.map(p => `<li><button data-open="${p.id}"><em>${p.emoji}</em><span><b>${esc(p.name)}</b><small>${esc(p.region)} · ${fmtHa(p.area_ha)}</small></span></button></li>`).join("");
  $("#legend").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openPark(b.dataset.open); });
})();

/* ---------- Autres régions + sources ---------- */
$("#zoneCount").textContent = PARKS.length;
$("#zones").innerHTML = OTHER_ZONES.map(z => `<div><em>Bientôt</em><b>${esc(z.name)}</b><span>${esc(z.note)}</span></div>`).join("");
const usedSources = [...new Set(PARKS.flatMap(p => p.sources))];
$("#sourceList").innerHTML = usedSources.map(s => `<li><a href="${SOURCES[s].url}" target="_blank" rel="noopener">${esc(SOURCES[s].label)}</a></li>`).join("") +
  `<li><a href="https://www.ong-madagascar.org/" target="_blank" rel="noopener">ONG Madagascar – chiffres généraux sur la biodiversité</a></li>`;

/* ---------- Recherche du hero ---------- */
$("#heroSearch").addEventListener("submit", e => {
  e.preventDefault(); state.q = $("#heroInput").value; $("#q").value = state.q; render();
  $("#explorer").scrollIntoView({ behavior: "smooth" });
});

/* ---------- Menu, thème, retour haut ---------- */
const menu = $("#menu");
$("#burger").addEventListener("click", () => { const o = menu.classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); });
menu.addEventListener("click", e => { if (e.target.tagName === "A") menu.classList.remove("open"); });
const themeBtn = $("#theme");
function setTheme(dark) {
  document.body.classList.toggle("dark", dark); themeBtn.textContent = dark ? "☀️" : "🌙";
  try { localStorage.setItem("airlink-theme", dark ? "dark" : "light"); } catch (e) {}
}
let saved = null; try { saved = localStorage.getItem("airlink-theme"); } catch (e) {}
setTheme(saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
themeBtn.addEventListener("click", () => setTheme(!document.body.classList.contains("dark")));
const up = $("#up");
addEventListener("scroll", () => { up.style.display = scrollY > 600 ? "block" : "none"; });
up.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- Apparition au scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); } }), { threshold: .12 });
$$(".section>h2,.sub,.eco div,.steps li,.why div,.zone,.zone-others div,.legend li").forEach(el => { el.classList.add("reveal"); io.observe(el); });

/* ---------- Démarrage ---------- */
render(); updateCmpBar();
function fromHash() { const id = location.hash.slice(1); if (id && PARKS.some(p => p.id === id)) openPark(id, false); }
addEventListener("hashchange", fromHash); fromHash();
