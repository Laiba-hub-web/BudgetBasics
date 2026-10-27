/* BudgetBasics app.js: routing, modules and helpers. Content is in data.js. */
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rs = n => "Rs " + Math.round(n).toLocaleString("en-IN");
const num = v => (v.trim() === "" || isNaN(v)) ? NaN : Number(v);
const el = (tag, props = {}, ...kids) => { const e = Object.assign(document.createElement(tag), props); e.append(...kids); return e; };
let SEARCH_Q = "";
const bar = (label, pct, text, cls) => {
  const d = el("div", { className: "res" });
  d.innerHTML = `<div class="top2"><span></span><span></span></div><div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}" aria-label="${label}"><div class="fill ${cls}"></div></div>`;
  d.querySelectorAll("span")[0].textContent = label; d.querySelectorAll("span")[1].textContent = text;
  requestAnimationFrame(() => d.querySelector(".fill").style.width = Math.min(100, pct) + "%");
  return d;
};

/* ---------- Navigation and routing ---------- */
const ROUTES = [["home","Home"],["dashboard","Monthly Dashboard"],["basics","Budgeting Basics"],["needs","Needs vs Wants"],["rule","50-30-20 Rule"],["goals","Savings Goals"],["planner","Budget Simulator"],["challenge","Daily Saving Challenge"],["wallet","Wallet Demo"],["lab","Money Lab"],["mistakes","Money Mistakes"],["infographics","Infographics"],["videos","Video Lessons"],["gallery","Picture Gallery"],["chatbot","AI Chatbot"],["feedback","Feedback"],["contact","Contact Us"],["about","About Us"]];
const NAME = Object.assign(Object.fromEntries(ROUTES), { sitemap: "Sitemap", search: "Search Results" });
const ICON = { home:"\u{1F3E0}", dashboard:"\u{1F4B5}", basics:"\u{1F4D8}", needs:"\u2696\uFE0F", rule:"\u{1F9EE}", goals:"\u{1F3AF}", planner:"\u{1F9FE}", challenge:"\u{1F525}", wallet:"\u{1F45B}", mistakes:"\u26A0\uFE0F", infographics:"\u{1F4CA}", chatbot:"\u{1F916}", lab:"\u{1F9EA}", videos:"\u{1F3AC}", gallery:"\u{1F5BC}\uFE0F", about:"\u2139\uFE0F", contact:"\u2709\uFE0F", sitemap:"\u{1F5FA}\uFE0F", feedback:"\u{1F4AC}", search:"\u{1F50D}" };
const GROUPS = [["Learn", ["basics","needs","rule","mistakes"]], ["Tools", ["dashboard","goals","planner","challenge","wallet","lab","chatbot","search"]], ["Explore", ["infographics","videos","gallery","feedback"]]];
const link = (id, icon) => { const a = el("a", { href: "#" + id }); if (icon) a.append(el("span", { className: "ic", textContent: ICON[id] })); a.append(el("span", { className: "lbl", textContent: NAME[id] })); return a; };
{ const navTree = el("ul", { className: "tree navtree" }), root = el("li"), kids = el("ul"), rl = link("home", 1); rl.className = "node root"; root.append(rl);
  GROUPS.forEach(([g, ids]) => { const li = el("li"), u = el("ul"); li.append(el("span", { className: "node grp", textContent: g })); ids.forEach(i => { const c = el("li"), x = link(i, 1); x.className = "node" + (i === "search" ? " search-mobile" : ""); c.append(x); u.append(c); }); li.append(u); kids.append(li); });
  root.append(kids); navTree.append(root); $("#nav").append(navTree); }
$("#fLearn").append(...GROUPS[0][1].map(i => el("li", {}, link(i))));
$("#fTools").append(...[...GROUPS[1][1], "videos", "gallery"].map(i => el("li", {}, link(i))));
["about", "contact", "feedback", "sitemap"].forEach(i => {
  const li = el("li", { className: i === "sitemap" ? "footer-sitemap-card" : "" });
  const a = link(i);
  if (i === "sitemap") {
    a.className = "footer-sitemap-link";
    a.setAttribute("aria-label", "Open Sitemap");
    a.append(el("span", { className: "footer-sitemap-arrow", textContent: "→" }));
  }
  li.append(a);
  $("#fCo").append(li);
});
{
  // Dedicated horizontal sitemap: Home -> main groups -> individual pages.
  // Keep this separate from the sidebar tree so the sitemap reads like a visual road-map.
  const nodeA = (id, cls = "") => { const x = link(id, 1); x.className = "node " + cls; return x; };
  const map = el("div", { className: "sitemap-map", role: "tree", "aria-label": "BudgetBasics visual sitemap" });
  const rootWrap = el("div", { className: "smap-root" });
  rootWrap.append(nodeA("home", "root"), el("span", { className: "smap-stem", "aria-hidden": "true" }));

  const branches = el("div", { className: "smap-branches" });
  [...GROUPS, ["About the site", ["about", "contact", "feedback"]]].forEach(([g, ids]) => {
    const branch = el("section", { className: "smap-branch", role: "group", "aria-label": g });
    branch.style.setProperty("--items", ids.length);
    branch.append(el("div", { className: "smap-group node grp", textContent: g }));
    const list = el("div", { className: "smap-items" });
    ids.forEach((id, index) => {
      const row = el("div", { className: "smap-item", style: `--i:${index};` });
      row.append(nodeA(id, "smap-page"));
      const note = DATA.desc[id];
      if (note) row.append(el("span", { className: "smap-note", textContent: note }));
      list.append(row);
    });
    branch.append(list);
    branches.append(branch);
  });

  map.append(rootWrap, branches);
  $("#sitemapList").replaceChildren(map);
}
const closeMenu = () => { $("#side").classList.remove("open"); $("#scrim").classList.remove("show"); $("#menuBtn").setAttribute("aria-expanded", "false"); };
function route() {
  let id = location.hash.slice(1) || "home";
  if (!NAME[id]) id = "home";
  $$(".view").forEach(v => v.hidden = v.id !== "v-" + id);
  $$("#nav a, .toplink").forEach(a => a.getAttribute("href") === "#" + id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  const h = $("#v-" + id + " h1"); document.title = (h ? h.textContent : "Home") + " | BudgetBasics";
  $$(".rel").forEach(n => n.remove()); const cur = $("#v-" + id);
  if (cur && DATA.related[id]) { const d = el("div", { className: "rel" }); d.append(el("p", { className: "callout", textContent: "\u{1F4A1} Did you know? " + DATA.dyk[id] }), el("p", {}, "Related pages: ", ...DATA.related[id].map(r => { const x = link(r); x.className = "chip"; return x; }))); cur.append(d); }
  if (id === "dashboard" && typeof renderDashboard === "function") renderDashboard();
  if (id === "challenge" && typeof renderChallenge === "function") renderChallenge();
  if (id === "search" && typeof renderSearch === "function") renderSearch();
  renderBadges();
  closeMenu(); window.scrollTo({ top: 0, behavior: "smooth" });
}
window.addEventListener("hashchange", route);
$("#menuBtn").onclick = () => { const o = $("#side").classList.toggle("open"); $("#scrim").classList.toggle("show", o); $("#menuBtn").setAttribute("aria-expanded", o); };
$("#scrim").onclick = closeMenu;
$("#skip").onclick = e => { e.preventDefault(); $("#main").focus(); };
$("#siteSearch").onsubmit = e => {
  e.preventDefault();
  SEARCH_Q = $("#hsIn").value.trim();
  if (location.hash === "#search") {
    renderSearch();
    $("#srIn")?.focus();
  } else {
    location.hash = "#search";
  }
};
function tickBottom() { const d = new Date(); $("#btText").textContent = "LIVE TIME  •  " + d.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }) + "  •  " + d.toLocaleTimeString("en-GB") + "  •  BudgetBasics"; }
tickBottom(); setInterval(tickBottom, 1000);

/* ---------- Header: ticker, clock, visits, theme, back to top ---------- */
const TL = ["rule", "planner", "needs", "basics"];
[0, 1].forEach(() => $("#tickerText").append(...DATA.ticker.map((t, i) => el("a", { href: "#" + TL[i % 4], textContent: t }))));
try {
  let c = Number(localStorage.getItem("bb_visits")) || 0;
  if (!sessionStorage.getItem("bb_seen")) { c++; localStorage.setItem("bb_visits", c); sessionStorage.setItem("bb_seen", "1"); }
  renderOdo(2480 + c);
} catch (e) { $("#visits").textContent = "Visits: n/a"; }
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("#theme").setAttribute("aria-pressed", dark); $("#theme").textContent = dark ? "\u2600\uFE0F" : "\u{1F319}";
  try { localStorage.setItem("bb_theme", dark ? "dark" : "light"); } catch (e) {}
}
let saved = null; try { saved = localStorage.getItem("bb_theme"); } catch (e) {}
setTheme(saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
$("#theme").onclick = () => setTheme(document.documentElement.dataset.theme !== "dark");
const RING = 119.4;
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight; $("#toTop").hidden = scrollY < 300;
  $("#ring").style.strokeDashoffset = RING * (1 - (max > 0 ? scrollY / max : 0));
});
$("#toTop").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

/* ---------- Home ---------- */
["need","need","need","need","need","need","need","need","need","need","want","want","want","want","want","want","save","save","save","save"]
  .forEach(c => $("#comb").append(el("div", { className: "hex " + c })));
