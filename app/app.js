/* app · behaviour for the app page, after ouraring.com/membership.
     · sections settle in as they arrive,
     · the hero film eases back as its card scrolls away,
     · the fan of phones opens as it crosses the screen, the outer phones
       spreading and turning away from the one in the middle,
     · the Longevity AI chips change the photograph beside them,
     · the privacy photograph drifts against the scroll.
   The ticker and the live tiles are CSS. Every block guards on its own
   elements. */
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
    var els = $$('.ap-up');
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

  /* ---- 1 · the hero film eases back --------------------------------------- */
  (function hero() {
    var card = $('.ap-hero-card');
    if (!card || calm.matches) return;
    writers.push(function () {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--hero-p', clamp(-r.top / Math.max(r.height, 1), 0, 1).toFixed(3));
    });
    request();
  })();

  /* ---- 2 · the fan of phones ----------------------------------------------
     Each phone carries its place in the fan as `data-i` (0 in the middle,
     negative to the left). Progress runs from the fan's top reaching the foot
     of the window to its middle reaching the middle, and drives two numbers
     the stylesheet multiplies by `--i`: the spread in pixels and the turn in
     degrees. The outer phones also sit lower, which is `--lift`. */
  (function fan() {
    var box = $('[data-ap-fan]');
    if (!box) return;
    var phones = $$('.ap-phone', box);
    phones.forEach(function (p) {
      var i = +p.getAttribute('data-i') || 0;
      p.style.setProperty('--i', i);
      p.style.setProperty('--i-abs', Math.abs(i));
      p.style.setProperty('--lift', Math.abs(i) * 34);
    });
    function paint(p) {
      var w = box.clientWidth;
      var gap = Math.min(w / 5.2, 250);
      box.style.setProperty('--spread', (gap * p).toFixed(1));
      box.style.setProperty('--tilt', (5 * p).toFixed(2));
    }
    if (calm.matches) { paint(1); return; }
    writers.push(function () {
      var r = box.getBoundingClientRect();
      var p = clamp((innerHeight - r.top) / (innerHeight * 0.75), 0, 1);
      paint(1 - Math.pow(1 - p, 3));
    });
    request();
  })();

  /* ---- 4 · chips change the photograph ------------------------------------ */
  (function chips() {
    var sec = $('[data-ap-evolve]');
    if (!sec) return;
    var buttons = $$('.ap-chip', sec);
    var shots = $$('.ap-evolve-img img', sec);
    function pick(id) {
      buttons.forEach(function (b) {
        var on = b.getAttribute('data-shot') === id;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      shots.forEach(function (im) { im.classList.toggle('on', im.getAttribute('data-shot') === id); });
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { pick(b.getAttribute('data-shot')); });
      b.addEventListener('mouseenter', function () { pick(b.getAttribute('data-shot')); });
    });
  })();

  /* ---- 8 · the privacy photograph drifts ---------------------------------- */
  (function drift() {
    var img = $('.ap-privacy-img');
    if (!img || calm.matches) return;
    writers.push(function () {
      var r = img.getBoundingClientRect();
      var p = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
      img.style.setProperty('--par', p.toFixed(3));
    });
    request();
  })();

})();
