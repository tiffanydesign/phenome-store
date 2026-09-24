/* Shop by goal quiz, page script for quiz/index.html (body .qz).

   One question at a time on the left; on the right a live plan panel lists
   every product the quiz can recommend, ordered by the weight the answers so
   far give it. Answering animates the bars and reorders the list (FLIP), and
   hovering an answer previews the weight it would add, so the reader can see
   why a product leads before the result screen says so.

   Prices come from store/cart/cart.js (the site's price authority), and the
   cart ids match its catalogue so Add to cart hands straight to the drawer. */
(function () {
  'use strict';

  var root = document.querySelector('[data-qz]');
  if (!root) return;

  var BASE = '/phenome-store';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  /* A bar is full at this weight, the most any product can collect from
     answers that point at it, so bars only ever grow as answers come in. */
  var FULL = 16;

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
  var resEl = $('[data-qz-result]'), planEl = $('[data-qz-plan]'), listEl = $('[data-qz-list]');
  var recapEl = $('[data-qz-recap]'), noteEl = $('[data-qz-plan-note]'), planH = $('[data-qz-plan-h]');
  var barEl = $('[data-qz-bar]'), barName = $('[data-qz-bar-name]'), barThumbs = $('[data-qz-bar-thumbs]');

  var step = 0, answers = [], busy = false;

  function money(p) {
    return '£' + (p % 100 ? (p / 100).toFixed(2) : String(p / 100));
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  function tile(k) { return BASE + '/assets/shop/' + P[k].tile + '.webp'; }
  function done() { return answers.length === Q.length && answers.every(function (a) { return a != null; }); }

  function scores(extra) {
    var s = {}, why = {};
    ORDER.forEach(function (k) { s[k] = 0; why[k] = []; });
    answers.forEach(function (ai, qi) {
      if (ai == null) return;
      var o = Q[qi].opts[ai];
      for (var k in o[1]) { s[k] += o[1][k]; why[k].push({ qi: qi, label: o[0], w: o[1][k] }); }
    });
    var pre = {};
    if (extra) for (var k2 in extra) pre[k2] = extra[k2];
    return { s: s, why: why, pre: pre };
  }
  function ranked(s) {
    return ORDER.slice().sort(function (a, b) { return s[b] - s[a] || ORDER.indexOf(a) - ORDER.indexOf(b); });
  }

  /* ---- plan panel ------------------------------------------------------- */
  var rows = {};
  ORDER.forEach(function (k) {
    var li = document.createElement('li');
    li.className = 'qz-row';
    li.innerHTML =
      '<img class="qz-row-img" src="' + tile(k) + '" alt="" width="900" height="900" loading="lazy"/>' +
      '<span class="qz-row-txt"><span class="qz-row-n">' + esc(P[k].name) + '</span>' +
      '<span class="qz-row-p">' + money(P[k].price) + '</span></span>' +
      '<span class="qz-row-d" aria-hidden="true"></span>' +
      '<span class="qz-meter" aria-hidden="true"><i class="qz-meter-pre"></i><i class="qz-meter-on"></i></span>';
    rows[k] = li;
    listEl.appendChild(li);
  });

  /* FLIP: read every row's box, reorder, then play each row back from where
     it was. Only transform animates, so a reorder costs no layout per frame. */
  function paintPlan(extra, deltas) {
    var r = scores(extra), s = r.s, order = ranked(s);
    var first = {};
    ORDER.forEach(function (k) { first[k] = rows[k].getBoundingClientRect().top; });

    order.forEach(function (k, i) {
      var li = rows[k], on = s[k] > 0;
      li.classList.toggle('is-on', on);
      li.classList.toggle('is-lead', i === 0 && on);
      li.style.setProperty('--on', Math.min(s[k] / FULL, 1));
      li.style.setProperty('--pre', Math.min((s[k] + (r.pre[k] || 0)) / FULL, 1));
      li.classList.toggle('is-pre', !!r.pre[k]);
      listEl.appendChild(li);
    });

    if (!RM.matches) {
      ORDER.forEach(function (k) {
        var dy = first[k] - rows[k].getBoundingClientRect().top;
        if (!dy) return;
        rows[k].animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }],
          { duration: 460, easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
    }

    if (deltas) {
      for (var k in deltas) {
        var d = rows[k].querySelector('.qz-row-d');
        d.textContent = '+' + deltas[k];
        d.classList.remove('is-in'); void d.offsetWidth; d.classList.add('is-in');
      }
    }

    var any = order.filter(function (k) { return s[k] > 0; });
    listEl.classList.toggle('is-empty', !any.length);
    noteEl.hidden = !!any.length;
    barName.textContent = any.length ? P[any[0]].name : 'Answer a question to start';
    barThumbs.innerHTML = any.slice(0, 3).map(function (k) {
      return '<img src="' + tile(k) + '" alt="" width="900" height="900"/>';
    }).join('');
  }

  function preview(o) { if (!done()) paintPlan(o ? o[1] : null); }

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
      b.addEventListener('mouseenter', function () { preview(o); });
      b.addEventListener('focus', function () { preview(o); });
      b.addEventListener('mouseleave', function () { preview(null); });
      b.addEventListener('blur', function () { preview(null); });
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
    var prev = answers[step];
    answers[step] = i;
    var deltas = {};
    var o = Q[step].opts[i][1];
    for (var k in o) deltas[k] = o[k];
    if (prev === i) deltas = null;
    paintPlan(null, deltas);
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
        return '<li><span class="qz-because-w">+' + w.w + '</span><span>You chose ' + esc(w.label.charAt(0).toLowerCase() + w.label.slice(1)) + '</span></li>';
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

    planH.textContent = 'Your answers';
    recapEl.innerHTML = Q.map(function (q, qi) {
      return '<li><span class="qz-recap-k">' + q.short + '</span>' +
        '<span class="qz-recap-a">' + esc(q.opts[answers[qi]][0]) + '</span>' +
        '<button type="button" class="qz-recap-edit" data-qz-edit="' + qi + '" aria-label="Change ' + esc(q.short) + '">Change</button></li>';
    }).join('');
    recapEl.hidden = false;
    listEl.hidden = true;
    noteEl.hidden = true;
    planEl.classList.add('is-result');

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
    listEl.hidden = false;
    recapEl.hidden = true;
    planH.textContent = 'Your plan so far';
    planEl.classList.remove('is-result');
    step = at;
    renderQuestion();
    paintPlan();
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
    var ed = e.target.closest('[data-qz-edit]');
    if (ed) { backToQuestions(+ed.getAttribute('data-qz-edit')); return; }
    if (e.target.closest('[data-qz-restart]')) {
      answers = [];
      paintPlan();
      backToQuestions(0);
      var top = root.getBoundingClientRect().top + scrollY - 96;
      scrollTo({ top: top, behavior: RM.matches ? 'auto' : 'smooth' });
    }
  });

  /* Under 960px the panel is a bar pinned to the foot of the stage; tapping
     it opens the full list over the question. */
  barEl.addEventListener('click', function () {
    var open = planEl.classList.toggle('is-open');
    barEl.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ---- goal photographs ------------------------------------------------ */
  document.querySelectorAll('[data-goal]').forEach(function (g) {
    g.addEventListener('click', function () {
      answers = [+g.getAttribute('data-goal')];
      backToQuestions(1);
      var o = Q[0].opts[answers[0]][1], d = {};
      for (var k in o) d[k] = o[k];
      paintPlan(null, d);
      var top = root.getBoundingClientRect().top + scrollY - 96;
      scrollTo({ top: top, behavior: RM.matches ? 'auto' : 'smooth' });
    });
  });

  renderQuestion();
  paintPlan();
})();
