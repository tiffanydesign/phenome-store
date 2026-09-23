/* ============================================================================
   testing/compare · page script, for body.tcmp

   ANY TEST NEXT TO ANY OTHER, THREE AT ONCE. compare-materials' pickers:
   a dropdown at the top of each of the three columns holds all six tests,
   and a test already on screen in one column is DISABLED in the other two
   (greyed, not removed, so the list is the same six every time it opens).
   Choosing a test rewrites its column and the rows under it.

   ONLY WHAT DIFFERS is shown, the compare-materials rule: a line on which
   all three tests say the same thing is hidden, and a group left with no
   line goes with it.

   The choice is kept in the address (?tests=genomic,gut) so a comparison can
   be shared or linked to from a test page.

   GENERATED. The catalogue below and the default markup in index.html both
   come from scratchpad build_tcmp.py. ES5, like shared.js.
   ========================================================================= */
(function () {
  'use strict';

  var DATA = {
 "tests": [
  {
   "id": "genomic",
   "name": "Comprehensive Genomic Test",
   "cat": "Genetic testing",
   "price": "£650",
   "buy": "/phenome-store/testing/comprehensive-genomic/",
   "alt": "The Comprehensive Genomic Test collection kit",
   "spec": {
    "sample": [
     "Saliva, collected at home"
    ],
    "method": [
     "Whole genome sequencing",
     "30× depth on Illumina instruments"
    ],
    "reads": [
     "All three billion letters of your genome",
     "20,000+ genes"
    ],
    "report": [
     "13 health panels",
     "Lifelong reanalysis"
    ],
    "consult": [
     "1:1 with a genetic counsellor"
    ],
    "who": [
     "Adults 18 and over"
    ],
    "plans": [
     "One time purchase, £650"
    ],
    "best": [
     "A complete health picture"
    ]
   },
   "sections": [
    "Personalised genomic summary",
    "Disease predisposition and risk analysis",
    "Carrier screening and inherited variants",
    "Pharmacogenomic insights",
    "Nutrigenomic and metabolic health",
    "Lifestyle and wellness genetics",
    "Longevity and ageing pathways",
    "Mental and cognitive health",
    "Sports and exercise genetics",
    "Hormonal and reproductive health",
    "Cardiovascular and lipid metabolism",
    "Mitochondrial and energy function",
    "Detoxification and environmental response"
   ],
   "img": "/phenome-store/assets/testing/compare/kit-genomic.webp",
   "thumb": "/phenome-store/assets/testing/compare/kit-genomic_t.webp"
  },
  {
   "id": "gut",
   "name": "Gut Microbiome Test",
   "cat": "Microbiome testing",
   "price": "£180",
   "buy": "/phenome-store/store/gut-microbiome/",
   "alt": "The Gut Microbiome Test collection kit",
   "spec": {
    "sample": [
     "Stool, collected at home"
    ],
    "method": [
     "Shotgun metagenomic sequencing",
     "Bacteria named to genus and species"
    ],
    "reads": [
     "The bacteria in your gut, and what they do",
     "30+ conditions mapped, from IBS to Parkinson’s"
    ],
    "report": [
     "16 report sections",
     "A bacteria dictionary"
    ],
    "consult": [
     "1:1 with a nutrition specialist"
    ],
    "who": [
     "Adults 18 and over"
    ],
    "plans": [
     "Subscribe and save 20%, £144"
    ],
    "best": [
     "Digestion, immunity and mood"
    ]
   },
   "sections": [
    "Overview summary",
    "Microbial composition",
    "Enterotype",
    "Dysbiosis index",
    "Complete list of bacteria",
    "Metabolic potential",
    "Nutrient biosynthesis and breakdown",
    "Gut immune axis",
    "Gut skin axis",
    "Inflammatory potential",
    "Leaky gut syndrome",
    "Irritable bowel syndrome (IBS)",
    "Small intestinal bacterial overgrowth (SIBO)",
    "Gluten sensitivity",
    "Weight management",
    "Personalised recommendations"
   ],
   "img": "/phenome-store/assets/testing/compare/kit-gut.webp",
   "thumb": "/phenome-store/assets/testing/compare/kit-gut_t.webp"
  },
  {
   "id": "carrier",
   "name": "Carrier Screening Test",
   "cat": "Genetic testing",
   "price": "£390",
   "buy": "/phenome-store/store/carrier-screening/",
   "alt": "The Carrier Screening Test collection kit",
   "spec": {
    "sample": [
     "Saliva, collected at home"
    ],
    "method": [
     "Whole genome sequencing",
     "Classified to ACGS and ClinGen standards"
    ],
    "reads": [
     "Inherited conditions you could pass on",
     "500+ conditions across 1,300+ genes"
    ],
    "report": [
     "8 report sections",
     "Partner screening guidance"
    ],
    "consult": [
     "1:1 with a genetic counsellor"
    ],
    "who": [
     null
    ],
    "plans": [
     "Two tests for a couple, £700, save £80"
    ],
    "best": [
     "Planning a family"
    ]
   },
   "sections": [
    "Summary of your carrier status",
    "Gene and variant details",
    "Condition specific findings",
    "Inheritance pattern explanation",
    "Ethnicity based risk context",
    "Partner screening recommendations",
    "Residual risk explanation",
    "Glossary and scientific notes"
   ],
   "img": "/phenome-store/assets/testing/compare/kit-carrier.webp",
   "thumb": "/phenome-store/assets/testing/compare/kit-carrier_t.webp"
  },
  {
   "id": "newborn",
   "name": "Newborn Screening Test",
   "cat": "Genetic testing",
   "price": "£295",
   "buy": "/phenome-store/store/newborn-screening/",
   "alt": "The Newborn Screening Test collection kit",
   "spec": {
    "sample": [
     "Saliva swab, no needles"
    ],
    "method": [
     "Whole genome sequencing",
     "Classified to ACGS and ClinGen standards"
    ],
    "reads": [
     "Treatable conditions, before symptoms appear",
     "1,000+ genes across 6 body systems"
    ],
    "report": [
     "7 report sections",
     "Early detection and prevention guidance"
    ],
    "consult": [
     "1:1 with a genetic counsellor"
    ],
    "who": [
     "Babies from birth to 6 months"
    ],
    "plans": [
     "One time purchase, £295"
    ],
    "best": [
     "New parents"
    ]
   },
   "sections": [
    "Summary of genetic findings",
    "Gene and variant information",
    "Condition specific results",
    "Understanding inheritance",
    "Early detection and prevention",
    "Residual risk",
    "Glossary and scientific notes"
   ],
   "img": "/phenome-store/assets/testing/compare/kit-newborn.webp",
   "thumb": "/phenome-store/assets/testing/compare/kit-newborn_t.webp"
  },
  {
   "id": "sports",
   "name": "Sports Performance Test",
   "cat": "Genetic testing",
   "price": "£220",
   "buy": "/phenome-store/store/sports-performance/",
   "alt": "The Sports Performance Test collection kit",
   "spec": {
    "sample": [
     "Saliva, collected at home"
    ],
    "method": [
     "Whole genome sequencing",
     null
    ],
    "reads": [
     "How your genes shape strength, endurance and recovery",
     "11 performance domains"
    ],
    "report": [
     "11 report sections",
     "Training and nutrition guidance"
    ],
    "consult": [
     "1:1 with a performance coach"
    ],
    "who": [
     "Adults 18 and over"
    ],
    "plans": [
     "One time purchase, £220"
    ],
    "best": [
     "Training, and the recovery after it"
    ]
   },
   "sections": [
    "Performance overview",
    "Muscle composition and strength potential",
    "Explosiveness and anaerobic power",
    "Endurance capacity and oxygen efficiency",
    "Injury risk and tissue integrity",
    "Recovery speed and muscle repair",
    "Metabolic efficiency and energy use",
    "Training response and adaptability",
    "Nutrition and supplement absorption",
    "Mental focus and sleep recovery",
    "Tailored training and nutrition guidance"
   ],
   "img": "/phenome-store/assets/testing/compare/kit-sports.webp",
   "thumb": "/phenome-store/assets/testing/compare/kit-sports_t.webp"
  },
  {
   "id": "oral",
   "name": "Oral Microbiome Test",
   "cat": "Microbiome testing",
   "price": "£150",
   "buy": "/phenome-store/store/oral-microbiome/",
   "alt": "The Oral Microbiome Test collection kit",
   "spec": {
    "sample": [
     "Saliva, collected at home"
    ],
    "method": [
     "Shotgun metagenomic sequencing",
     "Bacteria named to species level"
    ],
    "reads": [
     "The bacteria in your mouth, protective and harmful",
     "700+ bacterial species detectable"
    ],
    "report": [
     "9 report sections",
     "A bacteria dictionary"
    ],
    "consult": [
     "1:1 with a dental specialist"
    ],
    "who": [
     null
    ],
    "plans": [
     "Subscribe and save 20%, £120"
    ],
    "best": [
     "Gum health, breath and the heart"
    ]
   },
   "sections": [
    "Overview summary",
    "Richness and diversity",
    "Microbial composition",
    "Firmicutes to Bacteroidetes ratio",
    "Key oral health indicators",
    "Oral systemic health connections",
    "Inflammatory potential",
    "Protective and harmful species",
    "Personalised recommendations"
   ],
   "img": "/phenome-store/assets/testing/compare/kit-oral.webp",
   "thumb": "/phenome-store/assets/testing/compare/kit-oral_t.webp"
  }
 ],
 "groups": [
  {
   "key": "sample",
   "label": "Sample",
   "icon": "<path d=\"M9 3h6M10 3v6.2L5.6 17.4A2.4 2.4 0 0 0 7.7 21h8.6a2.4 2.4 0 0 0 2.1-3.6L14 9.2V3\"/><path d=\"M7.4 14.5h9.2\"/>",
   "lines": 1
  },
  {
   "key": "method",
   "label": "Method",
   "icon": "<path d=\"M7 3c0 6 10 6 10 12s-10 3-10 6M17 3c0 6-10 6-10 12M17 21c0-1.4-.6-2.4-1.5-3.2\"/><path d=\"M8.6 6.5h6.8M8.6 17.5h6.8\"/>",
   "lines": 2
  },
  {
   "key": "reads",
   "label": "What it reads",
   "icon": "<circle cx=\"11\" cy=\"11\" r=\"6.6\"/><path d=\"m20 20-4.3-4.3\"/>",
   "lines": 2
  },
  {
   "key": "report",
   "label": "Your report",
   "icon": "<path d=\"M6.5 3h8l4 4v14h-12z\"/><path d=\"M14.5 3v4h4M9.5 12h6M9.5 16h6\"/>",
   "lines": 2
  },
  {
   "key": "consult",
   "label": "Consultation",
   "icon": "<circle cx=\"9\" cy=\"8.5\" r=\"3.2\"/><path d=\"M3.4 19.5c.6-3.2 2.8-5 5.6-5s5 1.8 5.6 5\"/><path d=\"M15.5 5.5h5v4.2h-2.4l-2.6 1.8z\"/>",
   "lines": 1
  },
  {
   "key": "who",
   "label": "Who can take it",
   "icon": "<circle cx=\"8\" cy=\"8\" r=\"2.8\"/><circle cx=\"16.5\" cy=\"9.5\" r=\"2.2\"/><path d=\"M3 19c.5-3 2.4-4.8 5-4.8s4.5 1.8 5 4.8M14 14.6c2.8-.6 5.4.9 6.2 4.4\"/>",
   "lines": 1
  },
  {
   "key": "plans",
   "label": "Ways to buy",
   "icon": "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12.5\" rx=\"2.4\"/><path d=\"M3 10h18M6.5 15h3.5\"/>",
   "lines": 1
  },
  {
   "key": "best",
   "label": "Best for",
   "icon": "<path d=\"m12 3.4 2.6 5.4 5.9.8-4.3 4.1 1.1 5.8L12 16.7l-5.3 2.8 1.1-5.8-4.3-4.1 5.9-.8z\"/>",
   "lines": 1
  }
 ],
 "reportIcon": "<path d=\"M6.5 3h8l4 4v14h-12z\"/><path d=\"M14.5 3v4h4M9.5 12h6M9.5 16h6\"/>",
 "defaults": [
  "genomic",
  "gut",
  "carrier"
 ],
 "icons": {
  "Saliva, collected at home": "tube",
  "Stool, collected at home": "pot",
  "Saliva swab, no needles": "swab",
  "Whole genome sequencing": "helix",
  "Shotgun metagenomic sequencing": "microbes",
  "30× depth on Illumina instruments": "layers",
  "Bacteria named to genus and species": "lens-microbe",
  "Bacteria named to species level": "lens-microbe",
  "Classified to ACGS and ClinGen standards": "badge",
  "All three billion letters of your genome": "chromosome",
  "The bacteria in your gut, and what they do": "gut",
  "Inherited conditions you could pass on": "family",
  "Treatable conditions, before symptoms appear": "shield",
  "How your genes shape strength, endurance and recovery": "runner",
  "The bacteria in your mouth, protective and harmful": "tooth",
  "20,000+ genes": "dots",
  "30+ conditions mapped, from IBS to Parkinson’s": "list",
  "500+ conditions across 1,300+ genes": "list",
  "1,000+ genes across 6 body systems": "body",
  "11 performance domains": "radar",
  "700+ bacterial species detectable": "petri",
  "13 health panels": "report",
  "16 report sections": "report",
  "8 report sections": "report",
  "7 report sections": "report",
  "11 report sections": "report",
  "9 report sections": "report",
  "Lifelong reanalysis": "reanalysis",
  "A bacteria dictionary": "book",
  "Partner screening guidance": "couple",
  "Early detection and prevention guidance": "clipboard",
  "Training and nutrition guidance": "clipboard",
  "1:1 with a genetic counsellor": "chat",
  "1:1 with a nutrition specialist": "apple",
  "1:1 with a performance coach": "stopwatch",
  "1:1 with a dental specialist": "tooth",
  "Adults 18 and over": "person",
  "Babies from birth to 6 months": "baby",
  "One time purchase, £650": "tag",
  "One time purchase, £295": "tag",
  "One time purchase, £220": "tag",
  "Subscribe and save 20%, £144": "repeat",
  "Subscribe and save 20%, £120": "repeat",
  "Two tests for a couple, £700, save £80": "two-kits",
  "A complete health picture": "whole",
  "Digestion, immunity and mood": "leaf",
  "Planning a family": "home-heart",
  "New parents": "bottle",
  "Training, and the recovery after it": "dumbbell",
  "Gum health, breath and the heart": "heart"
 },
 "sprite": "/phenome-store/assets/icons/compare.svg#"
};

  var heads = document.querySelector('[data-heads]');
  var bar = document.querySelector('[data-bar]');
  var rowsEl = document.querySelector('[data-rows]');
  if (!heads || !bar || !rowsEl || !DATA) return;

  var MAX = 3;
  var BY = {};
  for (var i = 0; i < DATA.tests.length; i++) BY[DATA.tests[i].id] = DATA.tests[i];

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---- the choice ------------------------------------------------------- */
  function fromUrl() {
    var m = /[?&]tests=([^&#]*)/.exec(location.search);
    if (!m) return null;
    var ids = decodeURIComponent(m[1]).split(','), out = [];
    for (var j = 0; j < ids.length && out.length < MAX; j++) {
      if (BY[ids[j]] && out.indexOf(ids[j]) < 0) out.push(ids[j]);
    }
    return out.length ? out : null;
  }
  var chosen = fromUrl() || DATA.defaults.slice();

  function toUrl() {
    if (!history.replaceState) return;
    var url = location.pathname + '?tests=' + chosen.join(',') + location.hash;
    try { history.replaceState(null, '', url); } catch (err) { /* file:// */ }
  }

  /* ---- markup, mirrored from build_tcmp.py ------------------------------ */
  var ORD = ['First', 'Second', 'Third'];
  function head(t, slot) {
    var opts = '';
    for (var o = 0; o < DATA.tests.length; o++) {
      var ot = DATA.tests[o], mine = ot.id === t.id, other = !mine && chosen.indexOf(ot.id) >= 0;
      opts += '<option value="' + ot.id + '"' + (mine ? ' selected=""' : '') + (other ? ' disabled=""' : '') + '>' + esc(ot.name) + '</option>';
    }
    return '<div class="cmp-head" data-slot="' + slot + '">' +
      '<label class="cmp-pick"><span class="cmp-sr">' + ORD[slot] + ' column</span><select data-pick="' + slot + '">' + opts + '</select></label>' +
      '<figure class="cmp-fig"><img alt="' + esc(t.alt) + '" data-shot="" decoding="async" height="978" src="' + t.img + '" width="1200"/></figure>' +
      '<p class="tcmp-cat" data-cat="">' + esc(t.cat) + '</p><h2 class="cmp-name" data-name="">' + esc(t.name) + '</h2>' +
      '<p class="cmp-price" data-price="">' + esc(t.price) + '</p>' +
      '<a class="btn cmp-buy" data-buy="" href="' + t.buy + '">Buy</a></div>';
  }

  function barc(t, slot) {
    if (!t) return '<div class="cmp-barc is-empty" data-slot="' + slot + '"></div>';
    return '<div class="cmp-barc" data-slot="' + slot + '"><img alt="" aria-hidden="true" decoding="async" height="130" src="' + t.thumb + '" width="160"/>' +
      '<div><p class="cmp-barn">' + esc(t.name) + '</p><p class="cmp-barp">' + esc(t.price) + '</p></div></div>';
  }

  function cell(v) {
    if (v === null) {
      return '<p class="cmp-ln is-none"><span class="cmp-none" role="img" aria-label="Not stated for this test"></span></p>';
    }
    var ic = DATA.icons[v];
    if (!ic) return '<p class="cmp-ln">' + esc(v) + '</p>';
    return '<p class="cmp-ln has-ic"><svg class="cmp-ic" aria-hidden="true" focusable="false"><use href="' +
      DATA.sprite + ic + '"/></svg><span>' + esc(v) + '</span></p>';
  }

  function pill(icon, label) {
    return '<h3 class="cmp-grp-h"><span class="cmp-pill"><svg aria-hidden="true" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">' + icon + '</svg>' +
      label + '</span></h3>';
  }

  function rows(cols) {
    var filled = 0, c, out = '';
    for (c = 0; c < cols.length; c++) if (cols[c]) filled++;
    for (var g = 0; g < DATA.groups.length; g++) {
      var grp = DATA.groups[g], lines = '';
      for (var l = 0; l < grp.lines; l++) {
        var vals = [], live = [];
        for (c = 0; c < cols.length; c++) {
          if (!cols[c]) { vals.push(''); continue; }
          var sp = cols[c].spec[grp.key];
          var v = l < sp.length ? sp[l] : null;
          vals.push(v); live.push(v);
        }
        var same = true, none = true;
        for (var k = 0; k < live.length; k++) {
          if (live[k] !== live[0]) same = false;
          if (live[k] !== null) none = false;
        }
        if ((filled > 1 && same) || none) continue;
        for (c = 0; c < cols.length; c++) {
          lines += cols[c] ? cell(vals[c]) : '<p class="cmp-ln is-empty"></p>';
        }
      }
      if (lines) out += '<div class="cmp-grp">' + pill(grp.icon, grp.label) + '<div class="cmp-lines">' + lines + '</div></div>';
    }
    var lists = '';
    for (c = 0; c < cols.length; c++) {
      if (!cols[c]) { lists += '<div class="tcmp-list is-empty"></div>'; continue; }
      var items = '';
      for (var s = 0; s < cols[c].sections.length; s++) items += '<li>' + esc(cols[c].sections[s]) + '</li>';
      lists += '<ol class="tcmp-list">' + items + '</ol>';
    }
    out += '<div class="cmp-grp">' + pill(DATA.reportIcon, 'Inside the report') +
      '<div class="cmp-lines tcmp-lists">' + lists + '</div></div>';
    return out;
  }

  /* ---- paint ------------------------------------------------------------
     The heads are rebuilt only on the first pass; after that a change swaps
     ONE column's head (so the select being used keeps focus) and every
     select's disabled options, then the bar and the rows. */
  function cols() {
    var out = [];
    for (var s = 0; s < MAX; s++) out.push(BY[chosen[s]]);
    return out;
  }

  function lockDuplicates() {
    var sels = heads.querySelectorAll('[data-pick]');
    for (var p = 0; p < sels.length; p++) {
      var mine = Number(sels[p].getAttribute('data-pick'));
      for (var o = 0; o < sels[p].options.length; o++) {
        var v = sels[p].options[o].value, taken = false;
        for (var s = 0; s < chosen.length; s++) if (s !== mine && chosen[s] === v) taken = true;
        sels[p].options[o].disabled = taken;
      }
    }
  }

  function paintBody() {
    var c = cols(), b = '';
    for (var s = 0; s < MAX; s++) b += barc(c[s], s);
    bar.innerHTML = b;
    rowsEl.innerHTML = rows(c);
    lockDuplicates();
  }

  function setColumn(slot) {
    var t = BY[chosen[slot]];
    var el = heads.querySelector('.cmp-head[data-slot="' + slot + '"]');
    if (!el) return;
    var img = el.querySelector('[data-shot]');
    var fig = img ? img.parentNode : null;
    if (img && img.getAttribute('src') !== t.img) {
      if (fig) fig.className = 'cmp-fig is-swapping';
      img.setAttribute('src', t.img);
      img.setAttribute('alt', t.alt);
    }
    el.querySelector('[data-cat]').textContent = t.cat;
    el.querySelector('[data-name]').textContent = t.name;
    el.querySelector('[data-price]').textContent = t.price;
    el.querySelector('[data-buy]').setAttribute('href', t.buy);
  }

  /* compare-materials' opening guard: a browser may restore a select's value
     across reload or the back button before this runs, and may restore two
     of them to the same test. Each slot is read, pushed to the first free
     test if it collides, and the page is painted from the result. */
  function taken(id, upTo) {
    for (var s = 0; s < upTo; s++) if (chosen[s] === id) return true;
    return false;
  }
  if (chosen.length < MAX) {
    for (var d = 0; d < DATA.tests.length && chosen.length < MAX; d++) {
      if (chosen.indexOf(DATA.tests[d].id) < 0) chosen.push(DATA.tests[d].id);
    }
  }
  if (!fromUrl()) {
    var restored = heads.querySelectorAll('[data-pick]');
    for (var r = 0; r < restored.length; r++) {
      var slot0 = Number(restored[r].getAttribute('data-pick'));
      if (BY[restored[r].value]) chosen[slot0] = restored[r].value;
    }
  }
  for (var q = 0; q < MAX; q++) {
    if (taken(chosen[q], q)) {
      for (var f = 0; f < DATA.tests.length; f++) {
        if (!taken(DATA.tests[f].id, q)) { chosen[q] = DATA.tests[f].id; break; }
      }
    }
  }

  var h = '', start = cols();
  for (var s0 = 0; s0 < MAX; s0++) h += head(start[s0], s0);
  heads.innerHTML = h;
  paintBody();

  heads.addEventListener('change', function (e) {
    var sel = e.target;
    if (!sel.hasAttribute || !sel.hasAttribute('data-pick') || !BY[sel.value]) return;
    var slot = Number(sel.getAttribute('data-pick'));
    chosen[slot] = sel.value;
    setColumn(slot);
    paintBody();
    toUrl();
  });

  /* The fade back in, once the new kit shot has decoded. */
  heads.addEventListener('load', function (e) {
    var img = e.target;
    if (img && img.hasAttribute && img.hasAttribute('data-shot') && img.parentNode) {
      img.parentNode.className = 'cmp-fig';
    }
  }, true);

  if (fromUrl()) toUrl();

  /* ---- the closing frame's drift, compare-materials' writer --------------- */
  var par = document.querySelector('[data-par]');
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (par && !calm) {
    par.classList.add('is-lively');
    var queued = false;
    var write = function () {
      queued = false;
      var r = par.getBoundingClientRect();
      var vh = innerHeight || 1;
      var p = (vh - r.top) / (vh + r.height);
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
