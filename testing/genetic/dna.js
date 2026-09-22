/* testing/genetic · behaviour for the genetic testing page.

   Six blocks, each guarding on its own elements, all writing in one rAF pass:
     · the hero copy, plate and figures settle in once the card is reached,
       and the helix behind them drifts against the scroll,
     · the definition of a gene lights one word at a time across its pinned
       travel, and the diagram beside it grows and is washed at the same pace,
     · the nine readings light the item in the middle of the window, hold that
       item's picture on the right, and fill the rail beside it,
     · each row of "where earlier insight helps" fills from the left as it
       crosses the window, and the second key lights once the first row is full,
     · the walled garden drifts against the scroll,
     · everything marked .dna-up arrives from below, once.

   Nothing here measures anything a stylesheet could have measured. */
(function () {
  'use strict';

  var doc = document;
  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  var root = $('[data-dna]');
  if (!root) return;

  var writers = [], queued = false;
  function sync() { queued = false; for (var i = 0; i < writers.length; i++) writers[i](); }
  function request() { if (!queued) { queued = true; requestAnimationFrame(sync); } }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });

  /* how far a tall section has travelled under a pinned stage, 0 to 1 */
  function travel(el) {
    var r = el.getBoundingClientRect();
    var t = r.height - innerHeight;
    return t > 0 ? clamp(-r.top / t, 0, 1) : 0;
  }
  /* how far a short element has crossed the window, 0 to 1 */
  function crossing(el) {
    var r = el.getBoundingClientRect();
    return clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
  }

  /* ---- reveals ------------------------------------------------------------ */
  (function reveal() {
    var els = $$('.dna-up, .dna-hero', root);
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || calm.matches) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -11% 0px', threshold: 0.06 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- the helix behind the hero, and the garden, both drifting ----------- */
  (function drift() {
    var els = $$('[data-dna-par]', root);
    if (!els.length || calm.matches) return;
    writers.push(function () {
      for (var i = 0; i < els.length; i++) {
        els[i].style.setProperty('--par', crossing(els[i]).toFixed(3));
      }
    });
    request();
  })();

  /* ---- what a gene is · the sentence, word by word ------------------------
     The words are wrapped here rather than in the markup, so the paragraph
     ships as one readable sentence and a page without script shows it whole. */
  (function gene() {
    var sec = $('[data-dna-gene]', root);
    if (!sec) return;
    var p = $('.dna-gene-p', sec);
    var pin = $('.dna-gene-pin', sec);
    if (!p) return;

    var words = p.textContent.trim().split(/\s+/);
    p.textContent = '';
    var spans = words.map(function (w, i) {
      var s = doc.createElement('span');
      s.textContent = w;
      p.appendChild(s);
      if (i < words.length - 1) p.appendChild(doc.createTextNode(' '));
      return s;
    });

    if (calm.matches) {
      spans.forEach(function (s) { s.classList.add('on'); });
      return;
    }
    writers.push(function () {
      /* the first tenth and the last eighth of the travel are held, so the
         sentence arrives dim and leaves fully lit rather than finishing
         mid screen */
      var t = travel(sec);
      var p2 = clamp((t - .1) / .72, 0, 1);
      var n = Math.round(p2 * spans.length);
      for (var i = 0; i < spans.length; i++) spans[i].classList.toggle('on', i < n);
      if (pin) pin.style.setProperty('--gp', p2.toFixed(4));
    });
    request();
  })();

  /* ---- the nine readings · the list, its held picture, the rail ----------- */
  (function readings() {
    var sec = $('[data-dna-read]', root);
    if (!sec) return;
    var list = $('.dna-read-list', sec);
    var items = $$('.dna-read-item', sec);
    var vis = $$('.dna-vis', sec);
    var rail = $('.dna-read-rail i', sec);
    if (!items.length) return;

    var cur = -1;
    function pick(i) {
      if (i === cur) return;
      cur = i;
      items.forEach(function (it, j) { it.classList.toggle('on', j === i); });
      vis.forEach(function (v, j) { v.classList.toggle('on', j === i); });
    }
    writers.push(function () {
      var mid = innerHeight / 2, best = 0, bestD = Infinity;
      for (var i = 0; i < items.length; i++) {
        var r = items[i].getBoundingClientRect();
        var d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      }
      pick(best);
      if (rail && list) {
        var lr = list.getBoundingClientRect();
        var p = clamp((mid - lr.top) / Math.max(lr.height, 1), 0, 1);
        rail.style.setProperty('--rail', (p * 100).toFixed(2) + '%');
      }
    });
    request();
  })();

  /* ---- why it matters · each row fills as it crosses ---------------------- */
  (function shift() {
    var sec = $('[data-dna-shift]', root);
    if (!sec) return;
    var rows = $$('.dna-shift-row', sec);
    var to = $('.dna-shift-k.is-to-target', sec);
    if (!rows.length) return;

    if (calm.matches) {
      rows.forEach(function (r) { r.style.setProperty('--p', '1'); r.classList.add('is-done'); });
      if (to) to.classList.add('is-to');
      return;
    }
    writers.push(function () {
      var any = false;
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i].getBoundingClientRect();
        var c = r.top + r.height / 2;
        /* opens when the row's middle is at 78% of the window, full at 46% */
        var p = clamp((innerHeight * .78 - c) / (innerHeight * .32), 0, 1);
        rows[i].style.setProperty('--p', p.toFixed(4));
        rows[i].classList.toggle('is-done', p > .96);
        if (p > .96) any = true;
      }
      if (to) to.classList.toggle('is-to', any);
    });
    request();
  })();
})();
