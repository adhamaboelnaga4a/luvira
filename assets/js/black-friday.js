/* Luvira Friday (Black Friday) page */
document.addEventListener('DOMContentLoaded', function () {
  var $ = LV.$, $$ = LV.$$, P = LV.P, B = LV.B, F = LV.data.FRIDAY, fmt = LV.fmt, esc = LV.esc;
  var start = new Date(F.start).getTime(), end = new Date(F.end).getTime();

  /* Countdowns */
  LV.countdown(Date.now() < start ? start : end, function (t) {
    $('[data-phase]').textContent = Date.now() < start ? 'STARTS IN' : 'ENDS IN';
    $('[data-clock]').textContent = t.d + 'd ' + LV.pad(t.h) + 'h ' + LV.pad(t.m) + 'm ' + LV.pad(t.s) + 's';
    $('[data-countdown]').innerHTML = LV.countdownHTML(t);
  });
  setInterval(dayClock, 1000); dayClock();
  function dayClock() { var m = new Date(); m.setHours(24, 0, 0, 0); var d = m - Date.now(); $('[data-day-clock]').textContent = LV.pad(Math.floor(d / 36e5)) + ':' + LV.pad(Math.floor(d / 6e4) % 60) + ':' + LV.pad(Math.floor(d / 1e3) % 60); }

  /* Gift tiers + sticky bar */
  function tiers() {
    var T = LV.Cart.totals().sub, max = F.tiers[F.tiers.length - 1][0];
    var next = F.tiers.filter(function (t) { return T < t[0]; })[0];
    var msg = next ? 'Add ' + fmt(next[0] - T) + ' EGP to unlock: ' + next[1] : 'Every gift unlocked. Enjoy!';
    $$('[data-total]').forEach(function (e) { e.textContent = fmt(T); });
    $$('[data-tier-msg]').forEach(function (e) { e.textContent = msg; });
    $('[data-items]').textContent = LV.Cart.count();
    var pct = Math.min(100, T / max * 100) + '%';
    $('[data-bigbar]').style.width = pct; $('[data-tierfill]').style.width = pct;
    $$('[data-mark]').forEach(function (m) { m.classList.toggle('is-on', T >= F.tiers[+m.getAttribute('data-mark')][0]); });
    $('[data-tiers]').innerHTML = F.tiers.map(function (t) {
      var on = T >= t[0];
      return '<div class="tier' + (on ? ' is-on' : '') + '"><div class="tier__img"><img src="' + P[t[2]].img + '" alt=""></div><div><span class="tier__state">' + (on ? '✓ Unlocked' : fmt(t[0] - T) + ' EGP to go') + '</span><strong>Spend ' + fmt(t[0]) + ' EGP</strong><span class="small" style="color:var(--ink-2)">' + esc(t[1]) + '</span></div></div>';
    }).join('');
  }
  document.addEventListener('cart:change', tiers); tiers();

  /* Friday bundles */
  $('[data-fbundles]').innerHTML = ['bf-fresh-radiant', 'bf-skin-nail', 'bf-complete-hair'].map(function (k) {
    var d = F.deals[k], b = B[d.of], save = b.was - d.price;
    return '<article class="bcard bcard--white"><a class="bcard__media" href="bundle.html?id=' + b.id + '"><img src="' + b.img + '" alt="' + esc(b.name) + '" loading="lazy"><span class="pill pill--rose" style="left:14px;right:auto">Save ' + fmt(save) + ' EGP</span></a><div class="bcard__body"><a class="bcard__name" href="bundle.html?id=' + b.id + '">' + esc(b.name) + '</a><span class="bcard__contents">' + esc(LV.bundleContents(b)) + '</span><div class="bcard__price"><span class="price">' + fmt(d.price) + ' EGP</span><s class="was">' + fmt(b.was) + '</s></div><button class="btn btn--sm btn--block" data-add="' + k + '">Add to cart</button></div></article>';
  }).join('');

  /* Build your own box */
  var picks = [], ids = ['serum', 'cream', 'clean', 'shampoo', 'cond', 'mask', 'hserum', 'midnight', 'queens', 'nail'];
  function box() {
    $('[data-pickers]').innerHTML = ids.map(function (i) {
      var c = picks.filter(function (x) { return x === i; }).length, p = P[i];
      return '<button class="picker' + (c ? ' is-picked' : '') + '" data-pick="' + i + '" aria-label="Add ' + esc(p.name) + ' to your box"' + (picks.length >= 3 ? ' aria-disabled="true"' : '') + '><img src="' + p.img + '" alt=""><span class="stack"><span>' + esc(p.name) + '</span><b>' + p.price + ' EGP</b></span>' + (c ? '<i>×' + c + '</i>' : '') + '</button>';
    }).join('');
    $('[data-slots]').innerHTML = [0, 1, 2].map(function (k) {
      var i = picks[k];
      return i ? '<div class="slot is-filled"><img src="' + P[i].img + '" alt="' + esc(P[i].name) + '"><button data-unpick="' + k + '" aria-label="Remove ' + esc(P[i].name) + '">×</button></div>' : '<div class="slot">' + (k + 1) + '</div>';
    }).join('');
    var sum = picks.reduce(function (a, i) { return a + P[i].price; }, 0), full = picks.length === 3;
    $('[data-build-label]').textContent = full ? '25% off applied to your box' : 'Add ' + (3 - picks.length) + ' more to unlock 25% off';
    $('[data-build-price]').textContent = fmt(full ? Math.round(sum * (1 - F.boxOff)) : sum) + ' EGP';
    $('[data-build-was]').textContent = full ? fmt(sum) : '';
    var btn = $('[data-build-add]'); btn.disabled = !full;
  }
  $('[data-pickers]').addEventListener('click', function (e) { var b = e.target.closest('[data-pick]'); if (b && picks.length < 3) { picks.push(b.getAttribute('data-pick')); box(); } });
  $('[data-slots]').addEventListener('click', function (e) { var b = e.target.closest('[data-unpick]'); if (b) { picks.splice(+b.getAttribute('data-unpick'), 1); box(); } });
  $('[data-build-add]').addEventListener('click', function () { if (picks.length !== 3) return; LV.Cart.add('bf-box:' + picks.join(','), 1); picks = []; box(); LV.openCart(); });
  box();

  /* Everything 20% off */
  function deals(f) {
    $('[data-deals]').innerHTML = ids.filter(function (i) { return f === 'all' || P[i].cat === f; }).map(function (i) {
      var p = P[i], now = Math.round(p.price * (1 - F.sitewide));
      return '<article class="pcard deal-card"><div class="pcard__media"><a href="product.html?id=' + i + '"><img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy"></a><span class="pill pill--rose">−20%</span>' + (p.badge ? '<span class="pill pill--blush" style="left:auto;right:12px">' + esc(p.badge) + '</span>' : '') + '</div>' +
        '<span class="pcard__rating"><span class="stars">★</span> ' + p.rating.toFixed(1) + ' · ' + p.reviews + ' reviews</span><a class="pcard__name" href="product.html?id=' + i + '">' + esc(p.name) + '</a><span class="row gap-10" style="align-items:baseline"><span class="pcard__price">' + now + ' EGP</span><s class="was xs">' + p.price + '</s></span><button class="btn btn--ghost btn--sm btn--block" data-add="bf-p-' + i + '">Add to cart</button></article>';
    }).join('');
  }
  $('[data-seg]').addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (!b) return; $$('[data-f]').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); }); deals(b.getAttribute('data-f')); });
  deals('all');

  /* FAQ */
  $('[data-faq]').innerHTML = LV.faqHTML([
    ['When does Luvira Friday run?', 'From 12:00 am on 27 November until 11:59 pm on 30 November (Cairo time), or while stock lasts. Early-access subscribers can shop from 26 November.'],
    ['Does buy 3, get 1 free work with the sale?', 'Yes. Add any 4 products and the cheapest one is free, on top of the 20% sale price. It does not apply to bundles or the Deal of the Day.'],
    ['Can I pay cash on delivery?', 'Yes. Cash on delivery, card and wallets all work during the sale.'],
    ['Do the gifts stack?', 'You get every gift your cart total reaches. They are added automatically at checkout.'],
    ['Can I exchange sale items?', 'Unopened products can be exchanged within [14] days, as usual.']
  ], 0);

  /* Early access form */
  $('[data-ea]').addEventListener('submit', function (e) { e.preventDefault(); this.outerHTML = '<span class="notice" role="status">You’re on the list. We’ll message you on 26 Nov.</span>'; });
});