const tipCard = (t, href) => { const c = el(href ? "a" : "article", { className: "card" }); if (href) c.href = href; c.append(el("span", { className: "tag", textContent: t.topic }), el("h3", { textContent: t.t }), el("p", { textContent: t.d })); return c; };
$("#featTips").append(...DATA.tips.slice(0, 3).map(t => tipCard(t, "#basics")));
$("#facts").append(...DATA.facts.map((f, i) => el("a", { className: "tile", href: "#" + ["basics", "rule", "needs", "goals"][i % 4], textContent: f })));
$("#hgal").append(...DATA.gallery.slice(0, 4).map(galleryTile));
$("#mods").append(...DATA.mods.map(m => { const a = el("a", { className: "mod", href: "#" + m[0] }); a.append(el("span", { className: "ic", textContent: ICON[m[0]] }), el("span", {}, el("b", { textContent: m[1] }), el("span", { className: "t", textContent: m[2] }))); return a; }));
const dayOfYear = d => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
$("#totdText").textContent = DATA.tips[dayOfYear(new Date()) % DATA.tips.length].d;
let GOAL_PCT = 0;
function badges() {
  const doneCk = Object.values(ckState || {}).filter(Boolean).length > 0;
  return [
    { e: "\u{1F3AF}", t: "Goal Started", on: GOAL_PCT > 0 },
    { e: "\u{1F4B0}", t: "First Saving", on: (typeof sim !== "undefined" && sim.rows.length > 0) },
    { e: "\u{1F525}", t: "Saving Streak", on: (typeof sim !== "undefined" && new Set(sim.rows.map(r => r.date)).size >= 3) },
    { e: "\u{1F4CA}", t: "Budget Planned", on: (typeof sim !== "undefined" && sim.set) },
    { e: "\u{1F9E0}", t: "Quiz Completed", on: STAT.done > 0 },
    { e: "\u{1F3C6}", t: "Goal Achieved", on: GOAL_PCT >= 100 }
  ];
}
function renderBadges() { const s = $("#badgeStrip"); if (!s) return; s.replaceChildren(...badges().map(b => { const d = el("div", { className: "badge2 " + (b.on ? "on" : "off") }); d.innerHTML = `<span>${b.e}</span><small>${b.t}</small>`; return d; })); }

/* ---------- Budgeting Basics ---------- */
$("#concepts").append(...DATA.concepts.map(c => { const d = el("article", { className: "card" }); d.append(el("h3", { textContent: c[0] }), el("p", { textContent: c[1] }), el("p", { className: "note", textContent: c[2] })); return d; }));
(function () {
  const rows0 = [...DATA.income.map(r => ["Income", r[0], "Income", "-", r[1]]), ...DATA.budget.map(r => ["", r[0], r[1], r[2], r[3]])], tb = $("#budgetTbl tbody"), sum = $("#bSummary"), vals = [];
  function calc() {
    let inc = 0, need = 0, want = 0, sav = 0;
    vals.forEach(([row, inp]) => { const v = num(inp.value.trim()), ok = !isNaN(v) && v >= 0; inp.setAttribute("aria-invalid", !ok); const x = ok ? v : 0; if (row[2] === "Income") inc += x; else if (row[2] === "Need") need += x; else if (row[2] === "Want") want += x; else sav += x; });
    const out = need + want + sav, bal = inc - out, pc = x => inc ? Math.round(x / inc * 100) : 0;
    sum.replaceChildren(el("p", { className: "callout", textContent: `Total income ${rs(inc)}. Planned ${rs(out)}. ${bal >= 0 ? "Unassigned balance" : "Over by"} ${rs(Math.abs(bal))}.` }), ...[["Needs", need, "need"], ["Wants", want, "want"], ["Savings", sav, "save"]].map(([n, x, c]) => bar(n, inc ? x / inc * 100 : 0, `${rs(x)} (${pc(x)}% of income)`, c)));
  }
  rows0.forEach(row => { const inp = el("input", { value: row[4] }); inp.setAttribute("inputmode", "decimal"); inp.setAttribute("aria-label", row[1] + " amount"); inp.oninput = calc; const tr = el("tr"); tr.append(el("td", { textContent: row[1] }), el("td", { textContent: row[2] }), el("td", { textContent: row[3] }), el("td", {}, inp)); tb.append(tr); vals.push([row, inp]); });
  $("#bReset").onclick = () => { vals.forEach(([row, inp]) => inp.value = row[4]); calc(); }; calc();
})();
function choiceRow(text, options, correctIdx, why, onDone) {
  const r = el("div", { className: "qrow" }), fb = el("p", { className: "fb", role: "status" });
  r.append(el("p", { textContent: text }));
  options.forEach((o, i) => r.append(el("button", { className: "btn alt small", textContent: o, onclick: () => {
    const ok = i === correctIdx; fb.className = "fb " + (ok ? "good" : "bad");
    fb.textContent = (ok ? "Correct. " : "Not quite. ") + why; onDone && onDone(ok, r);
  } })));
  r.append(fb); return r;
}
$("#quiz").append(...DATA.quiz.map(q => choiceRow(q.q, q.o, q.a, q.why)));
function renderTips() {
  const q = $("#tipSearch").value.trim().toLowerCase(), tp = $("#tipTopic").value;
  let list = DATA.tips.filter(t => (tp === "all" || t.topic === tp) && (!q || (t.t + " " + t.d + " " + t.topic).toLowerCase().includes(q)));
  list.sort((a, b) => $("#tipSort").value === "topic" ? a.topic.localeCompare(b.topic) : a.t.localeCompare(b.t));
  $("#tipGrid").replaceChildren(...list.map(t => tipCard(t))); $("#tipEmpty").hidden = list.length > 0;
}
["input", "change"].forEach(ev => ["#tipSearch", "#tipTopic", "#tipSort"].forEach(s => $(s).addEventListener(ev, renderTips))); renderTips();
$("#habit").append(el("option", { value: "", textContent: "Choose a habit" }), ...Object.keys(DATA.habits).map(h => el("option", { textContent: h })));
$("#habit").onchange = e => $("#habitTip").textContent = DATA.habits[e.target.value] || "Pick a habit to see a tip.";
const ckState = {};
function ckUpdate() { const n = Object.values(ckState).filter(Boolean).length, t = DATA.checklist.length; $("#ckfill").style.width = n / t * 100 + "%"; $("#cktext").textContent = `${n} of ${t} done` + (n === t ? " - great job, you are budget ready!" : ""); }
DATA.checklist.forEach((t, i) => { const l = el("label", { className: "ck" }), c = el("input", { type: "checkbox", onchange: () => { ckState[i] = c.checked; ckUpdate(); } }); l.append(c, t); $("#cklist").append(l); }); ckUpdate();
$("#gloss").append(...DATA.glossary.map(([t, d]) => { const x = el("details"); x.append(el("summary", { textContent: t }), el("p", { textContent: d })); return x; }));

/* ---------- Needs vs Wants ---------- */
(function () {
  let right = 0, done = 0; const answered = new Set();
  DATA.items.forEach((it, i) => $("#nwList").append(choiceRow(it[0], ["Need", "Want"], it[1] ? 0 : 1, it[2], ok => {
    if (!answered.has(i)) { answered.add(i); done++; if (ok) right++; } STAT.right = right; STAT.done = done;
    $("#nwScore").textContent = `Score: ${right} / ${done} answered (${DATA.items.length} items)`;
  })));
})();

/* ---------- 50-30-20 ---------- */
$("#ruleForm").onsubmit = e => {
  e.preventDefault(); const v = num($("#ruleIncome").value), out = $("#ruleOut");
  if (isNaN(v) || v <= 0) { $("#ruleErr").textContent = "Enter your monthly income as a number greater than 0."; out.replaceChildren(); return; }
  $("#ruleErr").textContent = "";
  const [n, w, s] = $("#ruleMode").value.split(",").map(Number);
  out.replaceChildren(bar(`Needs (${n}%)`, n, rs(v * n / 100), "need"), bar(`Wants (${w}%)`, w, rs(v * w / 100), "want"), bar(`Savings (${s}%)`, s, rs(v * s / 100), "save"));
};

/* ---------- Savings Goals ---------- */
$("#goalForm").onsubmit = e => {
  e.preventDefault();
  const name = $("#gName").value.trim(), t = num($("#gTarget").value), now = num($("#gNow").value), m = num($("#gMonthly").value), err = $("#gErr"), out = $("#goalOut");
  out.replaceChildren();
  if (!name) return err.textContent = "Enter a goal name.";
  if ([t, now, m].some(isNaN)) return err.textContent = "Target, saved so far and monthly amount must be numbers.";
  if (t <= 0 || m <= 0 || now < 0) return err.textContent = "Target and monthly amount must be above 0, and savings cannot be negative.";
  err.textContent = "";
  const left = Math.max(0, t - now), months = Math.ceil(left / m), pct = Math.min(100, now / t * 100);
  const card = el("div", { className: "card" });
  card.append(el("h3", { textContent: name }), el("p", { textContent: left === 0 ? "You have already reached this goal. Well done!" : `Remaining: ${rs(left)}. At ${rs(m)} a month, that is about ${months} month${months > 1 ? "s" : ""}.` }));
  card.append(bar("Progress", pct, Math.round(pct) + "%", "save"), el("p", { className: "note", textContent: "Tip: " + (months > 12 ? "Long goal? Add a small side income or trim one want to shorten it." : "Great pace. Pay yourself first so the amount is never skipped.") }));
  out.append(card);
  GOAL_PCT = pct; renderMilestones(); if (typeof renderBadges === "function") renderBadges();
  if (pct >= 100) toast2("\u{1F3C6} Goal Achieved! Great work reaching " + name + ".");
};
function toast2(t) { if (typeof toast === "function") toast(t); }
const MS = [[0, "\u{1F3AF}", "Goal Started"], [5, "\u{1F4B0}", "Rs saved"], [25, "\u{1F525}", "25% Complete"], [50, "\u2B50", "50% Complete"], [100, "\u{1F3C6}", "Goal Achieved"]];
function renderMilestones() { const s = $("#milestones"); if (!s) return; s.replaceChildren(...MS.map(([p, e, t]) => { const d = el("div", { className: "ms " + (GOAL_PCT >= p ? "on" : "") }); d.innerHTML = `<span>${e}</span><small>${t}</small>`; return d; })); }
renderMilestones();
(function () { const box = $("#miniQ"); if (!box) return; box.append(choiceRow("If your income is Rs 20,000, how much is 20% savings?", ["Rs 2,000", "Rs 4,000", "Rs 6,000", "Rs 8,000"], 1, "20% of Rs 20,000 is Rs 4,000.")); })();

