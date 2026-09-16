/* science · behaviour for the Science page.
     · sections settle in as they arrive,
     · the hero photograph eases back as the card scrolls away,
     · in the longevity section the photograph holds while the glass cards
       travel up the right hand column with the scroll,
     · the nine readings drag, page with their arrows, and draw their position
       on a rule and a counter.
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

  /* ---- 4 · the nine readings ----------------------------------------------
     One slide fills the frame, so the arrows page by exactly one and the
     counter names the slide whose left edge the track is resting on. */
  (function readings() {
    var box = $('[data-sci-car]');
    if (!box) return;
    var track = $('.sci-car-track', box);
    var rule = $('.sci-car-rule', box);
    var count = $('[data-car-i]', box);
    var prev = $('[data-car-prev]', box);
    var next = $('[data-car-next]', box);
    if (!track) return;
    var slides = $$(':scope > *', track);

    function step() {
      var card = track.firstElementChild;
      if (!card) return track.clientWidth;
      return card.getBoundingClientRect().width + 12;
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
      if (count && slides.length) {
        var i = clamp(Math.round(track.scrollLeft / step()) + 1, 1, slides.length);
        var s = String(i);
        var t = s.length < 2 ? '0' + s : s;
        if (count.textContent !== t) count.textContent = t;
      }
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }
    var smooth = calm.matches ? 'auto' : 'smooth';
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
