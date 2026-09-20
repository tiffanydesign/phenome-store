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

  /* SIX COLOURS IN TWO STRAP MATERIALS, 2026-09-17 by request — the map the
     2026-09-16 note said was one entry away from a second colour. Hexes are
     sampled off the photographs, `strap` is which of the two rows a colour
     belongs to, and `name` is what the cart line and the label read.

     The material is part of the variant, not decoration: "Onyx" alone does not
     say whether a silicone or a nylon strap is in the box. */
  var COLOURS = {
    onyx:     { name: 'Onyx',     hex: '#313131', strap: 'sport' },
    ember:    { name: 'Ember',    hex: '#e4652e', strap: 'sport' },
    harbour:  { name: 'Harbour',  hex: '#566a82', strap: 'sport' },
    dune:     { name: 'Dune',     hex: '#e2d0c4', strap: 'sport' },
    graphite: { name: 'Graphite', hex: '#242424', strap: 'woven' },
    tidal:    { name: 'Tidal',    hex: '#394d68', strap: 'woven' }
  };
  var STRAPS = {
    sport: { name: 'sport silicone' },
    woven: { name: 'woven nylon' }
  };
  function firstColourOf(strap) {
    for (var k in COLOURS) {
      if (Object.prototype.hasOwnProperty.call(COLOURS, k) && COLOURS[k].strap === strap) return k;
    }
    return 'onyx';
  }
  var BASE_PRICE = 14900;
  var state = { colour: 'onyx', strap: 'sport', straps: [], extra: 0 };
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

    /* choosing a colour or a strap brings the product plate back to the front */
    $$('.bd-sw, .bd-choice').forEach(function (b) {
      b.addEventListener('click', function () { if (cur !== 0) go(0, true); });
    });

    /* THE PLATE FOLLOWS THE COLOUR. Six photographs stacked in the first slide,
       crossfading on a press — the same construction as the ring PDP's stills.
       It subscribes rather than listening to the buttons, so it agrees with the
       label and the cart line by construction rather than by coincidence. */
    var plate = $('[data-gal-plate]');
    if (plate) {
      var shots = $$('[data-colour-img]', plate);
      /* Tells the sheet the stack is now being driven, so its "show the first
         one" fallback can stand down. Set here rather than in the markup: the
         fallback has to hold for a page whose script never ran. */
      gal.classList.add('is-live');
      subs.push(function (s) {
        shots.forEach(function (img) {
          var on = img.getAttribute('data-colour-img') === s.colour;
          img.classList.toggle('on', on);
          /* A frame that is not showing is not announced, or six identical alt
             lines are read out in a row. */
          img.setAttribute('aria-hidden', on ? 'false' : 'true');
        });
      });
    }

    paint();
    schedule();
  }

  /* ---- 1 · decision column ------------------------------------------------ */
  function buyColumn() {
    var sws = $$('.bd-sw');
    if (!sws.length) return;
    var choices = $$('.bd-choice');

    /* THE STRAP IS THE FIRST QUESTION and the colour row answers it, so a
       colour has to follow its material: kept if it belongs to the new strap,
       otherwise that strap's first. Without this the page shows a nylon
       photograph under a silicone label for one press. */
    choices.forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-strap-type');
        if (state.strap === t) return;
        state.strap = t;
        if (COLOURS[state.colour].strap !== t) state.colour = firstColourOf(t);
        publish();
      });
    });

    sws.forEach(function (b) {
      b.addEventListener('click', function () {
        state.colour = b.getAttribute('data-colour');
        /* Choosing a colour also chooses its strap. A reader who clicks Tidal
           has said "woven nylon" as clearly as if they had clicked the card —
           though with the row filtered they can only reach their own. */
        state.strap = COLOURS[state.colour].strap;
        publish();
      });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!n) return;
        e.preventDefault();
        /* Walk the VISIBLE swatches only. Stepping onto a hidden one moves
           focus to a button that is not on the screen. */
        var live = sws.filter(function (o) { return !o.hidden; });
        var i = live.indexOf(b);
        var t = live[(i + n + live.length) % live.length];
        t.focus(); t.click();
      });
    });

    subs.push(function (s) {
      choices.forEach(function (o) {
        var on = o.getAttribute('data-strap-type') === s.strap;
        o.classList.toggle('on', on);
        o.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      sws.forEach(function (o) {
        var on = o.getAttribute('data-colour') === s.colour;
        o.classList.toggle('on', on);
        o.setAttribute('aria-checked', on ? 'true' : 'false');
        o.hidden = o.getAttribute('data-strap') !== s.strap;
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

    /* THE BOX FOLLOWS THE COLOUR TOO. Two stacks of six down the page — the
       Band and the spare strap in "What is in the box" — driven exactly the way
       the hero's first slide is, and for the same reason: a reader who has
       chosen Dune should not be shown an Onyx box forty lines later.

       One query rather than two, because both stacks answer the same question
       and the dock between them carries no `data-colour-img` to match. */
    var boxShots = $$('[data-box-colour] [data-colour-img]');
    if (boxShots.length) {
      subs.push(function (s) {
        boxShots.forEach(function (img) {
          var on = img.getAttribute('data-colour-img') === s.colour;
          img.classList.toggle('on', on);
          /* A plate that is not showing is not announced, or six identical alt
             lines are read out in a row. */
          img.setAttribute('aria-hidden', on ? 'false' : 'true');
        });
      });
    }

    subs.push(function (s) {
      var c = COLOURS[s.colour];
      var label = $('[data-colour-label]'); if (label) label.textContent = c.name;
      var total = money(BASE_PRICE + s.extra);
      $$('[data-price], [data-price-echo]').forEach(function (el) { el.textContent = total; });
      var v = $('[data-cart-variant]');
      if (v) {
        v.textContent = c.name + ', ' + STRAPS[s.strap].name +
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
      /* Commas, not middle dots: the site's copy rule has no dashes and no
         middle dots in rendered text, and this line is rendered text. */
      meta.textContent = money(BASE_PRICE + s.extra) + ', ' + COLOURS[s.colour].name +
        (s.straps.length ? ', ' + s.straps.length + ' spare ' + (s.straps.length === 1 ? 'strap' : 'straps') : '');
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