/* ---------- Budget Simulator: salary, fixed bills, daily spending, limit alerts ---------- */
const SCATS = [["Food","need",.35],["Transport","need",.2],["Education","need",.1],["Utilities","need",.05],["Entertainment","want",.1],["Shopping","want",.1],["Miscellaneous","want",.1]];
const STYLES = [["50,30,20","50-30-20 (balanced)"],["60,20,20","60-20-20 (higher costs)"],["70,20,10","70-20-10 (tight budget)"]];
const CAT_WORDS = { Food: /food|lunch|dinner|breakfast|grocer|restaurant|cafe|pizza|burger|snack|tea|chai|foodpanda/i, Transport: /bus|uber|careem|fuel|petrol|rickshaw|taxi|ride|metro|bike/i, Education: /book|fee|course|tuition|exam|stationery/i, Utilities: /bill|electric|gas|internet|wifi|phone|mobile|load|recharge/i, Entertainment: /movie|netflix|game|cinema|music|outing/i, Shopping: /shop|mall|cloth|shirt|shoe|dress|store|daraz/i };
const guessCat = t => (Object.entries(CAT_WORDS).find(([, re]) => re.test(t)) || ["Miscellaneous"])[0];
let sim = { salary: 50000, mode: "50,30,20", rows: [], fixed: [], goal: 0, limit: 0, set: false }, editing = -1, snap = {};
const KEEP = (() => { try { return localStorage.getItem("bb_keep") === "1"; } catch (e) { return false; } })();
try { const raw = (KEEP ? localStorage : sessionStorage).getItem("bb_sim"), x = raw && JSON.parse(raw); if (x && Array.isArray(x.rows)) sim = Object.assign(sim, x); } catch (e) {}
const store = () => { try { const s = JSON.stringify(sim); sessionStorage.setItem("bb_sim", s); if ($("#simKeep").checked) localStorage.setItem("bb_sim", s); } catch (e) {} };
const isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const sumRows = f => sim.rows.filter(f).reduce((t, r) => t + r.amt, 0);
const t0 = new Date(), monthFirst = isoDate(new Date(t0.getFullYear(), t0.getMonth(), 1)), monthLast = isoDate(new Date(t0.getFullYear(), t0.getMonth() + 1, 0));
$("#simMode").append(...STYLES.map(([v, t]) => el("option", { value: v, textContent: t })));
$("#eCat").append(...SCATS.map(c => el("option", { textContent: c[0] })));
$("#eDate").min = monthFirst; $("#eDate").max = monthLast; $("#eDate").value = isoDate(t0);
$("#simSalary").value = sim.salary; $("#simMode").value = sim.mode; $("#simLimit").value = sim.limit || ""; $("#simGoal").value = sim.goal || ""; $("#simKeep").checked = KEEP;
const td = (t, cls = "") => el("td", { textContent: t, className: cls });
function renderSim() {
  const now = new Date(), [n, w, s] = sim.mode.split(",").map(Number), sal = sim.salary, fixed = sim.fixed.reduce((t, x) => t + x.amt, 0);
  const save = sim.goal > 0 ? sim.goal : sal * s / 100, pool = sal - fixed - save;
  const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), day = now.getDate(), left = dim - day + 1;
  const spent = sumRows(() => true), rem = pool - spent, safe = Math.max(0, rem) / left, today = sumRows(r => r.date === isoDate(now)), proj = spent / day * dim, lim = sim.limit > 0 ? sim.limit : safe;
  snap = { sal, fixed, save, pool, spent, rem, safe, lim, left, proj, today };
  const tile = (label, v, cls = "") => { const d = el("div", { className: "tile" }); d.append(el("span", { className: "note", textContent: label }), el("br"), el("b", { className: cls, textContent: v })); return d; };
  $("#simStats").replaceChildren(tile("Monthly salary", rs(sal)), tile("Fixed bills", rs(fixed)), tile("Savings goal", rs(save)), tile("Money for daily spending", rs(pool), pool < 0 ? "neg" : ""), tile("Spent so far", rs(spent)), tile("Remaining", rs(rem), rem < 0 ? "neg" : ""), tile("Safe to spend per day", rs(safe)), tile("Daily limit", rs(lim)), tile("Spent today", rs(today), today > lim ? "neg" : ""), tile("Left today", rs(lim - today), lim - today < 0 ? "neg" : ""), tile("Days left this month", String(left)));
  const pct = pool > 0 ? spent / pool * 100 : (spent > 0 ? 101 : 0);
  $("#simProg").replaceChildren(bar("Daily-spending money used", pct, Math.round(pct) + "%", pct > 100 ? "over" : "save"));
  $("#simStatus").textContent = pool <= 0 ? "Your fixed bills and savings goal are as big as your salary or bigger. Lower the goal or the bills to leave money for daily spending." : !sim.rows.length ? "Add your first expense below to see how you are doing." : proj > pool ? `At this pace you would spend about ${rs(proj)} this month, which is ${rs(proj - pool)} over your daily-spending money. Try trimming wants for the next few days.` : `On track. At this pace you would spend about ${rs(proj)} and keep about ${rs(pool - proj)} extra.`;
  /* month report */
  const cr = SCATS.map(([c, g, sh]) => ({ c, g, b: Math.max(0, pool) * sh, sp: sumRows(r => r.cat === c) })), over = cr.filter(x => x.sp > x.b), extra = over.reduce((t, x) => t + x.sp - x.b, 0), top = [...cr].sort((p, q) => q.sp - p.sp)[0], saved = sal - fixed - spent, ps = sal - fixed - proj;
  const L = [`Income ${rs(sal)} - fixed bills ${rs(fixed)} - daily spending ${rs(spent)} = ${rs(saved)} left so far.`, `Savings goal ${rs(save)}. ` + (sim.rows.length ? (ps >= save ? `At this pace you will save about ${rs(ps)}. You are on track.` : `At this pace you will save about ${rs(Math.max(0, ps))}, which is ${rs(save - Math.max(0, ps))} short of your goal.`) : "Add spending to see your forecast.")];
  if (spent > 0) L.push(`Biggest spending category: ${top.c} (${rs(top.sp)}, ${Math.round(top.sp / spent * 100)}% of daily spending).`);
  L.push(over.length ? `Extra expenses (over budget): ${over.map(x => `${x.c} +${rs(x.sp - x.b)}`).join(", ")}. Total extra: ${rs(extra)}.` : "No category is over budget.");
  if (over.length) L.push(`Suggestion: trim ${over[0].c} for the rest of the month to protect your savings.`);
  const ul = el("ul"); L.forEach(x => ul.append(el("li", { textContent: x }))); $("#simReport").replaceChildren(ul);
  $("#expBreak").replaceChildren(...cr.map(x => bar(`${x.c} (${x.g})`, x.b ? x.sp / x.b * 100 : (x.sp ? 101 : 0), `${rs(x.sp)} of ${rs(x.b)}`, x.sp > x.b ? "over" : x.g)));
  /* day by day */
  const dates = [...new Set(sim.rows.map(r => r.date))].sort(); let cum = 0;
  $("#dayBody").replaceChildren(...(dates.length ? dates.map(d => { const t = sumRows(r => r.date === d), c = sim.rows.filter(r => r.date === d).length; cum += t; const tr = el("tr"); tr.append(td(d), td(c + (c > 1 ? " items" : " item")), td(rs(t), "num"), td(t > lim ? "Over limit" : "Within limit", t > lim ? "neg" : ""), td(rs(pool - cum), "num")); return tr; }) : [el("tr", {}, el("td", { colSpan: 5, textContent: "Your day-by-day list appears here once you add spending." }))]));
  /* last 7 days chart */
  const days = [...Array(7)].map((_, i) => { const d = new Date(now); d.setDate(now.getDate() - 6 + i); return [isoDate(d), d.getDate()]; }), vals = days.map(([k]) => sumRows(r => r.date === k)), mx = Math.max(...vals, 1);
  $("#dchart").innerHTML = days.map(([k, dd], i) => `<div class="dc"><span class="dv">${vals[i] ? rs(vals[i]) : ""}</span><i style="height:${vals[i] / mx * 100}%"></i><b>${dd}</b></div>`).join("");
  $("#cmpBody").replaceChildren(...STYLES.map(([v, name]) => { const [a1, b1, c1] = v.split(",").map(Number), tr = el("tr", { className: v === sim.mode ? "cur" : "" }); tr.append(td(name), td(rs(sal * a1 / 100), "num"), td(rs(sal * b1 / 100), "num"), td(rs(sal * c1 / 100), "num"), td(rs((sal - sal * c1 / 100) / dim), "num")); return tr; }));
  /* fixed bills */
  const fb = $("#fixBody"); fb.replaceChildren(); if (!sim.fixed.length) fb.append(el("tr", {}, el("td", { colSpan: 3, textContent: "No fixed bills yet. Add rent, internet, fees or anything that repeats every month." })));
  sim.fixed.forEach((f, i) => { const tr = el("tr"); tr.append(td(f.n), td(rs(f.amt), "num"), el("td", {}, el("button", { className: "btn alt small", textContent: "Remove", onclick: () => { sim.fixed.splice(i, 1); renderSim(); } }))); fb.append(tr); });
  /* entries */
  const tb = $("#expBody"); tb.replaceChildren();
  if (!sim.rows.length) tb.append(el("tr", {}, el("td", { colSpan: 5, textContent: "No entries yet. Add your first expense above." })));
  sim.rows.map((r, i) => [r, i]).sort((p, q) => q[0].date.localeCompare(p[0].date)).forEach(([r, i]) => {
    const tr = el("tr"); tr.append(td(r.date), td(r.cat), td(r.desc), td(rs(r.amt), "num"), el("td", {}, el("button", { className: "btn alt small", textContent: "Edit", onclick: () => startEdit(i) }), el("button", { className: "btn alt small", textContent: "Remove", onclick: () => { sim.rows.splice(i, 1); if (editing === i) resetForm(); renderSim(); } }))); tb.append(tr);
  });
  wiUpdate(); store();
}
function wiUpdate() { const raw = $("#wiIn").value.trim(), x = num(raw); $("#wiOut").textContent = raw === "" ? "Type an amount to see the effect." : isNaN(x) || x < 0 ? "Enter a valid amount." : `Saving ${rs(x)} more each month adds ${rs(x * 12)} in a year. Your total yearly savings would be ${rs((snap.save + x) * 12)}.`; }
function startEdit(i) { const x = sim.rows[i]; editing = i; $("#eDate").value = x.date; $("#eCat").value = x.cat; $("#eDesc").value = x.desc; $("#eAmt").value = x.amt; $("#eSave").textContent = "Save changes"; $("#eDesc").focus(); }
function resetForm() { editing = -1; $("#eSave").textContent = "Add expense"; $("#eDesc").value = ""; $("#eAmt").value = ""; }
function advise(price, name) {
  if (!sim.set) return "Enter your monthly salary in the Budget Simulator first, then I can check this against your real numbers.";
  const after = snap.rem - price, nl = Math.max(0, after) / snap.left, L = [];
  L.push(price > snap.rem ? `${name} costs ${rs(price)}, but you have only ${rs(Math.max(0, snap.rem))} left for daily spending this month. Buying it would put you ${rs(price - Math.max(0, snap.rem))} over budget.` : `After buying ${name} for ${rs(price)} you would have ${rs(after)} left. Your safe daily spend would drop from ${rs(snap.safe)} to ${rs(nl)}.`);
  if (price > snap.lim) L.push(`It is more than your daily limit of ${rs(snap.lim)}.`);
  L.push(price > snap.rem * .3 ? "This is a big share of what is left, so wait 48 hours before deciding." : "It fits your budget, but ask yourself whether it is a need or a want.");
  return L.join(" ");
}
$("#setupForm").onsubmit = e => { e.preventDefault(); const v = num($("#simSalary").value), lr = $("#simLimit").value.trim(), gr = $("#simGoal").value.trim(), lv = lr === "" ? 0 : num(lr), gv = gr === "" ? 0 : num(gr);
  if (isNaN(v) || v <= 0) return $("#simErr").textContent = "Enter your monthly salary as a number greater than 0.";
  if (isNaN(lv) || lv < 0 || isNaN(gv) || gv < 0) return $("#simErr").textContent = "Daily limit and savings goal must be numbers, or leave them empty.";
  $("#simErr").textContent = ""; Object.assign(sim, { salary: v, limit: lv, goal: gv, mode: $("#simMode").value, set: true }); renderSim(); toast("Dashboard updated."); };
