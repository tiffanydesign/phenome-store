/* store/supplements, the hero film's pause button.
   The film plays regardless of prefers-reduced-motion (the user's rule for
   the NAD+ gallery, applied here too); the button is the way to stop it.
   Offscreen it rests, and it resumes on the way back unless it was paused. */
(function () {
  var film = document.querySelector('[data-sx-film]');
  var btn = document.querySelector('[data-sx-play]');
  if (!film || !btn) return;
  var held = false;

  function paint() {
    btn.classList.toggle('is-paused', film.paused);
    btn.setAttribute('aria-label', film.paused ? 'Play the film' : 'Pause the film');
  }
  function play() { var p = film.play(); if (p && p.catch) p.catch(function () {}); }

  btn.addEventListener('click', function () {
    held = !film.paused;
    if (held) film.pause(); else play();
  });
  film.addEventListener('play', paint);
  film.addEventListener('pause', paint);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) { if (!film.paused) film.pause(); }
        else if (!held) play();
      });
    }).observe(film);
  }
  play();
  paint();

  /* The timeline's rail stops on the last dot. The kit's rail runs to a foot
     line this page does not have, so its end is measured here: the distance
     from the last step's dot to the bottom of the rail column. */
  (function railEnd() {
    var box = document.querySelector('.sx-how [data-ph-tl]');
    if (!box) return;
    function set() {
      var steps = box.querySelectorAll('.ph-tl-step');
      var last = steps[steps.length - 1];
      if (!last) return;
      var end = box.clientHeight - (last.offsetTop + 23);
      box.style.setProperty('--tl-end', Math.max(0, end) + 'px');
    }
    set();
    window.addEventListener('resize', set, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(set);
  })();

  /* A rail that fits its row has nothing to page through, so its arrows go.
     Skin & Beauty has one product and Anti-Inflammatory three: at desktop
     widths their arrows would sit there disabled, which reads as broken. */
  (function railArrows() {
    var cats = document.querySelectorAll('.sx-cat');
    if (!cats.length) return;
    function set() {
      Array.prototype.forEach.call(cats, function (c) {
        var rail = c.querySelector('[data-rail]');
        var nav = c.querySelector('[data-rail-nav]');
        if (!rail || !nav) return;
        nav.hidden = rail.scrollWidth <= rail.clientWidth + 2;
      });
    }
    set();
    window.addEventListener('resize', set, { passive: true });
    window.addEventListener('load', set);
  })();
})();
