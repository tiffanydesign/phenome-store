/* ============================================================================
   PhenomeTech Ring — the sensing film's timeline
   2026-09-14. One reader, one rAF, custom properties out; story.css does all
   the drawing. ES5-shaped like the rest of the site's scripts.

   THE TIMELINE, in fractions of the pinned track (story.css § 2b):

     before the pin   the card opens to the full screen (--rs-open), and the
                      film starts once it is mostly open — ONE play, no loop,
                      so it comes to rest on its last frame and stays there
     .00 – .10        the veil rises
     .02 – .09        copy A (Five layers) fades up and holds still
     .04 – .38        list B (the five readings) scrolls up from the lower
                      edge until its top is level with A's
     .40 – .47        A and B fade out together
     .51 – .58        copy C (Completing the circle) fades up and holds
     .53 – .90        list D (the five services) scrolls up the same way
     .90 – 1          C and D hold, then leave with the page as the pin ends

   Inside B and D the live item steps down the list as it scrolls.

   WHO GETS IT: a screen at least 901px wide and 641px tall, with motion
   allowed. Everyone else keeps the static stack — the film on its last frame
   and the modules in order — which is also the no-script page.
   ========================================================================== */
(function () {
  'use strict';

  var sec = document.querySelector('[data-rsense]');
  if (!sec) return;
  var film = sec.querySelector('[data-rsense-film]');
  var card = sec.querySelector('[data-rsense-card]');
  var layers = {};
  var ls = sec.querySelectorAll('[data-rsense-layer]');
  for (var i = 0; i < ls.length; i++) layers[ls[i].getAttribute('data-rsense-layer')] = ls[i];
  var lists = {
    b: [].slice.call(sec.querySelectorAll('[data-rsense-list="b"] .rsense-item')),
    d: [].slice.call(sec.querySelectorAll('[data-rsense-list="d"] .rsense-item'))
  };

  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var big = window.matchMedia ? matchMedia('(min-width: 901px) and (min-height: 641px)') : { matches: true };

  function clamp(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }
  function ease(t) { t = clamp(t); return t * t * (3 - 2 * t); }
  /* Present between `a` and `d`, arriving over [a, b] and leaving over [c, d].
     A module that never leaves passes d = Infinity. */
  function window4(p, a, b, c, d) {
    if (p <= a || p >= d) return 0;
    if (p < b) return ease((p - a) / (b - a));
    if (p <= c) return 1;
    return 1 - ease((p - c) / (d - c));
  }

  var live = false;
  var played = false;
  var startPoster = film && film.getAttribute('data-poster-start');
  var endPoster = film && film.getAttribute('poster');

  /* ---- the film. One play; `ended` needs no handler because a video that is
     not looping simply holds its last frame. It is rewound only when the
     section has left the screen below, so coming back down the page from above
     shows the same held frame rather than replaying behind the reader. */
  function play() {
    if (!film || played) return;
    played = true;
    try {
      var pr = film.play();
      if (pr && pr.catch) pr.catch(function () { showEnd(); });
    } catch (e) { showEnd(); }
  }
  function rewind() {
    if (!film || !played) return;
    played = false;
    try { film.pause(); film.currentTime = 0; } catch (e) {}
  }
  function showEnd() {
    if (!film) return;
    /* The held frame, without the film: the end poster, and the video told to
       stop where it is. If the metadata is in, jump to the last frame too. */
    film.setAttribute('poster', endPoster);
    try {
      film.pause();
      if (film.duration && isFinite(film.duration)) film.currentTime = film.duration - 0.05;
    } catch (e) {}
  }

  function setLayer(el, presence, travel) {
    if (!el) return;
    el.style.setProperty('--rl-in', presence.toFixed(3));
    el.style.setProperty('--rl-y', travel.toFixed(3));
    el.setAttribute('aria-hidden', presence > 0.5 ? 'false' : 'true');
  }
  function stepList(items, p, from, to) {
    if (!items.length) return;
    var k = Math.floor(clamp((p - from) / (to - from)) * items.length);
    if (k > items.length - 1) k = items.length - 1;
    for (var j = 0; j < items.length; j++) {
      items[j].setAttribute('aria-current', j === k ? 'true' : 'false');
    }
  }

  function frame() {
    queued = false;
    var vh = window.innerHeight || 1;
    fadeIntro(vh);
    if (!live) return;
    var box = sec.getBoundingClientRect();
    var travel = box.height - vh;

    /* Before the pin: the section's top rising from the bottom of the screen to
       the top of it. */
    var open = ease(clamp((vh - box.top) / vh));
    var p = travel > 0 ? clamp(-box.top / travel) : 0;

    sec.style.setProperty('--rs-open', open.toFixed(4));
    sec.style.setProperty('--rs-p', p.toFixed(4));
    sec.style.setProperty('--rs-veil', ease(p / 0.10).toFixed(3));

    if (open > 0.6) play();
    if (box.top > vh) rewind();

    /* The copy never travels (0); the list's travel is in screen heights, from
       RISE below its resting place up to 0, linear in scroll so it moves at
       the reader's pace, with the last stretch eased so it settles rather
       than stops. The last pair has no exit: the page carries it off. */
    setLayer(layers.a, window4(p, 0.02, 0.09, 0.40, 0.47), 0);
    setLayer(layers.b, window4(p, 0.04, 0.12, 0.40, 0.47), RISE * (1 - scrollIn(p, 0.04, 0.38)));
    setLayer(layers.c, window4(p, 0.51, 0.58, 2, 3), 0);
    setLayer(layers.d, window4(p, 0.53, 0.61, 2, 3), RISE * (1 - scrollIn(p, 0.53, 0.90)));

    stepList(lists.b, p, 0.08, 0.38);
    stepList(lists.d, p, 0.57, 0.90);
  }

  /* How far below its resting place a list starts, in screen heights: far
     enough that it enters from the lower edge of the frame. */
  var RISE = 0.62;
  /* Linear for the first 80% of the span, then an ease-out into the rest, with
     the two joined at matching speed so there is no visible seam. */
  function scrollIn(p, a, b) {
    var t = clamp((p - a) / (b - a));
    var k = 0.8;
    if (t <= k) return t / (k + (1 - k) / 2);
    var u = (t - k) / (1 - k);
    return (k + (1 - k) * (u - u * u / 2)) / (k + (1 - k) / 2);
  }

  /* ---- the introduction above the film. Each line's presence comes from
     where its centre sits on the screen: it fades up across the lower fifth,
     holds through the middle, and fades back out across the top fifth.
     --ri-dir flips the settle so a line rises in from below and lifts away
     upward. Runs on every screen size, not just when the film is live. */
  var intro = document.querySelector('.rintro');
  var introLines = intro ? [].slice.call(intro.querySelectorAll('.rintro-h, .rintro-p')) : [];
  function fadeIntro(vh) {
    if (!introLines.length) return;
    if (calm.matches) { intro.removeAttribute('data-fade'); return; }
    intro.setAttribute('data-fade', '');
    for (var n = 0; n < introLines.length; n++) {
      var r = introLines[n].getBoundingClientRect();
      var c = (r.top + r.height / 2) / vh;
      var v = c > 0.5 ? ease((0.98 - c) / 0.2) : ease((c - 0.02) / 0.2);
      introLines[n].style.setProperty('--ri', v.toFixed(3));
      introLines[n].style.setProperty('--ri-dir', c > 0.5 ? '1' : '-1');
    }
  }

  var queued = false;
  function request() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(frame);
  }

  function clear() {
    var props = ['--rs-open', '--rs-p', '--rs-veil'];
    for (var i = 0; i < props.length; i++) sec.style.removeProperty(props[i]);
    for (var key in layers) {
      if (!layers.hasOwnProperty(key)) continue;
      layers[key].style.removeProperty('--rl-in');
      layers[key].style.removeProperty('--rl-y');
      layers[key].removeAttribute('aria-hidden');
    }
    for (var name in lists) {
      if (!lists.hasOwnProperty(name)) continue;
      for (var j = 0; j < lists[name].length; j++) lists[name][j].removeAttribute('aria-current');
    }
  }

  function decide() {
    var want = big.matches && !calm.matches;
    if (want === live) return;
    live = want;
    if (live) {
      sec.setAttribute('data-live', '');
      if (film && !played && startPoster) film.setAttribute('poster', startPoster);
      if (film) film.preload = 'auto';
      request();
    } else {
      sec.removeAttribute('data-live');
      clear();
      showEnd();
    }
  }

  if (film) {
    /* Without the timeline the held frame is the whole story; make sure the
       video shows it once it knows its own length. */
    film.addEventListener('loadedmetadata', function () { if (!live) showEnd(); });
  }

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  if (calm.addEventListener) calm.addEventListener('change', decide);
  if (big.addEventListener) big.addEventListener('change', decide);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(request);

  decide();
  if (!live) { showEnd(); request(); }
})();
