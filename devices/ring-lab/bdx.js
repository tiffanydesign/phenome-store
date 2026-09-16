/* devices/ring-lab · bdx · behaviour for the archived Band design.

   The same five routines devices/band/band.js runs for these sections —
   the marquee, the growing circle, the round carousel, the bento panels and
   the specification accordion — with every query rooted at `.bdx` so this
   cannot reach the five other design studies on the page. Each one guards on
   its own elements and returns quietly without them. */
(function () {
  'use strict';

  var root = document.querySelector('[data-bdx]');
  if (!root) return;

  var doc = document;
  var still = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || root).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || root).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }

  /* one shared rAF scroll loop */
  var scrollFns = [];
  var queued = false;
  function onScroll(fn) {
    if (!scrollFns.length) {
      var run = function () { queued = false; scrollFns.forEach(function (f) { f(); }); };
      var q = function () { if (!queued) { queued = true; requestAnimationFrame(run); } };
      window.addEventListener('scroll', q, { passive: true });
      window.addEventListener('resize', q);
    }
    scrollFns.push(fn);
    fn();
  }

  /* ---- the marquee: the row is doubled so the loop has no seam ------------ */
  function marquee() {
    var m = $('[data-marquee]');
    if (!m) return;
    var row = $('.bd-marquee-row', m);
    $$('li', row).forEach(function (li) {
      var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); row.appendChild(c);
    });
    /* a constant speed whatever the viewport: about 70px per second */
    var fix = function () { row.style.setProperty('--mq-s', Math.max(30, row.scrollWidth / 2 / 70) + 's'); };
    fix();
    window.addEventListener('resize', fix);
  }

  /* ---- the dark circle grows with the scroll ------------------------------ */
  function coach() {
    var sec = $('[data-coach]');
    if (!sec) return;
    var stage = $('.bd-coach-stage', sec);
    var orb = $('[data-orb]', sec);
    var head = $('.bd-coach-h', sec);
    if (!stage || !orb || !head) return;
    function frame() {
      var r = sec.getBoundingClientRect();
      var vh = window.innerHeight, vw = window.innerWidth;
      var run = sec.offsetHeight - vh;
      var p = run > 0 ? clamp(-r.top / run, 0, 1) : 1;
      var drop = vh * 0.3;
      var cy = vh + drop;
      var full = Math.sqrt(Math.pow(vw / 2, 2) + Math.pow(cy, 2)) + 2;
      var e = clamp((p - 0.08) / 0.72, 0, 1);
      e = 1 - Math.pow(1 - e, 2.2);
      orb.style.setProperty('--orb-drop', drop + 'px');
      orb.style.setProperty('--orb-r', (e * full) + 'px');
      orb.style.setProperty('--orb-copy', ((1 - e) * vh * 0.28 - e * vh * 0.1) + 'px');
      head.style.setProperty('--c-lift', (e * vh * 0.18) + 'px');
      sec.style.setProperty('--orb-full', e.toFixed(3));
    }
    onScroll(frame);
  }

  /* ---- the round carousel ------------------------------------------------- */
  function apps() {
    var stage = $('[data-apps]');
    if (!stage) return;
    var items = $$('.bd-app', stage);
    var n = items.length, cur = 0, timer = 0, visible = false;
    var dotsBox = $('[data-apps-dots]', stage);
    var dots = items.map(function () { var i = doc.createElement('i'); dotsBox.appendChild(i); return i; });

    function offset(i) {
      var o = i - cur;
      if (o > n / 2) o -= n;
      if (o < -n / 2) o += n;
      return o;
    }
    var last = items.map(function (it, i) { return offset(i); });
    function paint() {
      items.forEach(function (it, i) {
        var o = offset(i);
        it.classList.toggle('is-jump', Math.abs(o - last[i]) > 1);
        it.style.setProperty('--o', o);
        it.classList.toggle('on', o === 0);
        last[i] = o;
      });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
    }
    function go(i) { cur = (i + n) % n; paint(); schedule(); }
    function schedule() {
      clearTimeout(timer);
      if (still.matches || !visible) return;
      timer = setTimeout(function () { go(cur + 1); }, 3200);
    }
    items.forEach(function (it, i) { $('.bd-app-img', it).addEventListener('click', function () { go(i); }); });

    var x0 = null;
    stage.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    stage.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener('mouseenter', function () { clearTimeout(timer); });
    stage.addEventListener('mouseleave', schedule);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.3 }).observe(stage);
    } else { visible = true; }
    paint();
  }

  /* ---- the bento panels draw in once ------------------------------------- */
  function bento() {
    var b = $('.bd-bento');
    if (!b) return;
    if (!('IntersectionObserver' in window)) { b.classList.add('is-in'); return; }
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      b.classList.add('is-in'); io.disconnect();
    }, { threshold: 0.25 });
    io.observe(b);
  }

  /* ---- specifications: one open at a time, animated height ---------------- */
  function specs() {
    var list = $$('[data-acc-group] details');
    list.forEach(function (d) {
      var sum = $('summary', d);
      if (!sum) return;
      sum.addEventListener('click', function (e) {
        e.preventDefault();
        var opening = !d.open;
        list.forEach(function (o) { if (o !== d && o.open) animate(o, false); });
        animate(d, opening);
      });
      function animate(el, open) {
        var p = $('div', el);
        if (still.matches || !p) { el.open = open; return; }
        if (open) {
          el.open = true;
          var h = p.scrollHeight;
          p.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
        } else {
          var h2 = p.scrollHeight;
          var a = p.animate([{ height: h2 + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: 'ease' });
          a.onfinish = function () { el.open = false; };
        }
      }
    });
  }

  marquee();
  coach();
  apps();
  bento();
  specs();
})();
