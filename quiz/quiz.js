/* Shop by goal quiz, page script for quiz/index.html (body .qz).

   One question at a time. Each answer quietly weights the products it points
   to; the result leads with the heaviest, pairs it with the next two, and
   says which answers brought it there. No running score is shown.

   Prices come from store/cart/cart.js (the site's price authority), and the
   cart ids match its catalogue so Add to cart hands straight to the drawer. */
(function () {
  'use strict';

  var root = document.querySelector('[data-qz]');
  if (!root) return;

  var BASE = '/phenome-store';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');

  var P = {
    genomic:   { name: 'Comprehensive Genomic Test', cart: '/store/comprehensive-genomic/', href: '/testing/comprehensive-genomic/', tile: 'test-genomic', price: 65000,
                 blurb: 'Whole genome sequencing reads all three billion base pairs of your DNA, turning 20,000+ genes into clear guidance for your health, longevity and prevention.' },
    gut:       { name: 'Gut Microbiome Test', cart: '/store/gut-microbiome/', href: '/store/gut-microbiome/', tile: 'test-gut', price: 18000,
                 blurb: 'Shotgun metamicrobiome sequencing maps the bacteria living in your gut, with clear guidance for digestion, immunity and metabolism.' },
    oral:      { name: 'Oral Microbiome Test', cart: '/store/oral-microbiome/', href: '/store/oral-microbiome/', tile: 'test-oral', price: 15000,
                 blurb: 'Sequencing the bacteria in your mouth turns your oral microbiome into guidance for gum health, fresh breath and whole body wellbeing.' },
    carrier:   { name: 'Carrier Screening Test', cart: '/store/carrier-screening/', href: '/store/carrier-screening/', tile: 'test-carrier', price: 39000,
                 blurb: 'Reads the recessive conditions you could pass to a child, long before it becomes an urgent question.' },
    newborn:   { name: 'Newborn Screening Test', cart: '/store/newborn-screening/', href: '/store/newborn-screening/', tile: 'test-newborn', price: 29500,
                 blurb: 'Screening in the first months turns invisible risks into decisions you can act on, when early care matters most.' },
    sports:    { name: 'Sports Performance Test', cart: '/store/sports-performance/', href: '/store/sports-performance/', tile: 'test-sports', price: 22000,
                 blurb: 'For everyone from professional athletes to beginners, tailoring training, recovery and nutrition to your genetic profile.' },
    ring:      { name: 'PhenomeTech Ring', cart: '/store/phenometech-ring/', href: '/store/phenometech-ring/', tile: 'ring-phenometech', price: 17900,
                 blurb: 'A light ring that tracks sleep, activity, heart rate and recovery, feeding the same app as your test results.' },
    band:      { name: 'PhenomeTech Band', cart: '/devices/band/', href: '/devices/band/', tile: 'band-phenometech', price: 14900,
                 blurb: 'A screenless band that reads your heart, sleep, temperature and training all day.' },
    nad:       { name: 'NAD+', cart: '/supplements/nad/', href: '/supplements/nad/', tile: 'supp-nad', price: 6499,
                 blurb: 'A liposomal NAD+ sachet taken each morning, to support cellular energy as you age.' },
    carnitine: { name: 'Carnitine Performance+', cart: '/supplements/carnitine-performance/', href: '/supplements/carnitine-performance/', tile: 'supp-carnitine', price: 2999,
                 blurb: 'Acetyl-L-carnitine capsules for energy and recovery around training.' }
  };
  var ORDER = Object.keys(P);

  var Q = [
    { q: 'What do you most want to achieve?', short: 'Goal',
      why: 'This sets the goal everything else is weighed against.',
      opts: [['Live longer and age well', { genomic: 3, ring: 2, nad: 2 }],
             ['Improve my gut health', { gut: 4, oral: 1 }],
             ['More energy and better sleep', { ring: 3, gut: 2, nad: 1 }],
             ['Perform at my peak', { sports: 4, ring: 2, band: 2, carnitine: 1 }],
             ['Plan a family', { carrier: 4, newborn: 2 }],
             ['Understand my genome and risks', { genomic: 4, carrier: 2 }]] },
    { q: 'What is bothering you most right now?', short: 'Right now',
      why: 'Symptoms point to the test most likely to explain them.',
      opts: [['Digestion, bloating or IBS', { gut: 3 }],
             ['Low energy or poor sleep', { ring: 2, gut: 2, nad: 1 }],
             ['Breath, gums or teeth', { oral: 4 }],
             ['Recovery or recurring injuries', { sports: 3, band: 1, carnitine: 1 }],
             ['Nothing, I am being proactive', { genomic: 2 }]] },
    { q: 'How do you like to measure your health?', short: 'Measuring',
      why: 'Some people want a device that reads them every day, others one deep test.',
      opts: [['Continuous wearable data', { ring: 4, band: 2 }],
             ['One deep test', { genomic: 2, gut: 1 }],
             ['A bit of both', { ring: 2, genomic: 2 }]] },
    { q: 'How deep do you want to go on genetics?', short: 'Genetics',
      why: 'Decides between your whole genome and a lighter, targeted route.',
      opts: [['My whole genome, everything', { genomic: 4 }],
             ['Only what I can act on', { carrier: 2, sports: 1 }],
             ['Not fussed about genetics', { gut: 2, ring: 2 }]] },
    { q: 'Are you planning a family?', short: 'Family',
      why: 'Family plans bring in Carrier Screening, and Newborn Screening after birth.',
      opts: [['Yes, in the next year or two', { carrier: 4, newborn: 1 }],
             ['Already expecting', { carrier: 3, newborn: 3 }],
             ['We have a newborn', { newborn: 4 }],
             ['No', {}]] },
    { q: 'Want a daily supplement in the plan?', short: 'Supplement',
      why: 'Adds something to take every day, for people who want action as well as data.',
      opts: [['Yes, add one', { nad: 3, carnitine: 1 }],
             ['Just the insights for now', {}]] }
  ];

  var $ = function (s, c) { return (c || root).querySelector(s); };
  var ask = $('[data-qz-ask]'), card = $('[data-qz-card]'), qEl = $('[data-qz-q]');
  var whyEl = $('[data-qz-why]'), optsEl = $('[data-qz-opts]'), stepEl = $('[data-qz-step]');
  var progEl = $('[data-qz-prog]'), backEl = $('[data-qz-back]'), hintEl = $('[data-qz-hint]');
  var resEl = $('[data-qz-result]');

  var step = 0, answers = [], busy = false;

  function money(p) {
    return '£' + (p % 100 ? (p / 100).toFixed(2) : String(p / 100));
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  function tile(k) { return BASE + '/assets/shop/' + P[k].tile + '.webp'; }
  function done() { return answers.length === Q.length && answers.every(function (a) { return a != null; }); }

  function scores() {
    var s = {}, why = {};
    ORDER.forEach(function (k) { s[k] = 0; why[k] = []; });
    answers.forEach(function (ai, qi) {
      if (ai == null) return;
      var o = Q[qi].opts[ai];
      for (var k in o[1]) { s[k] += o[1][k]; why[k].push({ qi: qi, label: o[0], w: o[1][k] }); }
    });
    return { s: s, why: why };
  }
  function ranked(s) {
    return ORDER.slice().sort(function (a, b) { return s[b] - s[a] || ORDER.indexOf(a) - ORDER.indexOf(b); });
  }

  /* ---- question ----------------------------------------------------------- */
  function renderProgress() {
    progEl.innerHTML = Q.map(function (_, i) {
      return '<span class="' + (answers[i] != null ? 'is-done' : '') + (i === step ? ' is-now' : '') + '"><i></i></span>';
    }).join('');
  }

  function renderQuestion() {
    var q = Q[step];
    stepEl.textContent = 'Question ' + (step + 1) + ' of ' + Q.length;
    qEl.textContent = q.q;
    whyEl.textContent = q.why;
    backEl.hidden = step === 0;
    hintEl.textContent = done() ? 'Change your answer, or press its number' : 'Pick one to continue, or press its number';
    optsEl.setAttribute('aria-label', q.q);
    optsEl.innerHTML = '';
    q.opts.forEach(function (o, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'qz-opt' + (answers[step] === i ? ' is-on' : '');
      b.style.setProperty('--i', i);
      b.setAttribute('aria-pressed', answers[step] === i ? 'true' : 'false');
      var tags = Object.keys(o[1]).map(function (k) { return P[k].name; });
      b.innerHTML = '<span class="qz-opt-k">' + (i + 1) + '</span>' +
        '<span class="qz-opt-t">' + esc(o[0]) +
        '<span class="qz-opt-s">' + (tags.length ? 'Lifts ' + esc(tags.join(', ')) : 'Adds nothing, and that is fine') + '</span></span>' +
        '<span class="qz-opt-c" aria-hidden="true"></span>';
      b.addEventListener('click', function () { choose(i); });
      optsEl.appendChild(b);
    });
    renderProgress();
  }

  /* Leave, swap the words, arrive. The card leaves upward and the new one
     rises into place; options follow in a 40ms stagger (see quiz.css). */
  function swap(fn) {
    if (RM.matches) { fn(); return; }
    busy = true;
    card.classList.add('is-out');
    setTimeout(function () {
      fn();
      card.classList.remove('is-out');
      card.classList.add('is-in');
      void card.offsetWidth;
      card.classList.remove('is-in');
      busy = false;
    }, 190);
  }

  function choose(i) {
    if (busy) return;
    var btn = optsEl.children[i];
    if (btn) {
      [].forEach.call(optsEl.children, function (c) { c.classList.remove('is-on'); c.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-on', 'is-pick');
      btn.setAttribute('aria-pressed', 'true');
    }
    answers[step] = i;
    renderProgress();

    setTimeout(function () {
      if (done()) { showResult(); return; }
      var next = step + 1;
      while (next < Q.length && answers[next] != null) next++;
      if (next >= Q.length) { next = answers.indexOf(undefined); if (next < 0) next = Q.length - 1; }
      swap(function () { step = next; renderQuestion(); qEl.focus({ preventScroll: true }); });
    }, RM.matches ? 0 : 260);
  }

  backEl.addEventListener('click', function () {
    if (busy || step === 0) return;
    swap(function () { step--; renderQuestion(); qEl.focus({ preventScroll: true }); });
  });

  document.addEventListener('keydown', function (e) {
    if (ask.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName || '')) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= Q[step].opts.length) {
      var r = root.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      e.preventDefault();
      choose(n - 1);
    }
  });

  /* ---- result ------------------------------------------------------------- */
  function cartBtn(ids, label, cls) {
    return '<button type="button" class="' + cls + '" data-qz-add="' + ids.join(' ') + '">' + label + '</button>';
  }

  function showResult() {
    var r = scores(), s = r.s, order = ranked(s).filter(function (k) { return s[k] > 0; });
    if (!order.length) order = ['genomic'];
    var lead = order[0], pair = order.slice(1, 3), p = P[lead];

    $('[data-qz-res-name]').textContent = p.name;
    $('[data-qz-hero]').innerHTML =
      '<div class="qz-hero-media"><img src="' + tile(lead) + '" alt="' + esc(p.name) + '" width="900" height="900"/></div>' +
      '<div class="qz-hero-body">' +
      '<p class="qz-hero-price">' + money(p.price) + '</p>' +
      '<p class="qz-hero-blurb">' + esc(p.blurb) + '</p>' +
      '<p class="qz-hero-k">Why it leads</p>' +
      '<ul class="qz-because">' + r.why[lead].map(function (w) {
        return '<li><span>You chose ' + esc(w.label.charAt(0).toLowerCase() + w.label.slice(1)) + '</span></li>';
      }).join('') + '</ul>' +
      '<div class="qz-hero-cta">' + cartBtn([lead], 'Add to cart', 'btn') +
      '<a class="link-more" href="' + BASE + p.href + '">See the ' + (/Test$/.test(p.name) ? 'test' : 'product') + '</a></div>' +
      '</div>';

    $('[data-qz-pair]').innerHTML = pair.map(function (k, i) {
      var x = P[k];
      return '<article class="qz-mini" style="--i:' + i + '">' +
        '<a class="qz-mini-media" href="' + BASE + x.href + '" tabindex="-1" aria-hidden="true"><img src="' + tile(k) + '" alt="" width="900" height="900" loading="lazy"/></a>' +
        '<div class="qz-mini-body"><h4 class="qz-mini-n"><a href="' + BASE + x.href + '">' + esc(x.name) + '</a></h4>' +
        '<p class="qz-mini-b">' + esc(x.blurb) + '</p>' +
        '<div class="qz-mini-foot"><span class="qz-mini-p">' + money(x.price) + '</span>' +
        cartBtn([k], 'Add', 'qz-add') + '</div></div></article>';
    }).join('');
    $('[data-qz-pair]').previousElementSibling.hidden = !pair.length;

    var all = [lead].concat(pair);
    var sum = all.reduce(function (t, k) { return t + P[k].price; }, 0);
    $('[data-qz-total]').innerHTML =
      '<p class="qz-total-t">' + (all.length > 1 ? 'All ' + (all.length === 2 ? 'two' : 'three') + ' together' : 'Your plan') +
      '<b>' + money(sum) + '</b></p>' +
      '<div class="qz-total-cta">' + cartBtn(all, all.length > 1 ? 'Add all to cart' : 'Add to cart', 'btn') +
      '<button type="button" class="btn ghost" data-qz-restart>Start over</button></div>';

    ask.hidden = true;
    resEl.hidden = false;
    resEl.classList.remove('is-in'); void resEl.offsetWidth; resEl.classList.add('is-in');
    var top = root.getBoundingClientRect().top + scrollY - 96;
    if (scrollY > top) scrollTo({ top: top, behavior: RM.matches ? 'auto' : 'smooth' });
    $('[data-qz-res-h]').focus({ preventScroll: true });
  }

  function backToQuestions(at) {
    resEl.hidden = true;
    ask.hidden = false;
    step = at;
    renderQuestion();
    qEl.focus({ preventScroll: true });
  }

  root.addEventListener('click', function (e) {
    var add = e.target.closest('[data-qz-add]');
    if (add) {
      var C = window.PhenomeCart;
      var ids = add.getAttribute('data-qz-add').split(' ');
      if (C && C.add) {
        ids.forEach(function (k) { C.add(P[k].cart); });
        C.open();
        add.classList.add('is-added');
      } else {
        location.href = BASE + P[ids[0]].href;
      }
      return;
    }
    if (e.target.closest('[data-qz-restart]')) {
      answers = [];
      backToQuestions(0);
      var top = root.getBoundingClientRect().top + scrollY - 96;
      scrollTo({ top: top, behavior: RM.matches ? 'auto' : 'smooth' });
    }
  });

  /* ---- goal photographs ------------------------------------------------ */
  document.querySelectorAll('[data-goal]').forEach(function (g) {
    g.addEventListener('click', function () {
      answers = [+g.getAttribute('data-goal')];
      backToQuestions(1);
      var top = root.getBoundingClientRect().top + scrollY - 96;
      scrollTo({ top: top, behavior: RM.matches ? 'auto' : 'smooth' });
    });
  });

  renderQuestion();
})();