$("#simKeep").onchange = e => { try { if (e.target.checked) localStorage.setItem("bb_keep", "1"); else { localStorage.removeItem("bb_keep"); localStorage.removeItem("bb_sim"); } } catch (x) {} store(); toast(e.target.checked ? "Your data will be remembered on this device." : "Saved data removed. Data now lasts only for this session."); };
$("#fixForm").onsubmit = e => { e.preventDefault(); const n = $("#fxName").value.trim(), a = num($("#fxAmt").value); if (!n) return $("#fxErr").textContent = "Enter a bill name."; if (isNaN(a) || a <= 0) return $("#fxErr").textContent = "Amount must be a number above 0."; $("#fxErr").textContent = ""; sim.fixed.push({ n, amt: a }); $("#fxName").value = ""; $("#fxAmt").value = ""; renderSim(); };
$("#expForm").onsubmit = e => {
  e.preventDefault(); const amt = num($("#eAmt").value), desc = $("#eDesc").value.trim(), date = $("#eDate").value;
  if (!date || date < monthFirst || date > monthLast) return $("#eErr").textContent = "Choose a date inside the current month.";
  if (!desc) return $("#eErr").textContent = "Add a short description.";
  if (isNaN(amt) || amt <= 0) return $("#eErr").textContent = "Amount must be a number greater than 0.";
  $("#eErr").textContent = ""; const x = { date, cat: $("#eCat").value, desc, amt };
  editing >= 0 ? sim.rows[editing] = x : sim.rows.push(x); resetForm(); renderSim(); checkLimit(date);
};
$("#eClear").onclick = () => { sim.rows = []; resetForm(); renderSim(); };
$("#wiIn").oninput = wiUpdate;
$("#affForm").onsubmit = e => { e.preventDefault(); const p = num($("#afPrice").value), n = $("#afName").value.trim() || "it"; if (isNaN(p) || p <= 0) return $("#afErr").textContent = "Enter the price as a number above 0."; $("#afErr").textContent = ""; const o = $("#afOut"); o.hidden = false; o.textContent = advise(p, n); };
$("#impGo").onclick = () => {
  const txt = $("#impText").value.trim(); if (!txt) return $("#impErr").textContent = "Paste at least one line first."; let added = 0, skipped = 0;
  txt.split(/\n/).forEach(line => { line = line.trim(); if (!line) return; const dm = line.match(/\d{4}-\d{2}-\d{2}/), date = dm ? dm[0] : isoDate(new Date()), rest = line.replace(/\d{4}-\d{2}-\d{2}/, " "), ns = rest.replace(/,(?=\d{3})/g, "").match(/\d+(\.\d+)?/g);
    if (!ns || date < monthFirst || date > monthLast) return skipped++; const amt = Number(ns[ns.length - 1]); if (!(amt > 0)) return skipped++;
    const desc = rest.replace(/rs\.?/ig, " ").replace(/\d[\d,.]*/g, " ").replace(/[,;|]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 60) || "Imported", cat = SCATS.map(c => c[0]).find(c => new RegExp("\\b" + c + "\\b", "i").test(line)) || guessCat(line);
    sim.rows.push({ date, cat, desc, amt }); added++; });
  $("#impErr").textContent = added ? "" : "No valid lines found. Use lines like: 2026-09-25, Lunch, 350"; if (added) { $("#impText").value = ""; renderSim(); toast(`${added} entr${added > 1 ? "ies" : "y"} added${skipped ? `, ${skipped} skipped` : ""}.`); }
};
$("#copySim").onclick = () => { const t = `BudgetBasics summary\nSalary: ${rs(snap.sal)}\nFixed bills: ${rs(snap.fixed)}\nSavings goal: ${rs(snap.save)}\nSpent so far: ${rs(snap.spent)}\nRemaining: ${rs(snap.rem)}\nSafe per day: ${rs(snap.safe)}\n\n` + sim.rows.map(r => `${r.date}  ${r.cat}  ${r.desc}  ${rs(r.amt)}`).join("\n"); navigator.clipboard ? navigator.clipboard.writeText(t).then(() => $("#simMsg").textContent = "Summary copied.") : $("#simMsg").textContent = "Copy is not supported in this browser."; };
$("#qsForm").onsubmit = e => { e.preventDefault(); const v = num($("#qsSalary").value); if (isNaN(v) || v <= 0) return $("#qsErr").textContent = "Enter your monthly salary as a number above 0."; $("#qsErr").textContent = ""; sim.salary = v; sim.set = true; $("#simSalary").value = v; renderSim(); location.hash = "#planner"; };
renderSim();

/* ---------- Money Mistakes ---------- */
$("#mistakeList").append(...DATA.mistakes.map(m => { const d = el("details"); d.append(el("summary", { textContent: m.t }),
  el("p", {}, el("b", { textContent: "Problem: " }), m.p), el("p", {}, el("b", { textContent: "Student scenario: " }), m.s),
  el("p", {}, el("b", { textContent: "Why it happens: " }), m.why), el("p", {}, el("b", { textContent: "Better action: " }), m.fix)); return d; }));

/* ---------- Infographics ---------- */
const GRAPHICS = {
  needs: `<div class="two"><div class="need"><b>Needs</b><br>Bus pass<br>Textbooks<br>Basic meals</div><div class="want"><b>Wants</b><br>Streaming<br>Outings<br>New gadgets</div></div>`,
  split: `<div class="stack"><span class="need" style="width:50%;color:#fff">50% needs</span><span class="want" style="width:30%">30% wants</span><span class="save" style="width:20%">20% save</span></div>`,
  cycle: `<div class="cyc"><b>Earn</b>&rarr;<b>Plan</b>&rarr;<b>Spend</b>&rarr;<b>Review</b>&rarr;</div>`,
  challenge: `<div class="bars">${[100, 200, 300, 400, 500, 600].map((v, i) => `<span style="height:${(i + 1) * 16}%">${v}</span>`).join("")}</div>`
};
function renderInfo() {
  const tp = $("#infoTopic").value, list = DATA.info.filter(i => tp === "all" || i.topic === tp);
  $("#infoGrid").replaceChildren(...list.map(i => { const f = el("figure", { className: "info" }); f.innerHTML = `<h3></h3><div role="img"></div><figcaption></figcaption>`; f.querySelector("h3").textContent = i.title; const g = f.querySelector("[role=img]"); g.setAttribute("aria-label", i.alt); g.innerHTML = GRAPHICS[i.id]; f.querySelector("figcaption").textContent = i.cap; return f; }));
  $("#infoEmpty").hidden = list.length > 0;
}
$("#infoTopic").onchange = renderInfo; renderInfo();

