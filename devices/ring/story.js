/* ============================================================================
   PhenomeTech Ring — the sensing film's timeline
   2026-09-14. One reader, one rAF, custom properties out; story.css does all
   the drawing. ES5-shaped like the rest of the site's scripts.

   THE TIMELINE, in fractions of the pinned track (story.css § 2b):

     before the pin   the card opens to the full screen (--rs-open), and the
                      film starts once it is mostly open — ONE play, no loop,
                      so it comes to rest on its last frame and stays there
     .00 – .10        the veil rises
     .03 – .42        module A (Five layers) in, held, then carried out upward
     .10 – .46        module B (the five readings), a beat behind A
     .52 – 1          module C (Completing the circle), held to the end
     .58 – 1          module D (the five services)

   Inside B and D the live item steps through the list as the module holds.

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
    if (!live) return;
    var box = sec.getBoundingClientRect();
    var vh = window.innerHeight || 1;
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

    /* Travel is signed and centred on each module's hold, so a module rises
       through the screen as the reader scrolls: below when arriving, above
       when leaving. The depth multiplier in story.css turns it into pixels. */
    setLayer(layers.a, window4(p, 0.03, 0.12, 0.34, 0.42), (0.22 - p) / 0.22);
    setLayer(layers.b, window4(p, 0.10, 0.19, 0.38, 0.46), (0.28 - p) / 0.22);
    /* The last pair never leaves, so its travel is capped: it keeps drifting up
       a little as the track runs out instead of sailing off the top. */
    setLayer(layers.c, window4(p, 0.52, 0.61, 2, 3), Math.max((0.72 - p) / 0.22, -0.4));
    setLayer(layers.d, window4(p, 0.58, 0.67, 2, 3), Math.max((0.78 - p) / 0.22, -0.4));

    stepList(lists.b, p, 0.14, 0.40);
    stepList(lists.d, p, 0.62, 0.96);
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
  if (!live) showEnd();
})();
