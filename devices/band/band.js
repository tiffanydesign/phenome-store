/* devices/band · page behaviour.
   Loaded after shared.js, so the nav, the footer and `.ph-bar` already exist.
   Every function guards on its own elements and returns quietly without them. */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var still = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }
  function money(p) { return '£' + (p % 100 ? (p / 100).toFixed(2) : String(p / 100)); }

  /* ONE COLOUR, 2026-09-16 by request. The map stays a map rather than a
     constant: the control is still a radiogroup, the cart line still reads the
     name from here, and a second colour is one entry away. */
  var COLOURS = { black: { name: 'Black', hex: '#141414' } };
  var BASE_PRICE = 14900;
  var state = { colour: 'black', straps: [], extra: 0 };
  var subs = [];
  function publish() { subs.forEach(function (fn) { fn(state); }); }

  /* ---- 1 · gallery: slides move sideways, a glass pill of dots below ------ */
  function gallery() {
    var gal = $('[data-gal]');
    if (!gal) return;
    var slides = $$('[data-slide]', gal);
    var dots = $('[data-gal-dots]', gal);
    var MS = 5000, cur = 0, timer = 0;
    gal.style.setProperty('--gal-ms', MS + 'ms');

    var btns = slides.map(function (s, i) {
      var b = doc.createElement('button');
      b.type = 'button'; b.className = 'bd-gal-dot'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Photograph ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(i, true); });
      dots.appendChild(b);
      return b;
    });

    function paint() {
      slides.forEach(function (s, i) {
        var o = i - cur;
        s.style.setProperty('--x', (o * 100) + '%');
        s.setAttribute('aria-hidden', o === 0 ? 'false' : 'true');
      });
      btns.forEach(function (b, i) {
        b.classList.remove('on');
        b.setAttribute('aria-selected', i === cur ? 'true' : 'false');
      });
      /* restart the progress fill by re-adding the class on the next frame */
      requestAnimationFrame(function () { btns[cur].classList.add('on'); });
    }
    function go(i, user) {
      cur = (i + slides.length) % slides.length;
      paint();
      if (user) hold(false);
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (still.matches || gal.classList.contains('is-held')) return;
      timer = setTimeout(function () { go(cur + 1); }, MS);
    }
    function hold(on) { gal.classList.toggle('is-held', on); if (on) clearTimeout(timer); else schedule(); }

    $('[data-gal-prev]', gal).addEventListener('click', function () { go(cur - 1, true); });
    $('[data-gal-next]', gal).addEventListener('click', function () { go(cur + 1, true); });
    gal.addEventListener('mouseenter', function () { hold(true); });
    gal.addEventListener('mouseleave', function () { hold(false); });

    var x0 = null;
    gal.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    gal.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1), true);
    });

    /* choosing a colour brings the product plate back to the front */
    $$('.bd-sw').forEach(function (b) { b.addEventListener('click', function () { if (cur !== 0) go(0, true); }); });

    paint();
    schedule();
  }

  /* ---- 1 · decision column ------------------------------------------------ */
  function buyColumn() {
    var sws = $$('.bd-sw');
    if (!sws.length) return;
    sws.forEach(function (b) {
      b.addEventListener('click', function () {
        state.colour = b.getAttribute('data-colour');
        sws.forEach(function (o) { var on = o === b; o.classList.toggle('on', on); o.setAttribute('aria-checked', on ? 'true' : 'false'); });
        publish();
      });
      b.addEventListener('keydown', function (e) {
        var i = sws.indexOf(b), n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!n) return;
        e.preventDefault();
        var t = sws[(i + n + sws.length) % sws.length]; t.focus(); t.click();
      });
    });

    $$('.bd-strap input').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var on = $$('.bd-strap input:checked');
        state.straps = on.map(function (i) { return i.value; });
        state.extra = on.reduce(function (sum, i) { return sum + (+i.getAttribute('data-strap-price') || 0); }, 0);
        publish();
      });
    });

    subs.push(function (s) {
      var c = COLOURS[s.colour];
      var label = $('[data-colour-label]'); if (label) label.textContent = c.name;
      var total = money(BASE_PRICE + s.extra);
      $$('[data-price], [data-price-echo]').forEach(function (el) { el.textContent = total; });
      var v = $('[data-cart-variant]');
      if (v) {
        v.textContent = c.name +
          (s.straps.length ? ', spare ' + (s.straps.length === 1 ? 'strap' : 'straps') + ' in ' + s.straps.join(' and ') : '');
      }
    });

    var now = $('[data-buy-now]');
    if (now) {
      now.addEventListener('click', function () {
        var cart = window.PhenomeCart;
        if (!cart || !cart.addHere) return;
        cart.addHere();
        if (cart.markReturn) cart.markReturn();
        location.href = cart.base + '/store/checkout/';
      });
    }
  }

  /* ---- 0 · the product bar ------------------------------------------------
     The `.is-past-hero` swap that used to be re-derived here, with a
     MutationObserver watching shared.js's own class, is gone: shared.js sets it
     directly from the hero observer for every page that has a bar. What is left
     is the part that really is the Band's — the swatch dot and the meta line. */
  function dock() {
    var bar = $('.ph-bar');
    if (!bar) return;
    var inner = $('.ph-bar-inner', bar), name = $('.ph-bar-name', bar);
    if (!inner || !name) return;
    var thumb = doc.createElement('span'); thumb.className = 'ph-bar-thumb'; thumb.setAttribute('aria-hidden', 'true');
    var txt = doc.createElement('span'); txt.className = 'ph-bar-txt';
    var meta = doc.createElement('span'); meta.className = 'ph-bar-meta';
    inner.insertBefore(thumb, name); inner.insertBefore(txt, name);
    txt.appendChild(name); txt.appendChild(meta);
    subs.push(function (s) {
      thumb.style.setProperty('--sw', COLOURS[s.colour].hex);
      meta.textContent = money(BASE_PRICE + s.extra) + ' · ' + COLOURS[s.colour].name +
        (s.straps.length ? ' · ' + s.straps.length + ' spare ' + (s.straps.length === 1 ? 'strap' : 'straps') : '');
    });

    /* over the dark bands the bar turns to ink so it never floats as a white slab */
    var darks = $$('.bd-coach, .bd-apps');
    if (!darks.length) return;
    function tone() {
      var y = 28, dark = false;
      darks.forEach(function (d) {
        var r = d.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          dark = !d.classList.contains('bd-coach') || (parseFloat(getComputedStyle(d).getPropertyValue('--orb-full')) || 0) > 0.5;
        }
      });
      body.classList.toggle('is-dark-bar', dark);
    }
    onScroll(tone);
  }

  /* one shared rAF scroll loop */
  var scrollFns = [];
  var queued = false;
  function onScroll(fn) {
    if (!scrollFns.length) {
      var run = function () { queued = false; scrollFns.forEach(function (f) { f(); }); };
      var q = function () { if (!queued) { queued = true; requestAnimationFrame(run); } };
      window.addEventListener('scroll', q, { passive: true });
      window.addEventListener('resize', q);
    }
    scrollFns.push(fn);
    fn();
  }

  /* ---- 2 · the dark circle grows with the scroll -------------------------- */
  function coach() {
    var sec = $('[data-coach]');
    if (!sec) return;
    var stage = $('.bd-coach-stage', sec);
    var orb = $('[data-orb]', sec);
    var head = $('.bd-coach-h', sec);
    function frame() {
      var r = sec.getBoundingClientRect();
      var vh = window.innerHeight, vw = window.innerWidth;
      var run = sec.offsetHeight - vh;
      var p = run > 0 ? clamp(-r.top / run, 0, 1) : 1;
      /* the circle's centre sits below the stage, so it rises as a dome; the
         radius that covers the far corners is the full target */
      var drop = vh * 0.3;
      var cy = vh + drop;
      var full = Math.sqrt(Math.pow(vw / 2, 2) + Math.pow(cy, 2)) + 2;
      var e = clamp((p - 0.08) / 0.72, 0, 1);
      e = 1 - Math.pow(1 - e, 2.2);
      orb.style.setProperty('--orb-drop', drop + 'px');
      orb.style.setProperty('--orb-r', (e * full) + 'px');
      /* the words rise from below the dome and settle a little above centre,
         clear of the carousel that slides up under them */
      orb.style.setProperty('--orb-copy', ((1 - e) * vh * 0.28 - e * vh * 0.1) + 'px');
      head.style.setProperty('--c-lift', (e * vh * 0.18) + 'px');
      sec.style.setProperty('--orb-full', e.toFixed(3));
    }
    if (!stage || !orb || !head) return;
    onScroll(frame);
  }

  /* ---- 3 · marquee: the row is doubled so the loop closes on itself, and
     the speed is set from its width so a wide screen does not race. -------- */
  function apps() {
    var row = $('[data-mq-row]');
    if (!row) return;
    $$('li', row).forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      row.appendChild(c);
    });
    function speed() { row.style.setProperty('--mq-s', Math.max(40, row.scrollWidth / 2 / 55) + 's'); }
    speed();
    window.addEventListener('resize', speed);
  }

  /* ---- 4 · the help panels draw their own readings in, once each ----------
     One observer over three panels rather than one over the group: the column
     is three screens tall, so a single trigger would run all three bar charts
     while two of them are still below the fold. Each panel unobserves itself
     once it has played, and without IntersectionObserver every panel is simply
     drawn at rest, which is the finished state. */
  function helpPanels() {
    var panels = $$('.bd-hp');
    if (!panels.length) return;
    if (!('IntersectionObserver' in window)) {
      panels.forEach(function (p) { p.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    panels.forEach(function (p) { io.observe(p); });
  }

  /* ---- 5 · the studio row · arrows page it by one frame, and hide
     themselves at either end. The track is a native scroller, so a touch
     reader already has the gesture and this is only for the pointer. -------- */
  function studio() {
    var box = $('[data-studio]');
    if (!box) return;
    var track = $('.bd-studio-track', box);
    var prev = $('.bd-studio-arrow.is-prev', box);
    var next = $('.bd-studio-arrow.is-next', box);
    var shot = $('.bd-studio-shot', box);
    if (!track || !prev || !next || !shot) return;

    function step() { return shot.getBoundingClientRect().width + 14; }
    function sync() {
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft > max - 8;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  gallery();
  buyColumn();
  dock();
  coach();
  apps();
  helpPanels();
  studio();
  publish();
})();
