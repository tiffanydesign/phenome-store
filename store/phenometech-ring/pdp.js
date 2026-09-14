/* ============================================================================
   PhenomeTech Ring — the product page's own behaviour

   LOADED AFTER shared.js, and that order is load-bearing rather than tidy:
   shared.js builds the nav, the footer and `.ph-bar` synchronously inside its
   own IIFE, so by the time this file parses those elements exist and can be
   enhanced instead of re-created. Nothing here re-implements anything
   shared.js already does — the pinned band's index, the figure count-up, the
   section reveal and the product bar's observer are all still shared.js's,
   and this file reads their output.

   EVERY CONTROL ON THIS PAGE SHIPS AS A BUTTON WITH ITS STATE IN THE MARKUP.
   The page's previous version painted `.on` onto a div and stopped: five
   swatches, eight size chips and two material cards that looked like controls
   and were pictures. So the rule for this file is the one shared.js writes for
   its rail arrows — "ship the buttons, wire them later" leaves dead controls,
   so ship real controls and let this make them live. Where a control genuinely
   cannot work without script (the lightbox), it is created here.

   ES5-shaped on purpose: var, function declarations, no template literals, no
   optional chaining. shared.js is written that way and one page introducing a
   second dialect is a second thing to maintain.

   Every lookup is guarded. shared.js's own note says the build fails on ONE
   console error, so a missing element returns rather than throws.
   ========================================================================== */

