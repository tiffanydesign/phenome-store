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
})();
