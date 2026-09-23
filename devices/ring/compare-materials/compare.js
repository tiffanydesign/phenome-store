/* ============================================================================
   devices/ring/compare-materials · page script, for body.cmp

   TWO BEHAVIOURS, and the second only exists because of the first.

   1 · THE PICKERS. Five products, three columns. Choosing a product in one
       column rewrites that column: its photograph, its finishes, its name, its
       price, where Buy goes, its line in the sticky bar, and its
       answer in every row of the table. Nothing else on the page moves.

       A product already on screen is DISABLED in the other two dropdowns
       rather than hidden, which is what apple.com/iphone/compare does and the
       only one of the two that leaves the list the same length every time it
       is opened. The one on screen in THIS column stays selectable, obviously.

   2 · THE DISCS. Choosing a finish changes the photograph above it and the
       name under it. Within a column only.

   THE MARKUP IS THE OPENING STATE and this file never builds a column from
   nothing: it overwrites the three the HTML already carries. That is what
   keeps the comparison readable with the script blocked, and it is why the
   catalogue below has to agree with the HTML for the three defaults. If a
   figure changes, change it in both.

   Written in the same ES5 shared.js is, for the same reason: this file loads
   after it on the one page that includes it, and a syntax error a browser
   cannot parse takes the whole script out rather than the one behaviour it
   belongs to.
   ========================================================================= */
