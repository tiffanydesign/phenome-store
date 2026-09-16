/* =============================================================================
   store/cart/cart.js — the cart, on every page.

   The flow is taken from seed.com: a buy button never leaves the page it is
   on. It adds the line and opens a drawer from the right, and the drawer's
   Checkout is the only way forward to /store/checkout/, which is a separate,
   distraction free page. There is no cart PAGE: /store/cart/ was deleted on
   the user's call, and every link that still points at it only opens the
   drawer. Leaving checkout by its back control returns to the page the
   reader came from with the drawer open again (see RETURN below).

   Injected by shared.js, so no page carries its own <script> for it. State is
   localStorage only: there is no shop backend behind this mirror, and a real
   platform replaces store() and nothing else.
   ========================================================================== */
(function () {
  'use strict';
  if (window.PhenomeCart) return;

  var self = document.currentScript;
  var BASE = self ? self.src.replace(/\/store\/cart\/cart\.js.*$/, '').replace(/^[a-z]+:\/\/[^/]*/i, '') : '/phenome-store';
  var KEY = 'phenome.cart.v1';
  var PROMO = { code: 'Welcome10', rate: 0.10 };
  /* RETURN: the page Checkout was opened from, so checkout's back control can
     go back to it. REOPEN: a one shot flag telling that page to open the
     drawer when it shows again. Both are sessionStorage, per tab. */
  var RETURN = 'phenome.cart.return';
  var REOPEN = 'phenome.cart.reopen';

  /* ---- catalogue ----------------------------------------------------------
     Copied from the Shop all cards (store/index.html), so the cart shows the
     same name, price and tile the reader just bought from. Prices in pence. */
  var CAT = {};
  [
    ['/store/phenometech-ring/', 'PhenomeTech Ring', 17900, 'ring-phenometech', 'ring'],
    ['/devices/band/', 'PhenomeTech Band', 14900, 'band-phenometech', 'band'],
    ['/store/comprehensive-genomic/', 'Comprehensive Genomic Test', 65000, 'test-genomic', 'test'],
    ['/store/carrier-screening/', 'Carrier Screening Test', 39000, 'test-carrier', 'test'],
    ['/store/newborn-screening/', 'Newborn Screening Test', 29500, 'test-newborn', 'test'],
    ['/store/sports-performance/', 'Sports Performance Test', 22000, 'test-sports', 'test'],
    ['/store/gut-microbiome/', 'Gut Microbiome Test', 18000, 'test-gut', 'test'],
    ['/store/oral-microbiome/', 'Oral Microbiome Test', 15000, 'test-oral', 'test'],
    ['/supplements/nad/', 'NAD+', 6499, 'supp-nad', 'supp'],
    ['/supplements/nad-boost/', 'NAD+ Boost', 7299, 'supp-nad-boost', 'supp'],
    ['/supplements/nad-betaine/', 'NAD+ Betaine', 6299, 'supp-nad-betaine', 'supp'],
    ['/supplements/nad-resveratrol/', 'NAD+ Resveratrol', 6499, 'supp-nad-resveratrol', 'supp'],
    ['/supplements/nad-spermidine/', 'NAD+ Spermidine', 5995, 'supp-nad-spermidine', 'supp'],
    ['/supplements/gly-nac/', 'Gly NAC', 4799, 'supp-gly-nac', 'supp'],
    ['/supplements/ser-nac/', 'Ser NAC', 4599, 'supp-ser-nac', 'supp'],
    ['/supplements/broccoli-complex-capsules/', 'Broccoli Complex Capsules', 2199, 'supp-broccoli', 'supp'],
    ['/supplements/mitochondria-boost/', 'Mitochondria Boost', 12000, 'supp-mitochondria', 'supp'],
    ['/supplements/carnitine-performance/', 'Carnitine Performance+', 2999, 'supp-carnitine', 'supp'],
    ['/supplements/guarana-capsules/', 'Guarana Capsules', 2199, 'supp-guarana', 'supp'],
    ['/supplements/quercetin-capsules/', 'Quercetin Capsules', 2699, 'supp-quercetin', 'supp'],
    ['/supplements/sambucus-gummies/', 'Sambucus Gummies', 1795, 'supp-sambucus', 'supp'],
    ['/supplements/throat-relief-lozenges/', 'Throat Relief Lozenges', 899, 'supp-throat-relief', 'supp'],
    ['/supplements/propolis-throat-lozenges/', 'Propolis Throat Lozenges', 1099, 'supp-propolis', 'supp'],
    ['/supplements/pelargonium-throat-lozenges/', 'Pelargonium Throat Lozenges', 999, 'supp-pelargonium', 'supp'],
    ['/supplements/joint-boost-capsules/', 'Joint Boost Capsules', 2999, 'supp-joint-boost', 'supp'],
    ['/supplements/bromelain-capsules/', 'Bromelain Capsules', 3999, 'supp-bromelain', 'supp'],
    ['/supplements/flexicream/', 'FlexiCream', 1899, 'supp-flexicream', 'supp'],
    ['/supplements/multi-collagen-powder/', 'Multi Collagen Powder', 3995, 'supp-collagen', 'supp'],
    ['/supplements/nigella-sativa-seed-oil/', 'Nigella Sativa Seed Oil', 2295, 'supp-nigella', 'supp']
  ].forEach(function (r) {
    CAT[r[0]] = { id: r[0], name: r[1], price: r[2], img: BASE + '/assets/shop/' + r[3] + '.webp', type: r[4] };
  });

  /* One product carries a sale, so the cart shows seed.com's discount states:
     the highlighted "off today" line, the struck list price, and the
     Discounts row in the foot. A sale price applies to a one time purchase;
     a subscription keeps its own page price. Placeholder offer, unconfirmed. */
  CAT['/supplements/mitochondria-boost/'].sale = 10200;

  /* Seed's "Bundle + Save" rail. Ours makes no bundle promise; it only offers
     what pairs well. The ring is left out because it cannot be added without
     a size, and a size is chosen on its own page. */
  var PAIRS = ['/supplements/mitochondria-boost/', '/supplements/nad/', '/store/gut-microbiome/',
    '/store/oral-microbiome/', '/supplements/nad-spermidine/', '/supplements/quercetin-capsules/'];

  /* ---- state -------------------------------------------------------------- */
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && Array.isArray(s.lines)) return s;
    } catch (e) { /* storage blocked or corrupt: start empty */ }
    return { lines: [], promo: false };
  }
  var state = load();
  var subs = [];

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
    subs.forEach(function (fn) { fn(state); });
  }

  function totals() {
    var sub = 0, was = 0, count = 0;
    state.lines.forEach(function (l) {
      sub += l.unit * l.qty;
      was += (l.was || l.unit) * l.qty;
      count += l.qty;
    });
    var promo = state.promo ? Math.round(sub * PROMO.rate) : 0;
    return { count: count, subtotal: sub, was: was, promo: promo, saving: was - sub + promo, total: sub - promo };
  }

  function add(item) {
    var key = item.id + '|' + (item.variant || '') + '|' + item.plan;
    var hit = state.lines.filter(function (l) { return l.key === key; })[0];
    if (hit) hit.qty += 1;
    else state.lines.push({ key: key, id: item.id, variant: item.variant || '', plan: item.plan,
      unit: item.unit, was: item.was || null, qty: 1 });
    flash = key;
    save();
    return key;
  }
  function setQty(key, q) {
    state.lines = state.lines.map(function (l) { if (l.key === key) l.qty = q; return l; })
      .filter(function (l) { return l.qty > 0; });
    save();
  }
  function applyPromo(code) {
    if (String(code || '').trim().toLowerCase() !== PROMO.code.toLowerCase()) return false;
    state.promo = true; save(); return true;
  }
  function clear() { state = { lines: [], promo: false }; save(); }

  /* ---- helpers ------------------------------------------------------------ */
  /* No minus sign, ever: the site's copy rule allows no dash of any kind, so
     a discount says what it is in its label and in green instead. */
  function money(p) {
    p = Math.abs(p);
    return '£' + (p % 100 ? (p / 100).toFixed(2) : String(p / 100));
  }
  function minus(p) { return '\u2212' + money(p); }
  function pence(text) {
    var m = String(text || '').match(/£\s?(\d+(?:\.\d{1,2})?)(?![\s\S]*£)/);
    return m ? Math.round(parseFloat(m[1]) * 100) : 0;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  function here() {
    var p = location.pathname.replace(/index\.html$/, '');
    return BASE && p.indexOf(BASE) === 0 ? p.slice(BASE.length) : p;
  }
  function planLabel(l) {
    var p = CAT[l.id] || {};
    if (l.plan === 'sub') return p.type === 'supp' ? 'Delivered monthly' : 'Subscribe and save';
    return l.variant || 'One time purchase';
  }

  /* Which product, which options, what price — read off the page the button
     sits on, because the buttons themselves only carry href="/store/cart/". */
  function resolve(link) {
    var id = here().replace(/^\/testing\//, '/store/');
    var p = CAT[id];
    if (!p) return null;
    var item = { id: id, plan: 'once', variant: '', unit: p.sale || p.price, was: p.sale ? p.price : null };

    /* The band page writes its whole choice (colour, spare straps) into one
       element and its running total into [data-price]. */
    var bv = document.querySelector('[data-cart-variant]');
    if (bv) {
      item.variant = bv.textContent.trim();
      item.unit = pence((document.querySelector('[data-price]') || {}).textContent) || p.price;
      return item;
    }

    var mat = document.querySelector('.buy-choice.on[data-material] .n');
    if (mat) {
      var fin = document.querySelector('[data-finish-label]');
      var size = document.querySelector('[data-size-label]');
      item.variant = [mat.textContent.trim(), fin && fin.textContent.trim(),
        size && 'size ' + size.textContent.trim()].filter(Boolean).join(', ');
      item.unit = pence((document.querySelector('[data-price]') || {}).textContent) || p.price;
      return item;
    }
    var radio = document.querySelector('.supp-opt input:checked');
    if (radio && radio.value === 'subscribe') {
      var sp = pence(radio.parentNode.querySelector('.supp-opt-p').textContent);
      if (sp) { item.plan = 'sub'; item.was = p.price; item.unit = sp; }
      return item;
    }
    var on = document.querySelector('.buy-choices .buy-choice.on');
    if (on && /subscribe/i.test(on.textContent) && pence(on.textContent)) {
      item.plan = 'sub'; item.was = p.price; item.unit = pence(on.textContent);
    }
    var n = (link.textContent.match(/(\d+) tests/) || [])[1];
    if (n) {
      item.variant = n === '2' ? 'Two tests, one per partner' : n + ' tests';
      item.was = p.price * +n;
      item.unit = pence(link.textContent) || item.was;
    }
    return item;
  }

  /* ---- markup shared by the drawer and the full page ---------------------- */
  function lineHTML(l) {
    var p = CAT[l.id];
    if (!p) return '';
    var off = l.was && l.was > l.unit ? l.was - l.unit : 0;
    return '<li class="cx-line" data-key="' + esc(l.key) + '">' +
      '<a class="cx-thumb" href="' + BASE + l.id + '" tabindex="-1" aria-hidden="true"><img src="' + p.img + '" alt="" width="900" height="900" loading="lazy" decoding="async"></a>' +
      '<div class="cx-line-main">' +
        '<a class="cx-line-name" href="' + BASE + l.id + '">' + esc(p.name) + '</a>' +
        '<p class="cx-line-plan">' + esc(planLabel(l)) + (l.plan === 'sub' && l.variant ? ', ' + esc(l.variant) : '') + '</p>' +
        (off ? '<p class="cx-line-off"><span class="cx-hl">' + money(off * l.qty) + ' off today</span></p>' : '') +
        '<div class="cx-line-foot">' +
          '<p class="cx-price">' + money(l.unit * l.qty) + (off ? ' <s>' + money(l.was * l.qty) + '</s>' : '') + '</p>' +
          '<div class="cx-step" role="group" aria-label="Quantity of ' + esc(p.name) + '">' +
            '<button type="button" data-step="-1" aria-label="' + (l.qty === 1 ? 'Remove ' + esc(p.name) : 'One fewer') + '">' +
              (l.qty === 1 ? '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>'
                           : '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8h9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>') +
            '</button>' +
            '<output aria-live="polite">' + l.qty + '</output>' +
            '<button type="button" data-step="1" aria-label="One more"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8h9M8 3.5v9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>' +
          '</div>' +
        '</div>' +
      '</div></li>';
  }

  function pairsHTML(limit) {
    var inCart = state.lines.map(function (l) { return l.id; });
    var list = PAIRS.filter(function (id) { return inCart.indexOf(id) < 0; }).slice(0, limit || 4);
    if (!list.length) return '';
    return '<section class="cx-pairs" aria-label="Pairs well with"><h3 class="cx-h">Pairs well with</h3><ul class="cx-pairs-row">' +
      list.map(function (id) {
        var p = CAT[id];
        return '<li class="cx-pair"><span class="cx-pair-img"><img src="' + p.img + '" alt="" width="900" height="900" loading="lazy" decoding="async"></span>' +
          '<span class="cx-pair-body"><a class="cx-pair-name" href="' + BASE + id + '">' + esc(p.name) + '</a>' +
          '<span class="cx-pair-foot"><span class="cx-price">' + money(p.sale || p.price) + (p.sale ? ' <s>' + money(p.price) + '</s>' : '') + '</span>' +
          '<button type="button" class="cx-add" data-add="' + id + '">Add</button></span></span></li>';
      }).join('') + '</ul></section>';
  }

  function offerHTML(t) {
    var msg = state.promo
      ? 'You are saving 10% with ' + PROMO.code
      : t.count ? 'Welcome10 takes 10% off your first order' : 'Free UK delivery on every order';
    return '<p class="cx-offer' + (state.promo ? ' is-on' : '') + '"><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M8.6 1.8H14v5.4l-6.6 6.6a1 1 0 0 1-1.4 0L2.2 10a1 1 0 0 1 0-1.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="11" cy="4.8" r="1" fill="currentColor"/></svg>' + msg + '</p>';
  }

  /* seed.com's promo component, four states: a text button; a label over a
     bordered box with the input and an Apply text button inside it; the same
     box in red with "Invalid promo code" under it; and the box saying the
     code is applied, with Remove. The open and invalid states are UI only, so
     they live here rather than in storage, and survive a repaint. */
  var promoUI = 'closed', promoDraft = '', promoFocus = false;
  function promoHTML() {
    if (state.promo) {
      return '<div class="cx-promo"><p class="cx-promo-label">Promo code</p>' +
        '<div class="cx-promo-box is-on"><span>' + PROMO.code + ' applied!</span>' +
        '<button type="button" class="cx-link" data-promo-remove>Remove</button></div></div>';
    }
    if (promoUI === 'closed') {
      return '<div class="cx-promo"><button type="button" class="cx-link" data-promo-open>Apply promo code</button></div>';
    }
    var bad = promoUI === 'bad';
    return '<div class="cx-promo"><label class="cx-promo-label" for="cxPromo">Promo code</label>' +
      '<form class="cx-promo-box' + (bad ? ' is-bad' : '') + '" data-promo novalidate>' +
      '<input id="cxPromo" name="code" autocomplete="off" placeholder="Promo code" value="' + esc(promoDraft) + '"' +
      (bad ? ' aria-invalid="true" aria-describedby="cxPromoErr"' : '') + '>' +
      '<button type="submit" class="cx-link">Apply</button></form>' +
      (bad ? '<p class="cx-promo-err" id="cxPromoErr" role="alert">Invalid promo code</p>' : '') + '</div>';
  }
  function focusPromo(root) {
    if (!promoFocus) return;
    var i = root.querySelector('#cxPromo');
    if (!i || i.offsetParent === null) return;
    promoFocus = false;
    i.focus();
    i.setSelectionRange(i.value.length, i.value.length);
  }
  function repaint() { subs.forEach(function (fn) { fn(state); }); }

  function discountsHTML(t) {
    return t.saving > 0 ? '<p class="cx-row cx-disc"><span>Discounts</span><span class="cx-hl">' + minus(t.saving) + '</span></p>' : '';
  }
  function sumHTML(t, noDiscounts) {
    return (noDiscounts ? '' : discountsHTML(t)) +
      '<p class="cx-row cx-total"><span>Total</span><span>' + money(t.total) + '</span></p>' +
      '<p class="cx-fine">Free UK delivery. Taxes calculated at checkout.</p>' +
      '<a class="cx-cta" href="' + BASE + '/store/checkout/">Checkout</a>';
  }

  /* Empty means empty: no recommendations, and the one control closes the
     drawer so the reader stays on the page they were browsing. */
  function emptyHTML() {
    return '<div class="cx-empty"><p class="cx-empty-t">Your cart is empty</p>' +
      '<button type="button" class="cx-cta cx-cta-inline" data-close>Continue shopping</button></div>';
  }

  /* ---- behaviour shared by both hosts ------------------------------------- */
  function wire(host, onChange) {
    host.addEventListener('click', function (e) {
      var step = e.target.closest('[data-step]');
      if (step) {
        var li = step.closest('.cx-line');
        var line = state.lines.filter(function (l) { return l.key === li.getAttribute('data-key'); })[0];
        if (line) setQty(line.key, line.qty + (+step.getAttribute('data-step')));
        return;
      }
      var a = e.target.closest('[data-add]');
      if (a) {
        var p = CAT[a.getAttribute('data-add')];
        add({ id: p.id, plan: 'once', unit: p.sale || p.price, was: p.sale ? p.price : null });
        return;
      }
      if (e.target.closest('[data-promo-open]')) {
        promoUI = 'open'; promoFocus = true; repaint();
        return;
      }
      if (e.target.closest('[data-promo-remove]')) {
        promoUI = 'closed'; promoDraft = ''; state.promo = false; save();
      }
    });
    host.addEventListener('input', function (e) {
      if (e.target.id !== 'cxPromo') return;
      promoDraft = e.target.value;
      if (promoUI !== 'bad') return;
      promoUI = 'open';
      e.target.closest('.cx-promo-box').classList.remove('is-bad');
      e.target.removeAttribute('aria-invalid');
      var err = host.querySelector('.cx-promo-err');
      if (err) err.parentNode.removeChild(err);
    });
    host.addEventListener('submit', function (e) {
      var f = e.target.closest('[data-promo]');
      if (!f) return;
      e.preventDefault();
      promoDraft = f.code.value;
      if (applyPromo(promoDraft)) { promoUI = 'closed'; promoDraft = ''; return; }
      promoUI = 'bad'; promoFocus = true; repaint();
    });
    subs.push(onChange);
  }
  var flash = null;
  function markFlash(root) {
    if (!flash) return;
    var li = root.querySelector('.cx-line[data-key="' + flash.replace(/"/g, '\\"') + '"]');
    if (li) li.classList.add('is-new');
    flash = null;
  }

  /* ---- the drawer --------------------------------------------------------- */
  var drawer, panel, lastFocus;
  function buildDrawer() {
    drawer = document.createElement('div');
    drawer.className = 'cx-drawer';
    drawer.hidden = true;
    drawer.innerHTML = '<div class="cx-scrim" data-close></div>' +
      '<aside class="cx-panel" role="dialog" aria-modal="true" aria-labelledby="cxTitle" tabindex="-1">' +
      '<header class="cx-head"><h2 id="cxTitle" class="cx-title">Your cart</h2>' +
      '<button type="button" class="cx-close" data-close aria-label="Close the cart"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></header>' +
      '<div class="cx-scroll"></div><footer class="cx-foot"></footer></aside>';
    document.body.appendChild(drawer);
    panel = drawer.querySelector('.cx-panel');
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { close(); return; }
      if (e.target.closest('.cx-cta[href]')) {
        try { sessionStorage.setItem(RETURN, location.pathname + location.search + location.hash); } catch (err) { /* no return */ }
      }
    });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = panel.querySelectorAll('a[href], button, input, summary');
      f = [].filter.call(f, function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    wire(drawer, paintDrawer);
    paintDrawer();
  }
  function paintDrawer() {
    if (!drawer) return;
    var t = totals();
    var focusKey = document.activeElement && document.activeElement.closest && document.activeElement.closest('.cx-line');
    var focusStep = focusKey && document.activeElement.getAttribute('data-step');
    focusKey = focusKey && focusKey.getAttribute('data-key');
    drawer.querySelector('.cx-title').innerHTML = 'Your cart <span>' + t.count + '</span>';
    drawer.querySelector('.cx-scroll').innerHTML = t.count
      ? offerHTML(t) + '<ul class="cx-lines">' + state.lines.map(lineHTML).join('') + '</ul>' + pairsHTML(4) + promoHTML()
      : emptyHTML();
    drawer.querySelector('.cx-foot').innerHTML = t.count ? sumHTML(t) : '';
    drawer.querySelector('.cx-foot').hidden = !t.count;
    panel.classList.toggle('is-empty', !t.count);
    markFlash(drawer);
    focusPromo(drawer);
    if (focusKey) {
      var back = drawer.querySelector('.cx-line[data-key="' + focusKey.replace(/"/g, '\\"') + '"] [data-step="' + focusStep + '"]');
      (back || panel).focus();
    }
  }
  function open() {
    if (!drawer) buildDrawer();
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.documentElement.classList.add('cx-open');
    requestAnimationFrame(function () { drawer.classList.add('is-in'); panel.focus(); });
  }
  function close() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-in');
    document.documentElement.classList.remove('cx-open');
    setTimeout(function () { drawer.hidden = true; }, 380);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---- boot --------------------------------------------------------------- */
  function badge() {
    var n = totals().count;
    document.querySelectorAll('.ph-nav-icon[href$="/store/cart/"]').forEach(function (a) {
      var b = a.querySelector('.cx-badge');
      if (!b) { b = document.createElement('span'); b.className = 'cx-badge'; a.appendChild(b); }
      b.textContent = n > 9 ? '9+' : String(n);
      b.hidden = !n;
      a.setAttribute('aria-label', n ? 'Cart, ' + n + (n === 1 ? ' item' : ' items') : 'Cart');
    });
  }

  function boot() {
    subs.push(badge);
    badge();

    /* Capture phase, so this runs before anything a page script put on the
       same button. Modified clicks are caught too: the cart page is gone, so
       there is nothing for a new tab to open. */
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button > 1) return;
      var a = e.target.closest && e.target.closest('a[href$="/store/cart/"]');
      if (!a || a.closest('.cx-drawer')) return;
      e.preventDefault();
      if (!a.classList.contains('ph-nav-icon')) {
        var item = resolve(a);
        if (item) add(item);
      }
      open();
    }, true);
    document.addEventListener('auxclick', function (e) {
      if (e.button === 1 && e.target.closest && e.target.closest('a[href$="/store/cart/"]')) e.preventDefault();
    }, true);

    /* Back from checkout. pageshow fires both on a fresh load and when the
       browser restores this page from its back/forward cache, where boot()
       does not run again; the cart may have changed on checkout meanwhile
       (a promo applied), so state is re-read before the drawer paints. */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) { state = load(); repaint(); }
      var again = false;
      try { again = sessionStorage.getItem(REOPEN) === '1'; sessionStorage.removeItem(REOPEN); } catch (err) { /* none */ }
      if (again && !document.querySelector('[data-checkout]')) open();
    });

    /* Another tab changed the cart. */
    window.addEventListener('storage', function (e) {
      if (e.key !== KEY) return;
      state = load();
      subs.forEach(function (fn) { fn(state); });
    });
  }

  window.PhenomeCart = {
    base: BASE, catalogue: CAT, lines: function () { return state.lines.slice(); },
    totals: totals, money: money, minus: minus, planLabel: planLabel, applyPromo: applyPromo,
    removePromo: function () { state.promo = false; save(); },
    promoOn: function () { return state.promo; }, promoCode: PROMO.code,
    clear: clear, open: open, close: close, subscribe: function (fn) { subs.push(fn); },
    /* Add what the current page describes without opening the drawer, for an
       Add to cart control that goes straight on to checkout. */
    addHere: function (link) { var item = resolve(link || document.body); if (item) add(item); return !!item; },
    markReturn: function () {
      try { sessionStorage.setItem(RETURN, location.pathname + location.search + location.hash); } catch (err) { /* no return */ }
    },
    /* Where checkout's back control should go, and a flag so that page opens
       the drawer when it shows. Falls back to Shop all. */
    backToCart: function () {
      var to = null;
      try { to = sessionStorage.getItem(RETURN); sessionStorage.setItem(REOPEN, '1'); } catch (err) { /* none */ }
      return to || BASE + '/store/';
    },
    returnUrl: function () { try { return sessionStorage.getItem(RETURN); } catch (err) { return null; } }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
