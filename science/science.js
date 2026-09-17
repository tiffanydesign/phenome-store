/* science · behaviour for the Science page.
     · sections settle in as they arrive,
     · the hero photograph eases back as the card scrolls away,
     · in the longevity section the photograph holds while the glass cards
       travel up the right hand column with the scroll,
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
    var els = $$('.sci-up, .sci-topic');
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

  /* ---- 5 · the glass cards travel over a photograph that holds ------------
     Restored 2026-09-16. The track moves from the foot of its column to the
     head of it across the section's travel, so the first card is arriving as
     the photograph pins and the last has settled by the time it releases. */
  (function accuracy() {
    var sec = $('[data-sci-acc]');
    if (!sec) return;
    var pin = $('.sci-acc-pin', sec);
    var col = $('.sci-acc-cards', sec);
    var track = $('.sci-acc-track', sec);
    if (!pin || !col || !track) return;
    var wide = matchMedia('(min-width: 861px)');

    writers.push(function () {
      if (!wide.matches || calm.matches) { track.style.removeProperty('--acc-y'); return; }
      var r = sec.getBoundingClientRect();
      var travel = r.height - innerHeight;
      var p = travel > 0 ? clamp(-r.top / travel, 0, 1) : 0;
      var from = col.clientHeight * 0.55;
      var to = Math.min(0, col.clientHeight - track.scrollHeight);
      var y = from + (to - from) * p;
      track.style.setProperty('--acc-y', y.toFixed(1) + 'px');
      pin.style.setProperty('--acc-p', p.toFixed(3));
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
  /* ---- 8 · how the kits work: the rail fills with the scroll ------------- */
  (function steps() {
    var box = $('[data-sci-steps]');
    if (!box) return;
    var rail = $('.sci-rail', box);
    var fill = $('i', rail);
    var items = $$('.sci-step', box);
    if (!items.length) return;
    function layout() {
      var first = items[0].offsetTop + 18;
      var last = items[items.length - 1].offsetTop + 18;
      rail.style.top = first + 'px';
      rail.style.height = Math.max(0, last - first) + 'px';
    }
    layout();
    window.addEventListener('resize', layout);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(layout);
    if (calm.matches) {
      fill.style.setProperty('--p', 1);
      items.forEach(function (s) { s.classList.add('on'); });
      return;
    }
    var lastP = -1;
    writers.push(function () {
      var line = window.innerHeight * 0.62;
      var r = rail.getBoundingClientRect();
      var p = r.height ? clamp((line - r.top) / r.height, 0, 1) : 0;
      if (Math.abs(p - lastP) < 0.001) return;
      lastP = p;
      fill.style.setProperty('--p', p.toFixed(4));
      items.forEach(function (s, i) {
        var on = i === 0 ? (line - r.top) > -40 : p >= (i / (items.length - 1)) - 0.001;
        s.classList.toggle('on', on);
      });
    });
    var floats = $$('[data-sci-float]');
    writers.push(function () {
      var vh = window.innerHeight;
      floats.forEach(function (f) {
        var r = f.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var c = (r.top + r.height / 2 - vh / 2) / vh;
        f.style.translate = '0 ' + (c * 28 * +f.getAttribute('data-sci-float')).toFixed(1) + 'px';
      });
    });
    request();
  })();

  /* ---- 11 · the team: arrows page, a bio dialog ------------------------- */
  (function team() {
    var sec = $('[data-sci-team]');
    if (!sec) return;
    var track = $('[data-team-track]', sec);
    var cards = $$('[data-tm]', sec);
    var bar = $('[data-team-bar]', sec);
    var prev = $('[data-team-prev]', sec);
    var next = $('[data-team-next]', sec);
    var smooth = calm.matches ? 'auto' : 'smooth';

    function step() { return (cards[0] ? cards[0].getBoundingClientRect().width : 300) + 16; }
    function paint() {
      var max = track.scrollWidth - track.clientWidth;
      var vis = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
      var p = max > 0 ? track.scrollLeft / max : 1;
      if (bar) bar.style.setProperty('--p', (vis + (1 - vis) * p).toFixed(3));
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: smooth }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: smooth }); });
    track.addEventListener('scroll', paint, { passive: true });
    track.addEventListener('transitionend', paint);
    window.addEventListener('resize', paint);
    paint();

    var dlg = $('[data-bio-dialog]');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    var body = $('[data-bio-body]', dlg);
    var opener = null;
    $$('[data-bio-open]', sec).forEach(function (b) {
      b.addEventListener('click', function () {
        var tpl = $('template[data-bio="' + b.getAttribute('data-bio-open') + '"]', sec);
        if (!tpl) return;
        body.innerHTML = '';
        body.appendChild(tpl.content.cloneNode(true));
        opener = b;
        dlg.showModal();
        dlg.scrollTop = 0;
      });
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-bio-close]')) dlg.close();
    });
    dlg.addEventListener('close', function () { if (opener) opener.focus(); });
  })();
})();
