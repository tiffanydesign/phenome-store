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
      rows: {
        material: ['Grade 5 aerospace titanium', 'The alloy aircraft are built from, hard, light, and it does not corrode.'],
        weight: ['4', 'g', 'Approximately, at size 8.'],
        feel: ['Durable and solid', 'A mirror edge, or a fine directional grain that catches the light and hides a day of wear.'],
        scratch: ['High', ''],
        sizes: ['5 to 13', RING_SIZING],
        charge: ['About 90 minutes', ''],
        water: ['10 ATM, 100 m', ''],
        extra: ['Nothing extra', RING_SENSORS],
        best: ['Durable strength, worn all day', '']
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
      rows: {
        material: ['Titanium under a matte coat', 'The same metal body, finished so it returns the room as a soft glow rather than a line.'],
        weight: ['4', 'g', 'Approximately, at size 8.'],
        feel: ['Quiet and soft', 'Takes no fingerprints, and the one of the three that stays looking the same all day.'],
        scratch: ['High', ''],
        sizes: ['5 to 13', RING_SIZING],
        charge: ['About 90 minutes', ''],
        water: ['10 ATM, 100 m', ''],
        extra: ['Nothing extra', RING_SENSORS],
        best: ['The quietest thing on your hand', '']
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
      rows: {
        material: ['High density zirconia ceramic', 'Harder than steel at the surface, and warm against the skin within minutes.'],
        weight: ['6', 'g', 'Approximately, at size 8.'],
        feel: ['Refined and warm', 'A fired glaze, the crispest reflection of the three, and the only one that will not scratch.'],
        scratch: ['Very high', ''],
        sizes: ['5 to 13', RING_SIZING],
        charge: ['About 90 minutes', ''],
        water: ['10 ATM, 100 m', ''],
        extra: ['Nothing extra', RING_SENSORS],
        best: ['A refined finish that will not mark', '']
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
      rows: {
        material: ['Anodised aluminium frame', 'On a perforated sport silicone strap, moulded in one piece.'],
        weight: ['24', 'g', 'With the sport strap on it. The core alone is 11 g.'],
        feel: ['Firm through hard effort', 'Held against the wrist rather than resting on it, which is what a hard hour asks for.'],
        scratch: ['High', ''],
        sizes: ['130 to 210 mm wrist', 'Both strap lengths are in every box, so there is nothing to measure first.'],
        charge: ['About 60 minutes', ''],
        water: ['5 ATM, 50 m', 'Safe for swimming and showers.'],
        extra: ['Blood oxygen, and training load', BAND_SENSORS],
        best: ['Training, and the day either side of it', '']
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
      rows: {
        material: ['Anodised aluminium frame', 'On an elastic woven nylon loop, with no buckle to find in the dark.'],
        weight: ['21', 'g', 'With the woven loop on it. The core alone is 11 g.'],
        feel: ['Soft, and barely there', 'The loop gives with the wrist, so it can be worn through a night as easily as through an hour.'],
        scratch: ['High', ''],
        sizes: ['135 to 205 mm wrist', 'One continuous loop, pulled to whatever tension you want.'],
        charge: ['About 60 minutes', ''],
        water: ['5 ATM, 50 m', 'Safe for showers. Wrung out and air dried after a swim.'],
        extra: ['Blood oxygen, and training load', BAND_SENSORS],
        best: ['Long wear, and sleeping in it', '']
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
  function cell(slot, row) {
    return document.querySelector('.cmp-c[data-slot="' + slot + '"][data-row="' + row + '"]');
  }

  /* ---- one cell of the table ---------------------------------------------
     Three shapes only: a value, a value with a second line under it, and the
     one row set as a figure. `weight` is the figure row and is the only one
     with three parts, which is why it is spelled out rather than looped. */
  function fillCell(slot, row, data) {
    var el = cell(slot, row);
    if (!el) return;
    var html;
    if (row === 'weight') {
      html = '<p class="cmp-fig-v">' + esc(data[0]) + '<small>' + esc(data[1]) + '</small></p>';
      if (data[2]) html += '<p class="cmp-s">' + esc(data[2]) + '</p>';
    } else {
      html = '<p class="cmp-v">' + esc(data[0]) + '</p>';
      if (data[1]) html += '<p class="cmp-s">' + esc(data[1]) + '</p>';
    }
    el.innerHTML = html;
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

    for (var row in product.rows) {
      if (Object.prototype.hasOwnProperty.call(product.rows, row)) {
        fillCell(slot, row, product.rows[row]);
      }
    }

    setFinish(slot, finishId || product.finishes[0][0]);
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
})();
