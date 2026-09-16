/* ============================================================================
   contact · page script, for body.ctc

   Three behaviours, and nothing else runs on this page:
     1 · the gallery — arrows, dots, keyboard, drag
     2 · the floating number — copy to clipboard, with the answer shown in the
         control that was pressed
     3 · the form — a local confirmation, because there is no endpoint yet

   Written in the same ES5 shared.js is, for the same reason: this file loads
   after it on every page that includes it, and a syntax error a browser cannot
   parse takes the whole script out, not the one behaviour it belongs to.
   ========================================================================= */
(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     1 · THE GALLERY

     The index lives in one place — a CSS custom property on the track — and
     everything else is read back from it. The transform is the independent
     `translate` property, which is what lets this coexist with shared.css's
     section reveal: that rule animates `transform` on `main > section > *`, and
     two rules writing the same property is how a slide ends up half travelled.
     ---------------------------------------------------------------------- */
  function gallery(root) {
    var track = root.querySelector('[data-gal-track]');
    var frame = root.querySelector('[data-gal-frame]');
    var dots = root.querySelector('[data-gal-dots]');
    var cap = root.querySelector('[data-gal-cap]');
    var prev = root.querySelector('[data-gal-step="-1"]');
    var next = root.querySelector('[data-gal-step="1"]');
    if (!track || !frame) return;

    var slides = track.children;
    var count = slides.length;
    if (count < 2) return;

    var captions = [];
    var src = root.querySelector('[data-gal-captions]');
    if (src) { try { captions = JSON.parse(src.textContent); } catch (e) { captions = []; } }

    var i = 0;

    /* The dots are built here rather than typed into the markup so the count
       can never disagree with the number of frames. A page that ships seven
       photographs and six dots is the failure this prevents. */
    var buttons = [];
    if (dots) {
      for (var d = 0; d < count; d++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ctc-gal-dot';
        b.setAttribute('aria-label', 'Image ' + (d + 1) + ' of ' + count);
        b.setAttribute('role', 'tab');
        (function (n) {
          b.addEventListener('click', function () { go(n); });
        })(d);
        dots.appendChild(b);
        buttons.push(b);
      }
    }

    function draw() {
      track.style.setProperty('--i', i);
      for (var n = 0; n < count; n++) {
        /* Everything off screen leaves the tab order. A link or a control inside
           a slide nobody can see is still focusable, and a keyboard reader lands
           on it with the page apparently unchanged. */
        slides[n].setAttribute('aria-hidden', n === i ? 'false' : 'true');
        if (buttons[n]) buttons[n].setAttribute('aria-current', n === i ? 'true' : 'false');
      }
      if (cap && captions[i]) cap.textContent = captions[i];
      /* Ends are disabled rather than wrapped. Six frames of one building is a
         set with a first and a last, not a loop, and a carousel that wraps hides
         from a reader the fact that they have seen all of it. */
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === count - 1;
    }

    function go(n) {
      i = Math.max(0, Math.min(count - 1, n));
      draw();
    }

    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });

    /* Arrow keys, but only once the gallery has focus inside it. Binding them
       to the document would steal the arrow keys from the page's own scrolling
       for every reader who never looked at the photographs. */
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(i - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(i + 1); e.preventDefault(); }
    });

    /* Drag, with one pointer, and a threshold of a twelfth of the frame so a
       press that wanders two pixels is still a press. Pointer events rather
       than touch events: the same handler then serves a trackpad, a stylus and
       a finger, and a laptop reader can throw the frames sideways too. */
    var x0 = null, w = 0;
    frame.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      x0 = e.clientX;
      w = frame.getBoundingClientRect().width;
    });
    frame.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > w / 12) go(dx < 0 ? i + 1 : i - 1);
    });
    frame.addEventListener('pointercancel', function () { x0 = null; });

    draw();
  }

  /* -------------------------------------------------------------------------
     2 · THE FLOATING NUMBER

     navigator.clipboard is not available on an insecure origin and can be
     refused by permission on a secure one, so the failure path matters: if the
     copy does not happen the label must NOT say it did. It falls back to
     selecting the number so a reader can copy it themselves, and only the
     success path swaps the label.
     ---------------------------------------------------------------------- */
  function copyButton(btn) {
    var text = btn.getAttribute('data-copy') || btn.textContent;
    var label = btn.textContent;
    var timer = null;

    function confirmed() {
      btn.textContent = 'Copied';
      btn.classList.add('is-copied');
      clearTimeout(timer);
      timer = setTimeout(function () {
        btn.textContent = label;
        btn.classList.remove('is-copied');
      }, 1800);
    }

    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(confirmed, function () {});
        return;
      }
      /* No clipboard. Put the number on screen selected instead of pretending. */
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { if (document.execCommand('copy')) confirmed(); } catch (e) {}
      document.body.removeChild(ta);
    });
  }

  /* -------------------------------------------------------------------------
     3 · THE FORM

     There is no endpoint. The confirmation is local and it is honest about
     being local only in the copy, which is signed off. What this replaces is an
     inline onsubmit that set style.display on a paragraph: the paragraph is now
     hidden with the `hidden` attribute, so it is out of the accessibility tree
     as well as off the screen until there is something to say.
     ---------------------------------------------------------------------- */
  function form(el) {
    var sent = el.querySelector('[data-sent]');
    el.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!sent) return;
      sent.hidden = false;
    });
  }

  function init() {
    var g = document.querySelector('[data-gal]');
    if (g) gallery(g);

    var copies = document.querySelectorAll('[data-copy]');
    for (var i = 0; i < copies.length; i++) copyButton(copies[i]);

    var f = document.querySelector('[data-ctc-form]');
    if (f) form(f);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
