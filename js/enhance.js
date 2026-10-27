/* BudgetBasics enhance.js — advanced/professional polish layer.
   Self-contained: watches the existing app's DOM instead of touching its
   internals, so it works safely alongside js/app.js and js/data.js. */
(function () {
  "use strict";
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var q = function (s, r) { return (r || document).querySelector(s); };
  var qa = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var sayToast = function (t) { if (typeof toast === "function") { toast(t); } };

  /* ---------- Confetti ---------- */
  function confettiBurst(x, y, count) {
    if (reduceMotion) return;
    count = count || 26;
    var colors = ["#f6b21b", "#0ea5e9", "#14b8a6", "#f5a623", "#38bdf8", "#5eead4"];
    for (var i = 0; i < count; i++) {
      var p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = x + "px"; p.style.top = y + "px";
      p.style.background = colors[i % colors.length];
      var angle = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 100;
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", (Math.sin(angle) * dist - 50) + "px");
      p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(p);
      (function (piece) { setTimeout(function () { piece.remove(); }, 950); })(p);
    }
  }
  function confettiCenter(el) {
    var r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    confettiBurst(r.left + r.width / 2, r.top + r.height / 2);
  }

  /* ---------- XP / Level gamification ---------- */
  function getXP() { try { return Number(localStorage.getItem("bb_xp")) || 0; } catch (e) { return 0; } }
  function setXP(v) { try { localStorage.setItem("bb_xp", v); } catch (e) {} }
  var TITLES = [[1, "Budget Newbie"], [3, "Saver Rookie"], [6, "Smart Spender"], [10, "Budget Ninja"], [15, "Money Master"], [Infinity, "Budget Legend"]];
  function levelTitle(lvl) { for (var i = 0; i < TITLES.length; i++) if (lvl < TITLES[i][0]) return TITLES[i][1]; return TITLES[TITLES.length - 1][1]; }
  function xpWidget() {
    var box = document.getElementById("xpWidget");
    if (!box) {
      box = document.createElement("div"); box.id = "xpWidget"; box.className = "xpwidget";
      box.innerHTML = '<div class="xptop"><span></span><span></span></div><div class="xpbar"><div class="xpfill" id="xpFill"></div></div>';
      var side = document.getElementById("side"), visits = document.getElementById("visits");
      if (side) { if (visits && visits.nextSibling) side.insertBefore(box, visits.nextSibling); else side.appendChild(box); }
    }
    return box;
  }
  function renderXP() {
    var box = xpWidget(); if (!box) return;
    var xp = getXP(), level = Math.floor(xp / 100) + 1, inLevel = xp % 100;
    box.querySelector(".xptop span:first-child").textContent = "\uD83D\uDC1D Lvl " + level + " \u00B7 " + levelTitle(level);
    box.querySelector(".xptop span:last-child").textContent = inLevel + "/100 XP";
    var fill = box.querySelector("#xpFill"); if (fill) fill.style.width = inLevel + "%";
  }
  function floatXP(amount, atEl) {
    if (reduceMotion) return;
    var box = xpWidget(); var r = (atEl || box).getBoundingClientRect();
    var f = document.createElement("div"); f.className = "xp-float"; f.textContent = "+" + amount + " XP";
    f.style.left = (r.left + r.width / 2 - 20) + "px"; f.style.top = (r.top) + "px";
    document.body.appendChild(f); setTimeout(function () { f.remove(); }, 950);
  }
  function levelUpBanner(level) {
    if (reduceMotion) { sayToast("\uD83C\uDF89 Level up! You are now Lvl " + level + " \u2013 " + levelTitle(level)); return; }
    var b = document.createElement("div"); b.className = "levelup-banner";
    b.textContent = "\uD83C\uDF89 Level up! Lvl " + level + " \u2013 " + levelTitle(level);
    document.body.appendChild(b); confettiBurst(innerWidth / 2, 90, 40);
    setTimeout(function () { b.remove(); }, 2200);
  }
  function awardXP(amount, atEl) {
    var before = getXP(), after = before + amount;
    setXP(after); renderXP(); floatXP(amount, atEl);
    if (Math.floor(after / 100) > Math.floor(before / 100)) levelUpBanner(Math.floor(after / 100) + 1);
  }
  renderXP();

  /* ---------- Achievement watchers (badges, milestones, challenge grids) ---------- */
  function watchOnSet(containerId, itemSel, labelSel, opts) {
    var el = document.getElementById(containerId); if (!el) return;
    var prev = new Set();
    function scan(first) {
      var now = new Set(qa(labelSel, el).map(function (n) { return n.textContent; }));
      if (!first) {
        now.forEach(function (label) {
          if (!prev.has(label)) {
            if (opts && opts.onNew) opts.onNew(label, el);
          }
        });
      }
      prev = now;
    }
    scan(true);
    new MutationObserver(function () { scan(false); }).observe(el, { childList: true, subtree: true });
  }
  watchOnSet("badgeStrip", ".badge2.on", ".badge2.on small", {
    onNew: function (label, el) {
      sayToast("\uD83C\uDFC5 Achievement unlocked: " + label);
      confettiCenter(el); awardXP(15, el);
    }
  });
  watchOnSet("milestones", ".ms.on", ".ms.on small", {
    onNew: function (label, el) {
      sayToast("\u2B50 Milestone: " + label);
      confettiCenter(el); awardXP(label.toLowerCase().indexOf("achieved") > -1 ? 30 : 10, el);
    }
  });

  /* Daily challenge grids: award small XP per newly-completed day, confetti on full completion */
  function watchChallenge(containerId, onSel) {
    var el = document.getElementById(containerId); if (!el) return;
    var prevOn = -1;
    function scan() {
      var items = qa(onSel === "checkbox" ? "input[type=checkbox]" : ".dcell", el);
      if (!items.length) return;
      var onCount = items.filter(function (it) { return onSel === "checkbox" ? it.checked : it.classList.contains("on"); }).length;
      if (prevOn >= 0 && onCount > prevOn) awardXP(8 * (onCount - prevOn), el);
      if (prevOn >= 0 && onCount === items.length && prevOn < items.length) { sayToast("\uD83D\uDD25 Challenge complete! Every day checked off."); confettiCenter(el); }
      prevOn = onCount;
    }
    scan();
    new MutationObserver(scan).observe(el, { childList: true, subtree: true });
  }
  watchChallenge("ch7list", "checkbox");
  watchChallenge("ch30grid", "dcell");

  /* Quiz / needs-vs-wants correct answers */
  new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      var t = m.target;
      if (t.classList && t.classList.contains("fb") && t.classList.contains("good") && !t.dataset.xpDone) {
        t.dataset.xpDone = "1"; awardXP(5, t);
      }
    });
  }).observe(document.body, { attributes: true, attributeFilter: ["class"], subtree: true });

  /* Expense log: XP for each new row added */
  (function () {
    var el = document.getElementById("expBody"); if (!el) return;
    var prevCount = el.children.length;
    new MutationObserver(function () {
      var n = el.children.length;
      if (n > prevCount) awardXP(5 * (n - prevCount), el);
      prevCount = n;
    }).observe(el, { childList: true });
  })();

  /* Feedback / Contact forms: one-time XP when the confirmation message appears */
  ["fbOk", "ctOk"].forEach(function (id) {
    var el = document.getElementById(id); if (!el) return;
    new MutationObserver(function () {
      if (el.textContent.trim() && !el.dataset.xpDone) { el.dataset.xpDone = "1"; awardXP(10, el); }
    }).observe(el, { childList: true, characterData: true, subtree: true });
  });

  /* Money Lab: small XP for trying a new tool (once per page load) */
  (function () {
    var seen = {};
    var tabs = document.getElementById("labTabs"); if (!tabs) return;
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var id = b.dataset.id || b.textContent;
      if (!seen[id]) { seen[id] = 1; awardXP(3, b); }
    });
  })();

  /* Chatbot: small XP per question asked */
  (function () {
    var f = document.getElementById("chatForm"); if (!f) return;
    f.addEventListener("submit", function () { if (document.getElementById("chatQ").value.trim()) awardXP(2, f); });
  })();

  /* ---------- Nicer chat bubbles: pop-in animation on new messages ---------- */
  (function () {
    var log = document.getElementById("chatLog"); if (!log) return;
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes && m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && n.classList && n.classList.contains("msg")) n.classList.add("msg-in");
        });
      });
    }).observe(log, { childList: true });
  })();

  /* ---------- Scroll-reveal stagger animation when a page section opens ---------- */
  function revealSection(section) {
    var items = qa(".card, .mod, .tile, .dcard, .badge2, .ms, .gtile", section);
    items.forEach(function (it, i) {
      it.classList.remove("reveal-in"); void it.offsetWidth;
      it.style.animationDelay = Math.min(i * 30, 380) + "ms";
      it.classList.add("reveal-in");
    });
  }
  qa("#main .view").forEach(function (v) {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) { if (m.attributeName === "hidden" && !v.hidden) revealSection(v); });
    }).observe(v, { attributes: true, attributeFilter: ["hidden"] });
  });
  var startVisible = q("#main .view:not([hidden])"); if (startVisible) revealSection(startVisible);

  /* ---------- Printable month report ---------- */
  (function () {
    var heading = qa("#v-planner h2").filter(function (h) { return h.textContent.trim() === "Month report"; })[0];
    if (!heading) return;
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "btn alt small"; btn.style.marginLeft = "10px";
    btn.textContent = "\uD83D\uDDA8\uFE0F Print / Save as PDF";
    btn.onclick = function () { window.print(); };
    heading.appendChild(btn);
  })();

  /* ---------- Keyboard shortcuts ---------- */
  function isTyping(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
  }
  function buildShortcutsDialog() {
    if (document.getElementById("kbdDlg")) return;
    var dlg = document.createElement("dialog"); dlg.id = "kbdDlg";
    dlg.innerHTML =
      "<h2>\u2328\uFE0F Keyboard shortcuts</h2>" +
      '<p><span class="kbd">/</span> Focus search</p>' +
      '<p><span class="kbd">h</span> Home</p>' +
      '<p><span class="kbd">d</span> Monthly Dashboard</p>' +
      '<p><span class="kbd">p</span> Budget Simulator</p>' +
      '<p><span class="kbd">g</span> Savings Goals</p>' +
      '<p><span class="kbd">t</span> Toggle dark mode</p>' +
      '<p><span class="kbd">?</span> Show this help</p>' +
      '<button class="btn" type="button" id="kbdClose">Close</button>';
    document.body.appendChild(dlg);
    dlg.querySelector("#kbdClose").onclick = function () { dlg.close(); };
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (isTyping(document.activeElement)) return;
    if (e.key === "/") { var s = document.getElementById("hsIn"); if (s) { e.preventDefault(); s.focus(); } }
    else if (e.key === "h") location.hash = "#home";
    else if (e.key === "d") location.hash = "#dashboard";
    else if (e.key === "p") location.hash = "#planner";
    else if (e.key === "g") location.hash = "#goals";
    else if (e.key === "t") { var tb = document.getElementById("theme"); if (tb) tb.click(); }
    else if (e.key === "?") { buildShortcutsDialog(); document.getElementById("kbdDlg").showModal(); }
  });
  try {
    if (!localStorage.getItem("bb_kbd_hint")) {
      setTimeout(function () { sayToast("Tip: press ? for keyboard shortcuts"); localStorage.setItem("bb_kbd_hint", "1"); }, 5000);
    }
  } catch (e) {}
})();

