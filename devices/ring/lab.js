/* devices/ring-lab · page behaviour
   Loaded after shared.js, so the nav, the footer and `.ph-bar` exist.
   One scroll reader publishes numbers as custom properties; CSS does the rest.
   Every block guards on its own elements. */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var root = doc.documentElement;
  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function span(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function vh() { return innerHeight || 1; }

  /* progress of a pinned track: 0 as it pins, 1 as it lets go */
  function pinned(el) {
    var r = el.getBoundingClientRect();
    var run = el.offsetHeight - vh();
    return run > 0 ? clamp(-r.top / run, 0, 1) : 0;
  }
  /* progress of an element crossing the screen: 0 top at bottom edge, 1 bottom at top edge */
  function crossing(el) {
    var r = el.getBoundingClientRect();
    return clamp((vh() - r.top) / (vh() + r.height), 0, 1);
  }

  var writers = [];
  function sync() { queued = false; for (var i = 0; i < writers.length; i++) writers[i](); }
  var queued = false;
  function request() { if (!queued) { queued = true; requestAnimationFrame(sync); } }

  /* ---- 0 · the bar: devices/ring's glass, then the product bar ----------- */
  (function bar() {
    var hero = $('[data-lab-hero]');
    if (!hero) return;
    var navH = parseFloat(getComputedStyle(root).getPropertyValue('--ph-nav-h')) || 44;
    /* The hero ground behind the bar, measured off the photograph's top strip
       (180, 183, 195): light, so the ink stays dark. devices/ring samples its
       film per frame because the film changes; this picture does not. */
    body.style.setProperty('--nav-tint', '180 183 195');
    body.style.setProperty('--nav-tint-alpha', '.62');
    body.style.setProperty('--nav-ink', 'var(--ph-text-1)');
    var name = $('.ph-bar-name');
    if (name) name.textContent = 'PhenomeTech Ring';
    /* `.is-past-hero` was written here too, from this page's own measurement of
       the hero. shared.js now sets it from the observer that also decides when
       the bar is `.on`, which is the one that cannot disagree with itself — so
       this writer keeps only the value that IS this page's, the hero progress
       the film and the tint are driven from. navH is still read above because
       the tint sampling wants it. */
    writers.push(function () {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--hero-p', clamp(-r.top / r.height, 0, 1).toFixed(4));
    });
  })();

  /* ---- reveals ------------------------------------------------------------ */
  (function reveal() {
    var els = $$('.lab-textblock, .lab-in, .lab-featlist');
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
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- 1 · battery dial --------------------------------------------------- */
  (function battery() {
    var sec = $('[data-battery]');
    if (!sec) return;
    var count = $('[data-count]', sec);
    var last = -1;
    writers.push(function () {
      var p = pinned(sec);
      /* phase one: the week of battery counts up and the arc closes */
      var a = span(p, 0.02, 0.42);
      /* hand over: photograph and glass leave, the unit changes */
      var h = span(p, 0.44, 0.58);
      /* phase two: 7 climbs to 100 metres, the inner arc draws */
      var b = span(p, 0.56, 0.92);
      var n = b > 0 ? Math.round(7 + (100 - 7) * b) : Math.max(1, Math.round(7 * a));
      if (n !== last) { count.textContent = n; last = n; }
      sec.style.setProperty('--arc', (0.08 + 0.92 * a).toFixed(4));
      sec.style.setProperty('--arc2', b.toFixed(4));
      sec.style.setProperty('--bg-o', (0.45 * (1 - h)).toFixed(3));
      sec.style.setProperty('--bg-o-g', (1 - h).toFixed(3));
      sec.style.setProperty('--u-a', (1 - span(h, 0, 0.5)).toFixed(3));
      sec.style.setProperty('--u-b', span(h, 0.5, 1).toFixed(3));
      var moving = (a > 0 && a < 1) || (b > 0 && b < 1);
      sec.style.setProperty('--c-blur', moving ? '0.6px' : '0px');
    });
  })();

  /* ---- 2 and 4 · frame sequences ------------------------------------------ */
  function sequence(canvas, progress) {
    var total = +canvas.getAttribute('data-frames');
    var tpl = canvas.getAttribute('data-src');
    var reverse = canvas.hasAttribute('data-reverse');
    var ctx = canvas.getContext('2d');
    var frames = new Array(total);
    var shown = -1, want = 0, started = false;

    function url(i) { return tpl.replace('{n}', String(i + 1).padStart(3, '0')); }
    function load(i) {
      if (frames[i]) return frames[i];
      var im = new Image();
      im.decoding = 'async';
      im.onload = function () { if (i === want) draw(i); };
      im.src = url(i);
      frames[i] = im;
      return im;
    }
    function draw(i) {
      var im = frames[i];
      if (!im || !im.complete || !im.naturalWidth) {
        /* hold the nearest frame that is ready rather than flashing black */
        for (var d = 1; d < total; d++) {
          var k = i - d; if (k >= 0 && frames[k] && frames[k].complete && frames[k].naturalWidth) { i = k; im = frames[k]; break; }
        }
        if (!im || !im.naturalWidth) return;
      }
      if (i === shown) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
      shown = i;
    }
    function warm() {
      if (started) return;
      started = true;
      load(0); load(total - 1);
      /* then the rest, a few at a time, so the first frames arrive first */
      var i = 0;
      (function next() {
        for (var c = 0; c < 6 && i < total; c++, i++) load(i);
        if (i < total) setTimeout(next, 60);
      })();
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { if (es[0].isIntersecting) warm(); }, { rootMargin: '150% 0px' }).observe(canvas);
    } else warm();

    writers.push(function () {
      if (!started) return;
      var p = progress();
      var f = Math.round(p * (total - 1));
      want = reverse ? total - 1 - f : f;
      load(want);
      draw(want);
    });
  }
  (function seqs() {
    var caseSec = $('[data-case]');
    var caseCanvas = caseSec && $('canvas[data-seq]', caseSec);
    if (caseCanvas) {
      var track = $('.lab-seq-track', caseSec);
      sequence(caseCanvas, function () { return span(pinned(track), 0.04, 0.9); });
    }
    var snap = $('[data-snap]');
    var snapCanvas = snap && $('canvas[data-seq]', snap);
    if (snapCanvas) {
      sequence(snapCanvas, function () { return span(crossing(snapCanvas), 0.2, 0.72); });
    }
  })();

  /* ---- 7 · off the grid tint ---------------------------------------------- */
  (function offgrid() {
    var sec = $('[data-offgrid]');
    if (!sec) return;
    writers.push(function () {
      var r = sec.getBoundingClientRect();
      /* 0 as the window's top meets the bottom of the screen, 1 as it fills it */
      var p = clamp((vh() - r.top) / vh(), 0, 1);
      sec.style.setProperty('--tint', (0.8 * span(p, 0.35, 1)).toFixed(3));
      sec.style.setProperty('--tint-copy', span(p, 0.7, 1).toFixed(3));
    });
  })();

  /* ---- 8, 9, 13 · crossing numbers ---------------------------------------- */
  (function crosses() {
    var eng = $('.lab-eng');
    if (eng) writers.push(function () { eng.style.setProperty('--eng-p', crossing(eng).toFixed(4)); });
    var film = $('.lab-film');
    if (film) writers.push(function () { film.style.setProperty('--film-p', span(crossing(film), 0, 0.5).toFixed(4)); });
    var close = $('[data-close]');
    if (close) writers.push(function () { close.style.setProperty('--cl-p', span(crossing(close), 0.1, 0.55).toFixed(4)); });
  })();

  /* ---- 5 · carousel ------------------------------------------------------- */
  (function carousel() {
    var car = $('[data-carousel]');
    if (!car) return;
    var view = $('[data-car-view]', car), track = $('[data-car-track]', car);
    var cards = $$('.lab-card', track);
    var prev = $('[data-car-prev]', car), next = $('[data-car-next]', car), dotsBox = $('[data-car-dots]', car);
    var idx = 0, dots = [];

    function step() { var c = cards[0].getBoundingClientRect().width; return c + parseFloat(getComputedStyle(track).columnGap || 18); }
    function maxIdx() {
      var pad = parseFloat(getComputedStyle(view).paddingLeft) || 0;
      var visible = (view.clientWidth - pad * 2 + 18) / step();
      return Math.max(0, Math.ceil(cards.length - visible - 0.02));
    }
    function paintDots() {
      var m = maxIdx();
      if (dots.length !== m + 1) {
        dotsBox.innerHTML = '';
        dots = [];
        for (var i = 0; i <= m; i++) dots.push(dotsBox.appendChild(doc.createElement('i')));
      }
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    }
    function go(i) {
      idx = clamp(i, 0, maxIdx());
      track.style.setProperty('--car-x', (-idx * step()) + 'px');
      prev.disabled = idx === 0;
      next.disabled = idx === maxIdx();
      paintDots();
    }
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });

    var x0 = null, base = 0;
    view.addEventListener('pointerdown', function (e) {
      x0 = e.clientX; base = -idx * step();
      view.classList.add('is-drag');
      view.setPointerCapture(e.pointerId);
    });
    view.addEventListener('pointermove', function (e) {
      if (x0 === null) return;
      track.style.setProperty('--car-x', (base + (e.clientX - x0)) + 'px');
    });
    function end(e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      view.classList.remove('is-drag');
      go(idx + (Math.abs(dx) > 50 ? (dx < 0 ? 1 : -1) * Math.max(1, Math.round(Math.abs(dx) / step())) : 0));
    }
    view.addEventListener('pointerup', end);
    view.addEventListener('pointercancel', end);
    addEventListener('resize', function () { go(idx); });
    go(0);

    /* the chat card types its question, waits, clears, and types again */
    var typer = $('[data-type]', car);
    if (typer && !calm.matches) {
      var text = typer.getAttribute('data-type'), n = 0, dir = 1;
      (function tick() {
        n += dir;
        typer.textContent = text.slice(0, n);
        var wait = 55;
        if (n >= text.length) { dir = -1; wait = 2200; }
        else if (n <= 0) { dir = 1; wait = 700; }
        else if (dir < 0) wait = 18;
        setTimeout(tick, wait);
      })();
    } else if (typer) typer.textContent = typer.getAttribute('data-type');
  })();

  /* ---- 10 · app tabs ------------------------------------------------------ */
  (function app() {
    var sec = $('[data-app]');
    if (!sec) return;
    var tabs = $$('.lab-tab', sec), scrs = $$('.app-scr', sec), hl = $('.lab-tab-hl', sec), bar = $('.lab-tabs', sec);
    var cur = 0, timer = 0, visible = false;
    function place() {
      var t = tabs[cur], b = bar.getBoundingClientRect(), r = t.getBoundingClientRect();
      hl.style.setProperty('--hl-x', (r.left - b.left) + 'px');
      hl.style.setProperty('--hl-w', r.width + 'px');
    }
    function show(i, user) {
      cur = i;
      tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      scrs.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      place();
      clearTimeout(timer);
      if (!calm.matches && visible && !user) timer = setTimeout(function () { show((cur + 1) % tabs.length); }, 4500);
      if (user) timer = setTimeout(function () { show((cur + 1) % tabs.length); }, 9000);
    }
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { show(k, true); }); });
    addEventListener('resize', place);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(place);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) show(cur); else clearTimeout(timer);
      }, { threshold: 0.35 }).observe(sec);
    }
    show(0);
  })();

  /* ---- 12 · marquee ------------------------------------------------------- */
  (function marquee() {
    var row = $('.lab-mq-row');
    if (!row) return;
    $$('li', row).forEach(function (li) { row.appendChild(li.cloneNode(true)); });
    function speed() { row.style.setProperty('--mq-s', Math.max(40, row.scrollWidth / 2 / 55) + 's'); }
    speed();
    addEventListener('resize', speed);
  })();

  /* ---- film modal --------------------------------------------------------- */
  (function modal() {
    var dlg = $('[data-film-modal]');
    if (!dlg || !dlg.showModal) return;
    var v = $('[data-film]', dlg);
    $$('[data-film-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        dlg.showModal();
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      });
    });
    function shut() { v.pause(); if (dlg.open) dlg.close(); }
    $('[data-film-close]', dlg).addEventListener('click', shut);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) shut(); });
    dlg.addEventListener('close', function () { v.pause(); });
  })();

  /* the background loop rests when it is off screen */
  (function loops() {
    var vids = $$('.lab-film-bg, .lab-card-media video');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !calm.matches) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.1 });
    vids.forEach(function (v) { io.observe(v); });
  })();

  sync();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(request);
})();
