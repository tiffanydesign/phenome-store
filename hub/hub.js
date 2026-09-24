/* hub · behaviour for the Longevity Hub, after ouraring.com/science-and-research.
     · sections settle in as they arrive,
     · the hero photograph eases back as its card scrolls away and the
       cornerstone photograph drifts against the scroll,
     · the guides rail: round arrows step one card, a progress line fills as
       the rail moves, the mouse can drag it,
     · the hero's Search pill opens the site search panel.
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
    var els = $$('.hb-up');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || calm.matches) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- the two photographs that move with the scroll ---------------------- */
  (function drift() {
    if (calm.matches) return;
    var card = $('.hb-hero-card'), corner = $('.hb-corner');
    if (!card && !corner) return;
    writers.push(function () {
      var vh = innerHeight;
      if (card) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--hero-p', clamp(-r.top / r.height, 0, 1).toFixed(4));
      }
      if (corner) {
        var c = corner.getBoundingClientRect();
        corner.style.setProperty('--corner-p', clamp((vh - c.top) / (vh + c.height), 0, 1).toFixed(4));
      }
    });
    request();
  })();

  /* ---- the guides rail ---------------------------------------------------- */
  var rail = (function car() {
    var host = $('[data-hb-car]');
    if (!host) return null;
    var track = $('[data-hb-track]', host), bar = $('[data-hb-bar]', host);
    var prev = $('[data-hb-prev]', host), next = $('[data-hb-next]', host);
    var cards = $$('.hb-guide', track);
    if (!track || !cards.length) return null;

    function step() {
      return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    }
    function paint() {
      var max = track.scrollWidth - track.clientWidth;
      var w = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
      var p = max > 0 ? track.scrollLeft / max : 0;
      if (bar) {
        bar.parentNode.style.setProperty('--bar-w', clamp(w, 0.08, 1).toFixed(4));
        /* translateX is a share of the bar's own width, so the far end of the
           line is (1 - w) / w bar widths away */
        bar.style.setProperty('--bar-x', (w < 1 ? p * (1 - w) / w : 0).toFixed(4));
      }
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }
    function go(dir) {
      track.scrollBy({ left: dir * step(), behavior: calm.matches ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', paint, { passive: true });
    addEventListener('resize', paint, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    /* mouse drag; touch keeps the native swipe */
    var down = null, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = { x: e.clientX, left: track.scrollLeft };
      moved = false;
    });
    addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('is-drag'); }
      if (moved) track.scrollLeft = down.left - dx;
    });
    addEventListener('pointerup', function () {
      if (!down) return;
      down = null;
      if (!moved) return;
      track.classList.remove('is-drag');
      /* settle on the nearest card, as the snap would have */
      var s = step(), i = Math.round(track.scrollLeft / s);
      track.scrollTo({ left: i * s, behavior: 'smooth' });
    });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

    paint();
    return {
      show: function (card) {
        var i = cards.indexOf(card);
        if (i < 0) return;
        track.scrollTo({ left: i * step(), behavior: calm.matches ? 'auto' : 'smooth' });
      }
    };
  })();

  /* ---- the hero's Search pill opens the nav's search panel ---------------- */
  (function search() {
    var pill = $('[data-hb-search]');
    if (!pill) return;
    pill.addEventListener('click', function (e) {
      var nav = $('.ph-nav [data-ph-search], header [data-ph-search]');
      if (!nav || nav === pill) return;
      e.preventDefault();
      nav.click();
    });
  })();
})();
