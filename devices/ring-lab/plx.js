/* devices/ring-lab · behaviour for the lab, sections 51 to 60.
   After ultrahuman.com/global/performance-lab:
     · the hero copy and figures settle in once the section is reached,
     · the long sentence lights one word at a time across its pinned travel,
     · the dashboard rises through the signal rows, then the photograph opens
       out of its outline to the whole window,
     · the system list lights the item in the middle of the window, holds
       that item's picture on the right, and fills the rail beside it,
     · the films play when pressed, one at a time, and page with arrows,
     · the clinic photograph drifts against the scroll.
   Every block guards on its own elements. */
(function () {
  'use strict';

  var doc = document;
  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  var root = $('[data-plx]');
  if (!root) return;

  var writers = [], queued = false;
  function sync() { queued = false; for (var i = 0; i < writers.length; i++) writers[i](); }
  function request() { if (!queued) { queued = true; requestAnimationFrame(sync); } }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });

  function travel(el) {
    var r = el.getBoundingClientRect();
    var t = r.height - innerHeight;
    return t > 0 ? clamp(-r.top / t, 0, 1) : 0;
  }

  /* ---- reveals ------------------------------------------------------------ */
  (function reveal() {
    var els = $$('.px-up, .px-hero', root);
    if (!('IntersectionObserver' in window) || calm.matches) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- 52 · the sentence, word by word -------------------------------------
     The words are wrapped here rather than in the markup, so the paragraph
     ships as one readable sentence and a page without script shows it whole. */
  (function say() {
    var sec = $('[data-px-say]', root);
    if (!sec) return;
    var p = $('p', sec);
    if (!p) return;
    var words = p.textContent.trim().split(/\s+/);
    p.textContent = '';
    var spans = words.map(function (w, i) {
      var s = doc.createElement('span');
      s.textContent = w;
      p.appendChild(s);
      if (i < words.length - 1) p.appendChild(doc.createTextNode(' '));
      return s;
    });
    if (calm.matches) { spans.forEach(function (s) { s.classList.add('on'); }); return; }
    writers.push(function () {
      /* the first and last tenth of the travel are held, so the sentence
         arrives dim and leaves fully lit */
      var n = Math.round(clamp((travel(sec) - .08) / .78, 0, 1) * spans.length);
      for (var i = 0; i < spans.length; i++) spans[i].classList.toggle('on', i < n);
    });
    request();
  })();

  /* ---- 53 · the dashboard, then the photograph ---------------------------- */
  (function read() {
    var sec = $('[data-px-read]', root);
    if (!sec) return;
    var pin = $('.px-read-pin', sec);
    writers.push(function () {
      var p = calm.matches ? 1 : travel(sec);
      pin.style.setProperty('--rd', p.toFixed(4));
      /* the clip opens across the last third of the travel */
      pin.style.setProperty('--op', clamp((p - .58) / .3, 0, 1).toFixed(4));
    });
    request();
  })();

  /* ---- 55 · the system list and its held picture -------------------------- */
  (function system() {
    var sec = $('[data-px-sys]', root);
    if (!sec) return;
    var items = $$('.px-sys-item', sec);
    var vis = $$('.px-vis', sec);
    var rail = $('.px-sys-rail', sec);
    var cur = -1;
    function pick(i) {
      if (i === cur) return;
      cur = i;
      items.forEach(function (it, j) { it.classList.toggle('on', j === i); });
      vis.forEach(function (v, j) { v.classList.toggle('on', j === i); });
    }
    writers.push(function () {
      var mid = innerHeight / 2, best = 0, bestD = Infinity;
      items.forEach(function (it, j) {
        var r = it.getBoundingClientRect();
        var d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = j; }
      });
      pick(best);
      if (rail) {
        var r = sec.getBoundingClientRect();
        var list = $('.px-sys-list', sec).getBoundingClientRect();
        var p = clamp((mid - list.top) / Math.max(list.height, 1), 0, 1);
        rail.style.setProperty('--rail', (p * 100).toFixed(2) + '%');
      }
    });
    request();
  })();

  /* ---- 59 · the films ----------------------------------------------------- */
  (function films() {
    var box = $('[data-px-films]', root);
    if (!box) return;
    var track = $('.px-film-track', box);
    var prev = $('.px-film-arrow.is-prev', box);
    var next = $('.px-film-arrow.is-next', box);
    var cards = $$('.px-film', box);

    function stopAll(except) {
      cards.forEach(function (c) {
        if (c === except) return;
        var v = $('video', c);
        if (v && !v.paused) v.pause();
        c.classList.remove('is-playing');
        var b = $('.px-film-play', c);
        if (b) b.setAttribute('aria-label', 'Play ' + (c.getAttribute('data-name') || 'the film'));
      });
    }
    cards.forEach(function (c) {
      var v = $('video', c);
      var b = $('.px-film-play', c);
      if (!v || !b) return;
      b.addEventListener('click', function () {
        if (v.paused) {
          stopAll(c);
          var run = v.play();
          if (run && run.catch) run.catch(function () {});
          c.classList.add('is-playing');
          b.setAttribute('aria-label', 'Pause ' + (c.getAttribute('data-name') || 'the film'));
        } else {
          v.pause();
          c.classList.remove('is-playing');
          b.setAttribute('aria-label', 'Play ' + (c.getAttribute('data-name') || 'the film'));
        }
      });
    });

    if (!track) return;
    function step() { var c = cards[0]; return c ? c.getBoundingClientRect().width + 14 : track.clientWidth; }
    function paint() {
      var max = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }
    var smooth = calm.matches ? 'auto' : 'smooth';
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step() * 2, behavior: smooth }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step() * 2, behavior: smooth }); });
    track.addEventListener('scroll', paint, { passive: true });
    addEventListener('resize', paint, { passive: true });
    paint();
  })();

  /* ---- 60 · the clinic photograph drifts ---------------------------------- */
  (function place() {
    var sec = $('.px-place', root);
    if (!sec || calm.matches) return;
    writers.push(function () {
      var r = sec.getBoundingClientRect();
      sec.style.setProperty('--par', clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1).toFixed(3));
    });
    request();
  })();
})();
