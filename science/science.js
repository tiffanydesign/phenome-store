/* science · behaviour for the Science page, after ouraring.com/science-and-research.
     · sections settle in as they arrive, and the figures slide up out of a
       clipped line,
     · the hero photograph eases back as the card scrolls away,
     · in the accuracy section the photograph holds while the glass cards
       travel up the right hand column with the scroll,
     · the glass panels on the three photographs rise into place,
     · the method carousel drags, pages with its arrows, and draws its
       position on a rule; each card opens to say more.
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
    var els = $$('.sci-up, .sci-stat, .sci-photo');
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

  /* ---- 3 · the glass cards travel over a photograph that holds ------------
     The track moves from the foot of its column to the head of it across the
     section's travel, so the first card is arriving as the photograph pins and
     the last has settled by the time it releases. */
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

  /* ---- 8 · the method carousel -------------------------------------------- */
  (function method() {
    var box = $('[data-sci-car]');
    if (!box) return;
    var track = $('.sci-car-track', box);
    var rule = $('.sci-car-rule', box);
    var prev = $('[data-car-prev]', box);
    var next = $('[data-car-next]', box);
    if (!track) return;

    function step() {
      var card = track.firstElementChild;
      if (!card) return track.clientWidth;
      return card.getBoundingClientRect().width + 10;
    }
    function paint() {
      var max = track.scrollWidth - track.clientWidth;
      var visible = track.clientWidth / Math.max(track.scrollWidth, 1);
      var p = max > 0 ? track.scrollLeft / max : 0;
      if (rule) {
        rule.style.setProperty('--rule-w', (visible * 100).toFixed(2) + '%');
        /* translateX is a share of the thumb's own width, so the far end is
           reached when the thumb has moved (1 / visible − 1) of itself. */
        rule.style.setProperty('--rule-x', (p * (1 / Math.max(visible, .01) - 1) * 100).toFixed(2) + '%');
      }
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }
    var smooth = calm.matches ? 'auto' : 'smooth';
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step() * 2, behavior: smooth }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step() * 2, behavior: smooth }); });
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

    /* each card opens to say more, one at a time */
    $$('.sci-step', track).forEach(function (card) {
      var b = $('.sci-step-more', card);
      if (!b) return;
      b.addEventListener('click', function () {
        var open = !card.classList.contains('is-open');
        $$('.sci-step.is-open', track).forEach(function (o) {
          o.classList.remove('is-open');
          var ob = $('.sci-step-more', o);
          if (ob) ob.setAttribute('aria-expanded', 'false');
        });
        card.classList.toggle('is-open', open);
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  })();
})();
