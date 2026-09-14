/* ============================================================================
   PhenomeTech Ring — the sensing film's timeline
   2026-09-14. One reader, one rAF, custom properties out; story.css does all
   the drawing. ES5-shaped like the rest of the site's scripts.

   THE TIMELINE, in fractions of the pinned track (story.css § 2b):

     before the pin   the card opens to the full screen (--rs-open), and the
                      film starts once it is mostly open — ONE play, no loop,
                      so it comes to rest on its last frame and stays there
     .00 – 1          the film pushes in slowly across the pinned travel

   THE MODULES ARE GONE (2026-09-14, by request) and the schedule went with
   them: two rounds of copy and two lists used to fade up and scroll past the
   film on windows written here in fractions, and the veil rose under them.
   With nothing carried over the film there is no presence to publish, no list
   to step and nothing for a veil to sit behind — so setLayer, stepList,
   window4, scrollIn and the veil's own ramp are all deleted rather than left
   computing values no rule reads. What is left is the film: it opens, it
   plays, it drifts, it holds.

   WHO GETS IT: a screen at least 901px wide and 641px tall, with motion
   allowed. Everyone else keeps the static form — the film on its last frame
   inside the black band — which is also the no-script page.
   ========================================================================== */
(function () {
  'use strict';

  var sec = document.querySelector('[data-rsense]');
  if (!sec) return;
  var film = sec.querySelector('[data-rsense-film]');

  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var big = window.matchMedia ? matchMedia('(min-width: 901px) and (min-height: 641px)') : { matches: true };

  function clamp(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }
  function ease(t) { t = clamp(t); return t * t * (3 - 2 * t); }

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

    if (open > 0.6) play();
    if (box.top > vh) rewind();
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
    var props = ['--rs-open', '--rs-p'];
    for (var i = 0; i < props.length; i++) sec.style.removeProperty(props[i]);
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