(function () {
  'use strict';

  var RING = '/phenome-store/assets/ring/fin/';
  var BAND = '/phenome-store/assets/band/';

  /* Where Buy goes, shared by the three ring materials and by the two Band
     straps, so it is written once. */
  var RING_LINKS = { buy: '/phenome-store/store/phenometech-ring/' };
  var BAND_LINKS = { buy: '/phenome-store/devices/band/' };

  /* The sentence carried identically by the three ring materials, and the one
     carried identically by the two straps. */
  var RING_SENSORS = 'The three ring materials carry one sensor stack between them.';
  var BAND_SENSORS = 'Workouts are found on their own, scored, and answered with the recovery time they ask for.';
  var RING_SIZING = 'A free sizing kit arrives before the ring does.';

  /* A finish is [id, name, swatch, image, alt]. The image is spelled out rather
     than derived from the id because the Band's plates are named for the strap
     they are on, not for the product they belong to. */
  var CATALOGUE = {
    'ring-metal': {
      label: 'Ring, Metal',
      price: 'From £179',
      dotsLabel: 'Metal finishes',
      links: RING_LINKS,
      tall: false,
      shotW: 1400, shotH: 960,
      finishes: [
        ['metal-brushed', 'Brushed silver', '#b9bcc1', RING + 'metal-brushed.webp', 'The PhenomeTech Ring in brushed silver metal'],
        ['metal-black', 'Black', '#2b2b2e', RING + 'metal-black.webp', 'The PhenomeTech Ring in black metal'],
        ['metal-silver', 'Silver', '#ccced2', RING + 'metal-silver.webp', 'The PhenomeTech Ring in polished silver metal']
      ],
      spec: {
        material: ["Grade 5 aerospace titanium", "Durable and solid, mirror or brushed"],
        weight: ["About 4 g at size 8"],
        durability: ["High scratch resistance", "IP67, safe for washing and rain"],
        fit: ["Sizes 5 to 13", "Free sizing kit before the ring"],
        charge: ["Full charge in about 90 minutes"],
        extra: [null, null],
        best: ["Durable strength, worn all day"]
      }
    },

    'ring-matte': {
      label: 'Ring, Matte',
      price: 'From £189',
      dotsLabel: 'Matte finishes',
      links: RING_LINKS,
      tall: false,
      shotW: 1400, shotH: 960,
      finishes: [
        ['matte-rose', 'Rose', '#c9a49a', RING + 'matte-rose.webp', 'The PhenomeTech Ring in matte rose'],
        ['matte-stealth', 'Stealth black', '#2a2a2c', RING + 'matte-stealth.webp', 'The PhenomeTech Ring in stealth black']
      ],
      spec: {
        material: ["Titanium under a matte coat", "Quiet and soft, takes no fingerprints"],
        weight: ["About 4 g at size 8"],
        durability: ["High scratch resistance", "IP67, safe for washing and rain"],
        fit: ["Sizes 5 to 13", "Free sizing kit before the ring"],
        charge: ["Full charge in about 90 minutes"],
        extra: [null, null],
        best: ["The quietest thing on your hand"]
      }
    },

    'ring-ceramic': {
      label: 'Ring, Ceramic',
      price: 'From £199',
      dotsLabel: 'Ceramic finishes',
      links: RING_LINKS,
      tall: false,
      shotW: 1400, shotH: 960,
      finishes: [
        ['ceramic-white', 'White', '#eceef0', RING + 'ceramic-white.webp', 'The PhenomeTech Ring in white ceramic'],
        ['ceramic-black', 'Black', '#1f1f21', RING + 'ceramic-black.webp', 'The PhenomeTech Ring in black ceramic'],
        ['ceramic-silver', 'Silver', '#cfd2d6', RING + 'ceramic-silver.webp', 'The PhenomeTech Ring in silver ceramic'],
        ['ceramic-pink', 'Pink', '#e3bfc4', RING + 'ceramic-pink.webp', 'The PhenomeTech Ring in pink ceramic']
      ],
      spec: {
        material: ["High density zirconia ceramic", "Refined and warm, a fired glaze"],
        weight: ["About 6 g at size 8"],
        durability: ["Very high scratch resistance", "IP67, safe for washing and rain"],
        fit: ["Sizes 5 to 13", "Free sizing kit before the ring"],
        charge: ["Full charge in about 90 minutes"],
        extra: [null, null],
        best: ["A refined finish that will not mark"]
      }
    },

    /* The Band is two entries rather than one because the strap is the half of
       it worn against the skin: it changes the weight, the sizing, the way it
       is fastened and what a night in it feels like. The core is identical. */
    'band-sport': {
      label: 'Band, Sport silicone',
      price: 'From £149',
      dotsLabel: 'Sport silicone colours',
      links: BAND_LINKS,
      tall: true,
      shotW: 826, shotH: 1102,
      finishes: [
        ['band-onyx', 'Onyx', '#313131', BAND + 'band-onyx_cut.webp', 'The PhenomeTech Band in Onyx, on the perforated sport strap'],
        ['band-ember', 'Ember', '#e4652e', BAND + 'band-ember_cut.webp', 'The PhenomeTech Band in Ember, on the perforated sport strap'],
        ['band-harbour', 'Harbour', '#566a82', BAND + 'band-harbour_cut.webp', 'The PhenomeTech Band in Harbour, on the perforated sport strap'],
        ['band-dune', 'Dune', '#e2d0c4', BAND + 'band-dune_cut.webp', 'The PhenomeTech Band in Dune, on the perforated sport strap']
      ],
      spec: {
        material: ["Anodised aluminium frame", "Perforated sport silicone strap"],
        weight: ["24 g with the strap, 11 g core"],
        durability: ["High scratch resistance", "5 ATM, safe for swimming and showers"],
        fit: ["Fits 130 to 210 mm wrists", "Both strap lengths in the box"],
        charge: ["Full charge in about 60 minutes"],
        extra: ["Blood oxygen", "Training load and recovery time"],
        best: ["Training, and the day either side of it"]
      }
    },

    'band-woven': {
      label: 'Band, Woven nylon',
      price: 'From £159',
      dotsLabel: 'Woven nylon colours',
      links: BAND_LINKS,
      tall: true,
      shotW: 828, shotH: 1117,
      finishes: [
        ['band-graphite', 'Graphite', '#242424', BAND + 'band-weave-graphite_cut.webp', 'The PhenomeTech Band in Graphite, on the woven nylon loop'],
        ['band-tidal', 'Tidal', '#394d68', BAND + 'band-weave-tidal_cut.webp', 'The PhenomeTech Band in Tidal, on the woven nylon loop']
      ],
      spec: {
        material: ["Anodised aluminium frame", "Elastic woven nylon loop"],
        weight: ["21 g with the loop, 11 g core"],
        durability: ["High scratch resistance", "5 ATM, safe for showers"],
        fit: ["Fits 135 to 205 mm wrists", "One loop, pulled to any tension"],
        charge: ["Full charge in about 60 minutes"],
        extra: ["Blood oxygen", "Training load and recovery time"],
        best: ["Long wear, and sleeping in it"]
      }
    }
  };

  var picks = document.querySelectorAll('[data-pick]');
  if (!picks.length) return;

  /* What each of the three columns is showing. Read off the markup rather than
     assumed, so the defaults live in ONE place, which is the HTML. */
  var showing = [];

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function q(slot, sel) {
    return document.querySelector('[data-slot="' + slot + '"]' + sel);
  }
  /* ---- one group of the table, in one column --------------------------------
     THE SONOS SHAPE (sonos.com/sv-se/products/headphones, 2026-09-22): each
     group is a pill on a hairline, then one short fact per line, the three
     columns answering on the same line. A product with nothing to say on a
     line gets a drawn dash, not an empty gap, so the eye reads "not on this
     one" rather than "not loaded yet". `null` in the catalogue is that dash. */
  /* THE VALUE ICONS (2026-09-23, after apple.com/se/iphone/compare): each
     answer carries a small drawing from assets/icons/compare.svg, keyed by
     the answer's own words, so three different answers on one line show
     three different pictures. index.html carries the same icons for the
     opening three; an answer missing here is simply set without one. */
  var ICON_SPRITE = '/phenome-store/assets/icons/compare.svg#';
  var ICONS = {
    'High density zirconia ceramic': 'ring-ceramic',
    'Grade 5 aerospace titanium': 'ring-titanium',
    'Titanium under a matte coat': 'ring-matte',
    'Anodised aluminium frame': 'band-core',
    'Refined and warm, a fired glaze': 'glaze',
    'Durable and solid, mirror or brushed': 'shield',
    'Quiet and soft, takes no fingerprints': 'no-print',
    'Perforated sport silicone strap': 'strap-sport',
    'Elastic woven nylon loop': 'strap-woven',
    'About 6 g at size 8': 'feather',
    'About 4 g at size 8': 'feather',
    '24 g with the strap, 11 g core': 'weight',
    '21 g with the loop, 11 g core': 'weight',
    'Very high scratch resistance': 'diamond',
    'High scratch resistance': 'shield',
    'IP67, safe for washing and rain': 'drop',
    '5 ATM, safe for swimming and showers': 'swim',
    '5 ATM, safe for showers': 'shower',
    'Sizes 5 to 13': 'ring-size',
    'Fits 130 to 210 mm wrists': 'wrist-tape',
    'Fits 135 to 205 mm wrists': 'wrist-tape',
    'Free sizing kit before the ring': 'parcel',
    'Both strap lengths in the box': 'two-straps',
    'One loop, pulled to any tension': 'loop',
    'Full charge in about 90 minutes': 'charge',
    'Full charge in about 60 minutes': 'charge',
    'Blood oxygen': 'oxygen',
    'Training load and recovery time': 'gauge',
    'A refined finish that will not mark': 'sparkle',
    'Durable strength, worn all day': 'sun',
    'The quietest thing on your hand': 'hand',
    'Training, and the day either side of it': 'dumbbell',
    'Long wear, and sleeping in it': 'moon'
  };
  function lineHtml(text) {
    var id = ICONS[text];
    var ic = id ? '<svg class="cmp-ic" aria-hidden="true" focusable="false"><use href="' + ICON_SPRITE + id + '"/></svg>' : '';
    return ic + '<span>' + esc(text) + '</span>';
  }

  function fillGroup(slot, key, lines) {
    for (var i = 0; i < lines.length; i++) {
      var el = document.querySelector('.cmp-ln[data-slot="' + slot + '"][data-line="' + key + ':' + i + '"]');
      if (!el) continue;
      if (lines[i] === null) {
        el.className = 'cmp-ln is-none';
        el.innerHTML = '<span class="cmp-none" role="img" aria-label="Not on this one"></span>';
      } else {
        el.className = ICONS[lines[i]] ? 'cmp-ln has-ic' : 'cmp-ln';
        el.innerHTML = lineHtml(lines[i]);
      }
    }
  }

  /* ---- the finish, within one column -------------------------------------
     The photograph, the discs and the name under them. The figure keeps its
     own `img`; only the source, the alt and the dimensions change, and the
     dimensions change because a ring plate is landscape and a Band plate is
     portrait, so a stale pair would reserve the wrong box while it decodes. */
  function setFinish(slot, finishId) {
    var product = CATALOGUE[showing[slot]];
    var list = product.finishes;
    var chosen = list[0];
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i][0] === finishId) chosen = list[i];
    }

    var shot = q(slot, ' [data-shot]');
    var thumb = q(slot, ' [data-thumb]');
    var fig = shot ? shot.parentNode : null;

    if (shot && shot.getAttribute('src') !== chosen[3]) {
      /* Faded out, swapped, faded back in on load, so a column never shows the
         previous finish stretched into the new plate's box mid decode. */
      if (fig) fig.className = product.tall ? 'cmp-fig is-band is-swapping' : 'cmp-fig is-swapping';
      shot.setAttribute('src', chosen[3]);
      shot.setAttribute('alt', chosen[4]);
      shot.setAttribute('width', product.shotW);
      shot.setAttribute('height', product.shotH);
    }
    if (thumb) {
      thumb.setAttribute('src', chosen[3]);
      thumb.setAttribute('width', product.shotW);
      thumb.setAttribute('height', product.shotH);
    }

    var dots = document.querySelectorAll('[data-slot="' + slot + '"] .cmp-dot');
    for (i = 0; i < dots.length; i++) {
      /* The selected ring is drawn from aria-checked (finish.css). */
      var on = dots[i].getAttribute('data-finish') === chosen[0];
      dots[i].setAttribute('aria-checked', on ? 'true' : 'false');
    }

    var name = q(slot, ' [data-dotname]');
    if (name) name.textContent = chosen[1];
  }

  /* ---- a whole column ----------------------------------------------------- */
  function setProduct(slot, id, finishId) {
    var product = CATALOGUE[id];
    if (!product) return;
    showing[slot] = id;

    var head = q(slot, '.cmp-head');
    var fig = head ? head.querySelector('.cmp-fig') : null;
    if (fig) fig.className = product.tall ? 'cmp-fig is-band' : 'cmp-fig';

    /* The discs are rebuilt because the count changes between products: four
       ceramic finishes, two matte, two woven. */
    var group = q(slot, ' [data-dots]');
    if (group) {
      var html = '';
      for (var i = 0; i < product.finishes.length; i++) {
        var f = product.finishes[i];
        html += '<button aria-checked="false" aria-label="' + esc(f[1]) + '"' +
                ' class="cmp-dot fin-dot" data-finish="' + esc(f[0]) + '"' +
                ' role="radio" style="--d:' + esc(f[2]) + '" type="button"></button>';
      }
      group.innerHTML = html;
      group.setAttribute('aria-label', product.dotsLabel);
    }

    var i2, els;
    els = document.querySelectorAll('[data-slot="' + slot + '"] [data-name]');
    for (i2 = 0; i2 < els.length; i2++) els[i2].textContent = product.label;
    els = document.querySelectorAll('[data-slot="' + slot + '"] [data-price]');
    for (i2 = 0; i2 < els.length; i2++) els[i2].textContent = product.price;

    var buy = q(slot, ' [data-buy]');
    if (buy) buy.setAttribute('href', product.links.buy);

    for (var key in product.spec) {
      if (Object.prototype.hasOwnProperty.call(product.spec, key)) {
        fillGroup(slot, key, product.spec[key]);
      }
    }

    setFinish(slot, finishId || product.finishes[0][0]);
    prune();
  }

  /* ---- only what differs -------------------------------------------------
     User rule, 2026-09-22: a line on which the three columns say the same
     thing is not a comparison, so it is not shown; a group left with no line
     is not shown either. Three rings side by side therefore lose Fit, Charging
     and Extra readings and the shared IP67 line, and all of it comes back the
     moment a Band is put in a column. Run after every column change. Nothing
     is folded and nothing can be collapsed: every line that differs is out. */
  function prune() {
    var groups = document.querySelectorAll('.cmp-grp');
    for (var g = 0; g < groups.length; g++) {
      var lines = groups[g].querySelectorAll('.cmp-ln');
      var byLine = {};
      var order = [];
      for (var l = 0; l < lines.length; l++) {
        var key = lines[l].getAttribute('data-line');
        if (!byLine[key]) { byLine[key] = []; order.push(key); }
        byLine[key].push(lines[l]);
      }
      var shown = 0;
      for (var k = 0; k < order.length; k++) {
        var cells = byLine[order[k]];
        var first = cells[0].textContent + '|' + cells[0].className;
        var same = true;
        for (var c = 1; c < cells.length; c++) {
          if (cells[c].textContent + '|' + cells[c].className !== first) same = false;
        }
        for (var c2 = 0; c2 < cells.length; c2++) cells[c2].hidden = same;
        if (!same) shown++;
      }
      groups[g].hidden = shown === 0;
    }
  }

  /* ---- no column may show what another column is showing -------------------
     Disabled, not removed: the list is the same five every time it opens, so
     the one a reader is looking for is always where they last saw it. */
  function lockDuplicates() {
    for (var p = 0; p < picks.length; p++) {
      var sel = picks[p];
      var mine = Number(sel.getAttribute('data-pick'));
      var opts = sel.options;
      for (var o = 0; o < opts.length; o++) {
        var taken = false;
        for (var s = 0; s < showing.length; s++) {
          if (s !== mine && showing[s] === opts[o].value) taken = true;
        }
        opts[o].disabled = taken;
      }
    }
  }

  /* ---- wiring -------------------------------------------------------------

     The opening pass does NOT trust the three selects to agree with the three
     columns the HTML shipped. Firefox restores the value of a select across a
     reload and across the back button, and it restores it before this file
     runs, so a reader who left this page on Woven nylon comes back to a picker
     that says Woven nylon over a photograph of a ceramic ring. Worse, it
     restores each of the three on its own, so two of them can come back holding
     the same product, which is the one arrangement this page does not allow.

     So each slot is read, checked against the slots before it, pushed to the
     first free product if it collides, and then rendered from the catalogue.
     Where nothing was restored every value already matches its column and the
     render writes back what is there. */
  var CHOICES = [];
  for (var key in CATALOGUE) {
    if (Object.prototype.hasOwnProperty.call(CATALOGUE, key)) CHOICES.push(key);
  }

  function taken(id, upTo) {
    for (var s = 0; s < upTo; s++) {
      if (showing[s] === id) return true;
    }
    return false;
  }

  for (var p = 0; p < picks.length; p++) {
    (function (sel) {
      var slot = Number(sel.getAttribute('data-pick'));
      var want = CATALOGUE[sel.value] ? sel.value : CHOICES[0];
      if (taken(want, slot)) {
        for (var c = 0; c < CHOICES.length; c++) {
          if (!taken(CHOICES[c], slot)) { want = CHOICES[c]; break; }
        }
      }
      showing[slot] = want;
      sel.value = want;
      setProduct(slot, want);
      sel.addEventListener('change', function () {
        setProduct(slot, sel.value);
        lockDuplicates();
      });
    })(picks[p]);
  }

  /* One delegated listener rather than one per disc, because `setProduct`
     replaces the discs and anything bound to the old ones dies with them. */
  document.addEventListener('click', function (e) {
    var el = e.target;
    while (el && el !== document) {
      if (el.className && String(el.className).indexOf('cmp-dot') === 0) {
        var col = el;
        while (col && col !== document && !col.getAttribute('data-slot')) col = col.parentNode;
        if (col && col !== document) {
          setFinish(Number(col.getAttribute('data-slot')), el.getAttribute('data-finish'));
        }
        return;
      }
      el = el.parentNode;
    }
  });

  /* The fade back in, once the new plate has actually decoded. */
  var shots = document.querySelectorAll('[data-shot]');
  for (var s = 0; s < shots.length; s++) {
    (function (img) {
      img.addEventListener('load', function () {
        var fig = img.parentNode;
        if (fig) fig.className = fig.className.replace(' is-swapping', '');
      });
    })(shots[s]);
  }

  lockDuplicates();


  /* ---- the closing frame's drift -------------------------------------------
     devices/ring's § 9f writer, the same number: --pr-p is how far the band
     has crossed the screen, 0 as its top meets the bottom of the viewport, 1
     as its bottom leaves the top, so .5 is the band centred and at rest. */
  var par = document.querySelector('[data-par]');
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (par && !calm) {
    par.classList.add('is-lively');
    var queued = false;
    var write = function () {
      queued = false;
      var b = par.getBoundingClientRect();
      var h = innerHeight || 1;
      var p = (h - b.top) / (h + b.height);
      par.style.setProperty('--pr-p', (p < 0 ? 0 : p > 1 ? 1 : p).toFixed(4));
    };
    var request = function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(write);
    };
    write();
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
  }
})();
