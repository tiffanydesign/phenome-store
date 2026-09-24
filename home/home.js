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

  /* ---------------- 1b · the bar takes its colour from the hero ----------------
     devices/ring's sampler, generalised to a fading carousel. For each visible
     slide: the average of the picture strip that sits behind the bar, blended
     with the slide's flat ground (--g) where the picture does not reach. The
     slides are then composited by their live opacity, top slide last, over the
     hero's black, so a crossfade moves the bar with the picture. Read every
     second frame, eased every frame (EASE of the remaining gap), no CSS
     transition to fight it. A tainted canvas switches the sampler off for good
     and leaves the site's white bar. */
  function navTint(root) {
    var body = document.body;
    var slides = [].slice.call(root.querySelectorAll('.dj-slide'));
    var cv = document.createElement('canvas');
    cv.width = 8; cv.height = 2;
    var ctx = cv.getContext && cv.getContext('2d', { willReadFrequently: true });
    if (!ctx || !slides.length) return;

    var READ_EVERY = 2, EASE = 0.3;
    var ok = true, running = false, tick = 0, target = null, cur = null;

    function navH() {
      var nav = document.querySelector('.ph-nav');
      return nav ? nav.getBoundingClientRect().bottom : 44;
    }
    function rgb(s) {
      var m = (s || '').match(/[\d.]+/g);
      if (m && m.length >= 3) return [+m[0], +m[1], +m[2]];
      var h = (s || '').trim().replace('#', '');
      if (h.length === 6) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
      return [0, 0, 0];
    }

    // The colour behind the bar for one slide.
    function slideColour(s, h) {
      var media = s.querySelector('.dj-media');
      var ground = rgb(getComputedStyle(media).backgroundColor);
      var v = media.querySelector('video');
      if (!v || v.readyState < 2 || !v.videoWidth) return ground;
      var box = v.getBoundingClientRect();
      var W = window.innerWidth;
      var cs = getComputedStyle(v);
      var sc = cs.objectFit === 'cover'
        ? Math.max(box.width / v.videoWidth, box.height / v.videoHeight)
        : Math.min(box.width / v.videoWidth, box.height / v.videoHeight);
      var dw = v.videoWidth * sc, dh = v.videoHeight * sc;
      var pos = (cs.objectPosition || '50% 50%').split(' ');
      var left = box.left + (box.width - dw) * (parseFloat(pos[0]) || 50) / 100;
      var top = box.top + (box.height - dh) * (parseFloat(pos[1]) || 50) / 100;
      // Picture that is on screen, inside the element box, and under the bar.
      var x0 = Math.max(left, box.left, 0), x1 = Math.min(left + dw, box.right, W);
      var y0 = Math.max(top, box.top, 0), y1 = Math.min(top + dh, box.bottom, h);
      if (x1 <= x0 || y1 <= y0) return ground;
      ctx.drawImage(v, (x0 - left) / sc, (y0 - top) / sc, (x1 - x0) / sc, Math.max(1, (y1 - y0) / sc), 0, 0, 8, 2);
      var d = ctx.getImageData(0, 0, 8, 2).data, r = 0, g = 0, b = 0, n = d.length / 4;
      for (var i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      var f = (x1 - x0) / W;   // share of the bar's width the picture covers
      return [r / n * f + ground[0] * (1 - f), g / n * f + ground[1] * (1 - f), b / n * f + ground[2] * (1 - f)];
    }

    function sample() {
      var h = navH(), c = [0, 0, 0], on = null;
      var layer = function (s) {
        var o = parseFloat(getComputedStyle(s).opacity) || 0;
        if (o <= 0) return;
        var k = slideColour(s, h);
        for (var j = 0; j < 3; j++) c[j] = o * k[j] + (1 - o) * c[j];
      };
      try {
        slides.forEach(function (s) { if (s.classList.contains('is-on')) on = s; else layer(s); });
        if (on) layer(on);
      } catch (e) { ok = false; stop(); clear(); return; }
      target = c;
      if (!cur) cur = c.slice();
    }
    function paint() {
      var r = Math.round(cur[0]), g = Math.round(cur[1]), b = Math.round(cur[2]);
      var dark = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5;
      body.style.setProperty('--nav-tint', r + ' ' + g + ' ' + b);
      body.style.setProperty('--nav-tint-alpha', '.72');
      body.style.setProperty('--nav-ink', dark ? '#fff' : 'var(--ph-text-1)');
      body.style.setProperty('--nav-rim', dark ? 'rgba(255,255,255,.38)' : 'var(--border-strong)');
      body.classList.toggle('is-nav-dark', dark);
    }
    function clear() {
      ['--nav-tint', '--nav-tint-alpha', '--nav-ink', '--nav-rim'].forEach(function (p) { body.style.removeProperty(p); });
      body.classList.remove('is-nav-dark');
    }
    function frame() {
      if (!running) return;
      // An open menu or search sheet is the bar's own light surface.
      if (document.documentElement.classList.contains('ph-menu-open') ||
          document.documentElement.classList.contains('ph-search-open')) {
        cur = target = null; clear();
      } else {
        if (tick++ % READ_EVERY === 0) sample();
        if (target && cur) {
          for (var j = 0; j < 3; j++) cur[j] += (target[j] - cur[j]) * EASE;
          paint();
        }
      }
      raf = requestAnimationFrame(frame);
    }
    var raf = 0;
    function start() { if (ok && !running) { running = true; tick = 0; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; cancelAnimationFrame(raf); cur = target = null; }

    function sync() {
      var under = root.getBoundingClientRect().bottom > navH() && !document.hidden;
      if (under) start(); else { stop(); clear(); }
    }
    var queued = false;
    function request() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; sync(); });
    }
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  document.querySelectorAll('[data-dj-hero]').forEach(function (h) { hero(h); navTint(h); });
  document.querySelectorAll('[data-dj-films]').forEach(films);
})();
