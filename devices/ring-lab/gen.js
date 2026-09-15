/* devices/ring-lab · behaviour for the long story, sections 16 to 37.
   Mirrors what ringconn.com/pages/ringconn-gen-2 does, rebuilt here:
     · films play when they reach the screen and their words arrive on the
       film's own clock, not on a timer,
     · one section pins its title, scales it up and drops the subtitle,
     · the battery and sensing stages are fixed screens driven by scroll,
     · rows page sideways with buttons or a drag,
     · the colourway picker crossfades a track of photographs.
   Loaded after lab.js; every block guards on its own elements. */
(function () {
  'use strict';

  var doc = document;
  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function span(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function vh() { return innerHeight || 1; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  var root = $('[data-gx]');
  if (!root) return;

  var writers = [];
  var queued = false;
  function sync() { queued = false; for (var i = 0; i < writers.length; i++) writers[i](); }
  function request() { if (!queued) { queued = true; requestAnimationFrame(sync); } }

  /* ---- reveals ------------------------------------------------------------ */
  (function reveal() {
    var els = $$('.gx-in, .gx-slide, .gx-bio', root);
    if (!('IntersectionObserver' in window) || calm.matches) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- 16, 24, 26 · films, and words on the film's clock ------------------ */
  $$('[data-gx-film]', root).forEach(function (sec) {
    var v = $('video', sec);
    var lines = $$('.gx-vt', sec);
    if (!v) return;

    function paint() {
      var t = v.currentTime;
      lines.forEach(function (l) { l.classList.toggle('show', t >= +l.getAttribute('data-at')); });
    }
    v.addEventListener('timeupdate', paint);
    /* a film that has played through shows its last state rather than resetting */
    v.addEventListener('ended', function () { lines.forEach(function (l) { l.classList.add('show'); }); });

    if (calm.matches) { lines.forEach(function (l) { l.classList.add('show'); }); return; }
    if (!('IntersectionObserver' in window)) { v.loop = true; v.play(); return; }

    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          if (v.ended || v.currentTime >= v.duration - 0.05) v.currentTime = 0;
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else v.pause();
      });
    }, { threshold: 0.35 }).observe(sec);
  });

  /* ---- 17 · the question grows and its subtitle goes ---------------------- */
  (function ask() {
    var sec = $('[data-gx-ask]', root);
    if (!sec) return;
    var head = $('.gx-ask-head', sec);
    var sub = $('.gx-ask-sub', sec);
    writers.push(function () {
      var top = sec.getBoundingClientRect().top;
      /* 0 as the section's top reaches the middle of the screen */
      var p = clamp((vh() * 0.5 - top) / (vh() * 0.5), 0, 1);
      head.style.setProperty('--ask-s', lerp(0.8, 1, p).toFixed(4));
      head.style.setProperty('--ask-o', p.toFixed(3));
      var q = clamp((vh() * 0.5 - top) / (vh() * 1.2), 0, 1);
      sub.style.setProperty('--sub-o', (1 - span(q, 0.42, 0.72)).toFixed(3));
    });
  })();

  /* ---- 18 · the night, its cards draw once it is on screen ---------------- */
  (function replay() {
    var box = $('[data-gx-replay]', root);
    if (!box) return;
    if (!('IntersectionObserver' in window) || calm.matches) { box.classList.add('is-play'); count(); return; }
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      box.classList.add('is-play');
      count();
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(box);

    function count() {
      var el = $('[data-to]', box);
      if (!el) return;
      var to = +el.getAttribute('data-to'), t0 = 0;
      requestAnimationFrame(function step(t) {
        if (!t0) t0 = t;
        var p = clamp((t - t0) / 1800, 0, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      });
    }
  })();

  /* ---- 22, 32, 35, 36 · rows that page sideways --------------------------- */
  $$('[data-gx-car]', root).forEach(function (car) {
    var view = $('.gx-car-view', car), track = $('.gx-car-track', car);
    var cards = $$('.gx-card', track);
    var prev = $('[data-car-prev]', car), next = $('[data-car-next]', car);
    var idx = 0;

    function step() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    }
    function maxIdx() {
      var pad = parseFloat(getComputedStyle(view).paddingLeft) || 0;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var visible = (view.clientWidth - pad + gap) / step();
      return Math.max(0, Math.ceil(cards.length - visible - 0.02));
    }
    function go(i) {
      idx = clamp(i, 0, maxIdx());
      track.style.setProperty('--car-x', (-idx * step()) + 'px');
      prev.disabled = idx === 0;
      next.disabled = idx === maxIdx();
    }
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });

    var x0 = null, base = 0;
    view.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
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
  });

  /* ---- 25 · colourways ---------------------------------------------------- */
  (function colours() {
    var sec = $('[data-gx-colours]', root);
    if (!sec) return;
    var track = $('.gx-cw-track', sec);
    var btns = $$('.gx-cw-b', sec);
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        track.style.setProperty('--cw', i);
        btns.forEach(function (o, k) { o.classList.toggle('on', k === i); o.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      });
    });
  })();

  /* ---- 28 · battery, a fixed screen inside a 300vh track ------------------ */
  (function battery() {
    var sec = $('[data-gx-battery]', root);
    if (!sec) return;
    var stage = $('.gx-bat-stage', sec);
    var factor = 8; /* vw the numbers travel, the reference's own number */
    writers.push(function () {
      var r = sec.getBoundingClientRect();
      var run = sec.offsetHeight - vh();
      var p = clamp(-r.top / (run || 1), 0, 1);

      /* before the track: the screen rises into place from below */
      if (r.top > 0) {
        var inT = clamp(1 - r.top / vh(), 0, 1);
        stage.style.setProperty('--bat-o', inT.toFixed(3));
        stage.style.setProperty('--bat-y', ((1 - inT) * 100).toFixed(2) + 'vh');
        stage.style.setProperty('--bat-v', inT > 0 ? 'visible' : 'hidden');
      } else if (r.bottom < vh()) {
        /* after it: the screen leaves upward as the next section arrives */
        var outT = clamp(1 - r.bottom / vh(), 0, 1);
        stage.style.setProperty('--bat-o', (1 - outT).toFixed(3));
        stage.style.setProperty('--bat-y', (-outT * 55).toFixed(2) + 'vh');
        stage.style.setProperty('--bat-v', outT < 1 ? 'visible' : 'hidden');
      } else {
        stage.style.setProperty('--bat-o', '1');
        stage.style.setProperty('--bat-y', '0vh');
        stage.style.setProperty('--bat-v', 'visible');
      }

      /* the handover: days rise out, minutes rise in, between .25 and .75 */
      var t = span(p, 0.25, 0.75);
      stage.style.setProperty('--a-o', (1 - t).toFixed(3));
      stage.style.setProperty('--a-y', (-factor * t).toFixed(2) + 'vw');
      stage.style.setProperty('--b-o', t.toFixed(3));
      stage.style.setProperty('--b-y', (factor * (1 - t)).toFixed(2) + 'vw');
    });
  })();

  /* ---- 30 · sensing, the ring scales up then fades ------------------------ */
  (function chip() {
    var sec = $('[data-gx-chip]', root);
    if (!sec) return;
    var img = $('.gx-chip-img', sec);
    var text = $('.gx-chip-text', sec);
    /* the reference's own three lengths, in screens: the ring starts 0.7
       screens after the section's top passes, grows over one screen, and
       fades over the third of a screen after that */
    writers.push(function () {
      var r = sec.getBoundingClientRect();
      var show = vh() * 0.7, grow = vh(), fade = vh() * 0.3;
      var d = show - r.top; /* how far past the trigger we are, in pixels */

      if (d < 0) {
        img.style.setProperty('--chip-o', '0');
        img.style.setProperty('--chip-s', '1');
      } else {
        var o = d < vh() * 0.1 ? d / (vh() * 0.1) : 1;
        if (d > grow) o = Math.min(o, 1 - clamp((d - grow) / fade, 0, 1));
        img.style.setProperty('--chip-o', o.toFixed(3));
        img.style.setProperty('--chip-s', (1 + clamp(d / grow, 0, 1) * 0.18).toFixed(4));
      }

      /* the copy arrives as it rises past the middle of the ring */
      var tr = text.getBoundingClientRect();
      var ir = img.getBoundingClientRect();
      var q = clamp(((ir.top + ir.height / 2) - tr.top - 80) / 220, 0, 1);
      text.style.setProperty('--t-o', span(q, 0.15, 0.5).toFixed(3));
      text.style.setProperty('--d-o', span(q, 0.4, 0.75).toFixed(3));
      text.style.setProperty('--n-o', span(q, 0.65, 1).toFixed(3));
    });
  })();

  sync();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(request);
})();
