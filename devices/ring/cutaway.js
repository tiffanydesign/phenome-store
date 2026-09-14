/* ============================================================================
   PhenomeTech Ring — the sensor cutaway's behaviour
   Moved from store/phenometech-ring/pdp.js on 2026-09-14 with its markup and
   sheet. Same ES5 shape as the rest of the site's scripts; every lookup is
   guarded, so a page without the figure does nothing.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt); }

  /* ---- the cutaway's four marks -------------------------------------------
     A dot on the photograph and a row in the list are two views of one thing, so
     they share an index and either can drive it. Hover and focus both count:
     a pointer reader points, a keyboard reader tabs, and both should light the
     same pair. */
  function cutaway() {
    var fig = $('[data-cut]');
    if (!fig) return;
    var hots = $$('[data-hot]', fig);
    var items = $$('[data-cut-item]', fig);
    if (!hots.length || !items.length) return;

    var picBox = $('.ring-cut-fig', fig);
    var picImg = picBox && picBox.querySelector('img');
    var wireSvg = $('[data-cut-wire]', fig);
    var wirePath = wireSvg && wireSvg.querySelector('path');
    var wireTip = wireSvg && wireSvg.querySelector('.tip');
    var wireTrack = wireSvg && wireSvg.querySelector('.track');
    var dial = $('[data-dial]', fig);
    var dialN = dial && $('[data-dial-n]', dial);
    var dialT = dial && $('[data-dial-t]', dial);
    var at = -1;

    /* ---- THE RING'S OWN GEOMETRY, measured off ring_cutaway.webp (941 × 900).
       Centre at 469, 455 px; the white hollow is 292 px in radius on every one of
       eight rays; the outer edge is at 414 px. Stated as fractions of the image
       WIDTH so they survive any rendered size. */
    var RING_CX = 469 / 941;
    var RING_CY = 455 / 900;
    /* The track: inside the hollow (0.31) with room for the leader to be a real
       line, and wide enough that the readout's two lines sit within it. */
    var TRACK_R = 0.215;

    /* ---- THE LEADER, and why it points inward. See cutaway.css § the dial.

       Every mark is on the hollow's rim, so "toward the centre" is always into
       empty white and never across the band. One segment from just inside the
       mark's disc to the track, along the ring's own radius. Coordinates are in
       the figure's box, which the SVG fills, so nothing depends on the page's
       scroll position or on where the list has ended up. */
    function draw(i) {
      if (!wirePath || !wireTip || !picBox || !hots[i]) return;
      var box = picBox.getBoundingClientRect();
      var hot = hots[i].getBoundingClientRect();
      if (!box.width) return;

      /* The image is `contain` in a square, and it is 941 × 900 — so it fills
         the width and is letterboxed a few pixels top and bottom. The ring's
         centre has to be found in the image, not assumed at the box's centre. */
      var iw = box.width;
      var ih = picImg && picImg.naturalWidth ? iw * picImg.naturalHeight / picImg.naturalWidth : iw * 900 / 941;
      var top = (box.height - ih) / 2;
      var cx = iw * RING_CX;
      var cy = top + ih * RING_CY;
      var r = iw * TRACK_R;

      if (wireTrack) {
        wireTrack.setAttribute('cx', cx.toFixed(1));
        wireTrack.setAttribute('cy', cy.toFixed(1));
        wireTrack.setAttribute('r', r.toFixed(1));
      }

      var hx = hot.left + hot.width / 2 - box.left;
      var hy = hot.top + hot.height / 2 - box.top;
      var vx = cx - hx, vy = cy - hy;
      var mag = Math.sqrt(vx * vx + vy * vy) || 1;
      var ux = vx / mag, uy = vy / mag;

      /* Out of the mark's white collar (11px disc radius + 3px collar), and onto
         the track, which is `mag - r` in from the mark along the same ray. */
      var gap = 14;
      var sx = hx + ux * gap, sy = hy + uy * gap;
      var ex = hx + ux * (mag - r), ey = hy + uy * (mag - r);

      var d = 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) +
              'L' + ex.toFixed(1) + ' ' + ey.toFixed(1);
      wirePath.setAttribute('d', d);
      wireTip.setAttribute('cx', ex.toFixed(1));
      wireTip.setAttribute('cy', ey.toFixed(1));

      /* The draw-in needs the path's own length as its dash, and the length is
         only knowable after the `d` is set. Handed to CSS as a property so the
         keyframe stays in the stylesheet with the rest of the motion. */
      var len = 0;
      try { len = wirePath.getTotalLength(); } catch (err) { len = 0; }
      wirePath.style.strokeDasharray = len ? len + ' ' + len : 'none';
      wireSvg.style.setProperty('--wire-len', len + 'px');
      wireSvg.setAttribute('data-live', '');
    }

    function show(i) {
      for (var j = 0; j < hots.length; j++) {
        hots[j].setAttribute('aria-current', j === i ? 'true' : 'false');
      }
      for (var k = 0; k < items.length; k++) {
        if (k === i) items[k].setAttribute('data-on', '');
        else items[k].removeAttribute('data-on');
        var btn = $('[data-cut-btn]', items[k]);
        if (btn) btn.setAttribute('aria-expanded', k === i ? 'true' : 'false');
      }
      var changed = at !== i;
      at = i;

      /* The readout takes the row's own words, so the list stays the single
         source for the names and the dial cannot drift out of step with it. */
      if (dial && changed) {
        var n = $('.n', items[i]);
        var t = $('.t', items[i]);
        if (dialN && n) dialN.textContent = n.textContent;
        /* The names carry no hyphens any more (the site sets none), so the
           U+2011 substitution that used to stand here has nothing to convert.
           The words go across as they are written in the list. */
        if (dialT && t) dialT.textContent = t.textContent;
        dial.removeAttribute('data-swap');
        void dial.offsetWidth;
        dial.setAttribute('data-swap', '');
      }

      /* The leader re-draws in only when the mark changes; hovering the live
         one again would otherwise restart the dash on every mouseenter. The
         line lives inside the figure now, so the list's row animation cannot
         move either end of it and there is nothing to re-measure later. */
      if (changed) {
        if (wireSvg) wireSvg.removeAttribute('data-live');
        draw(i);
      }
    }

    function wire(el, i) {
      on(el, 'click', function () { show(i); });
      on(el, 'mouseenter', function () { show(i); });
      on(el, 'focus', function () { show(i); });
    }
    for (var i = 0; i < hots.length; i++) wire(hots[i], i);
    for (var j = 0; j < items.length; j++) {
      var btn = $('[data-cut-btn]', items[j]);
      if (btn) wire(btn, j);
    }

    var queued = false;
    on(window, 'resize', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; if (at >= 0) draw(at); });
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { if (at >= 0) draw(at); });
    }

    show(0);
  }

  cutaway();
})();
