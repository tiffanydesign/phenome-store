/* FAQ · routing, drawing, search.

   Laid out on the colleague's help centre template: a search hero, Browse by
   topic as a bento, Popular right now, and each topic as a side list of every
   topic beside its groups of questions. Type and colour are the page's own
   scale (help.css header), not the template's.

   Three views on one page, chosen by the hash:
     #/                    home
     #/<topic>             a topic: its groups, then its guides
     #/<topic>/<guide>     one product or test guide
   The hero is shared and only changes its words. A search replaces the view
   while it has a query and hands it back when the field is cleared.

   Question cards are the site's Questions component (shared.css `.acc.is-faq`)
   with its rule of one open at a time. shared.js binds that rule at parse time
   to lists that exist then, and these are drawn later, so the same behaviour
   is bound here to `[data-hc-acc]`. */
(function () {
  'use strict';
  var H = window.PH_HELP;
  var app = document.querySelector('[data-hc]');
  if (!H || !app) return;

  var BASE = '/phenome-store';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hero = {
    crumb: $('[data-hc-crumb]'), title: $('[data-hc-title]'), sub: $('[data-hc-sub]'),
    q: $('[data-hc-q]'), clear: $('[data-hc-clear]'), form: $('[data-hc-search]')
  };
  var view = $('[data-hc-view]');
  var results = $('[data-hc-results]');
  var resultsIn = $('[data-hc-results-in]');

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function countOf(groups) {
    var n = 0;
    for (var i = 0; i < groups.length; i++) n += groups[i].qs.length;
    return n;
  }
  /* `sep` lets a tile set the guide count on its own line. */
  function topicCount(t, sep) {
    var s = countOf(t.groups) + ' answers';
    if (t.guides && t.guides.length) s += (sep || ', ') + t.guides.length + ' ' + t.guideKind;
    return s;
  }

  /* ---- glyphs, one per topic, on a 24 grid at 1.5 ---------------------- */
  var GLYPH = {
    tube: '<path d="M9 3h6M10 3v12.5a2 2 0 0 0 4 0V3"/><path d="M10 10h4"/>',
    capsule: '<rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="m9.2 7.9 4.9 7"/>',
    ring: '<circle cx="12" cy="13" r="7"/><circle cx="12" cy="13" r="4.2"/><path d="M9.5 5.4 12 3.5l2.5 1.9"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.5 18.5h3M9.5 8.5h5M9.5 11.5h3"/>',
    box: '<path d="m3.5 7.5 8.5-4 8.5 4v9l-8.5 4-8.5-4z"/><path d="m3.5 7.5 8.5 4 8.5-4M12 11.5v9"/>',
    helix: '<path d="M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9"/><path d="M8.5 6.5h7M8.5 17.5h7"/>',
    hands: '<path d="M3 13.5 7.5 9l3 1.2L14 8l7 5.5"/><path d="m7.5 15 2.3 2.3a1.5 1.5 0 0 0 2.1 0l3.6-3.6M10 12.8l2.6 2.6M3 13.5l3 3"/>'
  };
  function glyph(k) {
    return '<svg class="hc-gl" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (GLYPH[k] || '') + '</svg>';
  }
  var ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  /* ---- answers: a line starting "• " is a list item, a blank line breaks a
     paragraph, an email address becomes a link. Two named pages link too. */
  var PAGES = [
    ['“About” page', BASE + '/about/'],
    ['“How it Works” page', BASE + '/testing/how-it-works/']
  ];
  function inline(s, mark) {
    var h = esc(s);
    if (mark) h = mark(h);
    h = h.replace(/([\w.]+@phenomelongevity\.com)/g, '<a href="mailto:$1">$1</a>');
    for (var i = 0; i < PAGES.length; i++) {
      var k = esc(PAGES[i][0]);
      if (h.indexOf(k) > -1) h = h.replace(k, '<a href="' + PAGES[i][1] + '">' + k + '</a>');
    }
    return h;
  }
  function answer(a, mark) {
    var out = '', list = [];
    function flush() {
      if (list.length) out += '<ul>' + list.join('') + '</ul>';
      list = [];
    }
    var paras = a.split('\n\n');
    for (var p = 0; p < paras.length; p++) {
      var lines = paras[p].split('\n');
      var text = [];
      for (var l = 0; l < lines.length; l++) {
        var ln = lines[l];
        if (ln.indexOf('• ') === 0) {
          if (text.length) { out += '<p>' + text.join('<br/>') + '</p>'; text = []; }
          list.push('<li>' + inline(ln.slice(2), mark) + '</li>');
        } else {
          flush();
          text.push(inline(ln, mark));
        }
      }
      flush();
      if (text.length) out += '<p>' + text.join('<br/>') + '</p>';
    }
    return out;
  }

  function card(q, a, open, crumb, mark) {
    return '<details class="acc-item"' + (open ? ' open=""' : '') + '><summary>' +
      '<span class="hc-q">' + (crumb ? '<span class="hc-q-crumb">' + crumb + '</span>' : '') +
      '<span class="hc-q-t">' + (mark ? mark(esc(q)) : esc(q)) + '</span></span>' +
      '</summary><div class="acc-body"><div>' + answer(a, mark) + '</div></div></details>';
  }
  function cards(qs) {
    var h = '<div class="acc is-faq hc-acc" data-hc-acc="">';
    for (var i = 0; i < qs.length; i++) h += card(qs[i][0], qs[i][1], false);
    return h + '</div>';
  }

  /* ---- shared pieces ---------------------------------------------------- */
  /* The hero. A lead line is optional: the home title stands alone, a topic
     keeps its two tone pair (topic name held back, its title in ink). */
  function setHero(lead, main, sub, trail) {
    var c = '<a href="' + BASE + '/contact/">Support</a><span aria-hidden="true">›</span><a href="#/">FAQ</a>';
    for (var i = 0; i < (trail || []).length; i++) {
      c += '<span aria-hidden="true">›</span>' +
        (trail[i][1] ? '<a href="' + trail[i][1] + '">' + esc(trail[i][0]) + '</a>' : '<span aria-current="page">' + esc(trail[i][0]) + '</span>');
    }
    hero.crumb.innerHTML = c;
    hero.title.innerHTML = (lead ? '<span class="ph-display-lead">' + esc(lead) + '</span>' : '') + '<span>' + esc(main) + '</span>';
    hero.sub.textContent = sub;
    hero.sub.hidden = !sub;
  }

  /* ---- views ------------------------------------------------------------ */
  /* Home. Browse by topic is seven light cards of one kind, on a four column
     grid: Tests, the largest topic, takes two columns, so the seven fill two
     rows of four exactly and no card is left alone on a third row. Popular
     right now is one centred column under it. Both headings run on one line,
     the held back word first. */
  function drawHome() {
    setHero('', 'How can we help?', '', []);
    app.classList.remove('is-topic');

    var T = H.topics, tiles = '';
    for (var i = 0; i < T.length; i++) {
      var t = T[i];
      tiles += '<a class="hc-tile' + (i === 0 ? ' is-wide' : '') + '" href="#/' + t.id + '">' +
        '<span class="hc-tile-ic">' + glyph(t.glyph) + '</span>' +
        (t.name !== t.title ? '<span class="hc-tile-k">' + esc(t.name) + '</span>' : '') +
        '<span class="hc-tile-t">' + esc(t.title) + '</span>' +
        '<span class="hc-tile-d">' + esc(t.desc) + '</span>' +
        '<span class="hc-tile-foot"><span>' + topicCount(t, '<br>') + '</span><i class="hc-go">' + ARROW + '</i></span>' +
        '</a>';
    }

    var pop = '<div class="acc is-faq hc-acc" data-hc-acc="">';
    for (var p = 0; p < H.popular.length; p++) {
      var tp = byId(T, H.popular[p][2]);
      pop += card(H.popular[p][0], H.popular[p][1], p === 0, tp ? esc(tp.name) : '');
    }
    pop += '</div>';

    view.innerHTML =
      '<section class="hc-sec hc-browse"><div class="hc-wrap">' +
        '<div class="hc-grid">' + tiles + '</div>' +
      '</div></section>' +
      '<section class="hc-sec hc-pop"><div class="hc-wrap"><div class="hc-pop-col">' +
        '<h2 class="ph-display is-ink is-line hc-h2"><span class="ph-display-lead">Popular</span> <span>right now</span></h2>' +
        pop +
      '</div></div></section>';
  }

  /* The side list: every topic, and under the open one either its groups (a
     topic) or its sibling guides (a guide). Folds to a dropdown on a phone. */
  function sideNav(active, guideOf) {
    var T = H.topics, li = '';
    for (var i = 0; i < T.length; i++) {
      var t = T[i], on = t.id === active.id;
      li += '<li class="' + (on ? 'is-on' : '') + '"><a href="#/' + t.id + '"' + (on && !guideOf ? ' aria-current="page"' : '') + '>' +
        '<span class="hc-side-ic">' + glyph(t.glyph) + '</span>' + esc(t.name) + '</a>';
      if (on) {
        var sub = '';
        if (guideOf) {
          for (var g = 0; g < t.guides.length; g++) {
            var gd = t.guides[g];
            sub += '<li><a href="#/' + t.id + '/' + gd.id + '"' + (gd === guideOf ? ' aria-current="page"' : '') + '>' + esc(gd.name) + '</a></li>';
          }
        } else {
          for (var k = 0; k < t.groups.length; k++) {
            sub += '<li><a href="#" data-hc-jump="g' + k + '">' + esc(t.groups[k].name) + '</a></li>';
          }
          if (t.guides && t.guides.length) sub += '<li><a href="#" data-hc-jump="guides">' + esc(t.guidesLabel) + '</a></li>';
        }
        li += '<ul class="hc-side-sub">' + sub + '</ul>';
      }
      li += '</li>';
    }
    return '<nav class="hc-side" aria-label="Browse topics">' +
      '<details class="hc-side-box" data-hc-side="" open=""><summary><span>Browse topics</span><i aria-hidden="true"></i></summary>' +
      '<ul class="hc-side-list">' + li + '</ul></details></nav>';
  }

  function groupsHtml(groups) {
    var h = '';
    for (var k = 0; k < groups.length; k++) {
      h += '<section class="hc-group" id="g' + k + '"><div class="hc-group-head">' +
        '<h2 class="hc-gh">' + esc(groups[k].name) + '</h2><span class="hc-gn">' + groups[k].qs.length + '</span></div>' +
        cards(groups[k].qs) + '</section>';
    }
    return h;
  }

  function drawTopic(t) {
    setHero(t.name === t.title ? 'FAQ' : t.name, t.title, t.desc, [[t.name]]);
    app.classList.add('is-topic');
    var guides = '';
    if (t.guides && t.guides.length) {
      var gl = '';
      for (var g = 0; g < t.guides.length; g++) {
        var gd = t.guides[g];
        gl += '<a class="hc-guide" href="#/' + t.id + '/' + gd.id + '">' +
          '<span class="hc-guide-t">' + esc(gd.name) + '</span>' +
          '<span class="hc-guide-d">' + esc(gd.desc) + '</span>' +
          '<span class="hc-tile-foot"><span>' + countOf(gd.groups) + ' answers</span><i class="hc-go">' + ARROW + '</i></span></a>';
      }
      guides = '<section class="hc-group" id="guides"><div class="hc-group-head"><h2 class="hc-gh">' + esc(t.guidesLabel) + '</h2>' +
        '<span class="hc-gn">' + t.guides.length + '</span></div><div class="hc-guide-grid">' + gl + '</div></section>';
    }
    view.innerHTML = '<div class="hc-wrap hc-layout">' + sideNav(t) +
      '<div class="hc-main"><p class="hc-meta">' + topicCount(t) + '</p>' + groupsHtml(t.groups) + guides + '</div></div>';
  }

  function drawGuide(t, gd) {
    setHero(t.guidesLabel, gd.name, gd.desc, [[t.name, '#/' + t.id], [gd.name]]);
    app.classList.add('is-topic');
    var i = t.guides.indexOf(gd);
    var next = t.guides[(i + 1) % t.guides.length];
    view.innerHTML = '<div class="hc-wrap hc-layout">' + sideNav(t, gd) +
      '<div class="hc-main"><p class="hc-meta">' + countOf(gd.groups) + ' answers</p>' + groupsHtml(gd.groups) +
      '<a class="hc-next" href="#/' + t.id + '/' + next.id + '"><span class="hc-next-tx"><span class="hc-next-k">Next guide</span>' +
      '<span class="hc-next-t">' + esc(next.name) + '</span></span><i class="hc-go">' + ARROW + '</i></a></div></div>';
  }

  /* On a phone the side list starts folded. */
  function foldSide() {
    var side = $('[data-hc-side]');
    if (side && window.matchMedia('(max-width: 1023px)').matches) side.open = false;
  }

  /* ---- routing ---------------------------------------------------------- */
  var current = null;
  function route() {
    var parts = (location.hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
    var key = parts.join('/');
    if (key === current) return;
    current = key;
    var t = parts[0] && byId(H.topics, parts[0]);
    var gd = t && parts[1] && t.guides ? byId(t.guides, parts[1]) : null;
    if (gd) drawGuide(t, gd);
    else if (t) drawTopic(t);
    else drawHome();
    if (hero.q.value) { hero.q.value = ''; search(''); }
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = '';
    foldSide();
  }
  window.addEventListener('hashchange', route);

  /* In page jumps from the group chips. A plain `#g3` would be read as a
     route, so these scroll by hand and leave the hash alone. */
  app.addEventListener('click', function (e) {
    var j = e.target.closest('[data-hc-jump]');
    if (!j) return;
    e.preventDefault();
    var el = document.getElementById(j.getAttribute('data-hc-jump'));
    if (!el) return;
    var nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ph-nav-h')) || 44;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - nav - 24, behavior: calm ? 'auto' : 'smooth' });
    var side = $('[data-hc-side]');
    if (side && window.matchMedia('(max-width: 1023px)').matches) side.open = false;
  });

  /* ---- one card open at a time, closed with an animation ---------------- */
  app.addEventListener('click', function (e) {
    var sum = e.target.closest('summary');
    if (!sum) return;
    var item = sum.parentNode, list = item.parentNode;
    if (!list || !list.hasAttribute || !list.hasAttribute('data-hc-acc')) return;
    e.preventDefault();
    if (item.open) { close(item); return; }
    var open = list.querySelector('details[open]');
    if (open && open !== item) close(open);
    item.open = true;
  });
  function close(item) {
    var body = item.querySelector('.acc-body');
    if (!body || calm) { item.open = false; return; }
    body.style.gridTemplateRows = '1fr';
    body.offsetHeight;
    body.style.gridTemplateRows = '0fr';
    var done = false;
    function end() {
      if (done) return;
      done = true;
      body.removeEventListener('transitionend', end);
      item.open = false;
      body.style.gridTemplateRows = '';
    }
    body.addEventListener('transitionend', end);
    setTimeout(end, 600);
  }

  /* ---- search ----------------------------------------------------------- */
  var INDEX = [];
  (function build() {
    function add(groups, trail) {
      for (var k = 0; k < groups.length; k++) {
        for (var i = 0; i < groups[k].qs.length; i++) {
          var q = groups[k].qs[i];
          INDEX.push({ q: q[0], a: q[1], crumb: trail.concat(groups[k].name),
            hay: (q[0] + ' ' + q[1]).toLowerCase(), hq: q[0].toLowerCase() });
        }
      }
    }
    for (var t = 0; t < H.topics.length; t++) {
      var tp = H.topics[t];
      add(tp.groups, [tp.name]);
      for (var g = 0; g < (tp.guides || []).length; g++) add(tp.guides[g].groups, [tp.name, tp.guides[g].name]);
    }
  })();

  function search(raw) {
    var q = raw.trim().toLowerCase();
    hero.clear.hidden = !q;
    if (!q) {
      results.hidden = true;
      view.hidden = false;
      resultsIn.innerHTML = '';
      return;
    }
    var words = q.split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!words.length) words = [q];
    var hits = [];
    for (var i = 0; i < INDEX.length; i++) {
      var it = INDEX[i], ok = true, score = 0;
      for (var w = 0; w < words.length; w++) {
        if (it.hay.indexOf(words[w]) < 0) { ok = false; break; }
        if (it.hq.indexOf(words[w]) > -1) score += 3;
      }
      if (it.hq.indexOf(q) > -1) score += 6;
      if (it.crumb.length === 2) score += 1;          /* a topic answer before a guide's */
      if (ok) hits.push({ it: it, s: score, i: i });
    }
    hits.sort(function (a, b) { return b.s - a.s || a.i - b.i; });

    var re = new RegExp('(' + words.map(function (w) {
      return esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ')', 'gi');
    function mark(h) { return h.replace(re, '<mark>$1</mark>'); }

    var MAX = 40, shown = hits.slice(0, MAX);
    var h = '<div class="hc-res-head"><h2 class="hc-gh">' +
      (hits.length ? hits.length + (hits.length === 1 ? ' answer' : ' answers') + ' for “' + esc(raw.trim()) + '”' : 'No answers for “' + esc(raw.trim()) + '”') +
      '</h2>' + (hits.length > MAX ? '<p class="hc-res-note">Showing the closest ' + MAX + '. Add a word to narrow it down.</p>' : '') + '</div>';
    if (hits.length) {
      h += '<div class="acc is-faq hc-acc" data-hc-acc="">';
      for (var r = 0; r < shown.length; r++) {
        var x = shown[r].it;
        h += card(x.q, x.a, false, x.crumb.map(esc).join('<i aria-hidden="true">›</i>'), mark);
      }
      h += '</div>';
    } else {
      h += '<p class="hc-res-empty">Try fewer words, or browse the topics below. Or write to us at <a href="mailto:hello@phenomelongevity.com">hello@phenomelongevity.com</a>.</p>' +
        '<p class="hc-res-empty"><a class="hc-btn" href="#/" data-hc-reset="">Browse all topics</a></p>';
    }
    resultsIn.innerHTML = h;
    results.hidden = false;
    view.hidden = true;
  }

  var t0;
  hero.q.addEventListener('input', function () {
    clearTimeout(t0);
    t0 = setTimeout(function () { search(hero.q.value); }, 120);
  });
  hero.form.addEventListener('submit', function (e) { e.preventDefault(); search(hero.q.value); hero.q.blur(); });
  hero.clear.addEventListener('click', function () { hero.q.value = ''; search(''); hero.q.focus(); });
  hero.q.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hero.q.value) { hero.q.value = ''; search(''); }
  });
  results.addEventListener('click', function (e) {
    if (e.target.closest('[data-hc-reset]')) { hero.q.value = ''; search(''); }
  });

  route();
  var pre = new URLSearchParams(location.search).get('q');
  if (pre) { hero.q.value = pre; search(pre); }
})();
