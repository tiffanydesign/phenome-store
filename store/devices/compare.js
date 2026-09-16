/* store/devices · the wearable comparison.

   Two jobs, both carried over with the table from devices/ring-lab/fit.js:
   the header follows the reader down while the table is in view, and the
   title arrives on scroll. Everything guards on its own elements. */
(function () {
  'use strict';

  var doc = document;
  var sec = doc.querySelector('[data-dv-cmp]');
  if (!sec) return;

  /* ---- the title arrives ------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: .2 });
    sec.querySelectorAll('.dv-rise').forEach(function (el) { io.observe(el); });
  } else {
    sec.querySelectorAll('.dv-rise').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- the header that follows ------------------------------------------- */
  var table = sec.querySelector('[data-dv-scroll]');
  var head = sec.querySelector('[data-dv-head]');
  var wrap = sec.querySelector('.dv-table-wrap');
  if (!table || !head || !wrap) return;

  var clone = doc.createElement('div');
  clone.className = 'dv-head-clone';
  clone.setAttribute('aria-hidden', 'true');
  clone.appendChild(head.cloneNode(true));
  doc.body.appendChild(clone);

  /* The product bar, where a page has one, is what the clone has to clear.
     56 is the nav's own height and the honest fallback. */
  function barH() {
    var bar = doc.querySelector('.ph-bar');
    return bar ? bar.getBoundingClientRect().bottom : 56;
  }

  var queued = false;
  function place() {
    queued = false;
    var w = wrap.getBoundingClientRect();
    var top = Math.max(0, barH());
    var hr = head.getBoundingClientRect();
    var tr = table.getBoundingClientRect();
    /* Shown once the real header has passed under the bar, and hidden again
       before the table's foot arrives, so it never outlives its own table. */
    var on = hr.top < top && tr.bottom > top + hr.height * 2.5;
    clone.classList.toggle('on', on);
    if (!on) return;
    clone.style.top = top + 'px';
    clone.style.left = w.left + 'px';
    clone.style.width = table.clientWidth + 'px';
    clone.scrollLeft = table.scrollLeft;
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(place); } }

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  table.addEventListener('scroll', function () { clone.scrollLeft = table.scrollLeft; }, { passive: true });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(request);
  place();
})();
