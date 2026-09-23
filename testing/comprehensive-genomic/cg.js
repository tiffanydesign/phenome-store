/* testing/comprehensive-genomic · page script
   Loaded after shared.js, which has already built the nav, the footer and the
   `.ph-bar` synchronously, so everything here enhances rather than races.
   Every part guards on its own elements and the page reads fine without it.

   The gallery, the viewer, the growing card, the ring, the navy field and the
   review list are supplements/nad's, section for
   section: same geometry, same timings, this page's names and content. */
(function () {
  'use strict';

  var doc = document;
  var still = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || doc).querySelectorAll(s)); }

  /* Scroll work is batched into one rAF per frame for the whole page. */
  var jobs = [];
  var queued = false;
  function onFrame(fn) { jobs.push(fn); }
  function tick() {
    queued = false;
    for (var i = 0; i < jobs.length; i++) jobs[i]();
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(tick); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);

  function onceInView(el, cls, margin) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { el.classList.add(cls); return; }
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      el.classList.add(cls);
      io.disconnect();
    }, { rootMargin: margin || '0px 0px -15% 0px' });
    io.observe(el);
  }

  /* ---- 1 · the hero frame ------------------------------------------------
     Slides stack in one cell and each is translated by its shortest wrapped
     offset from the current one; only the outgoing and incoming slide animate.
     A countdown with a remainder drives it, paused by the hold button, a
     hidden tab, the viewer or the frame leaving the screen, and the current
     dot's CSS fill runs on the same --dwell. Autoplay is on by default,
     whatever the OS motion setting, as it is on the NAD page. */
  var DWELL = 5000;
  function gallery() {
    var main = $('[data-gal-main]');
    if (!main) return null;
    var track = $('[data-gal-track]', main);
    var slides = $$('[data-slide]', main);
    var navBox = $('[data-gal-nav]', main);
    var n = slides.length, cur = 0;
    main.setAttribute('data-live', '');
    if (track) track.scrollLeft = 0;

    var dots = [];
    var CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (navBox && n > 1) {
      navBox.innerHTML =
        '<button class="cg-gal-arrow" type="button" data-gal-prev aria-label="Previous slide">' + CHEV + '</button>' +
        '<div class="cg-gal-dots"></div>' +
        '<button class="cg-gal-arrow" type="button" data-gal-next aria-label="Next slide">' + CHEV.replace('M15 5l-7 7 7 7', 'M9 5l7 7-7 7') + '</button>';
      var box = $('.cg-gal-dots', navBox);
      for (var d = 0; d < n; d++) {
        var btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = 'cg-gal-dot';
        btn.setAttribute('aria-label', 'Show slide ' + (d + 1) + ' of ' + n);
        btn.innerHTML = '<i></i>';
        box.appendChild(btn);
        dots.push(btn);
      }
      navBox.hidden = false;
    }

    function offsetOf(i, c) {
      var o = ((i - c) % n + n) % n;
      return o > n / 2 ? o - n : o;
    }
    function place(prev, dir) {
      if (track && track.scrollLeft) track.scrollLeft = 0;
      slides.forEach(function (sl, i) {
        var o = offsetOf(i, cur);
        if (i === cur) o = 0;
        else if (i === prev && dir) o = -dir;
        if (i === cur || i === prev) sl.removeAttribute('data-snap');
        else sl.setAttribute('data-snap', '');
        sl.style.setProperty('--o', o);
        sl.setAttribute('aria-hidden', i === cur ? 'false' : 'true');
      });
      dots.forEach(function (dt, k) { dt.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
    }

    var held = false, hover = false, offscreen = false;
    var timer = null, started = 0, remaining = DWELL;
    function paused() { return held || hover || offscreen || doc.hidden; }
    function stopTimer() {
      if (!timer) return;
      clearTimeout(timer); timer = null;
      remaining = Math.max(0, remaining - (Date.now() - started));
    }
    function startTimer() {
      if (timer || paused() || n < 2) return;
      started = Date.now();
      timer = setTimeout(function () { timer = null; go(cur + 1, 1); }, remaining);
    }
    function sync() {
      if (paused()) stopTimer(); else startTimer();
      main.toggleAttribute('data-held', held);
      main.toggleAttribute('data-hover', hover || offscreen);
    }
    function restartDwell() {
      if (timer) { clearTimeout(timer); timer = null; }
      remaining = DWELL;
      main.style.setProperty('--dwell', DWELL + 'ms');
      var dot = dots[cur];
      if (dot) { dot.setAttribute('aria-current', 'false'); void dot.offsetWidth; dot.setAttribute('aria-current', 'true'); }
      sync();
    }
    function go(i, dir) {
      var next = ((i % n) + n) % n;
      if (next === cur) { restartDwell(); return; }
      var prev = cur;
      if (!dir) dir = offsetOf(next, prev) > 0 ? 1 : -1;
      slides[next].setAttribute('data-snap', '');
      slides[next].style.setProperty('--o', dir);
      void slides[next].offsetWidth;
      cur = next;
      place(prev, dir);
      restartDwell();
    }

    var hold = $('[data-gal-hold]', main);
    function paintHold() {
      if (!hold) return;
      hold.toggleAttribute('data-paused', held);
      hold.setAttribute('aria-label', held ? 'Play the slideshow' : 'Pause the slideshow');
    }
    if (hold) hold.addEventListener('click', function () { held = !held; paintHold(); sync(); });

    main.addEventListener('click', function (e) {
      if (e.target.closest('[data-gal-prev]')) go(cur - 1, -1);
      else if (e.target.closest('[data-gal-next]')) go(cur + 1, 1);
      else {
        var k = dots.indexOf(e.target.closest('.cg-gal-dot'));
        if (k > -1) go(k);
      }
    });
    main.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1, -1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1, 1); }
    });
    var sx = 0, sy = 0, tracking = false;
    main.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' || e.target.closest('button')) return;
      tracking = true; sx = e.clientX; sy = e.clientY;
    });
    main.addEventListener('pointerup', function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    main.addEventListener('pointercancel', function () { tracking = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { offscreen = !es[0].isIntersecting; sync(); }, { threshold: 0.25 }).observe(main);
    }
    doc.addEventListener('visibilitychange', sync);

    place(-1, 0);
    paintHold();
    restartDwell();
    return { slides: slides, current: function () { return cur; }, hold: function (on) { hover = on; sync(); } };
  }

  /* ---- 1b · the viewer, opening on whichever slide is showing ------------ */
  function viewer(gal) {
    var lb = $('[data-lb]');
    if (!lb || !gal || typeof lb.showModal !== 'function') return;
    var tiles = gal.slides;
    var stage = $('[data-lb-stage]', lb);
    var count = $('[data-lb-count]', lb);
    var cur = 0;
    var opener = null;

    function paint() {
      var t = tiles[cur];
      stage.innerHTML = '';
      var img = $('img', t);
      if (img) {
        var big = doc.createElement('img');
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        stage.appendChild(big);
      } else {
        stage.appendChild($('[data-facts]', t).cloneNode(true));
      }
      count.textContent = (cur + 1) + ' / ' + tiles.length;
    }
    function open(i, from) {
      cur = i; opener = from || null; paint();
      gal.hold(true);
      lb.showModal();
    }
    function step(d) { cur = (cur + d + tiles.length) % tiles.length; paint(); }

    var zoom = $('[data-gal-zoom]');
    if (zoom) zoom.addEventListener('click', function () { open(gal.current(), zoom); });
    $$('[data-open-facts]').forEach(function (b) {
      b.addEventListener('click', function () { open(tiles.length - 1, b); });
    });
    lb.addEventListener('click', function (e) {
      var s = e.target.closest('[data-lb-step]');
      if (s) { step(+s.getAttribute('data-lb-step')); return; }
      if (e.target.closest('[data-lb-close]') || e.target === lb || e.target === stage) lb.close();
    });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
    lb.addEventListener('close', function () { gal.hold(false); if (opener) opener.focus(); });

    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* ---- the product bar's thumbnail and its meta line --------------------- */
  function dock() {
    var bar = $('.ph-bar');
    if (!bar) return;
    var inner = $('.ph-bar-inner', bar);
    var name = $('.ph-bar-name', bar);
    if (!inner || !name) return;
    var thumb = doc.createElement('img');
    thumb.className = 'ph-bar-thumb';
    thumb.alt = '';
    thumb.width = 32; thumb.height = 32;
    thumb.src = '/phenome-store/assets/shop/test-genomic.webp';
    var txt = doc.createElement('span');
    txt.className = 'ph-bar-txt';
    var meta = doc.createElement('span');
    meta.className = 'ph-bar-meta';
    meta.textContent = '£650, results in 2 to 3 weeks';
    inner.insertBefore(thumb, name);
    inner.insertBefore(txt, name);
    txt.appendChild(name);
    txt.appendChild(meta);
  }

  /* ---- 2 · the card's photograph drifts against the scroll --------------- */
  function drift() {
    var bg = $('[data-drift]');
    if (!bg || still.matches) return;
    var box = bg.parentNode;
    onFrame(function () {
      var r = box.getBoundingClientRect();
      var vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var p = (vh - r.top) / (vh + r.height); /* 0 entering, 1 leaving */
      bg.style.translate = '0 ' + ((p - 0.5) * -7).toFixed(2) + '%';
    });
  }

  /* ---- 2 · and grows to fill the screen ----------------------------------
     Progress runs 0 to 1 while the track's top climbs from 80% of the way
     down the window to its top, so the card is seen inset before it grows;
     from there the stage is pinned and the frame stays full. The scale is a
     smoothstep, and the corner is divided by the scale so the corner you see
     closes at the same pace as the frame opens. */
  function essGrow() {
    var sec = $('[data-ess]');
    if (!sec) return;
    var track = $('.cg-ess-track', sec);
    var hero = $('.cg-ess-hero', sec);
    if (!track || !hero) return;
    var narrow = window.matchMedia ? window.matchMedia('(max-width: 760px)') : { matches: false };
    var S0 = 0.86, R = 28;
    var last = -1;
    onFrame(function () {
      if (narrow.matches) {
        if (last !== -2) { hero.style.removeProperty('--ess-s'); hero.style.removeProperty('--ess-rad'); last = -2; }
        return;
      }
      var vh = window.innerHeight;
      var r = track.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 1.5) return;
      var run = vh * 0.8;
      var p = still.matches ? 1 : (run - r.top) / run;
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      var e = p * p * (3 - 2 * p);
      if (Math.abs(e - last) < 0.0005) return;
      last = e;
      var s = S0 + (1 - S0) * e;
      hero.style.setProperty('--ess-s', s.toFixed(4));
      hero.style.setProperty('--ess-rad', (R * (1 - e) / s).toFixed(2) + 'px');
    });
  }

  /* ---- 3 · the ring of nine areas ----------------------------------------
     The circles open out once the ring is in view. Pointing at one, tabbing
     to it or tapping it puts its name and what it covers at the centre;
     leaving the ring puts the resting line back. */
  function ring() {
    var box = $('[data-ring]');
    if (!box) return;
    var core = $('.cg-ring-core', box);
    var k = $('[data-ring-k]', box);
    var d = $('[data-ring-d]', box);
    if (!core || !k || !d) return;
    var base = { k: k.textContent, d: d.textContent };
    var shown = base, timer = null;
    var btns = $$('.cg-ring-list button', box);

    if ('IntersectionObserver' in window && !still.matches) {
      box.setAttribute('data-armed', '');
      onceInView(box, 'is-in', '0px 0px -20% 0px');
    }

    function show(next, btn) {
      btns.forEach(function (b) { b.setAttribute('aria-current', b === btn ? 'true' : 'false'); });
      if (next === shown) return;
      shown = next;
      clearTimeout(timer);
      core.classList.add('is-swap');
      timer = setTimeout(function () {
        k.textContent = next.k;
        d.textContent = next.d;
        core.classList.remove('is-swap');
      }, still.matches ? 0 : 160);
    }
    btns.forEach(function (b) {
      var item = { k: b.getAttribute('data-name'), d: b.getAttribute('data-d') };
      b.addEventListener('pointerenter', function () { show(item, b); });
      b.addEventListener('focus', function () { show(item, b); });
      b.addEventListener('click', function () { show(item, b); });
    });
    box.addEventListener('pointerleave', function () { show(base, null); });
    box.addEventListener('focusout', function (e) { if (!box.contains(e.relatedTarget)) show(base, null); });
  }

  /* ---- 6 · the navy field ------------------------------------------------
     Three rows of eight tiles from the shots listed on the section, each row
     starting two shots on, and every row sliding 60% sideways across the
     section's pass through the window, neighbours in opposite directions. */
  function stdField() {
    var sec = $('[data-std]');
    if (!sec) return;
    var field = $('.cg-std-field', sec);
    var shots = (sec.getAttribute('data-std') || '').split(',');
    if (!field || !shots[0]) return;
    var ROWS = 3, PER_ROW = 8, TRAVEL = 60, rows = [];
    for (var r = 0; r < ROWS; r++) {
      var row = doc.createElement('div');
      row.className = 'cg-std-row';
      for (var t = 0; t < PER_ROW; t++) {
        var tile = doc.createElement('span');
        tile.className = 'cg-std-tile';
        tile.style.backgroundImage = 'url("' + shots[(t + r * 2) % shots.length] + '")';
        row.appendChild(tile);
      }
      field.appendChild(row);
      rows.push(row);
    }
    if (still.matches) return;
    onFrame(function () {
      var box = sec.getBoundingClientRect();
      var vh = window.innerHeight;
      if (box.bottom < -200 || box.top > vh + 200) return;
      var p = (vh - box.top) / (vh + box.height);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      for (var i = 0; i < rows.length; i++) {
        var x = i % 2 === 0 ? -TRAVEL * (1 - p) : -TRAVEL * p;
        rows[i].style.transform = 'translate3d(' + x.toFixed(3) + '%, 0, 0)';
      }
    });
  }

  viewer(gallery());
  dock();
  drift();
  essGrow();
  ring();
  stdField();
  request();
})();