/* ---------- Chatbot (rule-based keyword matching) ---------- */
function say(text, who) { const m = el("div", { className: "msg " + who, textContent: text }); $("#chatLog").append(m); m.scrollIntoView({ block: "nearest" }); }
function smartReply(q) {
  const low = q.toLowerCase(), ns = (q.replace(/,/g, "").match(/\d+(\.\d+)?/g) || []).map(Number), amt = ns.length ? ns[ns.length - 1] : 0, need = "Enter your monthly salary in the Budget Simulator first, then I can answer with your real numbers.";
  if (/easypaisa|easy paisa|jazzcash|bank account|connect my|link my/.test(low)) return "This site cannot connect to Easypaisa or any bank. It is a static educational site with no server, and the project rules forbid real transactions. You can add spending by hand or paste lines into the Import box in the Budget Simulator.";
  if (/afford|buy|purchase|worth|khareed|should i get/.test(low) && amt) return advise(amt, "it");
  if (/spend today|per day|safe to spend|daily limit|aaj|kitna kharch/.test(low)) return sim.set ? `You can safely spend about ${rs(snap.safe)} per day for the next ${snap.left} days. Your daily limit is ${rs(snap.lim)} and you have spent ${rs(snap.today)} today.` : need;
  if (/where.*(money|went|go)|most|highest|biggest|zyada|kahan/.test(low)) { if (!sim.rows.length) return "Add some spending in the Budget Simulator first, then I can show where your money goes."; const by = {}; sim.rows.forEach(r => by[r.cat] = (by[r.cat] || 0) + r.amt); return "Your top categories: " + Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, v]) => `${c} ${rs(v)} (${Math.round(v / snap.spent * 100)}%)`).join(", ") + "."; }
  if (/saved so far|how much (have i saved|did i save|is left)|bacha|bachat/.test(low)) return sim.set ? `So far: salary ${rs(snap.sal)} minus bills ${rs(snap.fixed)} minus spending ${rs(snap.spent)} leaves ${rs(snap.sal - snap.fixed - snap.spent)}. Your savings goal is ${rs(snap.save)}.` : need;
  if (/cut|reduce|trim|cut down|kam kar/.test(low)) { if (!sim.rows.length) return "Log a few days of spending first. Then I can tell you which category to trim."; const by = {}; sim.rows.forEach(r => by[r.cat] = (by[r.cat] || 0) + r.amt); const t = Object.entries(by).sort((a, b) => b[1] - a[1])[0]; return `Your biggest category is ${t[0]} (${rs(t[1])}). Trimming 10% there would save about ${rs(t[1] * .1)}.`; }
  return null;
}
function ask(q) {
  q = q.trim(); if (!q) return; say(q, "me"); const low = q.toLowerCase(), sm = smartReply(q), hit = DATA.bot.find(b => b.k.some(k => low.includes(k)));
  setTimeout(() => say(sm || (hit ? hit.a : DATA.botFallback), "bot"), 300);
}
DATA.prompts.forEach(p => $("#prompts").append(el("button", { className: "btn alt small", type: "button", textContent: p, onclick: () => ask(p) })));
$("#chatForm").onsubmit = e => { e.preventDefault(); ask($("#chatQ").value); $("#chatQ").value = ""; };

/* ---------- Forms: client-side validation only, nothing is sent or stored ---------- */
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
function wire(formId, errId, okId, check, okText) {
  $(formId).onsubmit = e => {
    e.preventDefault(); const msg = check(); $(errId).textContent = msg || "";
    if (!msg) { $(okId).textContent = okText; $(formId).reset(); } else $(okId).textContent = "";
  };
}
wire("#fbForm", "#fbErr", "#fbOk", () => {
  if ($("#fbName").value.trim().length < 2) return "Enter your name (at least 2 letters).";
  if (!emailOk($("#fbEmail").value.trim())) return "Enter a valid email like name@example.com.";
  if (!$("#fbRate").value) return "Choose a rating.";
  if ($("#fbMsg").value.trim().length < 10) return "Comments must be at least 10 characters.";
}, "Thank you! Your feedback passed validation. (Nothing was sent or stored.)");
wire("#ctForm", "#ctErr", "#ctOk", () => {
  if ($("#ctName").value.trim().length < 2) return "Enter your name (at least 2 letters).";
  if (!emailOk($("#ctEmail").value.trim())) return "Enter a valid email like name@example.com.";
  if ($("#ctPhone").value.trim() && !/^[+\d][\d\s-]{6,}$/.test($("#ctPhone").value.trim())) return "Phone number looks wrong. Use digits, spaces or dashes, or leave it empty.";
  if ($("#ctMsg").value.trim().length < 10) return "Message must be at least 10 characters.";
}, "Thanks for reaching out! Your message passed validation. (Nothing was sent or stored.)");

/* ---------- Contact, About and footer details come from DATA.site ---------- */
const S = DATA.site, ext = ([n, u]) => el("a", { href: u, target: "_blank", rel: "noopener", textContent: n + " (external)" });
$("#siteContact").append(el("p", {}, "Email: ", el("a", { href: "mailto:" + S.email, textContent: S.email })), el("p", {}, "Phone: ", el("a", { href: "tel:" + S.phone.replace(/\s/g, ""), textContent: S.phone })), el("p", { textContent: "Address: " + S.address }), el("p", {}, "Social: ", ...S.socials.flatMap((x, i) => i ? [", ", ext(x)] : [ext(x)])));
$("#creators").textContent = S.creators;
$("#footSocial").append(...S.socials.map(([n, u]) => el("a", { href: u, target: "_blank", rel: "noopener", textContent: n })));
/* ---------- videos, gallery, visitor counter ---------- */
$("#vgrid").append(...DATA.videos.map(v => { const f = el("figure", { className: "vid" }); f.innerHTML = `<video controls preload="none" playsinline poster="https://assets.mixkit.co/videos/${v.id}/${v.id}-thumb-360-${v.p}.jpg"><source src="https://assets.mixkit.co/videos/${v.id}/${v.id}-360.mp4" type="video/mp4">Your browser cannot play this video.</video><figcaption><h3></h3><p></p><ul></ul><a target="_blank" rel="noopener" href="https://mixkit.co/free-stock-video/money/">Source: Mixkit (external)</a></figcaption>`; f.querySelector("h3").textContent = v.t; f.querySelector("p").textContent = v.l; f.querySelector("ul").append(...v.k.map(k => el("li", { textContent: k }))); return f; }));
function galleryTile(g) { const b = el("button", { className: "gtile", type: "button" }); b.style.background = `linear-gradient(135deg,${g[3]},${g[4]})`; b.append(el("span", { className: "ge", textContent: g[0] }), g[1]); b.onclick = () => { $("#gT").textContent = g[0] + " " + g[1]; $("#gP").textContent = g[2]; $("#gDlg").showModal(); }; return b; }
$("#galleryGrid").append(...DATA.gallery.map(galleryTile)); $("#gX").onclick = () => $("#gDlg").close();
function odoHtml(n) { return String(n).padStart(6, "0").split("").map(x => `<b>${x}</b>`).join(""); }
function renderOdo(n) { $("#odoTop").innerHTML = "<span>\u{1F441} Visitors</span>" + odoHtml(n); $("#visits").innerHTML = '<span>Total visitors</span><div class="odo big">' + odoHtml(n) + "</div>"; }
/* ---------- daily limit alerts and notifications ---------- */
function toast(t) { const n = $("#toast"); n.textContent = t; n.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => n.classList.remove("show"), 6000); }
function checkLimit(date) {
  const day = sumRows(r => r.date === date), lim = snap.lim, over = day > lim, bar = $("#alertBar");
  let msg = over ? `Limit crossed! You spent ${rs(day)} on ${date}, which is ${rs(day - lim)} more than your daily limit of ${rs(lim)}. Please slow down.` : `You spent ${rs(day)} on ${date}. You have ${rs(lim - day)} left of your ${rs(lim)} daily limit.`;
  if (snap.rem < 0) msg += ` Your monthly spending budget is also exceeded by ${rs(-snap.rem)}.`;
  bar.hidden = false; bar.className = "alertbar " + (over || snap.rem < 0 ? "bad" : "good"); bar.textContent = (over ? "\u26A0\uFE0F " : "\u2705 ") + msg; toast(msg);
  try { if ("Notification" in window && Notification.permission === "granted") new Notification(over ? "BudgetBasics: limit crossed" : "BudgetBasics: daily update", { body: msg }); } catch (e) {}
}
$("#notifBtn").onclick = () => { if (!("Notification" in window)) return $("#simMsg").textContent = "This browser has no notifications. Alerts still appear on the page."; Notification.requestPermission().then(p => $("#simMsg").textContent = p === "granted" ? "Notifications are on." : "Notifications are blocked. Alerts still appear on the page."); };
$("#wsIn").oninput = () => { const x = +$("#wsIn").value; $("#wsVal").textContent = rs(x); $("#wsOut").textContent = `Monthly difference: ${rs(x)}. In 6 months: ${rs(x * 6)}. In 12 months: ${rs(x * 12)}.`; }; $("#wsIn").oninput();

/* ---------- Money Lab: ten interactive tools ---------- */
const STAT = { decisions: 0, right: 0, done: 0 };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fld = (id, label, v, ph = "") => `<label>${label}<input id="${id}" inputmode="decimal" value="${v}" placeholder="${ph}"></label>`;
const sel = (id, q, o) => `<label>${q}<select id="${id}">${o.map(x => `<option>${x}</option>`).join("")}</select></label>`;
const V = id => num($("#" + id).value);
const LAB = [["decision","\u{1F9E0}","Decision Lab",labDecision],["detective","\u{1F50D}","Spending Detective",labDetective],["grave","\u26B0\uFE0F","Subscription Graveyard",labGrave],["aid","\u{1F691}","First-Aid Kit",labAid],["future","\u23F3","Future Self",labFuture],["time","\u23F1\uFE0F","Price-to-Time",labTime],["pause","\u{1F6D1}","Purchase Pause",labPause],["journey","\u{1F4C5}","Money Journey",labJourney],["dna","\u{1F9EC}","Budget DNA",labDNA],["myth","\u{1F4A5}","Myth Buster",labMyth]];
function openTool(id) { const t = LAB.find(x => x[0] === id) || LAB[0]; $$("#labTabs button").forEach(x => x.setAttribute("aria-pressed", x.dataset.id === t[0])); $("#labBody").replaceChildren(); t[3]($("#labBody")); }
$("#labTabs").append(...LAB.map(t => { const b = el("button", { className: "chip", type: "button", textContent: t[1] + " " + t[2], onclick: () => openTool(t[0]) }); b.dataset.id = t[0]; return b; }));

