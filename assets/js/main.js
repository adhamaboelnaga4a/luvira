/* =========================================================
   Luvira storefront · shared logic
   Cart (localStorage), side cart, header, mega menu, drawer,
   toasts, accordions, before/after compare, helpers.
   ========================================================= */
(function () {
  'use strict';
  var D = window.LV_DATA;
  var P = D.PRODUCTS, B = D.BUNDLES;
  var FREE_AT = 850, SHIP_FEE = 95, KEY = 'luvira-cart-v1';

  /* ---------- Helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var param = function (k) { return new URLSearchParams(location.search).get(k); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var stars = function () { return '<span class="stars" aria-hidden="true">★★★★★</span>'; };
  var ARW = '<svg class="arw" width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4"/></svg>';

  /* Item lookup: products and bundles share one id space */
  function item(id) {
    if (P[id]) return { id: id, name: P[id].name, size: P[id].size, price: P[id].price, img: P[id].img, url: 'product.html?id=' + id, bundle: false };
    if (B[id]) return { id: id, name: B[id].name, size: B[id].items.length + ' products', price: B[id].price, was: B[id].was, img: B[id].img, url: 'bundle.html?id=' + id, bundle: true };
    /* Luvira Friday deals (sale prices, not combined with the 10% offer) */
    var F = D.FRIDAY;
    if (F && F.deals[id]) { var d = F.deals[id], src = B[d.of] || P[d.of]; return { id: id, name: src.name + ' · Friday', size: d.size || (B[d.of] ? B[d.of].items.length + ' products' : src.size), price: d.price, was: src.was || src.price, img: src.img, url: 'black-friday.html', bundle: !!B[d.of], noOffer: true }; }
    if (F && id.indexOf('bf-p-') === 0 && P[id.slice(5)]) { var p = P[id.slice(5)]; return { id: id, name: p.name + ' · 20% off', size: p.size, price: Math.round(p.price * (1 - F.sitewide)), was: p.price, img: p.img, url: 'black-friday.html', bundle: false, noOffer: true }; }
    if (F && id.indexOf('bf-box:') === 0) {
      var ids = id.slice(7).split(','); if (ids.length !== 3 || ids.some(function (x) { return !P[x]; })) return null;
      var sum = ids.reduce(function (a, x) { return a + P[x].price; }, 0);
      return { id: id, name: 'Friday box · pick 3', size: ids.map(function (x) { return P[x].short; }).join(', '), price: Math.round(sum * (1 - F.boxOff)), was: sum, img: P[ids[0]].img, url: 'black-friday.html#build', bundle: true, noOffer: true };
    }
    return null;
  }
  function bundleContents(b) { return b.items.map(function (i) { return P[i].short; }).join(', '); }

  /* ---------- Cart store ---------- */
  var Cart = {
    lines: [],
    load: function () { try { this.lines = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { this.lines = []; } this.lines = this.lines.filter(function (l) { return item(l.id); }); },
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(this.lines)); } catch (e) { } document.dispatchEvent(new CustomEvent('cart:change')); },
    find: function (id) { return this.lines.filter(function (l) { return l.id === id; })[0]; },
    add: function (id, qty) { qty = qty || 1; var l = this.find(id); if (l) l.qty += qty; else this.lines.push({ id: id, qty: qty }); this.save(); },
    setQty: function (id, qty) { var l = this.find(id); if (!l) return; l.qty = qty; if (qty <= 0) this.remove(id); else this.save(); },
    remove: function (id) { this.lines = this.lines.filter(function (l) { return l.id !== id; }); this.save(); },
    replace: function (ids, withId) { this.lines = this.lines.filter(function (l) { return ids.indexOf(l.id) < 0; }); this.add(withId, 1); },
    count: function () { return this.lines.reduce(function (a, l) { return a + l.qty; }, 0); },
    totals: function () {
      var sub = 0, eligible = 0;
      this.lines.forEach(function (l) { var it = item(l.id); var v = it.price * l.qty; sub += v; if (!it.bundle && !it.noOffer) eligible += v; });
      var unlocked = sub >= FREE_AT;
      var disc = unlocked ? Math.round(eligible * 0.1) : 0;
      var ship = unlocked || sub === 0 ? 0 : SHIP_FEE;
      return { sub: sub, disc: disc, ship: ship, total: sub - disc + ship, unlocked: unlocked, rem: Math.max(0, FREE_AT - sub), pct: Math.min(100, Math.round(sub / FREE_AT * 100)) };
    }
  };

  /* Bundle suggestion: the bundle that covers most of the single products in the cart */
  function bestBundle() {
    var singles = Cart.lines.filter(function (l) { return P[l.id]; }).map(function (l) { return l.id; });
    if (!singles.length) return null;
    var best = null, score = 0;
    Object.keys(B).forEach(function (k) {
      if (Cart.find(k) || k === 'complete-set') return;
      var hit = B[k].items.filter(function (i) { return singles.indexOf(i) > -1; }).length;
      if (hit > score || (hit === score && best && B[k].was - B[k].price > B[best].was - B[best].price)) { score = hit; best = k; }
    });
    return score ? B[best] : null;
  }

  function deliveryWindow() {
    var d1 = new Date(Date.now() + 2 * 864e5), d2 = new Date(Date.now() + 4 * 864e5);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return { short: d1.getDate() + '–' + d2.getDate() + ' ' + mo[d2.getMonth()], long: days[d1.getDay()] + ' ' + d1.getDate() + ' – ' + days[d2.getDay()] + ' ' + d2.getDate() + ' ' + mo[d2.getMonth()] };
  }

  /* ---------- Side cart ---------- */
  function buildSideCart() {
    if ($('#sidecart')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="overlay" id="cart-overlay" data-close-cart></div>' +
      '<aside class="sidecart" id="sidecart" role="dialog" aria-modal="true" aria-labelledby="sc-title" aria-hidden="true">' +
      '<div class="sidecart__head"><h2 id="sc-title">Your cart <span data-sc-count></span></h2><button class="sidecart__close" data-close-cart aria-label="Close cart"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="progress"><span data-sc-progress></span><div class="progress__bar"><div class="progress__fill" data-sc-fill></div></div><div class="progress__legend"><span>0 EGP</span><span>850 EGP · Free shipping + 10% off</span></div></div>' +
      '<div class="sidecart__body" data-sc-body></div>' +
      '<div class="sidecart__foot" data-sc-foot></div>' +
      '</aside>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

  function renderSideCart() {
    var sc = $('#sidecart'); if (!sc) return;
    var t = Cart.totals(), n = Cart.count();
    $('[data-sc-count]', sc).textContent = '(' + n + ')';
    $('[data-sc-progress]', sc).textContent = t.unlocked ? 'You unlocked free shipping + 10% off.' : (n ? 'You are ' + fmt(t.rem) + ' EGP away from free shipping + 10% off' : 'Free shipping + 10% off on orders over 850 EGP');
    var fill = $('[data-sc-fill]', sc); fill.style.width = t.pct + '%'; fill.classList.toggle('is-done', t.unlocked);
    var body = $('[data-sc-body]', sc), foot = $('[data-sc-foot]', sc);
    if (!n) {
      body.innerHTML = '<div class="empty-state"><span class="title-sm">Your cart is empty</span><span class="muted small">Start with our bestsellers.</span><a class="btn" href="collection.html">Shop bestsellers ' + ARW + '</a></div>' + upsellRail(4);
      foot.innerHTML = ''; foot.hidden = true; return;
    }
    foot.hidden = false;
    var html = Cart.lines.map(function (l) {
      var it = item(l.id);
      return '<div class="line"><img class="line__img' + (it.bundle ? ' line__img--cover' : ' multiply') + '" src="' + it.img + '" alt=""><div class="line__body">' +
        '<div class="line__top"><a href="' + it.url + '">' + esc(it.name) + '</a><strong>' + fmt(it.price * l.qty) + ' EGP</strong></div>' +
        '<span class="xs muted">' + esc(it.size) + (it.bundle ? ' · bundle price' : '') + '</span>' +
        '<div class="line__bottom"><div class="qty"><button data-qty="-1" data-id="' + l.id + '" aria-label="Decrease quantity">−</button><span>' + l.qty + '</span><button data-qty="1" data-id="' + l.id + '" aria-label="Increase quantity">+</button></div><button class="text-btn" data-remove="' + l.id + '">Remove</button></div>' +
        '</div></div>';
    }).join('');
    var bb = bestBundle();
    if (bb) {
      var covered = bb.items.filter(function (i) { return Cart.find(i); });
      html += '<div class="upsell"><img src="' + bb.img + '" alt=""><div class="stack gap-6" style="flex:1;min-width:0"><span class="eyebrow eyebrow--gold" style="font-size:9px">Save more</span><strong style="font-size:14px;font-weight:600">Switch to ' + esc(bb.name) + '</strong><span class="xs muted">' + bb.items.length + ' products · ' + fmt(bb.price) + ' EGP · save ' + fmt(bb.was - bb.price) + '</span></div><button class="btn btn--sm" data-swap="' + bb.id + '" data-swap-items="' + covered.join(',') + '">Upgrade</button></div>';
    }
    html += upsellRail(3);
    html += '<details class="disclose"><summary>Discount code</summary><form class="code" data-code><label class="sr-only" for="sc-code">Discount code</label><input id="sc-code" placeholder="Enter code"><button class="btn btn--sm" type="submit">Apply</button></form></details>';
    body.innerHTML = html;
    foot.innerHTML =
      '<div class="sum-row"><span>Subtotal</span><span>' + fmt(t.sub) + ' EGP</span></div>' +
      (t.disc ? '<div class="sum-row sum-row--green"><span>10% off (850+ offer)</span><span>−' + fmt(t.disc) + ' EGP</span></div>' : '') +
      '<div class="sum-row"><span>Shipping · arrives ' + deliveryWindow().short + '</span><span style="font-weight:600;color:' + (t.ship ? 'var(--ink)' : 'var(--green)') + '">' + (t.ship ? t.ship + ' EGP' : 'Free') + '</span></div>' +
      '<div class="sum-total"><span>Total</span><span>' + fmt(t.total) + ' EGP</span></div>' +
      '<a class="btn btn--block" href="cart.html" style="margin-top:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>Checkout · ' + fmt(t.total) + ' EGP</a>' +
      '<div class="row between xs" style="padding-top:4px;color:var(--ink-2)"><span>Cash on delivery · Secure · Easy exchange</span><a href="cart.html" class="link-u" style="font-size:10px">View cart</a></div>';
  }

  function upsellRail(n) {
    var have = Cart.lines.map(function (l) { return l.id; });
    var inBundles = []; Cart.lines.forEach(function (l) { if (B[l.id]) inBundles = inBundles.concat(B[l.id].items); });
    var picks = ['serum', 'cond', 'queens', 'nail', 'cream', 'hserum', 'mask', 'midnight', 'clean', 'shampoo'].filter(function (id) { return have.indexOf(id) < 0 && inBundles.indexOf(id) < 0; }).slice(0, n);
    if (!picks.length) return '';
    return '<div style="margin-top:22px"><span class="eyebrow" style="color:var(--ink);font-size:10px">Complete your routine</span><div class="mini-rail">' + picks.map(function (id) {
      var p = P[id];
      return '<div class="mini"><a class="mini__img" href="product.html?id=' + id + '"><img src="' + p.img + '" alt="' + esc(p.name) + '"></a><span style="font-weight:500;line-height:1.3">' + esc(p.name) + '</span><span style="font-weight:600">' + p.price + ' EGP</span><button class="btn btn--ghost btn--sm" data-add="' + id + '" data-quiet>+ Add</button></div>';
    }).join('') + '</div></div>';
  }

  var lastFocus = null;
  function openCart() {
    renderSideCart();
    lastFocus = document.activeElement;
    $('#sidecart').classList.add('is-open'); $('#sidecart').setAttribute('aria-hidden', 'false');
    $('#cart-overlay').classList.add('is-open'); document.body.classList.add('no-scroll');
    setTimeout(function () { var c = $('#sidecart .sidecart__close'); if (c) c.focus({ preventScroll: true }); }, 50);
  }
  function closeCart() {
    var sc = $('#sidecart'); if (!sc || !sc.classList.contains('is-open')) return;
    sc.classList.remove('is-open'); sc.setAttribute('aria-hidden', 'true');
    $('#cart-overlay').classList.remove('is-open'); document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- Header count ---------- */
  function renderCount() {
    var n = Cart.count();
    $$('[data-cart-count]').forEach(function (el) { if (el.textContent !== String(n)) { el.textContent = n; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } });
    $$('[data-cart-label]').forEach(function (el) { el.setAttribute('aria-label', 'Cart, ' + n + ' items'); });
  }

  /* ---------- Toast ---------- */
  var toastT;
  function toast(msg) {
    var el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    var t = Cart.totals();
    el.innerHTML = '<span>' + (msg || 'Added') + ' · <strong>' + (t.unlocked ? 'Free shipping + 10% off unlocked' : fmt(t.rem) + ' EGP from free shipping') + '</strong></span><button class="btn btn--light btn--sm" data-open-cart>View cart</button>';
    el.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('is-on'); }, 3600);
  }

  /* Add with feedback. mode: 'toast' | 'drawer' | 'quiet' */
  function addToCart(id, qty, btn, mode) {
    Cart.add(id, qty || 1);
    if (btn) {
      var label = btn.getAttribute('data-label') || btn.innerHTML;
      btn.setAttribute('data-label', label);
      btn.classList.add('is-done'); btn.innerHTML = 'Added ✓';
      clearTimeout(btn._t); btn._t = setTimeout(function () { btn.classList.remove('is-done'); btn.innerHTML = btn.getAttribute('data-label'); }, 2200);
    }
    if (mode === 'drawer') openCart();
    else if (mode !== 'quiet') toast();
  }

  /* ---------- Header: mega menu + drawer ---------- */
  function initHeader() {
    var mt = $('[data-mega-toggle]'), mega = $('#mega');
    if (mt && mega) {
      var set = function (o) { mega.classList.toggle('is-open', o); mt.setAttribute('aria-expanded', o ? 'true' : 'false'); };
      mt.addEventListener('click', function (e) { e.stopPropagation(); set(!mega.classList.contains('is-open')); });
      document.addEventListener('click', function (e) { if (!mega.contains(e.target)) set(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    }
    var dr = $('#drawer'), ov = $('#drawer-overlay');
    var openD = function () { dr.classList.add('is-open'); ov.classList.add('is-open'); dr.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); setTimeout(function () { $('[data-close-drawer]', dr).focus({ preventScroll: true }); }, 50); };
    var closeD = function () { dr.classList.remove('is-open'); ov.classList.remove('is-open'); dr.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); };
    $$('[data-open-drawer]').forEach(function (b) { b.addEventListener('click', function () { openD(); if (b.hasAttribute('data-focus-search')) setTimeout(function () { $('#drawer-search').focus({ preventScroll: true }); }, 80); }); });
    $$('[data-close-drawer]').forEach(function (b) { b.addEventListener('click', closeD); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dr && dr.classList.contains('is-open')) closeD(); });
    // Search: send to collection page
    $$('[data-search]').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); var q = $('input', f).value.trim(); location.href = 'collection.html' + (q ? '?q=' + encodeURIComponent(q) : ''); }); });
    // Announcement rotator
    var an = $('[data-announce]');
    if (an) {
      var msgs = JSON.parse(an.getAttribute('data-announce')), i = 0, msgEl = $('.announce__msg', an);
      var show = function (k) { i = (k + msgs.length) % msgs.length; msgEl.textContent = msgs[i]; msgEl.style.animation = 'none'; void msgEl.offsetWidth; msgEl.style.animation = ''; };
      $('[data-prev]', an).addEventListener('click', function () { show(i - 1); restart(); });
      $('[data-next]', an).addEventListener('click', function () { show(i + 1); restart(); });
      var timer; var restart = function () { clearInterval(timer); timer = setInterval(function () { show(i + 1); }, 4500); }; restart();
    }
  }

  /* ---------- Accordions ---------- */
  function faqHTML(list, openIndex) {
    return '<div class="faq">' + list.map(function (f, i) {
      var o = i === openIndex;
      return '<div class="faq__item"><button class="faq__q" aria-expanded="' + o + '" data-acc>' + esc(f[0]) + '<span aria-hidden="true">+</span></button><div class="faq__a" role="region"><div><p>' + esc(f[1]) + '</p></div></div></div>';
    }).join('') + '</div>';
  }

  /* ---------- Cards ---------- */
  function productCard(id, opts) {
    var p = P[id]; opts = opts || {};
    var badge = p.badge ? '<span class="pill pill--light">' + esc(p.badge) + '</span>' : '';
    if (opts.compact) {
      return '<article class="pcard pcard--compact"><div class="pcard__media"><a href="product.html?id=' + id + '"><img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy"></a>' + (opts.tag ? '<span class="pill pill--light">' + opts.tag + '</span>' : '') + '</div>' +
        '<span class="pcard__rating">' + stars() + ' ' + p.rating.toFixed(1) + ' (' + p.reviews + ')</span>' +
        '<div class="pcard__foot"><span class="stack gap-6"><a class="pcard__name" href="product.html?id=' + id + '">' + esc(p.name) + '</a><span class="pcard__price">' + p.price + ' EGP</span></span><button class="btn btn--ghost btn--sm" data-add="' + id + '">Add</button></div></article>';
    }
    return '<article class="pcard"><div class="pcard__media"><a href="product.html?id=' + id + '" aria-label="' + esc(p.name) + '"><img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy"></a>' + badge +
      '<button class="btn btn--sm pcard__add" data-add="' + id + '">Add to cart · ' + p.price + ' EGP</button></div>' +
      '<div class="stack gap-6"><span class="pcard__rating">' + stars() + ' ' + p.rating.toFixed(1) + ' (' + p.reviews + ')</span>' +
      '<a class="pcard__name" href="product.html?id=' + id + '">' + esc(p.name) + '</a>' +
      '<span class="pcard__sub">' + esc(p.benefit) + ' · ' + esc(p.size) + '</span>' +
      '<span class="pcard__price">' + p.price + ' EGP</span></div></article>';
  }

  function bundleCard(id, opts) {
    var b = B[id]; opts = opts || {};
    var pct = Math.round((b.was - b.price) / b.was * 100);
    return '<article class="bcard' + (opts.white ? ' bcard--white' : '') + (opts.featured ? ' bcard--featured' : '') + '">' +
      '<a class="bcard__media" href="bundle.html?id=' + id + '"><img src="' + b.img + '" alt="' + esc(b.name) + '" loading="lazy"><span class="pill pill--light">' + esc(b.badge) + '</span><span class="pill pill--rose">−' + pct + '%</span></a>' +
      '<div class="bcard__body"><a class="bcard__name" href="bundle.html?id=' + id + '">' + esc(b.name) + '</a><span class="bcard__contents">' + esc(bundleContents(b)) + '</span>' +
      '<div class="bcard__price"><span class="price">' + fmt(b.price) + ' EGP</span><s class="was">' + fmt(b.was) + '</s><span class="save" style="margin-left:auto">Save ' + fmt(b.was - b.price) + '</span></div>' +
      '<button class="btn btn--block" data-add="' + id + '" style="margin-top:6px">Add bundle to cart</button></div></article>';
  }

  /* ---------- Before / after compare ---------- */
  function initCompare(root) {
    $$('[data-ba]', root).forEach(function (ba) {
      if (ba._ba) return; ba._ba = true;
      var range = ba.parentNode.querySelector('[data-ba-range]');
      var set = function (v) { v = Math.max(3, Math.min(97, v)); ba.style.setProperty('--pos', v + '%'); if (range) range.value = v; };
      var drag = false;
      var fromEvent = function (e) { var r = ba.getBoundingClientRect(); var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left; set(x / r.width * 100); };
      ba.addEventListener('pointerdown', function (e) { drag = true; ba.setPointerCapture(e.pointerId); fromEvent(e); });
      ba.addEventListener('pointermove', function (e) { if (drag) fromEvent(e); });
      ba.addEventListener('pointerup', function () { drag = false; });
      ba.addEventListener('pointercancel', function () { drag = false; });
      if (range) range.addEventListener('input', function () { set(Number(range.value)); });
      set(50);
    });
  }

  function resultsHTML(list, idx, ctaId, ctaLabel) {
    var w = list[idx];
    return '<div class="stack gap-14">' +
      '<div class="ba" data-ba><img class="ba__img" src="' + w.imgBefore + '" alt="' + esc(w.name) + ' before: ' + esc(w.before) + '"><img class="ba__img ba__after" src="' + w.imgAfter + '" alt="' + esc(w.name) + ' after: ' + esc(w.after) + '">' +
      '<div class="ba__handle"><span><svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 1 1 6l4 5M13 1l4 5-4 5"/></svg></span></div>' +
      '<span class="pill pill--dark ba__tag ba__tag--l">Before · ' + esc(w.from) + '</span><span class="pill pill--rose ba__tag ba__tag--r">After · ' + esc(w.to) + '</span>' +
      (w.imgBefore.indexOf('.svg') > -1 ? '<span class="ba__note">Placeholder · replace with ' + esc(w.name) + '’s real photos</span>' : '') + '</div>' +
      '<label class="ba__range">Drag to compare<input type="range" min="3" max="97" value="50" data-ba-range aria-label="Compare before and after"></label></div>' +
      '<div class="stack gap-18"><span class="eyebrow">Real customers · before &amp; after</span>' +
      '<h2 class="title-md" style="margin:0">Real people, <em class="accent">real results.</em></h2>' +
      '<div class="who"><span class="avatar">' + esc(w.i) + '</span><span class="stack gap-6" style="flex:1"><strong style="font-size:15px;font-weight:600">' + esc(w.name) + ', ' + w.age + ' <span class="verified">✓ Verified buyer</span></strong><span class="xs muted">' + esc(w.type) + ' · used ' + esc(w.used) + '</span></span>' + stars() + '</div>' +
      '<blockquote class="quote">“' + esc(w.quote) + '”</blockquote>' +
      '<div class="ba-notes"><div><b>Before</b>' + esc(w.before) + '</div><div><b>After ' + esc(w.to) + '</b>' + esc(w.after) + '</div></div>' +
      '<div class="stack gap-10"><span class="xs muted" style="font-weight:600">More results (' + list.length + ')</span><div class="people">' + list.map(function (q, i) {
        return '<button data-person="' + i + '" aria-pressed="' + (i === idx) + '"><span class="mini-av">' + esc(q.i) + '</span>' + esc(q.name.split(' ')[0]) + '</button>';
      }).join('') + '</div></div>' +
      (ctaId ? '<div class="row gap-14 wrap"><button class="btn" data-add="' + ctaId + '" data-mode="drawer">' + ctaLabel + '</button><a href="#reviews" class="small" style="font-weight:600;color:var(--ink);text-decoration:underline">Share your results</a></div>' : '') +
      '</div>';
  }
  function mountResults(el, list, ctaId, ctaLabel) {
    if (!el || !list || !list.length) { if (el) el.closest('section').hidden = true; return; }
    var draw = function (i) { el.innerHTML = resultsHTML(list, i, ctaId, ctaLabel); initCompare(el); };
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-person]'); if (b) draw(Number(b.getAttribute('data-person'))); });
    draw(0);
  }

  /* ---------- Countdown ---------- */
  function countdown(target, cb) {
    var tick = function () { var d = Math.max(0, target - Date.now()); cb({ d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60, done: d === 0 }); };
    tick(); return setInterval(tick, 1000);
  }
  function countdownHTML(t, labels) {
    labels = labels || ['Days', 'Hours', 'Mins', 'Secs'];
    return [t.d, t.h, t.m, t.s].map(function (v, i) { return '<div><b>' + pad(v) + '</b><span>' + labels[i].toUpperCase() + '</span></div>'; }).join('');
  }

  /* ---------- Global events ---------- */
  function initEvents() {
    document.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-open-cart]'))) { e.preventDefault(); var to = $('#toast'); if (to) to.classList.remove('is-on'); openCart(); return; }
      if ((t = e.target.closest('[data-close-cart]'))) { closeCart(); return; }
      if ((t = e.target.closest('[data-add]'))) { e.preventDefault(); addToCart(t.getAttribute('data-add'), Number(t.getAttribute('data-qty-add') || 1), t, t.hasAttribute('data-quiet') ? 'quiet' : (t.getAttribute('data-mode') || 'toast')); return; }
      if ((t = e.target.closest('[data-qty]'))) { var l = Cart.find(t.getAttribute('data-id')); if (l) Cart.setQty(l.id, l.qty + Number(t.getAttribute('data-qty'))); return; }
      if ((t = e.target.closest('[data-remove]'))) { Cart.remove(t.getAttribute('data-remove')); return; }
      if ((t = e.target.closest('[data-swap]'))) { Cart.replace(t.getAttribute('data-swap-items').split(','), t.getAttribute('data-swap')); return; }
      if ((t = e.target.closest('[data-acc]'))) { var o = t.getAttribute('aria-expanded') === 'true'; $$('[data-acc]', t.closest('.faq')).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); t.setAttribute('aria-expanded', o ? 'false' : 'true'); return; }
    });
    document.addEventListener('submit', function (e) {
      var f = e.target;
      if (f.matches('[data-code]')) { e.preventDefault(); var i = $('input', f); i.value = ''; i.placeholder = 'Code not valid · try LUVIRA10 at checkout'; }
      if (f.matches('[data-newsletter]')) { e.preventDefault(); f.innerHTML = '<span class="notice" role="status" style="flex:1">Thanks! Check WhatsApp or email for your 10% code.</span>'; }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });
    document.addEventListener('cart:change', function () { renderCount(); renderSideCart(); });
    window.addEventListener('storage', function (e) { if (e.key === KEY) { Cart.load(); document.dispatchEvent(new CustomEvent('cart:change')); } });
  }

  /* ---------- Public API ---------- */
  var LV = window.LV = {
    data: D, P: P, B: B, Cart: Cart, item: item, fmt: fmt, esc: esc, param: param, pad: pad, stars: stars, ARW: ARW, $: $, $$: $$,
    productCard: productCard, bundleCard: bundleCard, bundleContents: bundleContents, faqHTML: faqHTML,
    mountResults: mountResults, initCompare: initCompare, countdown: countdown, countdownHTML: countdownHTML,
    addToCart: addToCart, openCart: openCart, toast: toast, deliveryWindow: deliveryWindow, bestBundle: bestBundle,
    FREE_AT: FREE_AT, SHIP_FEE: SHIP_FEE, extras: {}
  };

  Cart.load();
  document.addEventListener('DOMContentLoaded', function () {
    buildSideCart(); initHeader(); initEvents(); renderCount(); renderSideCart();
    if (param('cart') === 'open') openCart();
  });
})();
