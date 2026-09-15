/* supplements/nad · page script
   Loaded after shared.js, which has already built the nav, the footer and the
   `.ph-bar` synchronously, so everything here enhances rather than races.
   Every part guards on its own elements and the page reads fine without it. */
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

  /* ---- 1 · gallery viewer ------------------------------------------------ */
  function viewer() {
    var lb = $('[data-lb]');
    var tiles = $$('[data-gal] .nd-tile');
    if (!lb || !tiles.length || typeof lb.showModal !== 'function') return;
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
      lb.showModal();
    }
    function step(d) { cur = (cur + d + tiles.length) % tiles.length; paint(); }

    tiles.forEach(function (t, i) { t.addEventListener('click', function () { open(i, t); }); });
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
    lb.addEventListener('close', function () { if (opener) opener.focus(); });

    /* A swipe on touch screens. */
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* ---- plan choice: hero radios, the price, the kit card, the bar -------- */
  var planSubs = [];
  function plans() {
    var radios = $$('.supp-opt input[name="nad-plan"]');
    if (!radios.length) return;
    var price = $('[data-nd-price]');
    var kitBtns = $$('[data-plan]');

    function chosen() {
      var r = radios.filter(function (x) { return x.checked; })[0] || radios[0];
      return { value: r.value, price: $('.supp-opt-p', r.parentNode).textContent.trim() };
    }
    function publish(animate) {
      var c = chosen();
      if (price && price.textContent !== c.price) {
        if (animate && !still.matches) {
          price.classList.add('is-swap');
          setTimeout(function () { price.textContent = c.price; price.classList.remove('is-swap'); }, 160);
        } else {
          price.textContent = c.price;
        }
      }
      kitBtns.forEach(function (b) {
        var on = b.getAttribute('data-plan') === c.value;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      planSubs.forEach(function (fn) { fn(c); });
    }
    radios.forEach(function (r) { r.addEventListener('change', function () { publish(true); }); });
    kitBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-plan');
        radios.forEach(function (r) { r.checked = r.value === v; });
        publish(true);
      });
    });
    publish(false);
  }

  /* ---- the nav/bar swap, as on the ring PDP ------------------------------ */
  function dock() {
    var bar = $('.ph-bar');
    if (!bar) return;
    var body = doc.body;
    var swap = function () { body.classList.toggle('is-past-hero', bar.classList.contains('on')); };
    if ('MutationObserver' in window) {
      new MutationObserver(swap).observe(bar, { attributes: true, attributeFilter: ['class'] });
    }
    swap();

    var inner = $('.ph-bar-inner', bar);
    var name = $('.ph-bar-name', bar);
    if (!inner || !name) return;
    var thumb = doc.createElement('img');
    thumb.className = 'ph-bar-thumb';
    thumb.alt = '';
    thumb.width = 32; thumb.height = 32;
    thumb.src = '/phenome-store/assets/shop/supp-nad.webp';
    var txt = doc.createElement('span');
    txt.className = 'ph-bar-txt';
    var meta = doc.createElement('span');
    meta.className = 'ph-bar-meta';
    inner.insertBefore(thumb, name);
    inner.insertBefore(txt, name);
    txt.appendChild(name);
    txt.appendChild(meta);
    planSubs.push(function (c) {
      meta.textContent = c.price + ' · ' + (c.value === 'subscribe' ? 'Delivered monthly' : 'One time purchase') + ' · 30 sachets';
    });
  }

  /* ---- 2 · essentials: photo drift, liposome callouts -------------------- */
  function essentials() {
    onceInView($('[data-lipo]'), 'is-in');
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

  /* ---- 3 · timeline: the rail fills with the scroll ---------------------- */
  function timeline() {
    var box = $('[data-steps]');
    if (!box) return;
    var rail = $('.nd-rail', box);
    var fill = $('i', rail);
    var steps = $$('.nd-step', box);
    if (!steps.length) return;

    function layout() {
      /* The rail runs dot to dot: from the first step's marker to the last's. */
      var first = steps[0].offsetTop + 14;
      var last = steps[steps.length - 1].offsetTop + 14;
      rail.style.top = first + 'px';
      rail.style.bottom = 'auto';
      rail.style.height = Math.max(0, last - first) + 'px';
    }
    layout();
    window.addEventListener('resize', layout);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(layout);

    if (still.matches) {
      fill.style.setProperty('--p', 1);
      steps.forEach(function (s) { s.classList.add('on'); });
      return;
    }
    var lastP = -1;
    onFrame(function () {
      var line = window.innerHeight * 0.62;
      var r = rail.getBoundingClientRect();
      var p = r.height ? Math.min(Math.max((line - r.top) / r.height, 0), 1) : 0;
      if (Math.abs(p - lastP) < 0.001) return;
      lastP = p;
      fill.style.setProperty('--p', p.toFixed(4));
      steps.forEach(function (s, i) {
        var on = i === 0 ? (line - r.top) > -40 : p >= (i / (steps.length - 1)) - 0.001;
        s.classList.toggle('on', on);
      });
    });

    /* Collage tiles drift a little against each other. */
    var floats = $$('[data-float]');
    onFrame(function () {
      var vh = window.innerHeight;
      floats.forEach(function (f) {
        var r = f.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var c = (r.top + r.height / 2 - vh / 2) / vh;
        f.style.translate = '0 ' + (c * 28 * +f.getAttribute('data-float')).toFixed(1) + 'px';
      });
    });
  }

  /* ---- 8 · FAQ: View all -------------------------------------------------- */
  function faq() {
    var list = $('[data-faq]');
    var btn = $('[data-faq-toggle]');
    if (!list || !btn) return;
    var label = $('[data-label]', btn);
    btn.addEventListener('click', function () {
      var all = !list.classList.contains('is-all');
      list.classList.toggle('is-all', all);
      btn.setAttribute('aria-expanded', all ? 'true' : 'false');
      label.textContent = all ? 'View less' : 'View all';
    });
  }

  /* ---- 9 · reviews: topics, search, sort, helpful votes ------------------ */
  function reviews() {
    var list = $('[data-rv-list]');
    if (!list) return;
    onceInView($('.nd-dist'), 'is-in');
    var cards = $$('.nd-rv', list);
    var empty = $('[data-rv-empty]', list);
    var search = $('[data-rv-search]');
    var sort = $('[data-rv-sort]');
    var topicBtns = $$('[data-topic]');
    var topic = '';
    var VOTES = 'phenome.nad.votes.v1';
    var voted = {};
    try { voted = JSON.parse(localStorage.getItem(VOTES) || '{}') || {}; } catch (e) { voted = {}; }

    topicBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });

    function helpful(c) { return +c.getAttribute('data-helpful') + (voted[cards.indexOf(c)] ? 1 : 0); }
    function apply() {
      var q = (search && search.value || '').trim().toLowerCase();
      var mode = sort ? sort.value : 'helpful';
      var shown = cards.filter(function (c) {
        var okT = !topic || (' ' + c.getAttribute('data-topics') + ' ').indexOf(' ' + topic + ' ') > -1;
        var okQ = !q || c.textContent.toLowerCase().indexOf(q) > -1;
        c.hidden = !(okT && okQ);
        return okT && okQ;
      });
      var order = cards.slice().sort(function (a, b) {
        if (mode === 'new') return a.getAttribute('data-date') < b.getAttribute('data-date') ? 1 : -1;
        if (mode === 'rating') return (+b.getAttribute('data-rating') - +a.getAttribute('data-rating')) || (helpful(b) - helpful(a));
        return helpful(b) - helpful(a);
      });
      order.forEach(function (c) {
        list.insertBefore(c, empty);
        /* Replay the entry animation on what just moved. */
        c.style.animation = 'none'; void c.offsetWidth; c.style.animation = '';
      });
      if (empty) empty.hidden = shown.length > 0;
    }

    topicBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-topic');
        topic = topic === t ? '' : t;
        topicBtns.forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-topic') === topic ? 'true' : 'false'); });
        apply();
      });
    });
    if (search) search.addEventListener('input', apply);
    if (sort) sort.addEventListener('change', apply);

    cards.forEach(function (c, i) {
      var v = $('[data-vote]', c);
      if (!v) return;
      var n = $('span', v);
      var base = +c.getAttribute('data-helpful');
      function paint() {
        v.setAttribute('aria-pressed', voted[i] ? 'true' : 'false');
        n.textContent = base + (voted[i] ? 1 : 0);
      }
      v.addEventListener('click', function () {
        voted[i] = !voted[i];
        try { localStorage.setItem(VOTES, JSON.stringify(voted)); } catch (e) { /* per session only */ }
        paint();
      });
      paint();
    });
    apply();
  }

  viewer();
  dock();
  plans();
  essentials();
  timeline();
  onceInView($('.nd-table'), 'is-in', '0px 0px -10% 0px');
  faq();
  reviews();
  request();
})();
