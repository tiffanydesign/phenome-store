/* Home. Two carousels, both clocked by a CSS progress fill:
   the fill's animationend advances the slide, so what you see filling is exactly
   how long is left. Under reduced motion no bar runs, so nothing advances on
   its own and no film plays; every control still works by hand. */
(function () {
  'use strict';

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function play(v) {
    if (!v || still) return;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  function pause(v) { if (v && !v.paused) v.pause(); }

  // Restart a CSS animation on an element: drop the class, force a style
  // flush, add it back.
  function run(el) {
    if (!el) return;
    el.classList.remove('is-run');
    void el.offsetWidth;
    if (!still) el.classList.add('is-run');
  }

  // Hold a carousel's clock while it is off screen.
  function holdOffscreen(root) {
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) {
      var off = !es[0].isIntersecting;
      root.classList.toggle('is-held', off);
      root.querySelectorAll('.is-on video').forEach(off ? pause : play);
    }, { threshold: 0.15 }).observe(root);
  }

  /* ---------------- 1 · hero ---------------- */
  function hero(root) {
    var slides = [].slice.call(root.querySelectorAll('.dj-slide'));
    var n = slides.length;
    if (!n) return;
    var box = root.querySelector('.dj-dots');

    // One dot per slide. No words on them: the name is the button's label.
    var dots = slides.map(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dj-dot';
      b.setAttribute('aria-label', 'Show slide ' + (i + 1) + ' of ' + n + ', ' + s.getAttribute('data-name'));
      b.innerHTML = '<b><i></i></b>';
      b.addEventListener('click', function () { go(i); });
      b.querySelector('i').addEventListener('animationend', function () { go(cur + 1); });
      box.appendChild(b);
      return b;
    });

    var cur = -1;
    function go(i) {
      i = (i % n + n) % n;
      if (i === cur) return;
      cur = i;
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle('is-on', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        s.querySelectorAll('a').forEach(function (a) { a.tabIndex = on ? 0 : -1; });
        var v = s.querySelector('video');
        if (on) { if (v) { try { v.currentTime = 0; } catch (e) {} } play(v); } else pause(v);
      });
      root.classList.toggle('is-ink', slides[i].classList.contains('is-ink'));
      dots.forEach(function (d, k) {
        var on = k === i;
        d.classList.toggle('is-on', on);
        d.setAttribute('aria-current', on ? 'true' : 'false');
        var f = d.querySelector('i');
        if (on) run(f); else f.classList.remove('is-run');
      });
    }

    holdOffscreen(root);
    go(0);
  }

  /* ---------------- 3 · film carousel ---------------- */
  function films(root) {
    var track = root.querySelector('.dj-films-track');
    var real = [].slice.call(track.children);
    var n = real.length;
    if (n < 2) return;
    var PAD = 2;

    function clone(el) {
      var c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.classList.add('is-clone');
      c.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; });
      return c;
    }
    for (var p = 0; p < PAD; p++) {
      track.insertBefore(clone(real[n - 1 - p]), track.firstChild);
      track.appendChild(clone(real[p]));
    }
    var all = [].slice.call(track.children);

    var dashes = root.querySelector('.dj-dashes');
    var dots = real.map(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dj-dash';
      b.setAttribute('aria-label', 'Film ' + (i + 1) + ' of ' + n);
      b.innerHTML = '<b><i></i></b>';
      b.addEventListener('click', function () { to(i + PAD); });
      dashes.appendChild(b);
      b.querySelector('i').addEventListener('animationend', function () { to(k + 1); });
      return b;
    });

    var k = PAD;
    function place(anim) {
      var s = all[k];
      var x = root.clientWidth / 2 - (s.offsetLeft + s.offsetWidth / 2);
      track.classList.toggle('is-snap', !anim);
      track.style.transform = 'translate3d(' + x + 'px,0,0)';
      if (!anim) void track.offsetWidth;
    }
    function mark() {
      var at = ((k - PAD) % n + n) % n;
      all.forEach(function (s, j) {
        var on = j === k;
        s.classList.toggle('is-on', on);
        if (!s.classList.contains('is-clone')) {
          s.setAttribute('aria-hidden', on ? 'false' : 'true');
          s.querySelectorAll('a').forEach(function (a) { a.tabIndex = on ? 0 : -1; });
        }
        var v = s.querySelector('video');
        on ? play(v) : pause(v);
      });
      dots.forEach(function (d, j) {
        d.classList.toggle('is-done', j < at);
        d.setAttribute('aria-current', j === at ? 'true' : 'false');
        var i = d.querySelector('i');
        if (j === at) run(i); else i.classList.remove('is-run');
      });
    }
    function to(next) {
      k = next;
      place(true);
      mark();
    }
    track.addEventListener('transitionend', function (e) {
      if (e.target !== track) return;
      if (k >= n + PAD) k -= n;
      else if (k < PAD) k += n;
      else return;
      place(false);
      // The clone and its original are the same picture; swapping which one is
      // live must not restart the dash or the film.
      all.forEach(function (s, j) { s.classList.toggle('is-on', j === k); });
      all.forEach(function (s, j) { if (j !== k) pause(s.querySelector('video')); });
      play(all[k].querySelector('video'));
    });

    root.querySelector('.dj-film-nav.is-prev').addEventListener('click', function () { to(k - 1); });
    root.querySelector('.dj-film-nav.is-next').addEventListener('click', function () { to(k + 1); });

    // Swipe on touch; a flick of 50px is a step.
    var x0 = null;
    track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    track.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) to(k + (dx < 0 ? 1 : -1));
    });
    track.style.touchAction = 'pan-y';

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { place(false); }, 60);
    });

    holdOffscreen(root);
    place(false);
    mark();
  }

  document.querySelectorAll('[data-dj-hero]').forEach(hero);
  document.querySelectorAll('[data-dj-films]').forEach(films);
})();
