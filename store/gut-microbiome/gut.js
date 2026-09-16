/* store/gut-microbiome · page behaviour.

   The page wears `.bd` and takes its layout from devices/band, but it does NOT
   load devices/band/band.js: that file carries the Band's own price, its three
   colours and a product bar that reads them, so running it here would put
   "£149 · Sage" over a gut test. What it shares with this page is the shape of
   the interactions, not the state behind them, so the three generic pieces are
   rebuilt here against this page's own data and nothing else is.

   Loaded after shared.js, so the nav, the footer and `.ph-bar` already exist.
   Every function guards on its own elements and returns quietly without them. */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var still = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function money(p) { return '£' + (p % 100 ? (p / 100).toFixed(2) : String(p / 100)); }

  var state = { price: 14400, plan: 'Subscribe & save (save 20%)' };
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

    paint();
    schedule();
  }

  /* ---- 2 · the plan chooser ----------------------------------------------
     A radio group, so the arrow keys move between the two the way they do on
     the Band's colours, and the price, the button and the line the cart reads
     all move from ONE published state rather than from three listeners. */
  function plans() {
    var opts = $$('.gt-plan');
    if (!opts.length) return;

    function choose(b) {
      state.price = +b.getAttribute('data-plan-price') || 0;
      state.plan = b.getAttribute('data-plan-name') || '';
      state.cta = b.getAttribute('data-cta') || '';
      opts.forEach(function (o) {
        var on = o === b;
        o.classList.toggle('on', on);
        o.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      publish();
    }

    opts.forEach(function (b) {
      b.addEventListener('click', function () { choose(b); });
      b.addEventListener('keydown', function (e) {
        var i = opts.indexOf(b);
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
              : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!n) return;
        e.preventDefault();
        var t = opts[(i + n + opts.length) % opts.length];
        t.focus(); choose(t);
      });
    });

    subs.push(function (s) {
      var total = money(s.price);
      $$('[data-price]').forEach(function (el) { el.textContent = total; });
      var label = $('[data-plan-label]'); if (label) label.textContent = s.plan;
      var cta = $('[data-cta-label]'); if (cta && s.cta) cta.textContent = s.cta;
      var v = $('[data-cart-variant]'); if (v) v.textContent = s.plan;
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

    /* the chosen plan starts the page: whichever button carries `on` in the
       markup is the source of truth, so the price is never written twice */
    var start = $('.gt-plan.on') || opts[0];
    choose(start);
  }

  /* ---- 3 · the product bar ------------------------------------------------
     Same swap as the Band: past the hero the global nav steps aside and the
     product bar takes the top. The bar carries the live price, and it goes to
     ink over the two dark bands so it never floats as a white slab on them. */
  function dock() {
    var bar = $('.ph-bar');
    if (!bar) return;
    var swap = function () { body.classList.toggle('is-past-hero', bar.classList.contains('on')); };
    if ('MutationObserver' in window) new MutationObserver(swap).observe(bar, { attributes: true, attributeFilter: ['class'] });
    swap();

    var inner = $('.ph-bar-inner', bar), name = $('.ph-bar-name', bar);
    if (inner && name) {
      var txt = doc.createElement('span'); txt.className = 'ph-bar-txt';
      var meta = doc.createElement('span'); meta.className = 'ph-bar-meta';
      inner.insertBefore(txt, name);
      txt.appendChild(name); txt.appendChild(meta);
      subs.push(function (s) { meta.textContent = money(s.price) + ', ' + s.plan; });
    }

    var darks = $$('.gt-hero, .gt-why');
    if (!darks.length) return;
    function tone() {
      var y = 28, dark = false;
      darks.forEach(function (d) {
        var r = d.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) dark = true;
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

  /* ---- 4 · the four points draw in once ---------------------------------- */
  function why() {
    var sec = $('[data-why]');
    if (!sec) return;
    if (!('IntersectionObserver' in window)) { sec.classList.add('is-in'); return; }
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      sec.classList.add('is-in'); io.disconnect();
    }, { threshold: 0.25 });
    io.observe(sec);
  }

  gallery();
  plans();
  dock();
  why();
  publish();
})();
