/* ============================================================================
   devices/ring-lab · "Supplements are everywhere" (`.supx`)

   The home page of phenomelongevity.com builds this field in its theme's
   <scrolled-images> element; this is the same behaviour without the element:

   1 · three rows of eight tiles from the five product shots listed on the
       field, each row starting at a different shot so no two rows line up;
   2 · every row slides sideways across the section's whole pass through the
       screen, from the moment its top enters at the bottom to the moment its
       bottom leaves at the top. Even rows travel -60% to 0, odd rows 0 to
       -60% (the reference's parallax of 1.5: 1.5 * 100 / 2.5);
   3 · `.is-in` once in view, which starts the headline's gradient sweep.

   ES5, to the floor shared.js is written to.
   ========================================================================= */
(function () {
  'use strict';

  var sec = document.querySelector('[data-supx]');
  if (!sec) return;
  var field = sec.querySelector('.supx-field');
  var shots = (sec.getAttribute('data-supx') || '').split(',');
  if (!field || !shots.length) return;

  var ROWS = 3, PER_ROW = 8, TRAVEL = 60;
  var rows = [];
  for (var r = 0; r < ROWS; r++) {
    var row = document.createElement('div');
    row.className = 'supx-row';
    for (var t = 0; t < PER_ROW; t++) {
      var tile = document.createElement('span');
      tile.className = 'supx-tile';
      tile.style.backgroundImage = 'url("' + shots[(t + r * 2) % shots.length] + '")';
      row.appendChild(tile);
    }
    field.appendChild(row);
    rows.push(row);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries, io) {
      if (entries[0].isIntersecting) { sec.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.35 }).observe(sec);
  } else {
    sec.classList.add('is-in');
  }

  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var queued = false;
  function sync() {
    queued = false;
    var box = sec.getBoundingClientRect();
    var vh = window.innerHeight;
    if (box.bottom < -200 || box.top > vh + 200) return;
    var p = (vh - box.top) / (vh + box.height);
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    for (var i = 0; i < rows.length; i++) {
      var x = i % 2 === 0 ? -TRAVEL * (1 - p) : -TRAVEL * p;
      rows[i].style.transform = 'translate3d(' + x.toFixed(3) + '%, 0, 0)';
    }
  }
  function request() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sync);
  }
  sync();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
})();
