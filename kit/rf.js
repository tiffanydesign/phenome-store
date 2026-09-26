/* kit/rf.js · the refined page kit's behaviour (kit/rf.css)
   Two small jobs, both guarded so a page that lacks the element does nothing:
   the closing card's film only plays while it is on screen, and a form that
   carries [data-rf-form] shows its own [data-sent] line instead of submitting
   (none of these forms are wired to a live system). */
(function () {
  'use strict';

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  (function films() {
    var vids = [].slice.call(document.querySelectorAll('.rf-end-film'));
    if (!vids.length) return;
    if (still || !('IntersectionObserver' in window)) {
      vids.forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.1 });
    vids.forEach(function (v) { v.pause(); io.observe(v); });
  })();

  (function forms() {
    [].forEach.call(document.querySelectorAll('form[data-rf-form]'), function (f) {
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var ok = f.querySelector('[data-sent]');
        if (ok) { ok.hidden = false; ok.style.display = 'block'; }
      });
    });
  })();
})();
