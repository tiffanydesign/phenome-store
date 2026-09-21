/* devices/ring-lab · 14 Tuned to you, 15 Choosing the right fit
   Loaded after lab.js. Same shape as the reference's vertical feature
   scroller: the feature whose middle is nearest the pinned phone's middle is
   the live one, the phone crossfades to its screen, its text fades by how far
   it sits from the phone, and the rail jumps to any feature. */
(function () {
  'use strict';

  var doc = document;
  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  var narrow = window.matchMedia('(max-width: 900px)');

  var writers = [];
  var queued = false;
  function sync() { queued = false; for (var i = 0; i < writers.length; i++) writers[i](); }
  function request() { if (!queued) { queued = true; requestAnimationFrame(sync); } }

  /* ---- title reveals ------------------------------------------------------ */
  (function rise() {
    var els = $$('.fit-rise');
    if (!('IntersectionObserver' in window) || calm.matches) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- 14 · feature scroller --------------------------------------------- */
  (function show() {
    var sec = $('[data-fit]');
    if (!sec) return;
    var phone = $('.fit-device .fit-phone', sec);
    var scrs = $$('.fit-device .fit-scr', sec);
    var items = $$('.fit-item', sec);
    var dots = $$('.fit-dots button', sec);
    var prev = $('[data-fit-prev]', sec), next = $('[data-fit-next]', sec);
    var cur = -1;

    /* a narrow screen has no room to pin a phone beside the text, so each
       feature carries its own copy of the screen that belongs to it */
    items.forEach(function (it, i) {
      var mini = doc.createElement('div');
      mini.className = 'fit-mini';
      mini.setAttribute('aria-hidden', 'true');
      var ph = doc.createElement('div');
      ph.className = 'fit-phone';
      ph.appendChild(doc.createElement('div')).className = 'fit-notch';
      var s = scrs[i].cloneNode(true);
      s.classList.add('on');
      ph.appendChild(s);
      mini.appendChild(ph);
      it.appendChild(mini);
    });

    function live(i) {
      if (i === cur) return;
      cur = i;
      scrs.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); d.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      prev.disabled = i === 0;
      next.disabled = i === items.length - 1;
    }

    function textOf(it) { return $('.fit-text', it); }

    writers.push(function () {
      if (narrow.matches) return;
      var pr = phone.getBoundingClientRect();
      var mid = pr.top + pr.height * 0.36;
      var best = 0, bestD = Infinity;
      items.forEach(function (it, i) {
        var r = textOf(it).getBoundingClientRect();
        var c = r.top + r.height / 2;
        var d = Math.abs(c - mid);
        if (d < bestD) { bestD = d; best = i; }
        var o = clamp(1 - d / (it.offsetHeight * 0.62), 0, 1);
        it.style.setProperty('--o', o.toFixed(3));
      });
      live(best);
    });

    function go(i) {
      i = clamp(i, 0, items.length - 1);
      var pr = phone.getBoundingClientRect();
      var r = textOf(items[i]).getBoundingClientRect();
      var target = scrollY + (r.top + r.height / 2) - (pr.top + pr.height * 0.36);
      if (narrow.matches) target = scrollY + items[i].getBoundingClientRect().top - 80;
      scrollTo({ top: Math.max(0, target), behavior: calm.matches ? 'auto' : 'smooth' });
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });
    live(0);
  })();

  /* ---- 15 · comparison header that follows the reader ---------------------- */
  (function compare() {
    var sec = $('[data-cmp]');
    if (!sec) return;
    var table = $('[data-cmp-scroll]', sec);
    var head = $('[data-cmp-head]', sec);
    var wrap = $('.fit-table-wrap', sec);
    var clone = doc.createElement('div');
    clone.className = 'fit-head-clone';
    clone.setAttribute('aria-hidden', 'true');
    clone.appendChild(head.cloneNode(true));
    doc.body.appendChild(clone);

    function barH() {
      var bar = $('.ph-bar');
      return bar ? bar.getBoundingClientRect().bottom : 56;
    }
    function place() {
      var w = wrap.getBoundingClientRect();
      var top = Math.max(0, barH());
      var hr = head.getBoundingClientRect();
      var tr = table.getBoundingClientRect();
      var on = hr.top < top && tr.bottom > top + hr.height * 2.5;
      clone.classList.toggle('on', on);
      if (!on) return;
      clone.style.top = top + 'px';
      clone.style.left = w.left + 'px';
      clone.style.width = table.clientWidth + 'px';
      clone.scrollLeft = table.scrollLeft;
    }
    writers.push(place);
    table.addEventListener('scroll', function () { clone.scrollLeft = table.scrollLeft; }, { passive: true });
  })();

  sync();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(request);
})();