(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var still = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false, addEventListener: function () {} };

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt); }

  /* One rAF-coalesced scroll subscription for the page rather than one per
     component. Three things below read the scroll position; three separate
     listeners would each schedule their own frame. */
  var readers = [];
  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      for (var i = 0; i < readers.length; i++) readers[i]();
    });
  }
  function watch(fn) {
    readers.push(fn);
    fn();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* ==========================================================================
     1 · THE PRODUCT'S STATE
     One object, three facts, and every part of the page that shows one of them
     subscribes. The alternative — each control reaching into the others — is
     what makes the hero and the comparison table disagree about which material
     is selected, which is exactly the bug the "Choose ceramic" button below is
     there to avoid creating.
     ====================================================================== */

  /* THE CATALOGUE IS THE PAGE'S OWN COPY, not a new set of claims. Prices,
     material names and colourway names are read off the markup that was already
     there (`Titanium £179 / Ceramic £199`, `Gold · Graphite · Silver`,
     `Arctic White or Onyx`); what is added is which film, which still and which
     three tones go with which finish.

     `clip` is the scene in the colourway film. Graphite and Onyx point at the
     same one for the same reason they point at the same still: the shoot
     delivered one black ring, and the ring is black in both materials.

     `hi / body / sh` are the three tones the swatch is drawn from — a
     highlight, the body, and the shaded side, sampled off that ring's own
     photograph. They live here rather than only in the stylesheet because the
     bead in the film's tag needs the same three and one table is better than
     two; the CSS holds them too, keyed by `data-tone`, for the swatches that
     never change. */
  var FINISHES = [
    { id: 'gold',     name: 'Gold',         mat: 'titanium', clip: 'gold',
      hi: '#fdf0dc', body: '#cfa878', sh: '#6c5036' },
    { id: 'graphite', name: 'Graphite',     mat: 'titanium', clip: 'graphite',
      hi: '#eceaf1', body: '#2b2a36', sh: '#101019' },
    { id: 'silver',   name: 'Silver',       mat: 'titanium', clip: 'silver',
      hi: '#eef0f4', body: '#a8afba', sh: '#5b6371' },
    { id: 'white',    name: 'Arctic White', mat: 'ceramic',  clip: 'white',
      hi: '#ffffff', body: '#dfe2e9', sh: '#aeb4c1' },
    { id: 'onyx',     name: 'Onyx',         mat: 'ceramic',  clip: 'graphite',
      hi: '#6e7783', body: '#14161a', sh: '#000000' }
  ];
  var MATERIALS = {
    titanium: { name: 'Titanium', price: 179, mo: '14.92', sw: '#C6A15B' },
    ceramic:  { name: 'Ceramic',  price: 199, mo: '16.58', sw: '#D6D6DA' }
  };

  var state = { material: 'titanium', finish: 'gold', size: '8', kit: false };
  var subs = [];
  function publish() { for (var i = 0; i < subs.length; i++) subs[i](state); }
  function subscribe(fn) { subs.push(fn); }

  function finishById(id) {
    for (var i = 0; i < FINISHES.length; i++) if (FINISHES[i].id === id) return FINISHES[i];
    return FINISHES[0];
  }
  function firstFinishOf(mat) {
    for (var i = 0; i < FINISHES.length; i++) if (FINISHES[i].mat === mat) return FINISHES[i];
    return FINISHES[0];
  }
  function money(n) { return '£' + n; }

  function setMaterial(mat) {
    if (!MATERIALS[mat] || state.material === mat) return;
    state.material = mat;
    /* The finish has to follow the material or the page shows a ceramic ring
       under a titanium price. Kept if it belongs to the new material, otherwise
       the new material's first. */
    if (finishById(state.finish).mat !== mat) state.finish = firstFinishOf(mat).id;
    publish();
  }
  function setFinish(id) {
    var f = finishById(id);
    if (state.finish === id) return;
    /* Choosing a finish also chooses its material. A reader who clicks Arctic
       White has said "ceramic" as clearly as if they had clicked the card. */
    state.finish = id;
    state.material = f.mat;
    publish();
  }
  function setSize(sz) {
    if (state.size === sz && !state.kit) return;
    state.size = sz; state.kit = false;
    publish();
  }
  function setKit() {
    if (state.kit) return;
    state.kit = true;
    publish();
  }

  /* ==========================================================================
     2 · THE GALLERY
     ====================================================================== */

  function gallery() {
    var main = $('[data-gal-main]');
    if (!main) return;

    var films = $$('video[data-clip]', main);
    /* `stillTile`, not `still`: the module-level `still` is the reduced-motion
       media query and shadowing it here silently broke the check below. */
    var stillTile = $('[data-gal-still]');
    var frames = stillTile ? $$('img[data-finish]', stillTile) : [];
    var stillCap = $('[data-still-cap]');
    var tag = $('[data-gal-tag]', main);
    var tagName = tag ? $('span', tag) : null;
    var tagDot = tag ? $('i', tag) : null;

    /* The `data-live` flag hands the crossfade over from CSS to script. Until
       it is set, `:not([data-live]) video:first-of-type` keeps the first clip's
       poster visible, so a page whose script never runs shows a picture rather
       than a black box. */
    main.setAttribute('data-live', '');
    if (stillTile) stillTile.setAttribute('data-live', '');

    /* ONLY THE CURRENT CLIP PLAYS. Four decoders running for three frames
       nobody can see is four decoders' worth of battery, and on a phone it is
       the difference between a hero that scrolls and one that stutters. The
       outgoing clip is paused AFTER the crossfade rather than with it — pausing
       first shows a frozen frame fading out, which reads as a stall — and the
       timeout re-checks the class before pausing, so flicking back and forth
       across the swatches cannot pause the one that is now showing. */
    var FADE = 560;
    /* Held by the reader, not by the code. Once it is true a swatch change
       swaps the picture and leaves it still — which is the whole point of a
       pause control on a thing that also changes underneath you. */
    var held = still.matches;
    var hold = $('[data-gal-hold]');

    function run(f) {
      for (var i = 0; i < films.length; i++) {
        (function (v) {
          var on = v.getAttribute('data-clip') === f.clip;
          v.classList.toggle('on', on);
          v.setAttribute('aria-hidden', on ? 'false' : 'true');
          if (on) {
            /* `still.matches` is read here rather than captured at boot, so a
               reader who turns reduced-motion on mid-session gets a poster on
               the next swatch instead of a film. */
            if (!held && !still.matches) { try { v.play(); } catch (e) {} }
          } else if (!v.paused) {
            setTimeout(function () {
              if (!v.classList.contains('on')) { try { v.pause(); } catch (e) {} }
            }, FADE);
          }
        })(films[i]);
      }
      paintHold();
    }

    function paintHold() {
      if (!hold) return;
      if (held) hold.setAttribute('data-paused', '');
      else hold.removeAttribute('data-paused');
      hold.setAttribute('aria-label', held ? 'Play the film' : 'Pause the film');
    }

    on(hold, 'click', function () {
      held = !held;
      var v = $('video.on', main);
      if (v) {
        if (held) { try { v.pause(); } catch (e) {} }
        else { try { v.play(); } catch (e) {} }
      }
      paintHold();
    });
    /* If reduced-motion comes on mid-session the films are stopped elsewhere;
       this keeps the button telling the truth about it. */
    if (still.addEventListener) {
      still.addEventListener('change', function () {
        if (still.matches) { held = true; paintHold(); }
      });
    }

    subscribe(function (s) {
      var f = finishById(s.finish);
      run(f);

      for (var i = 0; i < frames.length; i++) {
        var isOn = frames[i].getAttribute('data-finish') === s.finish;
        frames[i].classList.toggle('on', isOn);
        /* A frame that is not showing is not announced. Five stacked images
           would otherwise be five identical alt texts in a row. */
        frames[i].setAttribute('aria-hidden', isOn ? 'false' : 'true');
      }
      if (stillCap) stillCap.textContent = f.name;
      if (tagName) tagName.textContent = MATERIALS[s.material].name + ' · ' + f.name;
      if (tagDot) {
        tagDot.style.setProperty('--rf-hi', f.hi);
        tagDot.style.setProperty('--rf-body', f.body);
        tagDot.style.setProperty('--rf-sh', f.sh);
      }
    });
  }

  /* ---- the lightbox --------------------------------------------------------
     Built here rather than shipped in the markup: it is the one control on this
     page that has nothing to offer without script, so a reader who does not get
     the script should not get a dead overlay in their tab order either.
     The item list is the gallery's own frames plus the four tiles, read from the
     DOM at open time so it cannot drift from what is on screen. */
  function lightbox() {
    var tiles = $$('[data-lb]');
    var main = $('[data-gal-main]');
    if (!tiles.length && !main) return;

    var box = doc.createElement('div');
    box.className = 'pdp-lb';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Product images');
    box.innerHTML =
      '<div class="pdp-lb-frame"><p class="pdp-lb-cap"></p></div>' +
      '<button class="pdp-lb-btn pdp-lb-prev" type="button" aria-label="Previous image">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<button class="pdp-lb-btn pdp-lb-next" type="button" aria-label="Next image">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<button class="pdp-lb-btn pdp-lb-close" type="button" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
      '</button>';
    doc.body.appendChild(box);

    var frame = $('.pdp-lb-frame', box);
    var cap = $('.pdp-lb-cap', box);
    var btnPrev = $('.pdp-lb-prev', box);
    var btnNext = $('.pdp-lb-next', box);
    var btnClose = $('.pdp-lb-close', box);
    var items = [], idx = 0, opener = null;

    /* Read at open time, not at boot, because two of the things in this list
       change: the big frame is whichever colourway film is running, and the
       first tile is whichever studio still is showing. `.on` first, then the
       first child as the fallback for the case where the script set no state. */
    function collect() {
      items = [];
      if (main) {
        var film = $('video.on', main) || $('video', main);
        if (film) {
          items.push({
            kind: 'video', el: film,
            cap: film.getAttribute('aria-label') || ''
          });
        }
      }
      for (var i = 0; i < tiles.length; i++) {
        var g = $('img.on', tiles[i]) || $('img', tiles[i]);
        var c = $('.cap', tiles[i]);
        var label = c ? c.textContent : (tiles[i].getAttribute('aria-label') || '');
        if (g) items.push({ kind: 'img', src: g.currentSrc || g.src, cap: label });
      }
    }

    function paint() {
      var it = items[idx];
      if (!it) return;
      var old = frame.querySelector('img, video');
      if (old) frame.removeChild(old);
      var node;
      if (it.kind === 'video') {
        /* The film is cloned rather than moved. Moving it stops the copy in the
           mosaic, so closing the overlay would leave a frozen tile behind. */
        node = it.el.cloneNode(true);
        node.setAttribute('controls', '');
        node.removeAttribute('tabindex');
        node.muted = false;
      } else {
        node = doc.createElement('img');
        node.src = it.src;
        node.alt = it.cap;
        node.decoding = 'async';
      }
      frame.insertBefore(node, cap);
      cap.textContent = it.cap;
      var many = items.length > 1;
      btnPrev.hidden = !many;
      btnNext.hidden = !many;
      if (node.tagName === 'VIDEO' && !still.matches) { try { node.play(); } catch (e) {} }
    }

    function open(i) {
      collect();
      if (!items.length) return;
      idx = Math.max(0, Math.min(i, items.length - 1));
      opener = doc.activeElement;
      root.classList.add('pdp-lb-open');
      doc.body.classList.add('pdp-lb-open');
      box.classList.add('on');
      paint();
      btnClose.focus();
    }
    function close() {
      box.classList.remove('on');
      root.classList.remove('pdp-lb-open');
      doc.body.classList.remove('pdp-lb-open');
      var v = frame.querySelector('video');
      if (v) { try { v.pause(); } catch (e) {} }
      if (opener && opener.focus) opener.focus();
    }
    function step(d) {
      idx = (idx + d + items.length) % items.length;
      paint();
    }

    on(btnPrev, 'click', function () { step(-1); });
    on(btnNext, 'click', function () { step(1); });
    on(btnClose, 'click', close);
    /* The backdrop closes; the picture does not. `contains` rather than
       `target === box` so a click on the caption is inside, not outside. */
    on(box, 'click', function (e) {
      if (!frame.contains(e.target) && e.target.className.indexOf('pdp-lb-btn') === -1) close();
    });
    on(doc, 'keydown', function (e) {
      if (!box.classList.contains('on')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowLeft') { step(-1); return; }
      if (e.key === 'ArrowRight') { step(1); return; }
      /* Focus stays in the overlay: three buttons, so the trap is a cycle of
         three rather than a general-purpose tabbable scan. */
      if (e.key === 'Tab') {
        var ring = [btnClose, btnPrev, btnNext].filter(function (b) { return !b.hidden; });
        var at = ring.indexOf(doc.activeElement);
        e.preventDefault();
        ring[(at + (e.shiftKey ? -1 : 1) + ring.length) % ring.length].focus();
      }
    });

    var zoom = $('[data-gal-zoom]');
    on(zoom, 'click', function () { open(0); });
    for (var i = 0; i < tiles.length; i++) {
      (function (n) {
        on(tiles[n], 'click', function () { open(n + (main ? 1 : 0)); });
      })(i);
    }
  }

  /* ==========================================================================
     3 · THE BUY COLUMN
     ====================================================================== */

  function buyColumn() {
    /* SCOPED TO THE COLUMN, not the document. The comparison section grew its
       own live colourway dots, which also carry `data-swatch` — a global query
       here would wire every one of them twice (harmless, since the second
       setFinish is a no-op) and, worse, would let this function's `.on`
       bookkeeping reach controls that belong to another component. Each part of
       the page owns its own controls; they meet at the state object and nowhere
       else. */
    var col = $('.buy-col');
    if (!col) return;
    var cards = $$('[data-material]', col);
    var swatches = $$('[data-swatch]', col);
    var chips = $$('[data-size]', col);
    var kit = $('[data-kit]', col);

    for (var a = 0; a < cards.length; a++) {
      (function (el) {
        on(el, 'click', function () { setMaterial(el.getAttribute('data-material')); });
      })(cards[a]);
    }
    for (var b = 0; b < swatches.length; b++) {
      (function (el) {
        on(el, 'click', function () { setFinish(el.getAttribute('data-swatch')); });
      })(swatches[b]);
    }
    for (var c = 0; c < chips.length; c++) {
      (function (el) {
        on(el, 'click', function () { setSize(el.getAttribute('data-size')); });
      })(chips[c]);
    }
    on(kit, 'click', function (e) { e.preventDefault(); setKit(); });

    var finLabel = $('[data-finish-label]');
    var sizeLabel = $('[data-size-label]');
    var prices = $$('[data-price]');
    var mos = $$('[data-mo]');

    subscribe(function (s) {
      var m = MATERIALS[s.material];
      var f = finishById(s.finish);

      for (var i = 0; i < cards.length; i++) {
        var isOn = cards[i].getAttribute('data-material') === s.material;
        cards[i].classList.toggle('on', isOn);
        cards[i].setAttribute('aria-pressed', isOn ? 'true' : 'false');
      }
      /* ALL FIVE STAY LIVE. The first version disabled the three that do not
         belong to the chosen material, which turned the swatch row into a dead
         end and made the label above it a lie: setFinish() sets the material
         from the finish — "picking one picks its material" — and a disabled
         button can never reach it. So a reader who wants Onyx had to find the
         Ceramic card first, and the dimmed swatch was a control that looked
         like it did something and did nothing. That is the exact defect this
         page was rewritten to remove; reintroducing it three controls to the
         left would have been funny. The `.on` outline is the only state the
         row needs — which material a finish belongs to is already answered by
         the tag on the photograph and by the card that lights up. */
      for (var j = 0; j < swatches.length; j++) {
        var id = swatches[j].getAttribute('data-swatch');
        swatches[j].classList.toggle('on', id === s.finish);
        swatches[j].setAttribute('aria-pressed', id === s.finish ? 'true' : 'false');
      }
      for (var k = 0; k < chips.length; k++) {
        var picked = !s.kit && chips[k].getAttribute('data-size') === s.size;
        chips[k].classList.toggle('on', picked);
        chips[k].setAttribute('aria-pressed', picked ? 'true' : 'false');
      }
      if (kit) kit.classList.toggle('on', s.kit);

      /* The labels were sentences with a colourway hardcoded into one of them
         ("Choose your look: Gold."). They are 12px overlines now and the value
         sits at the end of the line, so the field name and the confirmation are
         one row instead of two. No trailing full stops: it is a field, not a
         sentence. */
      if (finLabel) finLabel.textContent = f.name;
      if (sizeLabel) sizeLabel.textContent = s.kit ? 'Sizing kit' : 'US ' + s.size;

      /* The number fades a quarter out and back rather than snapping. 140ms,
         which is under the threshold where a reader would call it an animation
         and over the one where they would miss the change. */
      for (var p = 0; p < prices.length; p++) {
        (function (el) {
          el.classList.add('swap');
          setTimeout(function () {
            el.textContent = money(m.price);
            el.classList.remove('swap');
          }, still.matches ? 0 : 140);
        })(prices[p]);
      }
      for (var q = 0; q < mos.length; q++) mos[q].textContent = m.mo;
    });
  }

  /* ==========================================================================
     4 · THE SIGNAL BAND
     ====================================================================== */

  /* RETIRED 2026-09-09 with the tablist it drove. The five signals are five
     things the ring does at once, not five alternatives, so the section shows
     all five and there is nothing to select — see pdp.css § 2. Removed rather
     than left to guard on its own missing elements: a no-op that still runs is
     a thing the next reader has to prove is a no-op. */

  /* ==========================================================================
     5 · THE TIMELINE
     ====================================================================== */

  function timeline() {
    var wrap = $('[data-tl]');
    if (!wrap) return;
    var steps = $$('[data-tl-step]', wrap);
    var rail = $('[data-tl-rail]', wrap);
    if (!steps.length) return;

    /* A reader who asked for less motion gets every step lit and no film. The
       rail is filled to its end so it does not read as a progress bar stuck at
       zero. */
    if (still.matches) {
      for (var s = 0; s < steps.length; s++) steps[s].setAttribute('aria-current', 'true');
      if (rail) rail.style.setProperty('--p', 1);
      return;
    }

    /* THE FILM DOES NOT FOLLOW THE STEPS, and that is a decision rather than an
       omission. The first version cut the clip into four windows and seeked
       between them on every step change. Two things were wrong with it. The
       footage that belongs beside this section is one continuous shot — the
       Health Monitor's biomarker rows peeling out one after another, which is
       the section's whole argument in moving form — and chopping it into 1.6s
       loops destroyed the only thing it had to say. And seed's own version of
       this section, which is where the arrangement comes from, runs ONE clip
       independently of the step: the film sets the register, the steps carry the
       progression. So the film loops, and the four windows and the `data-t`
       attribute that fed them are gone rather than left in as machinery nothing
       drives. */
    var cur = -1;

    /* A RATIO, NOT A PIXEL LENGTH, because the CSS scales the bar rather than
       growing it — animating `height` costs a layout pass on every frame of the
       420ms for a bar that moves nothing around it.
       The fill still reaches the CURRENT NODE and is still measured rather than
       divided into equal quarters: the steps carry different amounts of copy,
       so quarters would put the line above or below the dot it is supposed to
       arrive at. The 15 is the node's own offset inside its step; the 12s are
       the inset the rail's own ::before and ::after both start and end at, so
       the ratio is taken against the bar's box rather than the container's. */
    function setFill(i) {
      var INSET = 12, NODE = 15;
      var span = steps[0].parentNode.clientHeight - INSET * 2;
      if (span <= 0) return;
      var at = steps[i].offsetTop - steps[0].offsetTop + NODE - INSET;
      rail.style.setProperty('--p', Math.min(Math.max(at / span, 0), 1));
    }

    function goto(i) {
      if (i === cur) return;
      cur = i;
      for (var j = 0; j < steps.length; j++) {
        steps[j].setAttribute('aria-current', j === i ? 'true' : 'false');
      }
      if (rail) setFill(i);
    }

    for (var i = 0; i < steps.length; i++) {
      (function (n) {
        /* Clicking a step lights it and nothing else. It does NOT scroll: the
           section is already on screen — that is how the step got clicked — and
           taking the scroll here would fight a reader who is mid-flick. The
           scroll reader below takes over again on the next frame they move, so
           a click is a peek rather than a mode. */
        on(steps[n], 'click', function () { goto(n); });
        on(steps[n], 'focus', function () { goto(n); });
      })(i);
    }

    /* Scroll-driven, and it READS the scroll rather than taking it — the same
       rule shared.js writes for its pinned band. The current step is the last
       one whose node has crossed the line 46% down the viewport: a line, not
       the nearest midpoint, so the sequence only ever moves forward as you
       scroll down and backward as you scroll up. */
    watch(function () {
      var line = window.innerHeight * 0.46;
      var pick = 0;
      for (var j = 0; j < steps.length; j++) {
        if (steps[j].getBoundingClientRect().top <= line) pick = j;
      }
      goto(pick);
    });
  }

  /* ==========================================================================
     6 · THE PINNED BAND
     Nothing here. The band's four points are peers rather than steps, so the
     numbered rail that used to index them has been removed along with the code
     that drove it — see pdp.css §4. shared.js's own pinned() still turns the
     section's scroll into an index and toggles `.on`; the stylesheet does the
     rest, and this file has no business in it.
     ====================================================================== */

  /* ==========================================================================
     7 · THE FILM CONTROLS
     ====================================================================== */

  /* One wiring for every film on the page, keyed off which button is inside
     which frame. The glyph swap is the CSS's job — `data-paused` and
     `data-muted` on the button — so this only ever moves the attribute and the
     media state, never innerHTML. */
  function filmControls() {
    var bars = $$('[data-filmbar]');
    for (var i = 0; i < bars.length; i++) {
      (function (bar) {
        var sel = bar.getAttribute('data-filmbar');
        var film = sel ? $(sel) : null;
        if (!film) { bar.hidden = true; return; }

        var play = $('[data-film-play]', bar);
        var mute = $('[data-film-mute]', bar);

        function paintPlay() {
          if (!play) return;
          if (film.paused) play.setAttribute('data-paused', '');
          else play.removeAttribute('data-paused');
          play.setAttribute('aria-label', film.paused ? 'Play video' : 'Pause video');
        }
        function paintMute() {
          if (!mute) return;
          if (film.muted) mute.setAttribute('data-muted', '');
          else mute.removeAttribute('data-muted');
          mute.setAttribute('aria-label', film.muted ? 'Unmute video' : 'Mute video');
        }

        on(play, 'click', function () {
          if (film.paused) { try { film.play(); } catch (e) {} }
          else film.pause();
        });
        on(mute, 'click', function () { film.muted = !film.muted; paintMute(); });
        on(film, 'play', paintPlay);
        on(film, 'pause', paintPlay);
        on(film, 'volumechange', paintMute);

        /* AUTOPLAY IS AN ATTRIBUTE AND STILLNESS IS A QUERY, so a reader who has
           reduced-motion on gets a film that starts anyway — the markup ships
           `autoplay` because the overwhelming majority of readers should see it
           move. shared.js's own watchStill() does not touch video; it drops the
           reveal classes and nothing else. So the pause is taken here, once, at
           the only point that knows about both the setting and the element.
           The button then reads `data-paused`, which is exactly right: the film
           is stopped and the reader can start it deliberately. */
        if (still.matches) { try { film.pause(); } catch (e) {} }

        paintPlay();
        paintMute();
      })(bars[i]);
    }
  }

  /* ==========================================================================
     8 · TITANIUM OR CERAMIC
     ====================================================================== */

  /* Two columns, no key column, and the sliding measured pane is gone with the
     table it belonged to — the chosen column is a card now, which is one CSS
     property rather than a bounding-box calculation that had to be re-run on
     every resize. What is left here is state: which column is raised, which
     dot is ringed, which picture each column shows, and what the pick button
     says. */
  function compare() {
    var table = $('[data-vs]');
    if (!table) return;

    var cols = $$('[data-vs-mat]', table);
    var picks = $$('[data-vs-pick]', table);
    var dots = $$('[data-swatch]', table);
    var figs = $$('[data-vs-fig]', table);
    var names = $$('[data-vs-swname]', table);

    for (var i = 0; i < picks.length; i++) {
      (function (el) {
        on(el, 'click', function () { setMaterial(el.getAttribute('data-vs-pick')); });
      })(picks[i]);
    }
    /* The dots do the same job as the hero's swatches and go through the same
       setter, so a click here can cross the material boundary too — choosing
       Onyx from the titanium side of the page is a legitimate thing to want. */
    for (var d = 0; d < dots.length; d++) {
      (function (el) {
        on(el, 'click', function () { setFinish(el.getAttribute('data-swatch')); });
      })(dots[d]);
    }
    for (var f = 0; f < figs.length; f++) figs[f].setAttribute('data-live', '');

    /* EACH COLUMN REMEMBERS ITS OWN FINISH, and it needs somewhere to remember
       it. The state object holds ONE finish — the one being bought — so a
       column whose material is not current has nothing in it to read. This map
       is that memory: seeded with each material's first colourway so both
       columns have a picture at load, and updated only for the material the
       reader actually touched. The titanium column therefore keeps showing gold
       while the reader is looking at ceramic, instead of blanking or falling
       back to a default that has nothing to do with them. */
    var shown = {
      titanium: firstFinishOf('titanium').id,
      ceramic: firstFinishOf('ceramic').id
    };

    subscribe(function (s) {
      var cur = finishById(s.finish);
      shown[cur.mat] = cur.id;

      for (var j = 0; j < cols.length; j++) {
        if (cols[j].getAttribute('data-vs-mat') === s.material) cols[j].setAttribute('data-on', '');
        else cols[j].removeAttribute('data-on');
      }
      for (var k = 0; k < picks.length; k++) {
        var mat = picks[k].getAttribute('data-vs-pick');
        var isOn = mat === s.material;
        picks[k].textContent = isOn ? 'Selected' : 'Choose ' + MATERIALS[mat].name.toLowerCase();
        picks[k].disabled = isOn;
      }
      /* The ring goes only on the dot of the finish being bought. The other
         column's dots stay unringed even though its picture is showing one of
         them — the picture says "this is what ceramic looks like", the ring
         says "this is what you are buying", and only one of those is true of
         the column you have not chosen. */
      for (var n = 0; n < dots.length; n++) {
        dots[n].classList.toggle('on', dots[n].getAttribute('data-swatch') === s.finish);
      }

      /* Both columns are painted, each from its own remembered finish. */
      for (var g = 0; g < figs.length; g++) {
        var fig = figs[g];
        var want = shown[fig.getAttribute('data-vs-fig')];
        var frames = $$('img[data-finish]', fig);
        for (var m = 0; m < frames.length; m++) {
          var lit = frames[m].getAttribute('data-finish') === want;
          frames[m].classList.toggle('on', lit);
          frames[m].setAttribute('aria-hidden', lit ? 'false' : 'true');
        }
      }
      for (var w = 0; w < names.length; w++) {
        var mat = names[w].getAttribute('data-vs-swname');
        if (shown[mat]) names[w].textContent = finishById(shown[mat]).name;
      }
    });
  }

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

    var picBox = $('.pdp-cut-fig', fig);
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

    /* ---- THE LEADER, and why it points inward. See pdp.css § the dial.

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
        /* U+2011 for the hyphen: the readout is two short lines in a circle,
           and "heart- / rate" broken at the hyphen reads as two words. */
        if (dialT && t) dialT.textContent = t.textContent.replace(/-/g, '‑');
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

  /* ==========================================================================
     9 · TECH SPECS
     ====================================================================== */

  /* RETIRED 2026-09-09, with the accordion it drove. Tech Specs is one panel of
     plain lists now — see pdp.css § 6 — so there is nothing to expand and no
     control to report the state of. The function guarded on its own elements
     and would have gone quietly dead; it is removed instead, because a no-op
     that still runs is a thing the next reader has to prove is a no-op. */

  /* ==========================================================================
     10 · THE DOCK
     ====================================================================== */

  /* shared.js's `.ph-bar` arrives as a name and a button. It gains a thumbnail
     and a line of meta here, and the CSS takes it off the top edge — so the
     observer, the aria-hidden toggle and the tabindex handoff shared.js wrote
     all keep working and none of it is duplicated.
     shared.js runs at parse time inside its own IIFE, so the bar is already in
     the document when this file executes. The guard is for the case where it is
     not — a product page whose hero has no CTA gets no bar at all. */
  function dock() {
    var bar = $('.ph-bar');
    if (!bar) return;

    /* The nav/bar swap devices/ring runs (pdp.css § 7). Keyed off shared.js's
       own `.on` rather than a second observer on the hero, so the nav can never
       leave while the bar is still hidden, or the reverse. */
    var body = doc.body;
    var swap = function () { body.classList.toggle('is-past-hero', bar.classList.contains('on')); };
    if ('MutationObserver' in window) {
      new MutationObserver(swap).observe(bar, { attributes: true, attributeFilter: ['class'] });
    }
    swap();

    var inner = $('.ph-bar-inner', bar);
    var name = $('.ph-bar-name', bar);
    if (!inner || !name) return;

    var thumb = doc.createElement('img');
    thumb.className = 'ph-bar-thumb';
    thumb.alt = '';
    thumb.setAttribute('aria-hidden', 'true');
    thumb.width = 38; thumb.height = 38;
    thumb.decoding = 'async';

    var txt = doc.createElement('span');
    txt.className = 'ph-bar-txt';
    var meta = doc.createElement('span');
    meta.className = 'ph-bar-meta';

    inner.insertBefore(thumb, name);
    inner.insertBefore(txt, name);
    txt.appendChild(name);
    txt.appendChild(meta);

    subscribe(function (s) {
      var f = finishById(s.finish);
      /* The thumbnail comes from the studio still, not from the film's poster.
         A 38px circle cut out of a cloud bank says nothing; the same circle cut
         out of the plain-ground profile is recognisably that finish. */
      var frame = $('[data-gal-still] img[data-finish="' + s.finish + '"]');
      if (frame) thumb.src = frame.currentSrc || frame.src;
      meta.textContent = money(MATERIALS[s.material].price) + ' · ' + f.name +
        ' · ' + (s.kit ? 'sizing kit' : 'size ' + s.size);
    });
  }

  /* ==========================================================================
     BOOT
     Order matters in one place only: dock() reads the gallery's frames for its
     thumbnail, so gallery() has to have marked the frames first. Everything
     else is independent, and the single publish() at the end is what paints the
     initial state through every subscriber at once — rather than each component
     painting itself and then being repainted on the first interaction.
     ====================================================================== */

  gallery();
  lightbox();
  buyColumn();
  timeline();
  filmControls();
  compare();
  cutaway();
  dock();
  publish();

  /* A reader who turns reduced-motion on mid-session gets stillness on the next
     paint for the two things that can be withdrawn cleanly: a running film and a
     step that is animating. Nothing is re-laid out — shared.js makes the same
     trade for the same reason. */
  if (still.addEventListener) {
    still.addEventListener('change', function () {
      if (!still.matches) return;
      var films = $$('.pdp-tl-film video, .pin-film, [data-gal-main] video');
      for (var i = 0; i < films.length; i++) { try { films[i].pause(); } catch (e) {} }
    });
  }
})();
