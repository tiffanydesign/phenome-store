/* devices/ring-lab · sacc · the pinned longevity photograph.

   Restored from science/science.js as it shipped at 148ddc3. The track moves
   from the foot of its column to the head of it across the section's travel,
   so the first card is arriving as the photograph pins and the last has
   settled by the time it releases. Guards on its own elements. */
(function () {
  'use strict';

  var sec = document.querySelector('[data-sacc]');
  if (!sec) return;
  var pin = sec.querySelector('.sci-acc-pin');
  var col = sec.querySelector('.sci-acc-cards');
  var track = sec.querySelector('.sci-acc-track');
  if (!pin || !col || !track) return;

  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var wide = matchMedia('(min-width: 861px)');
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  var queued = false;
  function frame() {
    queued = false;
    if (!wide.matches || calm.matches) { track.style.removeProperty('--acc-y'); return; }
    var r = sec.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    var travel = r.height - innerHeight;
    var p = travel > 0 ? clamp(-r.top / travel, 0, 1) : 0;
    var from = col.clientHeight * 0.55;
    var to = Math.min(0, col.clientHeight - track.scrollHeight);
    track.style.setProperty('--acc-y', (from + (to - from) * p).toFixed(1) + 'px');
    pin.style.setProperty('--acc-p', p.toFixed(3));
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(frame); } }

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  frame();
})();
