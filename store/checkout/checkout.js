/* =============================================================================
   store/checkout/checkout.js — checkout and order confirmed.

   Checkout is seed.com's shape: nothing on the page leads anywhere but
   forward or back to the cart. The summary on the right is the live cart,
   including its promo code, so editing either one shows in both. An empty
   cart has nothing to check out and is sent back to /store/cart/.

   Place order validates, writes the order to sessionStorage, empties the cart
   and goes to /store/checkout/confirmed/, which reads the order back.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.PhenomeCart;
  if (!C) return;
  var ORDER = 'phenome.order.v1';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function itemsHTML(lines) {
    return '<ul class="co-items">' + lines.map(function (l) {
      var p = C.catalogue[l.id];
      if (!p) return '';
      var off = l.was && l.was > l.unit;
      return '<li class="co-item"><span class="co-item-img"><img src="' + p.img + '" alt="" width="900" height="900" decoding="async"><b>' + l.qty + '</b></span>' +
        '<span class="co-item-main"><span class="co-item-name">' + esc(p.name) + '</span>' +
        '<span class="co-item-plan">' + esc(C.planLabel(l)) + (l.plan === 'sub' && l.variant ? ', ' + esc(l.variant) : '') + '</span></span>' +
        '<span class="co-item-price">' + (off ? '<s>' + C.money(l.was * l.qty) + '</s>' : '') + C.money(l.unit * l.qty) + '</span></li>';
    }).join('') + '</ul>';
  }

  function rowsHTML(t, lines) {
    var subs = lines.some(function (l) { return l.plan === 'sub'; });
    return '<p class="co-row"><span>Subtotal, ' + t.count + (t.count === 1 ? ' item' : ' items') + '</span><span>' + C.money(t.subtotal) + '</span></p>' +
      (t.promo ? '<p class="co-row"><span>Discount, ' + C.promoCode + '</span><span class="co-save">' + C.minus(t.promo) + '</span></p>' : '') +
      '<p class="co-row"><span>Delivery</span><span>Free</span></p>' +
      '<p class="co-row co-grand"><span>Total</span><span><small>GBP</small>' + C.money(t.total) + '</span></p>' +
      (t.saving > 0 ? '<p class="co-saving"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8.6 1.8H14v5.4l-6.6 6.6a1 1 0 0 1-1.4 0L2.2 10a1 1 0 0 1 0-1.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="11" cy="4.8" r="1" fill="currentColor"/></svg>Total savings ' + C.money(t.saving) + '</p>' : '') +
      (subs ? '<p class="co-recur">This order includes a subscription that renews until you cancel it.</p>' : '');
  }

  var TRUST = '<ul class="co-trust">' +
    '<li><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M3.2 7.4 12 3l8.8 4.4v9.2L12 21l-8.8-4.4z"/><path d="M3.2 7.4 12 11.8l8.8-4.4M12 11.8V21"/></svg>Free UK delivery, in discreet packaging</li>' +
    '<li><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="6" y="2.6" width="12" height="18.8" rx="2"/><path d="M9.4 7.6h5.2M9.4 11.2h5.2" stroke-linecap="round"/></svg>Every result lands in the Phenome app</li>' +
    '<li><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M10 13.5l4 4M14 13.5l-4 4" stroke-linecap="round"/></svg>Pause or cancel a subscription anytime</li>' +
    '</ul>';

  /* ---- checkout ----------------------------------------------------------- */
  function checkout(form) {
    var side = document.querySelector('[data-summary]');
    var toggle = document.querySelector('.co-toggle');
    var aside = document.getElementById('coSummary');
    var promoOpen = false;

    if (!C.lines().length) {
      location.replace(C.base + '/store/cart/');
      return;
    }

    function paint() {
      var lines = C.lines();
      if (!lines.length) return;
      var t = C.totals();
      side.innerHTML = itemsHTML(lines) +
        (C.promoOn()
          ? '<div class="co-code is-on"><span>' + C.promoCode + ' applied</span><button type="button" data-code-remove>Remove</button></div>'
          : '<form class="co-code" data-code novalidate><div class="co-field"><input id="coCode" name="code" placeholder=" " autocomplete="off"/><label for="coCode">Discount code</label></div><button type="submit">Apply</button><p class="co-err" role="alert">That code is not valid.</p></form>') +
        rowsHTML(t, lines) + TRUST;
      document.querySelector('[data-total]').textContent = C.money(t.total);
      if (promoOpen) { var i = side.querySelector('#coCode'); if (i) i.focus(); }
    }

    side.addEventListener('submit', function (e) {
      var f = e.target.closest('[data-code]');
      if (!f) return;
      e.preventDefault();
      promoOpen = false;
      if (!C.applyPromo(f.code.value)) {
        f.classList.add('is-bad');
        f.code.setAttribute('aria-invalid', 'true');
        f.code.focus();
      }
    });
    side.addEventListener('click', function (e) {
      if (e.target.closest('[data-code-remove]')) C.removePromo();
    });

    toggle.addEventListener('click', function () {
      var on = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(on));
      aside.classList.toggle('is-open', on);
      toggle.querySelector('[data-toggle-label]').textContent = on ? 'Hide order summary' : 'Show order summary';
    });

    C.subscribe(paint);
    paint();

    /* Validation: required fields only, messages under the field, focus the
       first one that is wrong. An error clears as soon as the field is fixed. */
    function check(input) {
      var v = input.value.trim();
      var bad = input.required && (!v || (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)));
      input.closest('.co-field').classList.toggle('is-bad', bad);
      input.setAttribute('aria-invalid', String(bad));
      return !bad;
    }
    form.addEventListener('input', function (e) {
      if (e.target.closest('.co-field.is-bad')) check(e.target);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      [].forEach.call(form.querySelectorAll('input[required]'), function (i) {
        if (!check(i) && !first) first = i;
      });
      if (first) { first.focus(); return; }

      var order = {
        ref: 'PH' + String(Date.now()).slice(-6),
        first: form.first.value.trim(),
        email: form.email.value.trim(),
        address: [form.address.value, form.flat.value, form.city.value, form.postcode.value]
          .map(function (s) { return s.trim(); }).filter(Boolean).join(', '),
        lines: C.lines(),
        totals: C.totals()
      };
      try { sessionStorage.setItem(ORDER, JSON.stringify(order)); } catch (err) { /* nothing to read back */ }
      C.clear();
      location.href = C.base + '/store/checkout/confirmed/';
    });
  }

  /* ---- confirmed ---------------------------------------------------------- */
  function confirmed(slot) {
    var o = null;
    try { o = JSON.parse(sessionStorage.getItem(ORDER)); } catch (e) { /* none */ }
    if (!o || !o.lines) return;
    var ref = document.querySelector('[data-order-ref]');
    if (ref) ref.textContent = o.ref;
    var hi = document.querySelector('[data-order-hi]');
    if (hi && o.first) hi.textContent = 'Thank you, ' + o.first + '.';
    slot.hidden = false;
    slot.innerHTML = '<div class="co-done"><div class="co-done-head"><h2>Order ' + esc(o.ref) + '</h2>' +
      '<p>Confirmation sent to ' + esc(o.email) + '</p></div>' +
      itemsHTML(o.lines) + rowsHTML(o.totals, o.lines) +
      (o.address ? '<p class="co-done-addr"><span>Delivering to</span>' + esc(o.address) + '</p>' : '') + '</div>';
  }

  var form = document.querySelector('[data-checkout]');
  if (form) checkout(form);
  var slot = document.querySelector('[data-order]');
  if (slot) confirmed(slot);
})();
