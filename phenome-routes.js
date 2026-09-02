/* ============================================================================
   Phenome Store — the site map dock.

   AN OVERLAY, like phenome-glass.css, and it owns nothing the mirror already
   has. Every page already carries `.ds-launch`, the floating control that opens
   the design system. This file turns that single control into a DOCK: hover it
   and a second control rises above it, which opens a sheet listing every route
   on the site as a tree.

   The dock is built at runtime rather than written into 83 pages, so the mirror
   keeps one <script> tag per page and nothing else. On the design-system page,
   which deliberately carries no `.ds-launch`, the dock is created with the site
   map control alone.

   THE ROUTE TABLE BELOW IS GENERATED, not maintained by hand. It is the mirror
   walked on disk: every .html file, its route with `/index.html` folded away,
   and its <title> with the brand suffix trimmed. Regenerate after adding or
   removing a page — anything that walks the tree and emits the same pairs will
   do, and the counts in the sheet's header are computed from the table rather
   than typed, so a stale table cannot claim a number it does not have.
   ========================================================================== */
(function () {
  'use strict';

var ROUTES = [
  ["/", "Phenome Longevity"],
  ["/about/", "About"],
  ["/account/", "Your account"],
  ["/account/activate/", "Activate a kit"],
  ["/account/orders/", "Track an order"],
  ["/app/", "The App"],
  ["/app/book-a-session/", "Book a session"],
  ["/app/dashboard/", "Your dashboard"],
  ["/app/results-and-reports/", "Results and reports"],
  ["/app/trends/", "Trends over time"],
  ["/careers/", "Careers"],
  ["/clinic/", "The Clinic"],
  ["/clinic/book/", "Register your interest"],
  ["/clinic/what-to-expect/", "What to expect at the clinic"],
  ["/contact/", "Support"],
  ["/design-system/", "Design system"],
  ["/devices/ring/", "PhenomeTech Ring"],
  ["/devices/ring/compare-materials/", "Compare materials"],
  ["/devices/ring/find-your-size/", "Find your size"],
  ["/devices/ring/how-it-works/", "How it works"],
  ["/devices/ring/warranty-returns/", "Warranty & returns"],
  ["/hub/", "Longevity Hub"],
  ["/hub/gut-guide/", "The complete guide to gut health"],
  ["/hub/podcast/", "The Longevity Seat"],
  ["/hub/search/", "Search"],
  ["/legal/privacy.html", "Privacy & data"],
  ["/legal/terms.html", "Terms"],
  ["/press/", "Press"],
  ["/quiz/", "Shop by goal"],
  ["/science/", "The Science"],
  ["/science/multiomics/", "Multiomics"],
  ["/science/our-research/", "Our research"],
  ["/science/systems-biology/", "Systems biology"],
  ["/science/whole-genome-sequencing/", "Whole genome sequencing"],
  ["/sitemap/", "Sitemap"],
  ["/store/", "Store"],
  ["/store/carrier-screening/", "Carrier Screening Test"],
  ["/store/cart/", "Your bag"],
  ["/store/checkout/", "Checkout"],
  ["/store/checkout/confirmed/", "Order confirmed"],
  ["/store/comprehensive-genomic/", "Comprehensive Genomic Test"],
  ["/store/devices/", "Devices"],
  ["/store/genetic/", "Genetic"],
  ["/store/gut-microbiome/", "Gut Microbiome Test"],
  ["/store/microbiome/", "Microbiome"],
  ["/store/newborn-screening/", "Newborn Screening Test"],
  ["/store/oral-microbiome/", "Oral Microbiome Test"],
  ["/store/phenometech-ring/", "PhenomeTech Ring"],
  ["/store/sports-performance/", "Sports Performance Test"],
  ["/store/supplements/", "Supplements"],
  ["/supplements/", "Supplements — moved to the store"],
  ["/supplements/broccoli-complex-capsules/", "Broccoli Complex Capsules"],
  ["/supplements/bromelain-capsules/", "Bromelain Capsules"],
  ["/supplements/carnitine-performance/", "Carnitine Performance+"],
  ["/supplements/flexicream/", "FlexiCream"],
  ["/supplements/gly-nac/", "Gly-NAC"],
  ["/supplements/guarana-capsules/", "Guarana Capsules"],
  ["/supplements/joint-boost-capsules/", "Joint Boost Capsules"],
  ["/supplements/mitochondria-boost/", "Mitochondria Boost"],
  ["/supplements/multi-collagen-powder/", "Multi-Collagen Powder"],
  ["/supplements/nad-betaine/", "NAD+ Betaine"],
  ["/supplements/nad-boost/", "NAD+ Boost"],
  ["/supplements/nad-resveratrol/", "NAD+ Resveratrol"],
  ["/supplements/nad-spermidine/", "NAD+ Spermidine"],
  ["/supplements/nad/", "NAD+"],
  ["/supplements/nigella-sativa-seed-oil/", "Nigella Sativa Seed Oil"],
  ["/supplements/pelargonium-throat-lozenges/", "Pelargonium Throat Lozenges"],
  ["/supplements/propolis-throat-lozenges/", "Propolis Throat Lozenges"],
  ["/supplements/quercetin-capsules/", "Quercetin Capsules"],
  ["/supplements/sambucus-gummies/", "Sambucus Gummies"],
  ["/supplements/ser-nac/", "Ser-NAC"],
  ["/supplements/throat-relief-lozenges/", "Throat Relief Lozenges"],
  ["/testing/", "Testing"],
  ["/testing/carrier-screening/", "Carrier Screening Test"],
  ["/testing/compare/", "Compare tests"],
  ["/testing/comprehensive-genomic/", "Comprehensive Genomic Test"],
  ["/testing/genetic/", "Genetic testing"],
  ["/testing/gut-microbiome/", "Gut Microbiome Test"],
  ["/testing/how-it-works/", "How testing works"],
  ["/testing/microbiome/", "Microbiome testing"],
  ["/testing/newborn-screening/", "Newborn Screening Test"],
  ["/testing/oral-microbiome/", "Oral Microbiome Test"],
  ["/testing/sports-performance/", "Sports Performance Test"],
];

  /* The base the site is served from, taken from THIS script's own src rather
     than assumed. The mirror lives at /phenome-store on project pages and at /
     on a real domain; reading it back means the dock follows the deployment
     instead of hard-typing one of them. */
  var self = document.currentScript;
  if (!self) {
    var all = document.getElementsByTagName('script');
    self = all[all.length - 1];
  }
  var BASE = self.src.replace(/\/[^/]*$/, '');
  var BASE_PATH = BASE.replace(/^[a-z]+:\/\/[^/]*/i, '');

  function here() {
    var p = location.pathname;
    if (BASE_PATH && p.indexOf(BASE_PATH) === 0) p = p.slice(BASE_PATH.length);
    return p || '/';
  }

  /* ---- the tree ---------------------------------------------------------
     Routes are directories, so the hierarchy is already in the string. Group
     on the first segment, then sort so a section's own page leads the section
     it names and its children follow in path order. */
  function build() {
    var groups = [], byKey = {};
    ROUTES.forEach(function (r) {
      var route = r[0];
      var key = route === '/' ? '/' : route.split('/')[1];
      if (!byKey[key]) { byKey[key] = { key: key, rows: [] }; groups.push(byKey[key]); }
      byKey[key].rows.push({ route: route, title: r[1] });
    });
    groups.forEach(function (g) {
      g.rows.sort(function (a, b) {
        return a.route.length - b.route.length || a.route.localeCompare(b.route);
      });
    });
    groups.sort(function (a, b) {
      if (a.key === '/') return -1;
      if (b.key === '/') return 1;
      return a.key.localeCompare(b.key);
    });
    return groups;
  }

  function depthOf(route) {
    if (route === '/') return 0;
    var segs = route.replace(/^\/|\/$/g, '').split('/');
    if (/\.html$/.test(route)) segs.pop();
    return Math.max(0, segs.length - 1);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---- the sheet -------------------------------------------------------- */
  var overlay, input, countEl, opener, rows = [];

  function render() {
    var groups = build();
    var current = here();

    overlay = el('div', 'ph-routes');
    overlay.hidden = true;

    var scrim = el('div', 'ph-routes-scrim');
    scrim.setAttribute('data-ph-routes-close', '');
    overlay.appendChild(scrim);

    var sheet = el('div', 'ph-routes-sheet');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Site map');

    var head = el('header', 'ph-routes-head');
    var titles = el('div', 'ph-routes-titles');
    titles.appendChild(el('p', 'ph-routes-kicker', 'Phenome · Store'));
    titles.appendChild(el('h2', null, 'Site map'));
    head.appendChild(titles);

    countEl = el('p', 'ph-routes-count');
    head.appendChild(countEl);

    input = el('input', 'ph-routes-filter');
    input.type = 'search';
    input.placeholder = 'Filter routes';
    input.setAttribute('aria-label', 'Filter routes');
    head.appendChild(input);

    var close = el('button', 'ph-routes-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close the site map');
    close.setAttribute('data-ph-routes-close', '');
    head.appendChild(close);

    sheet.appendChild(head);

    var body = el('div', 'ph-routes-body');
    groups.forEach(function (g) {
      var sec = el('section', 'ph-routes-sec');
      var label = g.key === '/' ? '/' : '/' + g.key + '/';
      var h = el('h3', null, label);
      h.appendChild(el('b', null, String(g.rows.length)));
      sec.appendChild(h);

      g.rows.forEach(function (r) {
        var a = el('a', 'ph-route d' + Math.min(depthOf(r.route), 3));
        a.href = BASE + r.route;
        if (r.route === current) {
          a.className += ' on';
          a.setAttribute('aria-current', 'page');
        }
        a.appendChild(el('span', 'ph-route-path', r.route));
        a.appendChild(el('span', 'ph-route-title', r.title));
        sec.appendChild(a);
        rows.push({ node: a, sec: sec, hay: (r.route + ' ' + r.title).toLowerCase() });
      });
      body.appendChild(sec);
    });
    sheet.appendChild(body);
    overlay.appendChild(sheet);
    document.body.appendChild(overlay);

    setCount(rows.length, groups.length);

    input.addEventListener('input', filter);
    overlay.addEventListener('click', function (e) {
      if (e.target.hasAttribute && e.target.hasAttribute('data-ph-routes-close')) hide();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay && !overlay.hidden) hide();
    });
  }

  function setCount(pages, sections) {
    countEl.textContent = '';
    countEl.appendChild(el('b', null, String(pages)));
    countEl.appendChild(document.createTextNode(pages === 1 ? ' page · ' : ' pages · '));
    countEl.appendChild(el('b', null, String(sections)));
    countEl.appendChild(document.createTextNode(sections === 1 ? ' section' : ' sections'));
  }

  function filter() {
    var q = input.value.trim().toLowerCase();
    var shown = 0, secs = 0, seen = [];
    rows.forEach(function (r) {
      var hit = !q || r.hay.indexOf(q) !== -1;
      r.node.hidden = !hit;
      if (hit) {
        shown++;
        if (seen.indexOf(r.sec) === -1) { seen.push(r.sec); secs++; }
      }
    });
    rows.forEach(function (r) { r.sec.hidden = seen.indexOf(r.sec) === -1; });
    setCount(shown, secs);
    overlay.classList.toggle('is-empty', shown === 0);
  }

  function show() {
    overlay.hidden = false;
    document.documentElement.classList.add('ph-routes-open');
    input.value = '';
    filter();
    input.focus();
  }

  /* FOCUS CANNOT GO BACK TO A HIDDEN CONTROL. The site map button rests at
     `visibility: hidden` so it is out of the tab order until the dock opens,
     and an element in that state silently refuses `.focus()` — a keyboard
     visitor who pressed Escape was landing on <body> and had to tab the whole
     page again. So the dock is held open for exactly as long as the button
     holds focus, and released the moment it loses it. */
  function hide() {
    overlay.hidden = true;
    document.documentElement.classList.remove('ph-routes-open');
    if (!opener) return;
    var box = opener.parentNode;
    box.classList.add('is-armed');
    opener.focus();
    opener.addEventListener('blur', function off() {
      box.classList.remove('is-armed');
      opener.removeEventListener('blur', off);
    });
  }

  /* ---- the dock ---------------------------------------------------------
     The launcher is MOVED into a wrapper rather than duplicated, so it keeps
     its own markup, its own href and whatever else the mirror gives it. */
  function dock() {
    var launcher = document.querySelector('.ds-launch');
    var box = el('div', 'ph-dock');

    opener = el('button', 'ph-dock-btn');
    opener.type = 'button';
    opener.setAttribute('aria-haspopup', 'dialog');
    opener.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
      '<path d="M2 3h5M2 8h9M2 13h6" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" fill="none"/>' +
      '<circle cx="13" cy="3" r="1.4" fill="currentColor"/>' +
      '<circle cx="14" cy="13" r="1.4" fill="currentColor"/></svg>';
    opener.appendChild(el('span', 'ph-dock-t', 'Site map'));
    opener.addEventListener('click', show);

    box.appendChild(opener);
    if (launcher) {
      launcher.parentNode.removeChild(launcher);
      box.appendChild(launcher);
    }
    document.body.appendChild(box);
  }

  function init() { render(); dock(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
