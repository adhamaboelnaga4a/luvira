/* Bundle page · bundle.html?id=<bundle id> */
document.addEventListener('DOMContentLoaded', function () {
  var $ = LV.$, P = LV.P, B = LV.B, D = LV.data, esc = LV.esc, fmt = LV.fmt;
  var id = LV.param('id'); if (!B[id]) id = 'complete-hair';
  var b = B[id], qty = 1;
  var save = b.was - b.price, pct = Math.round(save / b.was * 100);
  document.title = b.name + ' · Luvira Cosmetics';

  $('[data-crumbs]').innerHTML = '<a href="index.html">Home</a><span aria-hidden="true">/</span><a href="collection.html?cat=bundles">Bundles</a><span aria-hidden="true">/</span><span>' + esc(b.name) + '</span>';
  $('[data-b-hero]').innerHTML = '<img src="' + b.img + '" alt="' + esc(b.name) + '"><span class="pill pill--light" style="left:18px">' + esc(b.badge) + '</span><span class="pill pill--rose" style="right:18px">Save ' + pct + '%</span>';
  $('[data-b-thumbs]').innerHTML = b.items.slice(0, 4).map(function (i) { return '<a href="product.html?id=' + i + '" aria-label="' + esc(P[i].name) + '"><img src="' + P[i].img + '" alt=""></a>'; }).join('');
  if (b.items.length > 4) $('[data-b-thumbs]').lastElementChild.insertAdjacentHTML('beforeend', '<span class="pill pill--dark" style="position:absolute;margin:0">+' + (b.items.length - 3) + '</span>');
  $('[data-b-thumbs]').lastElementChild.style.position = 'relative';

  var group = Object.keys(B).filter(function (k) { return b.group && B[k].group === b.group; }).sort(function (x, y) { return B[x].price - B[y].price; });
  var roles = { shampoo: 'Cleanse', cond: 'Detangle', mask: 'Repair', hserum: 'Finish', clean: 'Cleanse', serum: 'Treat', cream: 'Even tone', midnight: 'Evening scent', queens: 'Day scent', nail: 'Strengthen' };

  function buy() {
    $('[data-b-buy]').innerHTML =
      '<span class="eyebrow">Bundle · ' + esc(b.steps || b.items.length + ' products') + '</span>' +
      '<h1 class="title-lg" style="font-size:clamp(30px,3.2vw,42px)">' + esc(b.name) + '</h1>' +
      '<a class="rating-link" href="#reviews"><span class="stars" style="letter-spacing:2px">★★★★★</span><strong style="font-weight:600">4.9</strong><u>48 reviews</u><span style="color:var(--rose);font-weight:600">· Only [12] left at this price</span></a>' +
      '<div class="pdp-price"><span class="price" style="font-size:34px">' + fmt(b.price) + ' EGP</span><s class="was" style="font-size:18px">' + fmt(b.was) + '</s><span class="save" style="margin-left:auto">You save ' + fmt(save) + ' EGP</span></div>' +
      '<p style="font-size:15px;line-height:1.75;color:var(--ink-2)">' + esc(b.desc) + '</p>' +
      (group.length > 1 ? '<div><span class="xs" style="display:block;font-weight:700;letter-spacing:.24em;margin-bottom:12px">CHOOSE YOUR ROUTINE</span><div class="variant-grid">' + group.map(function (k) {
        var v = B[k];
        return '<a class="variant' + (k === id ? ' is-on' : '') + '" href="bundle.html?id=' + k + '"' + (k === id ? ' aria-current="page"' : '') + '><span class="k">' + esc((v.steps || '').toUpperCase()) + '</span><strong style="font-size:15px;font-weight:600">' + esc(v.name) + '</strong><span style="margin-top:6px;font-size:17px;font-weight:600">' + fmt(v.price) + ' EGP <s style="font-size:12px;color:var(--muted);font-weight:400">' + fmt(v.was) + '</s></span><span class="save">Save ' + fmt(v.was - v.price) + ' EGP</span>' + (v.badge === 'Most popular' ? '<span class="tag">MOST POPULAR</span>' : '') + '</a>';
      }).join('') + '</div></div>' : '') +
      '<div class="inside"><div class="inside__head">What’s inside · ' + b.items.length + ' full-size products</div>' +
      b.items.map(function (i) { var q = P[i]; return '<a class="inside__row" href="product.html?id=' + i + '" style="color:var(--ink)"><img src="' + q.img + '" alt=""><span>' + esc(q.name) + '<small>' + esc(q.size) + ' · ' + roles[i] + '</small></span><s class="small muted">' + q.price + ' EGP</s></a>'; }).join('') +
      '<div class="inside__total"><span>Bought separately <s>' + fmt(b.was) + ' EGP</s></span><strong style="color:var(--green);font-weight:600">Bundle ' + fmt(b.price) + ' EGP</strong></div></div>' +
      '<div class="buy-row"><div class="qty qty--lg"><button data-step="-1" aria-label="Decrease quantity">−</button><output>' + qty + '</output><button data-step="1" aria-label="Increase quantity">+</button></div><button class="btn" data-add="' + id + '" data-qty-add="' + qty + '" data-mode="drawer">Add bundle · ' + fmt(b.price * qty) + ' EGP</button></div>' +
      '<a class="btn btn--ghost btn--block" href="cart.html" data-buy-now>Buy now · Cash on delivery ' + LV.ARW + '</a>' +
      '<div class="assure"><span>— Delivered in 2–4 days</span><span>— Cash on delivery</span><span>— Secure checkout</span><span>— Gift-ready box</span></div>';
    $('[data-s-add]').setAttribute('data-qty-add', qty);
    $('[data-s-add]').textContent = 'Add bundle · ' + fmt(b.price * qty) + ' EGP';
  }
  $('[data-b-buy]').addEventListener('click', function (e) {
    var s = e.target.closest('[data-step]'); if (s) { qty = Math.max(1, qty + Number(s.getAttribute('data-step'))); buy(); }
    if (e.target.closest('[data-buy-now]')) LV.Cart.add(id, qty);
  });
  $('[data-s-img]').src = b.img;
  $('[data-s-name]').textContent = b.name;
  $('[data-s-meta]').innerHTML = fmt(b.price) + ' EGP <s>' + fmt(b.was) + '</s> · <span style="color:var(--green);font-weight:600">Save ' + fmt(save) + ' EGP</span>';
  $('[data-s-add]').setAttribute('data-add', id);
  buy();
  var bar = $('[data-sticky]');
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { bar.classList.toggle('is-on', !en[0].isIntersecting && en[0].boundingClientRect.top < 0); }).observe($('[data-b-buy]'));

  /* Before & after */
  LV.mountResults($('[data-results]'), D.RESULTS[b.cat] || D.RESULTS.skin, id, 'Add bundle · ' + fmt(b.price) + ' EGP');

  /* Steps */
  var when = { shampoo: 'EVERY WASH', cond: 'EVERY WASH', mask: 'WEEKLY', hserum: 'DAILY', clean: 'MORNING & NIGHT', serum: 'MORNING & NIGHT', cream: 'TWICE A DAY', midnight: 'EVENING', queens: 'DAILY', nail: 'DAILY' };
  $('[data-steps-title]').textContent = b.items.length + ' steps, one routine';
  $('[data-steps]').innerHTML = b.items.map(function (i, k) {
    var q = P[i];
    return '<div><div class="row between" style="align-items:baseline"><span class="num">' + LV.pad(k + 1) + '</span><span class="xs muted" style="font-weight:700;letter-spacing:.18em">' + when[i] + '</span></div><img src="' + q.img + '" alt="" loading="lazy"><strong style="font-size:17px;font-weight:500">' + esc(q.name) + '</strong><span class="small muted" style="line-height:1.7">' + esc(q.howto[0]) + '</span></div>';
  }).join('');

  /* Compare */
  $('[data-compare]').innerHTML = [['Price', '<s>' + fmt(b.was) + ' EGP</s>', fmt(b.price) + ' EGP'], ['Products', 'Pick and guess', 'Made to work together'], ['Guide', 'None', 'Step-by-step card'], ['Delivery', 'Separate items', 'One gift-ready box']].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('');
  $('[data-facts]').innerHTML = '<div><b>' + fmt(save) + ' EGP</b><p class="small muted" style="margin-top:6px">Saved today, ' + pct + '% off already applied.</p></div><div><b>[6–8] weeks</b><p class="small muted" style="margin-top:6px">Full-size products, not minis.</p></div><div><b>1 box</b><p class="small muted" style="margin-top:6px">Arrives together, ready to gift.</p></div>';

  $('[data-faq]').innerHTML = LV.faqHTML([['Are these full-size products?', 'Yes, the same full-size products sold individually.'], ['Can I swap a product?', 'Bundles are fixed to keep the price low. Message us on WhatsApp for a custom routine.'], ['Does the 850 EGP offer apply to bundles?', 'Bundles are already discounted, so the 10% off is not added on top. Free shipping still applies over 850 EGP.'], ['Can I pay cash on delivery?', 'Yes. Cash on delivery, card and wallets all work.']], 0);

  $('[data-more]').innerHTML = Object.keys(B).filter(function (k) { return k !== id; }).sort(function (x, y) { return (B[x].cat === b.cat ? 0 : 1) - (B[y].cat === b.cat ? 0 : 1); }).slice(0, 3).map(function (k) { return LV.bundleCard(k, { white: true }); }).join('');
});