/* BudgetBasics enhance2.js block — professional line-icon set, a quick-launch
   chatbot button near the ticker, and a downloadable copy of the Daily
   Saving Challenge page. Runs after the IIFE above; fully self-contained. */
(function () {
  "use strict";
  var q = function (s, r) { return (r || document).querySelector(s); };
  var qa = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Professional outline icon set (replaces emoji nav/module/gallery icons) ---------- */
  var ICON_SVG = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5A1 1 0 0 0 6.5 20.5h11A1 1 0 0 0 18.5 19.5V10"/><path d="M9.5 20.5v-6h5v6"/>',
    dashboard: '<path d="M3 3v17a1 1 0 0 0 1 1h17"/><rect x="7" y="13" width="3" height="5"/><rect x="12" y="9" width="3" height="9"/><rect x="17" y="5" width="3" height="13"/>',
    basics: '<path d="M3 5.5c2.2-1.3 5-1.3 7 0v14c-2-1.3-4.8-1.3-7 0z"/><path d="M21 5.5c-2.2-1.3-5-1.3-7 0v14c2-1.3 4.8-1.3 7 0z"/>',
    needs: '<path d="M12 3v18"/><path d="M6 6h12"/><path d="M4.5 6 2 12.5a3 3 0 0 0 6 0z"/><path d="M19.5 6 17 12.5a3 3 0 0 0 6 0z"/>',
    rule: '<circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><path d="M19 5 5 19"/>',
    goals: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
    planner: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3.5"/>',
    challenge: '<path d="M12 2.5c1.6 3.3-2 4.7-2 8a2 2 0 0 0 4 0c0-1.2-.6-2-.6-2s2.6.9 2.6 4.2a5 5 0 0 1-10 0c0-5.3 4-6.5 6-10.2z"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="16" cy="14" r="1.3" fill="currentColor" stroke="none"/>',
    mistakes: '<path d="M12 3 21.5 20H2.5z"/><path d="M12 10v4"/><circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none"/>',
    infographics: '<path d="M12 2v10l7 5"/><circle cx="12" cy="12" r="9.5"/>',
    chatbot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4.5"/><circle cx="12" cy="3.2" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="13.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="13.5" r="1" fill="currentColor" stroke="none"/><path d="M9 17h6"/>',
    lab: '<path d="M9.5 2h5"/><path d="M10 2.5v6.3L4.8 18a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 8.8V2.5"/><path d="M7 15h10"/>',
    videos: '<circle cx="12" cy="12" r="9.5"/><path d="M10 8.3v7.4l6-3.7z" fill="currentColor" stroke="none"/>',
    gallery: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5.2-5.2-4 4-2.3-2.3L3 18"/>',
    about: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7.8h.01"/><path d="M10.5 11h1.7v6"/><path d="M10.3 17h3.4"/>',
    contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.2 12 13l8.5-6.8"/>',
    sitemap: '<circle cx="12" cy="4.5" r="2"/><circle cx="5.5" cy="19" r="2"/><circle cx="18.5" cy="19" r="2"/><path d="M12 6.5v3.5M12 10 6.7 16.3M12 10l5.3 6.3"/>',
    feedback: '<path d="M4 4.5h16v12H8.3L4 20.5z"/>',
    search: '<circle cx="10.5" cy="10.5" r="7"/><path d="M20.5 20.5 15.7 15.7"/>'
  };
  function svgIcon(paths, size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 20) + '" height="' + (size || 20) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + '</svg>';
  }
  qa('#nav a[href^="#"], #mods a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href').replace('#', ''), ic = a.querySelector('.ic');
    if (ic && ICON_SVG[id]) ic.innerHTML = svgIcon(ICON_SVG[id]);
  });

  var GALLERY_SVG = [
    '<rect x="7" y="6" width="10" height="15" rx="2"/><path d="M9.5 6V4h5v2"/><path d="M9 12.5h6"/>',
    ICON_SVG.wallet,
    '<rect x="3.5" y="6" width="17" height="11" rx="2"/><path d="M3.5 12.5h17"/><circle cx="7.5" cy="19.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="16.5" cy="19.5" r="1.4" fill="currentColor" stroke="none"/>',
    ICON_SVG.basics,
    '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    '<path d="M6.5 2v8a2 2 0 0 0 4 0V2"/><path d="M8.5 10v12"/><path d="M17 2c-2.2 0-3.2 2.2-3.2 5.2s1 4 3.2 4v10.8"/>',
    ICON_SVG.goals,
    '<path d="M6.5 2h11v20l-3-2-2.5 2-2.5-2-3 2z"/><path d="M9.3 7.5h5.4M9.3 11.3h5.4M9.3 15h3.4"/>'
  ];
  ["#hgal .gtile", "#galleryGrid .gtile"].forEach(function (sel) {
    qa(sel).forEach(function (tile, i) {
      var ge = tile.querySelector('.ge');
      if (ge && GALLERY_SVG[i]) ge.innerHTML = svgIcon(GALLERY_SVG[i], 44);
    });
  });

  /* ---------- Floating "Ask AI" chatbot quick-launch button near the ticker ---------- */
  (function () {
    if (document.getElementById('chatFab')) return;
    var b = document.createElement('button');
    b.type = 'button'; b.id = 'chatFab';
    b.innerHTML = svgIcon(ICON_SVG.chatbot, 18) + '<span class="fabtext">Ask AI</span>';
    b.setAttribute('aria-label', 'Open the AI chatbot');
    b.onclick = function () { location.hash = '#chatbot'; };
    document.body.appendChild(b);
  })();

  /* ---------- Downloadable copy of the Daily Saving Challenge page ---------- */
  (function () {
    var view = document.getElementById('v-challenge'); if (!view) return;
    var card = document.createElement('div'); card.className = 'dl-card';
    card.innerHTML =
      '<div><b>Download this page</b><p>Save your 7-day and 30-day challenge progress as a file you can keep or print.</p></div>' +
      '<button type="button" class="dl-btn">' + svgIcon('<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>', 18) + 'Download</button>';
    view.appendChild(card);
    card.querySelector('.dl-btn').onclick = function () {
      var d7 = qa('#ch7list label').map(function (l) {
        var c = l.querySelector('input'); return (c && c.checked ? '[x] ' : '[ ] ') + l.textContent.replace(/^\s*/, '');
      }).join('\n');
      var d30done = qa('#ch30grid .dcell.on').length, d30total = qa('#ch30grid .dcell').length;
      var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Daily Saving Challenge \u2013 My Progress</title>' +
        '<style>body{font-family:Georgia,serif;max-width:640px;margin:40px auto;padding:0 20px;color:#0b2540;line-height:1.6}' +
        'h1{font-size:1.8rem}pre{white-space:pre-wrap;font-family:inherit;background:#eaf6ff;border-radius:12px;padding:16px}' +
        '.meta{color:#4a6a88;font-size:.9rem}</style></head><body>' +
        '<h1>Daily Saving Challenge \u2013 My Progress</h1>' +
        '<p class="meta">Downloaded from BudgetBasics on ' + new Date().toDateString() + '</p>' +
        '<h2>7-Day Challenge</h2><pre>' + d7.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>' +
        '<h2>30-Day Challenge</h2><p>' + d30done + ' of ' + d30total + ' days completed.</p>' +
        '</body></html>';
      var blob = new Blob([html], { type: 'text/html' }), url = URL.createObjectURL(blob);
      var a = document.createElement('a'); a.href = url; a.download = 'BudgetBasics-Daily-Saving-Challenge.html';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    };
  })();
})();
