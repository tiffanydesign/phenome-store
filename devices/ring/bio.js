/* devices/ring · § 9 biometrics. One observer: when the band is a little way
   on screen it gets `.is-in`, and bio.css staggers the list and names the
   sensors from that. Without the script (or with reduced motion) the
   `rbio-js` flag is never read as hiding anything, because the band is marked
   in straight away. */
(function () {
  'use strict';
  var band = document.querySelector('[data-rbio]');
  if (!band) return;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm || !('IntersectionObserver' in window)) { band.classList.add('is-in'); return; }
  var io = new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting) return;
    band.classList.add('is-in');
    io.disconnect();
  }, { rootMargin: '0px 0px -18% 0px', threshold: 0.05 });
  io.observe(band);
})();
