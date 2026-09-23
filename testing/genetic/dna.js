/* testing/genetic · behaviour for the genetic testing page.

   Five blocks, each guarding on its own elements, all writing in one rAF pass:
     · the hero copy, plate and figures settle in once the card is reached,
       and the laboratory slides in the plate turn every few seconds,
     · the nine readings light the item in the middle of the window, hold that
       item's picture on the right, and fill the rail beside it,
     · each row of "where earlier insight helps" fills from the left as it
       crosses the window, and the second key lights once the first row is full,
     · the walled garden is held still behind a clipped window while the
       page scrolls over it, darkening as it fills the screen,
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

  /* ---- the hero laboratory · three slides turning on their own -----------
     The live dot fills over one slide's time (dna.css, --slide-ms) and its
     animationend turns the slide, so the progress bar and the picture share
     one clock, and a hidden tab, whose animations are held, holds both.
     Still on the first slide for a reader who asked for less motion. */
  (function slides() {
    var box = $('[data-dna-slides]', root);
    if (!box) return;
    var imgs = $$('img', box), dots = $$('.dna-slide-dots i', box);
    if (imgs.length < 2 || calm.matches || dots.length !== imgs.length) return;
    var cur = 0;
    function show(n) {
      cur = (n + imgs.length) % imgs.length;
      imgs.forEach(function (im, j) { im.classList.toggle('on', j === cur); });
      /* segments before the live one stay full, the live one refills */
      dots.forEach(function (d, j) {
        d.classList.remove('on');
        d.classList.toggle('is-done', j < cur);
        if (j === cur) { void d.offsetWidth; d.classList.add('on'); }
      });
    }
    dots.forEach(function (d) {
      d.addEventListener('animationend', function () { show(cur + 1); });
    });
  })();

  /* ---- the walled garden · websitelab's off grid window ------------------
     0 as the window's top meets the foot of the screen, 1 as it fills it.
     The tint opens a third of the way in and stops at .8; the lede waits
     until the window is nearly full. */
  (function band() {
    var sec = $('[data-dna-band]', root);
    if (!sec) return;
    function span(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
    if (calm.matches) {
      sec.style.setProperty('--tint', '.6');
      sec.style.setProperty('--tint-copy', '1');
      return;
    }
    writers.push(function () {
      var r = sec.getBoundingClientRect();
      var p = clamp((innerHeight - r.top) / innerHeight, 0, 1);
      sec.style.setProperty('--tint', (0.8 * span(p, 0.35, 1)).toFixed(3));
      sec.style.setProperty('--tint-copy', span(p, 0.7, 1).toFixed(3));
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
