/* Cart page */
document.addEventListener('DOMContentLoaded', function () {
  var $ = LV.$, P = LV.P, B = LV.B, Cart = LV.Cart, fmt = LV.fmt, esc = LV.esc;

  function render() {
    var t = Cart.totals(), n = Cart.count();
    $('[data-count]').textContent = n;
    $('[data-progress]').textContent = t.unlocked ? 'You unlocked free shipping + 10% off.' : 'You are ' + fmt(t.rem) + ' EGP away from free shipping + 10% off';
    var f = $('[data-fill]'); f.style.width = t.pct + '%'; f.classList.toggle('is-done', t.unlocked);

    if (!n) {
      $('[data-lines]').innerHTML = '<div class="empty-state"><span class="title-sm">Your cart is empty</span><a class="btn" href="collection.html">Shop bestsellers ' + LV.ARW + '</a></div>';
    } else {
      $('[data-lines]').innerHTML = Cart.lines.map(function (l) {
        var it = LV.item(l.id);
        return '<div class="cart-row"><div class="cart-row__prod"><img src="' + it.img + '" alt=""' + (it.bundle ? ' class="cover"' : ' class="multiply"') + '><span class="stack gap-6"><a href="' + it.url + '" style="color:var(--ink);font-size:15px;font-weight:500">' + esc(it.name) + '</a><span class="xs muted">' + esc(it.size) + ' · ' + fmt(it.price) + ' EGP</span><span class="xs" style="color:var(--green);font-weight:600">In stock · ships today</span><button class="text-btn" data-remove="' + l.id + '" style="align-self:flex-start;margin-top:4px">Remove</button></span></div>' +
          '<div class="qty"><button data-qty="-1" data-id="' + l.id + '" aria-label="Decrease quantity">−</button><span>' + l.qty + '</span><button data-qty="1" data-id="' + l.id + '" aria-label="Increase quantity">+</button></div>' +
          '<strong class="cart-row__total">' + fmt(it.price * l.qty) + ' EGP</strong></div>';
      }).join('');
    }

    var bb = LV.bestBundle();
    if (bb) {
      var covered = bb.items.filter(function (i) { return Cart.find(i); });
      $('[data-swap]').innerHTML = '<div class="swap-card"><img src="' + bb.img + '" alt=""><span class="stack gap-6"><span class="eyebrow">You have the ' + esc(P[covered[0]].short.toLowerCase()) + ' · complete the routine</span><strong style="font-size:24px;font-weight:300">' + esc(bb.name) + ' · ' + fmt(bb.price) + ' EGP <s class="was" style="font-size:15px">' + fmt(bb.was) + '</s></strong><span class="small muted">' + esc(LV.bundleContents(bb)) + ' · save ' + fmt(bb.was - bb.price) + ' EGP</span></span><button class="btn btn--sm" data-swap="' + bb.id + '" data-swap-items="' + covered.join(',') + '">Swap to bundle</button></div>';
    } else $('[data-swap]').innerHTML = '';

    var have = Cart.lines.map(function (l) { return l.id; }), inB = [];
    Cart.lines.forEach(function (l) { if (B[l.id]) inB = inB.concat(B[l.id].items); });
    var ups = ['cond', 'serum', 'hserum', 'nail', 'queens', 'mask', 'cream', 'clean', 'midnight', 'shampoo'].filter(function (i) { return have.indexOf(i) < 0 && inB.indexOf(i) < 0; });
    $('[data-ups-wrap]').hidden = !ups.length;
    $('[data-ups]').innerHTML = ups.slice(0, 4).map(function (i) { return LV.productCard(i, { compact: true }); }).join('');
    var tip = ups.filter(function (i) { return P[i].price >= t.rem; })[0] || ups[0];
    $('[data-tip]').textContent = !t.unlocked && n && tip ? 'Tip: add the ' + P[tip].name + ' (' + P[tip].price + ' EGP) to unlock it.' : '';

    $('[data-sum]').innerHTML =
      '<div class="stack gap-14"><div class="sum-row"><span>Subtotal</span><span>' + fmt(t.sub) + ' EGP</span></div>' +
      '<div class="sum-row" style="color:' + (t.disc ? 'var(--green)' : 'var(--muted)') + '"><span>' + (t.unlocked ? '10% off (850+ offer)' : '10% off unlocks at 850 EGP') + '</span><span>' + (t.disc ? '−' + fmt(t.disc) + ' EGP' : '—') + '</span></div>' +
      '<div class="sum-row"><span>Shipping</span><span style="font-weight:600;color:' + (t.ship ? 'var(--ink)' : 'var(--green)') + '">' + (t.ship ? t.ship + ' EGP' : (n ? 'Free' : '—')) + '</span></div>' +
      '<div class="small" style="border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:12px 0">Estimated delivery · <strong style="font-weight:600">' + LV.deliveryWindow().long + '</strong></div></div>';
    $('[data-total]').innerHTML = '<div class="sum-total"><span>Total</span><span>' + fmt(t.total) + ' EGP</span></div>' + (t.unlocked ? '<span class="save" style="display:block;text-align:right;margin-top:6px">You’re saving ' + fmt(t.disc + LV.SHIP_FEE) + ' EGP</span>' : '');

    var msg = 'Hi Luvira, I would like to order:\n' + Cart.lines.map(function (l) { var it = LV.item(l.id); return '- ' + l.qty + ' × ' + it.name + ' (' + fmt(it.price * l.qty) + ' EGP)'; }).join('\n') + '\nTotal: ' + fmt(t.total) + ' EGP';
    $('[data-wa-order]').href = 'https://wa.me/201055800587?text=' + encodeURIComponent(msg);
    $('[data-checkout]').classList.toggle('is-disabled', !n);
  }
  $('[data-checkout]').addEventListener('click', function (e) { e.preventDefault(); if (!Cart.count()) return; alertBox(); });
  function alertBox() { LV.toast('Checkout connects to Shopify / Paymob here'); }
  document.addEventListener('cart:change', render);
  render();
});