function labDecision(b) {
  b.innerHTML = `<h2>Money Decision Lab</h2><p>Pick a situation, then a choice. There is no single correct answer, only trade-offs.</p><p id="scTabs"></p><div id="scBody"></div>`;
  const show = i => { const s = DATA.scenarios[i]; $$("#scTabs button").forEach((x, j) => x.setAttribute("aria-pressed", j === i));
    $("#scBody").innerHTML = `<p class="callout"><b>Situation:</b> ${s.s}</p><div class="grid">${s.o.map((o, k) => `<div class="card"><h3>${"AB"[k]}. ${o.t}</h3><button class="btn small" data-k="${k}">Choose ${"AB"[k]}</button></div>`).join("")}</div><div id="scOut" aria-live="polite"></div>`;
    $$("#scBody [data-k]").forEach(x => x.onclick = () => { const k = +x.dataset.k; STAT.decisions++;
      $("#scOut").innerHTML = `<div class="scroll"><table class="tbl"><thead><tr><th>Choice</th><th class="num">Spent</th><th class="num">Saved</th><th class="num">Available for surprises</th></tr></thead><tbody>${s.o.map((o, j) => `<tr class="${j === k ? "cur" : ""}"><td>${"AB"[j]}</td><td class="num">${rs(o.spend)}</td><td class="num">${rs(o.save)}</td><td class="num">${rs(s.budget - o.spend)}</td></tr>`).join("")}</tbody></table></div><p class="callout"><b>Possible consequence:</b> ${s.o[k].c}</p><p class="note">Both options can be reasonable. It depends on your priorities.</p>`; }); };
  DATA.scenarios.forEach((s, i) => $("#scTabs").append(el("button", { className: "chip", type: "button", textContent: s.t, onclick: () => show(i) }))); show(0);
}
function labDetective(b) {
  const C = ["Food", "Transport", "Shopping", "Fun", "Other"], DN = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
  b.innerHTML = `<h2>7-Day Spending Detective</h2><p>Enter what you spent each day in Rs. Leave blank if nothing.</p><div class="scroll"><table class="tbl"><thead><tr><th>Day</th>${C.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${DN.map((d, i) => `<tr><td>${d}</td>${C.map((c, j) => `<td><input class="dt" data-d="${i}" data-c="${j}" inputmode="decimal" aria-label="${d} ${c}" style="min-width:72px"></td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="err" id="dtErr" role="alert"></p><p><button class="btn" id="dtGo">Run the detective</button> <button class="btn alt" type="button" id="dtDemo">Fill a sample week</button></p><div id="dtOut" aria-live="polite"></div>`;
  const demo = [[500, 300, 0, 0, 0], [450, 0, 700, 0, 150], [300, 300, 0, 250, 0], [600, 0, 0, 180, 200], [350, 300, 900, 0, 0], [800, 0, 0, 600, 0], [200, 0, 0, 0, 120]];
  $("#dtDemo").onclick = () => $$(".dt").forEach(i => i.value = demo[i.dataset.d][i.dataset.c] || "");
  $("#dtGo").onclick = () => {
    const cells = []; let bad = false; $$(".dt").forEach(i => { const t = i.value.trim(), v = t === "" ? 0 : num(t); if (isNaN(v) || v < 0) bad = true; else if (v > 0) cells.push({ d: +i.dataset.d, c: +i.dataset.c, v }); });
    if (bad) return $("#dtErr").textContent = "Use numbers only (0 or more)."; if (!cells.length) return $("#dtErr").textContent = "Enter at least one amount."; $("#dtErr").textContent = "";
    const sum = f => cells.filter(f).reduce((t, x) => t + x.v, 0), tot = sum(() => true), byC = C.map((c, i) => sum(x => x.c === i)), byD = DN.map((d, i) => sum(x => x.d === i));
    const topC = byC.indexOf(Math.max(...byC)), topD = byD.indexOf(Math.max(...byD)), small = cells.filter(x => x.v < 500), ss = small.reduce((t, x) => t + x.v, 0), hid = [...cells].sort((p, q) => p.v - q.v).slice(0, 5);
    const out = $("#dtOut"); out.innerHTML = `<div class="callout"><b>\u{1F50D} Your Spending Detective Report</b><ul><li>You spent ${rs(tot)} in 7 days. Most went to ${C[topC]} (${rs(byC[topC])}, ${Math.round(byC[topC] / tot * 100)}%).</li><li>Small purchases under Rs 500 made up ${Math.round(ss / tot * 100)}% of your spending.</li><li>Your highest-spending day was ${DN[topD]} (${rs(byD[topD])}).</li></ul></div><h3>Hidden spending</h3><p>${hid.map(x => rs(x.v)).join(" + ")} <b>= ${rs(hid.reduce((t, x) => t + x.v, 0))}</b></p><p class="note">These are your smallest purchases. Small amounts add up.</p>`;
    out.append(...C.map((c, i) => bar(c, byC[i] / tot * 100, rs(byC[i]), "need")));
  };
}
function labGrave(b) {
  let subs = [{ n: "Netflix", a: 500, u: "Sometimes" }, { n: "Music", a: 300, u: "Yes" }, { n: "Cloud storage", a: 250, u: "Never" }, { n: "Gaming", a: 400, u: "Sometimes" }];
  b.innerHTML = `<h2>\u26B0\uFE0F Subscription Graveyard</h2><p>List your subscriptions and mark how often you use each. Unused ones move to the graveyard.</p><div id="gvRows"></div><p><button class="btn small" id="gvAdd">Add subscription</button></p><div id="gvOut" aria-live="polite"></div>`;
  const out = () => { const m = subs.reduce((t, s) => t + (s.a > 0 ? s.a : 0), 0), y = m * 12, dead = subs.filter(s => s.u === "Never"), dy = dead.reduce((t, s) => t + Math.max(0, s.a), 0) * 12, base = dy || y;
    $("#gvOut").innerHTML = `<div class="tiles"><div class="tile"><span class="note">Monthly</span><br><b>${rs(m)}</b></div><div class="tile"><span class="note">Yearly</span><br><b>${rs(y)}</b></div><div class="tile"><span class="note">Yearly cost of never-used ones</span><br><b class="${dy ? "neg" : ""}">${rs(dy)}</b></div></div>
    <h3>The graveyard</h3><div class="gvyard">${dead.length ? dead.map(s => `<div class="tomb">\u26B0\uFE0F<br><b>${esc(s.n || "Unnamed")}</b><br><small>R.I.P. ${rs(Math.max(0, s.a) * 12)} a year</small></div>`).join("") : '<p class="note">Nothing here yet. Mark a subscription as "Never" to move it in.</p>'}</div>
    <h3>What could ${rs(base)} a year mean? <span class="note">(sample prices)</span></h3><div class="grid"><div class="card">\u{1F4DA} <b>${Math.floor(base / 1500)}</b> books at Rs 1,500</div><div class="card">\u{1F68C} <b>${(base / 3000).toFixed(1)}</b> months of a Rs 3,000 transport pass</div><div class="card">\u{1F393} <b>${Math.min(100, Math.round(base / 15000 * 100))}%</b> of a Rs 15,000 course fee</div><div class="card">\u{1F4B0} <b>${rs(base)}</b> for an emergency fund</div></div>`; };
  const rows = () => { $("#gvRows").replaceChildren(...subs.map((s, i) => { const r = el("div", { className: "qrow" }); r.innerHTML = `<label>Name<input value="${esc(s.n)}" aria-label="Subscription name"></label><label>Rs per month<input inputmode="decimal" value="${s.a}" aria-label="Monthly price"></label><label>Do you use it?<select aria-label="Usage">${["Yes", "Sometimes", "Never"].map(o => `<option${o === s.u ? " selected" : ""}>${o}</option>`).join("")}</select></label><button class="btn alt small" type="button">Remove</button>`;
    const [n, a, u] = $$("input,select", r); n.oninput = () => { s.n = n.value; out(); }; a.oninput = () => { const v = num(a.value); s.a = isNaN(v) ? 0 : v; out(); }; u.onchange = () => { s.u = u.value; out(); }; $("button", r).onclick = () => { subs.splice(i, 1); rows(); out(); }; return r; })); };
  $("#gvAdd").onclick = () => { subs.push({ n: "", a: 0, u: "Yes" }); rows(); out(); }; rows(); out();
}
const FLOW = { start: ["Is it essential (health, food, study, transport)?", "e1", "e0"], e1: ["Can it wait until next month?", "w1", "w0"] };
const FEND = { e0: "Not essential: skip or delay it. Add it to your wants list and use the 48-hour wait.", w1: "It can wait: set a date and put a small amount aside each week.", w0: "It cannot wait: use emergency savings first, trim wants for a few weeks and plan to refill the savings." };
function flow(k) { const box = $("#flow"); if (FLOW[k]) { const [q, y, n] = FLOW[k]; box.innerHTML = `<b>${q}</b><p><button class="btn small" id="fy">Yes</button> <button class="btn small alt" id="fn">No</button></p>`; $("#fy").onclick = () => flow(y); $("#fn").onclick = () => flow(n); } else { box.innerHTML = `<p class="callout">${FEND[k]}</p><button class="btn small alt" id="fr">Start again</button>`; $("#fr").onclick = () => flow("start"); } }
function labAid(b) {
  b.innerHTML = `<h2>\u{1F691} Financial First-Aid Kit</h2><p>What is your situation?</p><p id="aidTabs"></p><div id="aidBody"></div>`;
  DATA.aid.forEach(x => { const t = el("button", { className: "chip", type: "button", textContent: x.ic + " " + x.t, onclick: () => { $$("#aidTabs button").forEach(y => y.setAttribute("aria-pressed", y === t)); $("#aidBody").innerHTML = `<ol class="steps">${x.s.map(s => `<li>${s}</li>`).join("")}</ol>` + (x.flow ? '<div class="card" id="flow"></div>' : ""); if (x.flow) flow("start"); } }); $("#aidTabs").append(t); });
}
function labFuture(b) {
  b.innerHTML = `<h2>\u23F3 Meet Your Future Self</h2><div class="row">${fld("fuAge", "Your age", 20)}${fld("fuM", "Monthly saving (Rs)", 2000)}${fld("fuE", "What if I add (Rs per month)", 500)}</div><p class="err" id="fuErr" role="alert"></p><button class="btn" id="fuGo">Show my future</button><div id="fuOut" aria-live="polite"></div>`;
  $("#fuGo").onclick = () => { const age = V("fuAge"), m = V("fuM"), e = V("fuE"); if (![age, m, e].every(x => !isNaN(x) && x >= 0) || m <= 0 || age > 100) return $("#fuErr").textContent = "Enter a valid age and monthly saving above 0."; $("#fuErr").textContent = "";
    const mx = (m + e) * 120; $("#fuOut").innerHTML = `<div class="fstep"><b>TODAY</b><span>Age ${age}: start saving</span></div>` + [1, 3, 5, 10].map(y => `<div class="fstep"><b>${y} year${y > 1 ? "s" : ""}</b><div style="flex:1"><div class="ffill" style="width:${m * 12 * y / mx * 100}%"></div><small>${rs(m * 12 * y)} at age ${age + y}</small><div class="ffill" style="width:${(m + e) * 12 * y / mx * 100}%;background:var(--amber)"></div><small>${rs((m + e) * 12 * y)} if you add ${rs(e)} a month</small></div></div>`).join("") + `<p class="note">Simple savings math with no interest. The lesson is consistency and time, not investment advice.</p>`; };
}
function labTime(b) {
  b.innerHTML = `<h2>\u23F1\uFE0F The Real Price</h2><p>How much of your working time does a purchase cost?</p><div class="row">${fld("tmInc", "Monthly income (Rs)", 30000)}${fld("tmHrs", "Working hours per month", 160)}${fld("tmPrice", "Purchase price (Rs)", 5000)}</div><p class="err" id="tmErr" role="alert"></p><button class="btn" id="tmGo">Calculate</button><div id="tmOut" aria-live="polite"></div>`;
  $("#tmGo").onclick = () => { const i = V("tmInc"), h = V("tmHrs"), p = V("tmPrice"); if ([i, h, p].some(x => isNaN(x) || x <= 0)) return $("#tmErr").textContent = "All three values must be numbers above 0."; $("#tmErr").textContent = "";
    const rate = i / h, hrs = p / rate; let H = Math.floor(hrs), M = Math.round((hrs - H) * 60); if (M === 60) { H++; M = 0; }
    $("#tmOut").innerHTML = `<p>${rs(i)} \u00F7 ${h} hours = about <b>${rate.toFixed(2)}</b> Rs per hour.</p><div class="callout" style="font-size:1.2rem">This purchase represents<br><b>${H} hours ${M} minutes</b> of your working time (about ${(hrs / 8).toFixed(1)} working days).</div>`; };
}
function labPause(b) {
  b.innerHTML = `<h2>\u{1F6D1} Smart Purchase Pause</h2><div class="row"><label>What do you want to buy?<input id="ppItem" maxlength="40" placeholder="e.g. a jacket"></label>${fld("ppPrice", "Price (Rs)", "")}</div><div class="row">${sel("ppA", "1. Do I need it?", ["Yes", "No"])}${sel("ppB", "2. Did I plan for it?", ["Yes", "No"])}${sel("ppC", "3. Can I afford it without affecting essentials?", ["Yes", "No"])}${sel("ppD", "4. Do I already own something similar?", ["No", "Yes"])}${sel("ppE", "5. Would I still want it tomorrow?", ["Yes", "Not sure"])}</div><p class="err" id="ppErr" role="alert"></p><button class="btn" id="ppGo">Reflect</button><div id="ppOut" aria-live="polite"></div>`;
  $("#ppGo").onclick = () => { const p = V("ppPrice"), it = $("#ppItem").value.trim() || "this item"; if (isNaN(p) || p <= 0) return $("#ppErr").textContent = "Enter the price as a number above 0."; $("#ppErr").textContent = "";
    const g = id => $("#" + id).value, L = []; if (g("ppA") === "No") L.push("You marked it as a want. Wants are fine when they fit your wants budget."); if (g("ppB") === "No") L.push("It was not planned. Unplanned purchases deserve a pause."); if (g("ppC") === "No") L.push("It may affect your essentials."); if (g("ppD") === "Yes") L.push("You already own something similar."); if (g("ppE") === "Not sure") L.push("Not sure about tomorrow? Waiting 48 hours costs nothing.");
    $("#ppOut").innerHTML = `<div class="callout"><b>\u{1F9E0} Purchase reflection: ${esc(it)} (${rs(p)})</b><ul>${(L.length ? L : ["Your answers suggest this purchase fits your plan."]).map(x => `<li>${x}</li>`).join("")}</ul><p>${L.length ? "You may want to review whether this purchase fits your current budget." : "The decision is yours."}</p></div>`; };
}
function labJourney(b) {
  b.innerHTML = `<h2>\u{1F4C5} Money Journey Timeline</h2><p>Tap each point in the month.</p><div class="jline" id="jl"></div><div class="callout" id="jd" aria-live="polite">Select a day to see what happens.</div>`;
  DATA.timeline.forEach(t => { const x = el("button", { className: "jnode", type: "button", onclick: () => { $$(".jnode").forEach(y => y.setAttribute("aria-pressed", y === x)); $("#jd").innerHTML = `<b>${t.i} ${t.d}: ${t.t}</b><br>${t.x}`; } }); x.innerHTML = `<span>${t.i}</span><small>${t.d}</small>`; $("#jl").append(x); });
}
function labMyth(b) {
  b.innerHTML = `<h2>\u{1F4A5} Financial Myth Buster</h2><div class="grid" id="myths"></div>`;
  DATA.myths.forEach(m => { const c = el("div", { className: "card" }); c.innerHTML = `<p><b>\u274C MYTH</b><br>${m.m}</p><button class="btn small">Reveal reality</button><div hidden><p><b>\u2705 REALITY</b><br>${m.r}</p><a class="more" href="#${m.go}">${m.gt} \u203A</a></div>`; $("button", c).onclick = e => { const d = $("div", c); d.hidden = !d.hidden; e.target.textContent = d.hidden ? "Reveal reality" : "Hide"; }; $("#myths").append(c); });
}
function dnaScores() { const s = Number(sim.mode.split(",")[2]), done = Object.values(ckState).filter(Boolean).length; return [["Saving", Math.min(100, s * 5)], ["Needs awareness", STAT.done ? Math.round(STAT.right / STAT.done * 100) : 0], ["Planning", Math.round(done / DATA.checklist.length * 100)], ["Expense tracking", Math.min(100, Math.round(new Set(sim.rows.map(r => r.date)).size / 7 * 100))], ["Decision making", Math.min(100, STAT.decisions * 34)]]; }
function labDNA(b) {
  const sc = dnaScores(), top = [...sc].sort((p, q) => q[1] - p[1])[0], tag = top[1] ? top[0] + " focused" : "Just getting started";
  b.innerHTML = `<h2>\u{1F9EC} My Budget DNA</h2><p>Built from what you did on this site: the simulator, the needs quiz, the checklist and the Decision Lab. A playful learning profile, not financial advice.</p><div id="dnaBars"></div><p class="callout"><b>${tag}</b></p><button class="btn" id="dnaDl">Download My Budget Card</button>`;
  $("#dnaBars").append(...sc.map(([n, v]) => bar(n, v, v + "%", "save")));
  $("#dnaDl").onclick = () => { const c = document.createElement("canvas"); c.width = 800; c.height = 480; const x = c.getContext("2d"), g = x.createLinearGradient(0, 0, 800, 480); g.addColorStop(0, "#075985"); g.addColorStop(1, "#0ea5e9"); x.fillStyle = g; x.fillRect(0, 0, 800, 480);
    x.fillStyle = "#fff"; x.font = "bold 40px Georgia"; x.fillText("MY BUDGET DNA", 40, 70); x.font = "22px sans-serif"; x.fillText(tag, 40, 105);
    sc.forEach(([n, v], i) => { const y = 150 + i * 60; x.fillStyle = "#fff"; x.font = "20px sans-serif"; x.fillText(n, 40, y); x.fillStyle = "rgba(255,255,255,.3)"; x.fillRect(260, y - 18, 480, 20); x.fillStyle = "#fbbf24"; x.fillRect(260, y - 18, 4.8 * v, 20); });
    x.fillStyle = "#e0f2fe"; x.font = "16px sans-serif"; x.fillText("BudgetBasics - NextGen BudgetBee (educational, not financial advice)", 40, 450);
    c.toBlob(bl => { const l = document.createElement("a"); l.href = URL.createObjectURL(bl); l.download = "my-budget-dna.png"; l.click(); setTimeout(() => URL.revokeObjectURL(l.href), 1500); }); };
}
/* ---------- Monthly Budget Dashboard (reads the same numbers as the Budget Simulator) ---------- */
$("#dashMonth").append(...DATA.months.map((m, i) => el("option", { value: i, textContent: m, selected: i === new Date().getMonth() })));
function healthState() {
  if (!sim.set) return ["\u26AA", "No data yet", ""];
  const ratio = snap.pool > 0 ? snap.spent / snap.pool : (snap.spent > 0 ? 2 : 0);
  if (ratio <= 0.9) return ["\u{1F7E2}", "Balanced", "good"]; if (ratio <= 1.05) return ["\u{1F7E1}", "Needs Attention", "warn"]; return ["\u{1F534}", "Over Budget", "bad"];
}
function renderDashboard() {
  if (typeof sim === "undefined") return;
  const monthName = DATA.months[Number($("#dashMonth").value)];
  const cards = [["\u{1F4B0}", "Income", rs(snap.sal || 0)], ["\u{1F9FE}", "Total Planned Expenses", rs((snap.fixed || 0) + (snap.spent || 0))], ["\u{1F3AF}", "Total Savings", rs(snap.save || 0)], ["\u{1F4B5}", "Remaining Balance", rs(snap.rem || 0)]];
  $("#dashCards").replaceChildren(...cards.map(([ic, t, v]) => { const d = el("div", { className: "dcard" }); d.innerHTML = `<span class="dic">${ic}</span><span class="note">${t}</span><b></b>`; d.querySelector("b").textContent = v; return d; }));
  const pct = sim.set && snap.pool > 0 ? Math.min(150, snap.spent / snap.pool * 100) : 0;
  $("#dashProg").replaceChildren(bar("Budget used this month", Math.min(100, pct), Math.round(pct) + "%", pct > 100 ? "over" : "save"));
  const [ic, label, cls] = healthState(); $("#dashHealth").className = "health " + cls; $("#dashHealth").textContent = `${ic} Budget Status: ${label}` + (cls === "bad" ? " \u2013 spending is above the planned budget." : cls === "warn" ? " \u2013 getting close to the limit, worth a review." : cls === "good" ? " \u2013 spending is within the planned budget." : "");
  const rv = $("#dashReview"), tp = $("#dashTips");
  if (!sim.set) { rv.innerHTML = `<p>Set up your salary in the <a href="#planner">Budget Simulator</a> to see your ${monthName} review here.</p>`; tp.replaceChildren(); return; }
  rv.innerHTML = `<p><b>${monthName} review</b></p><p>Total Income: ${rs(snap.sal)}<br>Total Expenses: ${rs(snap.fixed + snap.spent)}<br>Savings: ${rs(snap.save)}<br>Remaining: ${rs(snap.rem)}</p><p>${snap.rem >= 0 ? "You stayed within your planned budget." : "Your spending was higher than your planned amount this month. Review your expenses and consider adjusting next month."}</p>`;
  const by = {}; sim.rows.forEach(r => by[r.cat] = (by[r.cat] || 0) + r.amt);
  const ent = by["Entertainment"] || 0, entPct = snap.spent ? ent / snap.spent * 100 : 0, savePct = snap.sal ? snap.save / snap.sal * 100 : 0, tipsL = [];
  if (entPct > 30) tipsL.push("Your entertainment category is relatively high in this sample budget. Consider reviewing non-essential expenses.");
  if (savePct < 10) tipsL.push("Consider setting a small savings goal and gradually increasing your contribution.");
  if (!sim.rows.length) tipsL.push("Log a few days of spending in the Budget Simulator to get personal suggestions here.");
  if (!tipsL.length) tipsL.push("No unusual patterns yet. Keep logging your spending for more personal suggestions.");
  tp.replaceChildren(...tipsL.map(t => el("p", { textContent: "\u{1F4A1} " + t })));
}
$("#dashMonth").onchange = renderDashboard;

/* ---------- Daily Saving Challenge (session-only progress) ---------- */
let CH = { d7: {}, d30: {} };
try { CH = JSON.parse(sessionStorage.getItem("bb_challenge")) || CH; } catch (e) {}
const chStore = () => { try { sessionStorage.setItem("bb_challenge", JSON.stringify(CH)); } catch (e) {} };
function renderChallenge() {
  const n7 = Object.values(CH.d7).filter(Boolean).length; $("#ch7fill").style.width = n7 / 7 * 100 + "%"; $("#ch7text").textContent = `${n7} of 7 days done`;
  $("#ch7list").replaceChildren(...DATA.challenge7.map((t, i) => { const l = el("label", { className: "ck" }), c = el("input", { type: "checkbox", checked: !!CH.d7[i], onchange: () => { CH.d7[i] = c.checked; chStore(); renderChallenge(); renderBadges(); } }); l.append(c, `Day ${i + 1}: ${t}`); return l; }));
  const n30 = Object.values(CH.d30).filter(Boolean).length; $("#ch30fill").style.width = n30 / 30 * 100 + "%"; $("#ch30text").textContent = `${n30} of 30 days done` + (n30 === 30 ? " \u2013 challenge complete!" : "");
  $("#ch30grid").replaceChildren(...DATA.challenge30tips.map((t, i) => { const b = el("button", { className: "dcell " + (CH.d30[i] ? "on" : ""), type: "button", title: t, textContent: i + 1 }); b.onclick = () => { CH.d30[i] = !CH.d30[i]; chStore(); renderChallenge(); }; return b; }));
}
$("#chReset").onclick = () => { CH = { d7: {}, d30: {} }; chStore(); renderChallenge(); };

/* ---------- Wallet Demo (mock only, never a real account) ---------- */
$("#walletBody").append(...DATA.wallet.map(([c, d, amt]) => { const tr = el("tr"); tr.append(el("td", { textContent: c }), el("td", { textContent: d }), el("td", { className: "num", textContent: rs(amt) })); return tr; }));
$("#walletAdd").onclick = () => {
  const today = isoDate(new Date());
  DATA.wallet.forEach(([cat, desc, amt]) => sim.rows.push({ date: today, cat: SCATS.some(c => c[0] === cat) ? cat : "Miscellaneous", desc: "(Wallet demo) " + desc, amt }));
  renderSim(); $("#walletMsg").textContent = "Sample transactions added to your Budget Simulator."; toast("Sample transactions added to the Budget Simulator.");
};

/* ---------- Search system ---------- */
const SEARCH_ALIASES = [
  ["home", ["home", "main", "homepage"]],
  ["dashboard", ["monthly dashboard", "dashboard", "monthly"]],
  ["basics", ["budgeting basics", "getting basics", "budget basics", "basics", "budgeting"]],
  ["needs", ["needs vs wants", "needs and wants", "need vs want", "needs", "wants"]],
  ["rule", ["50-30-20 rule", "50 30 20", "50-30-20", "rule"]],
  ["goals", ["savings goals", "saving goals", "goals", "goal"]],
  ["planner", ["budget simulator", "expense planner", "budget planner", "expenses", "simulator"]],
  ["challenge", ["daily saving challenge", "saving challenge", "challenge"]],
  ["wallet", ["wallet demo", "wallet"]],
  ["lab", ["money lab", "lab", "myths", "myth"]],
  ["mistakes", ["money mistakes", "money mistake", "mistakes", "mistake"]],
  ["infographics", ["infographics", "infographic"]],
  ["videos", ["video lessons", "video lesson", "videos", "video"]],
  ["gallery", ["picture gallery", "gallery", "pictures"]],
  ["chatbot", ["ai chatbot", "chatbot", "budgetbee"]],
  ["feedback", ["feedback"]],
  ["contact", ["contact us", "contact"]],
  ["about", ["about us", "about"]],
  ["sitemap", ["sitemap", "site map"]]
];
const normalizeSearch = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
function directSearchRoute(query) {
  const q = normalizeSearch(query);
  if (!q) return null;
  // Exact route/page-name matches take priority.
  for (const [routeId, aliases] of SEARCH_ALIASES) {
    if (aliases.some(a => normalizeSearch(a) === q)) return routeId;
  }
  // Then allow a contained page name, e.g. "my money mistakes".
  for (const [routeId, aliases] of SEARCH_ALIASES) {
    if (aliases.some(a => { const n = normalizeSearch(a); return n.length >= 4 && (q.includes(n) || n.includes(q)); })) return routeId;
  }
  // Search the complete content index and open the page attached to the best textual match.
  const items = searchIndex();
  let best = null, bestScore = 0;
  const words = q.split(/\s+/).filter(Boolean);
  for (const item of items) {
    const title = normalizeSearch(item.title), desc = normalizeSearch(item.desc), cat = normalizeSearch(item.cat);
    let score = 0;
    if (title === q) score += 100;
    if (title.includes(q)) score += 60;
    if (q.includes(title) && title.length >= 4) score += 45;
    words.forEach(w => { if (title.includes(w)) score += 18; if (desc.includes(w)) score += 5; if (cat.includes(w)) score += 4; });
    if (score > bestScore) { bestScore = score; best = item.route; }
  }
  return bestScore > 0 ? best : null;
}
function searchIndex() {
  return [
    ...DATA.tips.map(t => ({ title: t.t, desc: t.d, route: "basics", cat: "Tip" })),
    ...DATA.mods.map(m => ({ title: m[1], desc: m[2], route: m[0], cat: "Module" })),
    ...DATA.mistakes.map(m => ({ title: m.t, desc: m.s, route: "mistakes", cat: "Money Mistake" })),
    ...DATA.glossary.map(([t, d]) => ({ title: t, desc: d, route: "basics", cat: "Glossary" })),
    ...DATA.myths.map(m => ({ title: m.m, desc: m.r, route: "lab", cat: "Myth Buster" })),
    { title: "Savings Goals", desc: "Set a goal name, target and monthly amount.", route: "goals", cat: "Module" },
    { title: "Money Mistakes", desc: "Common budgeting mistakes students make.", route: "mistakes", cat: "Module" },
    { title: "Daily Saving Challenge", desc: "7-day and 30-day saving challenges.", route: "challenge", cat: "Module" },
    ...ROUTES.map(([route, title]) => ({ title, desc: `Open ${title}.`, route, cat: "Page" }))
  ];
}
function openSearchRoute(routeId) {
  if (!NAME[routeId]) return false;
  location.hash = "#" + routeId;
  return true;
}
function renderSearch() {
  const input = $("#srIn");
  if (input) input.value = SEARCH_Q;
  const q = SEARCH_Q.trim().toLowerCase();
  const list = q ? searchIndex().filter(x => (x.title + " " + x.desc + " " + x.cat).toLowerCase().includes(q)) : [];
  $("#srCount").textContent = q ? `${list.length} result${list.length === 1 ? "" : "s"} for "${SEARCH_Q}"` : "Type a keyword above, such as saving, budget, expenses, needs, wants or goals.";
  $("#srResults").replaceChildren(...list.map(x => {
    const c = el("button", { className: "card search-result", type: "button" });
    c.setAttribute("aria-label", "Open " + x.title);
    c.onclick = () => openSearchRoute(x.route);
    c.append(el("span", { className: "tag", textContent: x.cat }), el("h3", { textContent: x.title }), el("p", { textContent: x.desc }), el("span", { className: "more", textContent: "Open page →" }));
    return c;
  }));
  $("#srEmpty").hidden = !q || list.length > 0;
}
function submitSearch(query) {
  SEARCH_Q = String(query || "").trim();
  if (!SEARCH_Q) return;
  const target = directSearchRoute(SEARCH_Q);
  if (target) {
    openSearchRoute(target);
  } else if (location.hash === "#search") {
    renderSearch();
  } else {
    location.hash = "#search";
  }
}
$("#siteSearch").onsubmit = e => { e.preventDefault(); submitSearch($("#hsIn").value); };
$("#srForm").onsubmit = e => { e.preventDefault(); submitSearch($("#srIn").value); };

openTool("decision");

route();
