/* =============================================================================
   store/shop.js — behaviour for the Shop all page only.

   Three small jobs:
     1. stagger each product card in as its row arrives,
     2. keep the category index in step with the scroll position,
     3. slide the index marker, and on a phone keep the live chip in view.

   Loaded after shared.js, which runs synchronously in its own IIFE at parse
   time, so the nav and the site wide reveal are already settled by the time
   anything here runs.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('.shop');
  if (!root) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Card entrance --------------------------------------------------
     The index is per row, so every row restarts the stagger instead of the
     twenty eighth card waiting a second and a half for its turn. */
  var cards = [].slice.call(root.querySelectorAll('.pcard'));

  cards.forEach(function (card) {
    var row = card.parentNode;
    var i = [].indexOf.call(row.children, card);
    card.style.setProperty('--i', String(Math.min(i, 5)));
  });

  if (reduced || !('IntersectionObserver' in window)) {
    cards.forEach(function (c) { c.classList.add('is-in'); });
  } else {
    var cardSeen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        cardSeen.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    cards.forEach(function (c) { cardSeen.observe(c); });
  }

  /* ---- 2. Which category am I in? ---------------------------------------
     Read off scroll position rather than intersection: a category can be
     taller than the viewport, in which case nothing is entering or leaving
     and an observer has no opinion at all. */
  var nav = root.querySelector('.shop-rail-nav');
  var links = [].slice.call(root.querySelectorAll('.shop-rail-link'));
  if (!nav || !links.length) return;

  var blocks = links.map(function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  });

  var current = -1;
  var queued = false;

  function markLive(link) {
    if (window.matchMedia('(max-width: 900px)').matches) keepChipInView(link);
  }

  /* Nudge the rail only when the live chip has actually left the window, so
     the rail is not forever sliding under a reader's thumb. */
  function keepChipInView(link) {
    var pad = 16;
    var left = link.offsetLeft - nav.scrollLeft;
    var right = left + link.offsetWidth;
    if (left >= pad && right <= nav.clientWidth - pad) return;
    var target = link.offsetLeft - pad;
    if (nav.scrollTo) nav.scrollTo({ left: target, behavior: reduced ? 'auto' : 'smooth' });
    else nav.scrollLeft = target;
  }

  function measure() {
    /* The line the page is "reading" sits a third of the way down, which is
       where a reader's eye actually is, not at the very top edge. */
    var line = window.scrollY + window.innerHeight * 0.34;
    var found = 0;

    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (b && b.getBoundingClientRect().top + window.scrollY <= line) found = i;
    }

    /* At the very bottom the last category may never reach the reading line,
       so hand it the mark once the page can scroll no further. */
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      found = blocks.length - 1;
    }

    if (found === current) return;
    current = found;

    links.forEach(function (a, i) { a.classList.toggle('on', i === found); });
    markLive(links[found]);
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      measure();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    current = -1;
    measure();
  });

  /* Fonts land after first paint and change every row height under the
     marker, so take the measurement again once they have. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { current = -1; measure(); });
  }

  measure();
})();
