/* devices/ring · § 9 biometrics. One observer: when the band is a little way
   on screen it gets `.is-in`, and bio.css staggers the list and names the
   sensors from that. Without the script (or with reduced motion) the
   `rbio-js` flag is never read as hiding anything, because the band is marked
   in straight away. */
(function () {
  'use strict';
  /* The band stands twice on the page since 2026-09-23, so each is watched. */
  var bands = [].slice.call(document.querySelectorAll('[data-rbio]'));
  if (!bands.length) return;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm || !('IntersectionObserver' in window)) {
    bands.forEach(function (b) { b.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -18% 0px', threshold: 0.05 });
  bands.forEach(function (b) { io.observe(b); });
})();
