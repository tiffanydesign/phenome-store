/* science · behaviour for the Science page.
     · sections settle in as they arrive,
     · the hero photograph eases back as the card scrolls away,
     · the five reasons light one at a time on a rail that fills as it is read,
       and the collage beside them drifts a little against the scroll,
     · the comparison rows arrive a beat behind their card,
     · the nine readings drag, page with their arrows, and draw their position
       on a counter and a nine chapter rail that is also nine keys.
   Every block guards on its own elements. */
(function () {
  'use strict';

  var doc = document;
  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  var writers = [], queued = false;
  function sync() { queued = false; for (var i = 0; i < writers.length; i++) writers[i](); }
  function request() { if (!queued) { queued = true; requestAnimationFrame(sync); } }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });

  /* ---- reveals ------------------------------------------------------------ */
  (function reveal() {
    /* .gx-in and .gx-slide arrived with the "How the ring helps" band
       (helps.css); they reveal on the same observer as everything else. */
    var els = $$('.sci-up, .sci-topic, .gx-in, .gx-slide');
    if (!('IntersectionObserver' in window) || calm.matches) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- 1 · the hero photograph eases back --------------------------------- */
  (function hero() {
    var card = $('.sci-hero-card');
    if (!card || calm.matches) return;
    writers.push(function () {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--hero-p', clamp(-r.top / Math.max(r.height, 1), 0, 1).toFixed(3));
    });
    request();
  })();

  /* ---- 5 · the five reasons, on a rail that fills -------------------------
     Carried over from supplements/nad with the band itself. The rail runs
     marker to marker rather than edge to edge, so the line starts and stops
     exactly where the first and last dots are; the fill is measured against a
     reading line 62% down the window, which is where a reader's eye actually
     is rather than where the top of the viewport is. */
  (function reasons() {
    var box = $('[data-sci-steps]');
    if (!box) return;
    var rail = $('.sci-rail', box);
    var fill = rail && $('i', rail);
    var steps = $$('.sci-step', box);
    if (!rail || !fill || !steps.length) return;

    function layout() {
      var first = steps[0].offsetTop + 15;
      var last = steps[steps.length - 1].offsetTop + 15;
      rail.style.top = first + 'px';
      rail.style.height = Math.max(0, last - first) + 'px';
    }
    layout();
    addEventListener('resize', layout);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(layout);

    if (calm.matches) {
      fill.style.setProperty('--p', 1);
      steps.forEach(function (s) { s.classList.add('on'); });
      return;
    }
    var lastP = -1;
    writers.push(function () {
      var line = innerHeight * 0.62;
      var r = rail.getBoundingClientRect();
      var p = r.height ? clamp((line - r.top) / r.height, 0, 1) : 0;
      if (Math.abs(p - lastP) < 0.001) return;
      lastP = p;
      fill.style.setProperty('--p', p.toFixed(4));
      steps.forEach(function (s, i) {
        var on = i === 0 ? (line - r.top) > -40 : p >= (i / (steps.length - 1)) - 0.001;
        s.classList.toggle('on', on);
      });
    });
    request();
  })();

  /* ---- 5b · the collage tiles drift a little against each other ----------- */
  (function collage() {
    var floats = $$('[data-sci-float]');
    if (!floats.length || calm.matches) return;
    writers.push(function () {
      var vh = innerHeight;
      floats.forEach(function (f) {
        var r = f.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var c = (r.top + r.height / 2 - vh / 2) / vh;
        f.style.translate = '0 ' + (c * 28 * +f.getAttribute('data-sci-float')).toFixed(1) + 'px';
      });
    });
    request();
  })();

  /* ---- 6b · the comparison rows arrive behind their card ------------------ */
  (function table() {
    var t = $('[data-sci-table]');
    if (!t) return;
    if (!('IntersectionObserver' in window) || calm.matches) { t.classList.add('is-in'); return; }
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      t.classList.add('is-in'); io.disconnect();
    }, { threshold: .2 });
    io.observe(t);
  })();

  /* ---- 4 · the nine readings ----------------------------------------------
     The arrows page by exactly one card, the counter names the card whose left
     edge the track is resting on, and the rail below is that same bar cut into
     nine chapters: a chapter fills as its reading arrives in the frame, so the
     white length is how much of the set has been seen rather than how far the
     scrollbar has travelled. Every chapter is also a key to its own reading. */
  (function readings() {
    var box = $('[data-sci-car]');
    if (!box) return;
    var track = $('.sci-car-track', box);
    var rail = $('[data-car-rail]', box);
    var count = $('[data-car-i]', box);
    var prev = $('[data-car-prev]', box);
    var next = $('[data-car-next]', box);
    if (!track) return;
    var slides = $$(':scope > *', track);
    var smooth = calm.matches ? 'auto' : 'smooth';

    function pad() {
      var cs = getComputedStyle(track);
      return (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    }
    function gap() { return parseFloat(getComputedStyle(track).columnGap) || 18; }
    function step() {
      var card = track.firstElementChild;
      if (!card) return track.clientWidth;
      return card.getBoundingClientRect().width + gap();
    }
    function two(n) { var s = String(n); return s.length < 2 ? '0' + s : s; }

    /* the rail is built here, not in the markup, because a chapter that cannot
       be clicked is a decoration and this page does not ship decorations */
    var segs = [];
    if (rail && slides.length) {
      slides.forEach(function (slide, i) {
        var b = doc.createElement('button');
        b.type = 'button';
        b.className = 'sci-car-seg';
        var title = $('.sci-read-t', slide);
        b.setAttribute('aria-label', 'Reading ' + two(i + 1) + (title ? ', ' + title.textContent.replace(/^\d+\s*/, '') : ''));
        b.appendChild(doc.createElement('i'));
        b.addEventListener('click', function () { track.scrollTo({ left: i * step(), behavior: smooth }); });
        segs.push(rail.appendChild(b));
      });
    }

    function paint() {
      var max = track.scrollWidth - track.clientWidth;
      var s = step();
      var lead = clamp(Math.round(track.scrollLeft / s), 0, slides.length - 1);
      /* how many cards deep the right hand edge of the frame is standing */
      var seen = track.scrollLeft / s + (track.clientWidth - pad() + gap()) / s;
      if (max > 0 && track.scrollLeft >= max - 2) seen = slides.length;
      segs.forEach(function (seg, i) {
        seg.firstChild.style.setProperty('--f', clamp(seen - i, 0, 1).toFixed(3));
        seg.classList.toggle('is-on', i === lead);
        seg.setAttribute('aria-current', i === lead ? 'true' : 'false');
      });
      if (count && slides.length) {
        var t = two(lead + 1);
        if (count.textContent !== t) count.textContent = t;
      }
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: smooth }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: smooth }); });
    track.addEventListener('scroll', paint, { passive: true });
    addEventListener('resize', paint, { passive: true });
    paint();

    /* drag with a mouse; touch keeps its native swipe */
    var down = false, moved = false, sx = 0, sl = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.target.closest('button')) return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
    });
    addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 4) { moved = true; track.classList.add('is-drag'); }
      if (moved) track.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      track.classList.remove('is-drag');
    });
  })();
})();
