/* devices/ring-lab · behaviour for the showcase, sections 38 to 50.

   Mirrors what samsung.com/us/rings/galaxy-ring does, rebuilt here:
     · a sticky rail of section names that lights the one you are inside and
       scrolls to it smoothly when pressed,
     · statements that settle in as they reach the screen, with a stagger,
     · a pinned sensor plate the ring grows inside while its names arrive,
     · numbers that count once, when their section is reached,
     · sideways card tracks paged by a round arrow at each shoulder, with the
       arrows disabling themselves at either end,
     · three charger states behind three tabs,
     · a colourway picker that crossfades two panels and renames itself,
     · one slide at a time with dots.

   Loaded after lab.js and gen.js. Every block guards on its own elements, so
   any one of them can be removed from the markup without breaking the rest.
   Nothing here hides anything: the stylesheet hides only under `.lab-js`, and
   what this file does is let it come back. */
(function () {
  'use strict';

  var doc = document;
  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  var root = $('[data-sam]');
  if (!root) return;

  /* One rAF for every scroll writer on this block, the same arrangement gen.js
     uses. Readers run inside the frame, so a section that measures does not
     force a layout per listener. */
  var writers = [];
  var queued = false;
  function sync() { queued = false; for (var i = 0; i < writers.length; i++) writers[i](); }
  function request() { if (!queued) { queued = true; requestAnimationFrame(sync); } }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });

  /* ---- reveals ------------------------------------------------------------ */
  (function reveal() {
    var els = $$('.sam-up', root);
    if (!('IntersectionObserver' in window) || calm.matches) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- 38 · the section rail ----------------------------------------------
     Longest match wins, read off the sections the rail actually names, so a
     section added to the markup without a rail entry changes nothing. */
  (function rail() {
    var bar = $('[data-sam-rail]', root);
    if (!bar) return;
    var links = $$('a[href^="#"]', bar);
    var pairs = links.map(function (a) {
      return { a: a, sec: doc.getElementById(a.getAttribute('href').slice(1)) };
    }).filter(function (p) { return p.sec; });
    if (!pairs.length) return;

    links.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var sec = doc.getElementById(a.getAttribute('href').slice(1));
        if (!sec) return;
        ev.preventDefault();
        /* The rail is sticky under the product bar, so the landing point is the
           section's top less both of them, or the heading lands underneath. */
        var off = bar.getBoundingClientRect().height + 56;
        var y = sec.getBoundingClientRect().top + scrollY - off;
        scrollTo({ top: y, behavior: calm.matches ? 'auto' : 'smooth' });
      });
    });

    writers.push(function () {
      var line = bar.getBoundingClientRect().bottom + 4;
      var best = null;
      for (var i = 0; i < pairs.length; i++) {
        if (pairs[i].sec.getBoundingClientRect().top <= line) best = pairs[i];
      }
      pairs.forEach(function (p) { p.a.classList.toggle('on', p === best); });
    });
    request();
  })();

  /* ---- 39 · the pinned sensor plate ---------------------------------------
     `--sp` runs 0 to 1 across the track's travel and the stylesheet does the
     rest: the ring grows, the opening words leave, the names and the footnote
     arrive. Read and written in the same frame. */
  (function sensors() {
    var track = $('[data-sam-sensors]', root);
    if (!track) return;
    var pin = $('.sam-sensors-pin', track);
    if (!pin) return;
    if (calm.matches) { pin.style.setProperty('--sp', 1); pin.classList.add('is-lit'); return; }

    writers.push(function () {
      var r = track.getBoundingClientRect();
      var travel = r.height - innerHeight;
      var p = travel > 0 ? clamp(-r.top / travel, 0, 1) : 0;
      pin.style.setProperty('--sp', p.toFixed(4));
      pin.classList.toggle('is-lit', p > 0.42);
    });
    request();
  })();

  /* ---- 42, 44, 48 · numbers that count once -------------------------------
     `data-count` holds the number to land on. The element's own text is the
     answer with the script off, so nothing here is load bearing. */
  (function counters() {
    var els = $$('[data-count]', root);
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || calm.matches) return;

    function run(el) {
      var to = parseFloat(el.getAttribute('data-count'));
      var dp = (el.getAttribute('data-count').split('.')[1] || '').length;
      var t0 = performance.now(), ms = 1300;
      (function step(t) {
        var p = clamp((t - t0) / ms, 0, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = (to * e).toFixed(dp);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    els.forEach(function (e) { e.textContent = '0'; io.observe(e); });
  })();

  /* ---- 41, 43, 49 · card tracks paged by the shoulder arrows --------------
     One page is the visible width less a card's gap, so a press always lands
     on a card edge rather than mid card. The arrows disable at the ends, which
     is the reference's own behaviour and the only state they carry. */
  $$('[data-sam-car]', root).forEach(function (car) {
    var track = $('.sam-track', car);
    var prev = $('[data-sam-prev]', car);
    var next = $('[data-sam-next]', car);
    if (!track) return;

    function page() {
      var first = track.firstElementChild;
      if (!first) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
      var step = first.getBoundingClientRect().width + gap;
      return Math.max(step, Math.floor(track.clientWidth / step) * step);
    }
    function paint() {
      var end = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= end;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -page(), behavior: calm.matches ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: page(), behavior: calm.matches ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', paint, { passive: true });
    addEventListener('resize', paint, { passive: true });
    paint();
  });

  /* ---- 45 · the charger, three states ------------------------------------- */
  (function charger() {
    var sec = $('[data-sam-case]', root);
    if (!sec) return;
    var tabs = $$('[data-case-state]', sec);
    var led = $('.sam-case-led', sec);
    var img = $('.sam-case-stage img', sec);
    if (!tabs.length) return;

    function pick(i) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.classList.toggle('on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) {
          if (led) led.style.setProperty('--led', t.getAttribute('data-led') || '#7fb2ff');
          if (img) img.style.transform = 'scale(' + (t.getAttribute('data-zoom') || '1') + ')';
        }
      });
    }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { pick(i); }); });
    pick(0);
  })();

  /* ---- 47 · the colourway picker ------------------------------------------
     Both panels hold every photograph, stacked, and the swatch crossfades the
     pair. Stacking rather than swapping a `src` is what makes the change a
     dissolve instead of a flash of empty frame on a cold cache. */
  (function colour() {
    var sec = $('[data-sam-colour]', root);
    if (!sec) return;
    var sws = $$('[data-sam-sw]', sec);
    var shots = $$('.sam-panel img', sec);
    var name = $('[data-sam-cname]', sec);
    var mat = $('[data-sam-cmat]', sec);
    if (!sws.length) return;

    function pick(id) {
      sws.forEach(function (s) {
        var on = s.getAttribute('data-sam-sw') === id;
        s.classList.toggle('on', on);
        s.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) {
          if (name) name.textContent = s.getAttribute('data-name') || '';
          if (mat) mat.textContent = s.getAttribute('data-mat') || '';
        }
      });
      shots.forEach(function (im) { im.classList.toggle('on', im.getAttribute('data-for') === id); });
    }
    sws.forEach(function (s) {
      s.addEventListener('click', function () { pick(s.getAttribute('data-sam-sw')); });
    });
    pick(sws[0].getAttribute('data-sam-sw'));
  })();

  /* ---- 49 · one slide at a time, with dots -------------------------------- */
  $$('[data-sam-slides]', root).forEach(function (box) {
    var track = $('.sam-track', box);
    var dots = $('[data-sam-dots]', box);
    if (!track || !dots) return;
    var slides = $$('.sam-slide', track);
    if (slides.length < 2) return;

    slides.forEach(function (_, i) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Slide ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () {
        track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: calm.matches ? 'auto' : 'smooth' });
      });
      dots.appendChild(b);
    });
    var buttons = $$('button', dots);
    function paint() {
      var i = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      buttons.forEach(function (b, j) { b.classList.toggle('on', j === clamp(i, 0, buttons.length - 1)); });
    }
    track.addEventListener('scroll', paint, { passive: true });
    paint();
  });
})();
