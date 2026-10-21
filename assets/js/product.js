/* Product page · product.html?id=<product id> */
document.addEventListener('DOMContentLoaded', function () {
  var $ = LV.$, $$ = LV.$$, P = LV.P, B = LV.B, D = LV.data, esc = LV.esc, fmt = LV.fmt;
  var id = LV.param('id'); if (!P[id]) id = 'shampoo';
  var p = P[id];
  var catName = { skin: 'Skin care', hair: 'Hair care', body: 'Body care', nails: 'Nail care' }[p.cat];
  document.title = p.name + ' · Luvira Cosmetics';
  var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', p.desc);

  /* Bundle that contains this product (best saving, not the full set) */
  var bundle = Object.keys(B).map(function (k) { return B[k]; }).filter(function (b) { return b.id !== 'complete-set' && b.items.indexOf(id) > -1; })
    .sort(function (a, b) { return (b.was - b.price) - (a.was - a.price); })[0];

  /* Breadcrumb */
  $('[data-crumbs]').innerHTML = '<a href="index.html">Home</a><span aria-hidden="true">/</span><a href="collection.html?cat=' + p.cat + '">' + catName + '</a><span aria-hidden="true">/</span><span>' + esc(p.name) + '</span>';

  /* Gallery: packshot + lifestyle photos */
  var G = [{ src: p.img, label: 'Packshot', contain: true }].concat((D.GALLERY[p.cat] || []).map(function (s, i) { return { src: s, label: 'Photo ' + (i + 2) }; }));
  var gi = 0;
  function gallery() {
    var g = G[gi];
    $('[data-gallery]').innerHTML =
      '<div class="gallery__thumbs" role="tablist" aria-label="Product images">' + G.map(function (x, i) { return '<button role="tab" aria-label="Show ' + x.label + '" aria-current="' + (i === gi) + '" data-gi="' + i + '"><img src="' + x.src + '" alt=""' + (x.contain ? ' class="contain"' : '') + '></button>'; }).join('') + '</div>' +
      '<div class="gallery__main">' + '<img src="' + g.src + '" alt="' + esc(p.name) + ', ' + g.label.toLowerCase() + '"' + (g.contain ? ' class="contain"' : '') + '>' +
      (p.badge ? '<span class="pill pill--light" style="top:18px;left:18px">' + esc(p.badge) + '</span>' : '') +
      '<span class="gallery__count">' + (gi + 1) + ' / ' + G.length + '</span>' +
      (D.RESULTS[p.cat] ? '<a class="pill pill--light gallery__ba" href="#results" style="text-transform:none;letter-spacing:0;font-size:12px;padding:9px 12px">See customer before &amp; after →</a>' : '') + '</div>';
  }
  $('[data-gallery]').addEventListener('click', function (e) { var b = e.target.closest('[data-gi]'); if (b) { gi = Number(b.getAttribute('data-gi')); gallery(); } });
  var tx = null, gEl = $('[data-gallery]');
  gEl.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  gEl.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 45) { gi = (gi + (dx < 0 ? 1 : -1) + G.length) % G.length; gallery(); } tx = null; });
  gallery();

  /* Buy box */
  var opt = 0, qty = 1;
  function curId() { return opt === 1 && bundle ? bundle.id : id; }
  function curPrice() { return opt === 1 && bundle ? bundle.price : p.price; }
  function buybox() {
    var total = curPrice() * qty, rem = Math.max(0, LV.FREE_AT - total);
    var cta = 'Add to cart · ' + fmt(total) + ' EGP';
    $('[data-buybox]').innerHTML =
      '<div class="stack gap-10"><span class="eyebrow">' + catName + ' · Made in Egypt</span>' +
      '<h1 class="title-lg" style="font-size:clamp(30px,3.2vw,42px)">' + esc(p.name) + '</h1>' +
      '<a class="rating-link" href="#reviews"><span class="stars" style="letter-spacing:2px">★★★★★</span><strong style="font-weight:600">' + p.rating.toFixed(1) + '</strong><u>' + p.reviews + ' reviews</u><span class="muted">· ' + (p.sales * 24) + ' sold this month</span></a>' +
      (D.RESULTS[p.cat] ? '<a class="ba-link" href="#results">See real before &amp; after photos ↓</a>' : '') + '</div>' +
      '<div class="pdp-price"><span class="price">' + fmt(curPrice()) + ' EGP</span>' + (opt === 1 ? '<s class="was">' + fmt(bundle.was) + '</s>' : '') + '<span class="size-tag">' + esc(opt === 1 ? bundle.items.length + ' PRODUCTS' : p.size.toUpperCase()) + '</span></div>' +
      '<p style="font-size:15px;line-height:1.75;color:var(--ink-2)">' + esc(p.desc) + '</p>' +
      '<div class="facts">' + p.facts.map(function (f) { return '<div><b>' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span></div>'; }).join('') + '</div>' +
      (bundle ? '<fieldset class="options"><legend>Choose your option</legend>' +
        '<label class="option"><input type="radio" name="opt" value="0"' + (opt === 0 ? ' checked' : '') + '><img src="' + p.img + '" alt=""><span class="option__txt"><strong>' + esc(p.short) + ' only</strong><span>' + esc(p.size) + '</span></span><span class="option__price">' + p.price + ' EGP</span></label>' +
        '<label class="option"><input type="radio" name="opt" value="1"' + (opt === 1 ? ' checked' : '') + '><img class="cover" src="' + bundle.img + '" alt=""><span class="option__txt"><strong>' + esc(bundle.name) + '</strong><span>' + esc(LV.bundleContents(bundle)) + '</span></span><span class="option__price">' + fmt(bundle.price) + ' EGP<s>' + fmt(bundle.was) + ' EGP</s></span><span class="tag">SAVE ' + fmt(bundle.was - bundle.price) + ' EGP</span></label>' +
        '</fieldset>' : '') +
      '<div class="offer-bar"><span>' + (opt === 1 ? 'Bundle price already includes the discount' : (rem > 0 ? 'Add ' + rem + ' EGP more for free shipping + 10% off' : 'This order gets free shipping + 10% off')) + '</span><div class="progress__bar"><div class="progress__fill" style="width:' + Math.min(100, Math.round(total / LV.FREE_AT * 100)) + '%"></div></div></div>' +
      '<div class="buy-row"><div class="qty qty--lg"><button data-step="-1" aria-label="Decrease quantity">−</button><output aria-live="polite">' + qty + '</output><button data-step="1" aria-label="Increase quantity">+</button></div>' +
      '<button class="btn" data-add="' + curId() + '" data-qty-add="' + qty + '" data-mode="drawer" data-main-add>' + cta + '</button></div>' +
      '<a class="btn btn--ghost btn--block" href="cart.html" data-buy-now>Buy now · Cash on delivery ' + LV.ARW + '</a>' +
      '<div class="assure">' +
      '<span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9C5560" stroke-width="1.3" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/></svg>Arrives ' + LV.deliveryWindow().short + '</span>' +
      '<span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9C5560" stroke-width="1.3" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>Cash on delivery</span>' +
      '<span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9C5560" stroke-width="1.3" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>Secure checkout</span>' +
      '<span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9C5560" stroke-width="1.3" aria-hidden="true"><path d="M4 9h11a5 5 0 0 1 0 10H8M8 5 4 9l4 4"/></svg>Easy [14]-day exchange</span></div>' +
      '<div class="pay-row"><div class="paybadges"><span>COD</span><span>VISA</span><span>MASTERCARD</span><span>WALLETS</span></div><a href="https://wa.me/201055800587">Questions? WhatsApp us</a></div>';
    sticky();
  }
  $('[data-buybox]').addEventListener('change', function (e) { if (e.target.name === 'opt') { opt = Number(e.target.value); buybox(); } });
  $('[data-buybox]').addEventListener('click', function (e) {
    var s = e.target.closest('[data-step]'); if (s) { qty = Math.max(1, qty + Number(s.getAttribute('data-step'))); buybox(); }
    var bn = e.target.closest('[data-buy-now]'); if (bn) { LV.Cart.add(curId(), qty); }
  });
  buybox();

  /* Sticky add bar: shows once the main button scrolls out of view */
  function sticky() {
    $('[data-s-img]').src = opt === 1 ? bundle.img : p.img;
    $('[data-s-name]').textContent = (opt === 1 ? bundle.name : p.name + ' · ' + p.size);
    $('[data-s-meta]').innerHTML = '<span class="stars">★</span> ' + p.rating.toFixed(1) + ' · ' + fmt(curPrice()) + ' EGP · Cash on delivery';
    var b = $('[data-s-add]'); b.setAttribute('data-add', curId()); b.setAttribute('data-qty-add', qty); b.textContent = 'Add to cart · ' + fmt(curPrice() * qty) + ' EGP';
  }
  var bar = $('[data-sticky]');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { var target = en[0]; bar.classList.toggle('is-on', !target.isIntersecting && target.boundingClientRect.top < 0); }).observe($('[data-buybox]'));
  }

  /* Before & after */
  LV.mountResults($('[data-results]'), D.RESULTS[p.cat], id, 'Add to cart · ' + p.price + ' EGP');

  /* Best used with (routine) */
  var routine = p.routine.filter(function (r) { return P[r]; });
  if (routine.indexOf(id) < 0) routine.unshift(id);
  var pickedFbt = {}; routine.forEach(function (r, i) { pickedFbt[r] = i < 3; });
  var whyMap = { shampoo: 'Gentle cleanse', cond: 'Detangles, prevents protein loss', mask: 'Weekly deep repair', hserum: 'Frizz control & shine', clean: 'Deep, non-drying cleanse', serum: 'Fades dark spots', cream: 'Evens delicate areas', midnight: 'Evening scent', queens: 'Everyday scent', nail: 'Stronger nails' };
  function fbt() {
    var sel = routine.filter(function (r) { return r === id || pickedFbt[r]; });
    var total = sel.reduce(function (a, r) { return a + P[r].price; }, 0);
    $('[data-fbt-steps]').textContent = routine.map(function (r, i) { return '0' + (i + 1) + ' ' + P[r].short.toUpperCase(); }).join(' — ');
    $('[data-fbt]').innerHTML = routine.map(function (r, i) {
      var q = P[r], locked = r === id;
      return '<label class="fbt__item"><input type="checkbox" data-fbt-id="' + r + '"' + (locked || pickedFbt[r] ? ' checked' : '') + (locked ? ' disabled' : '') + ' aria-label="Include ' + esc(q.name) + '"><span class="step">0' + (i + 1) + '</span><img src="' + q.img + '" alt="' + esc(q.name) + '" loading="lazy"><strong>' + esc(q.name) + '</strong><span class="xs muted">' + (locked ? 'This item' : whyMap[r]) + '</span><span style="font-weight:600;margin-top:auto">' + q.price + ' EGP</span></label>';
    }).join('') +
      '<div class="fbt__sum"><span class="xs" style="font-weight:700;letter-spacing:.2em;color:var(--muted)">' + sel.length + ' ITEMS</span><span style="font-size:30px;font-weight:300">' + fmt(total) + ' EGP</span><span class="xs" style="color:var(--rose);font-weight:500">' + (total >= LV.FREE_AT ? 'Unlocks free shipping + 10% off' : (LV.FREE_AT - total) + ' EGP from free shipping + 10% off') + '</span><button class="btn btn--block" data-fbt-add>Add ' + sel.length + ' to cart</button>' +
      (bundle ? '<a href="bundle.html?id=' + bundle.id + '" class="xs" style="color:var(--ink);text-decoration:underline">Or get the ' + esc(bundle.name) + ' · ' + fmt(bundle.price) + ' EGP</a>' : '') + '</div>';
  }
  if (routine.length < 2) { $('[data-fbt-wrap]').hidden = true; } else {
    $('[data-fbt-title]').textContent = { hair: 'Complete your hair routine', skin: 'Complete your skin routine', body: 'Layer your scent', nails: 'Pair it with' }[p.cat];
    $('[data-fbt]').addEventListener('change', function (e) { var c = e.target.closest('[data-fbt-id]'); if (c) { pickedFbt[c.getAttribute('data-fbt-id')] = c.checked; fbt(); } });
    $('[data-fbt]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-fbt-add]'); if (!b) return;
      routine.filter(function (r) { return r === id || pickedFbt[r]; }).forEach(function (r) { LV.Cart.add(r, 1); });
      LV.openCart();
    });
    fbt();
  }

  /* Details tabs */
  $('[data-p-overview]').innerHTML = '<p>' + esc(p.desc) + '</p>';
  $('[data-p-ingr]').innerHTML = p.ingredients.map(function (g) { return '<div><b>' + esc(g[0]) + '</b><span>' + esc(g[1]) + '</span></div>'; }).join('');
  $('[data-p-howto]').innerHTML = p.howto.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('');
  var vimg = { hair: 'assets/img/b-hair-routine.jpg', skin: 'assets/img/model-cream.jpg', body: 'assets/img/b-signature-glow.jpg', nails: 'assets/img/model-nail2.jpg' }[p.cat];
  $('[data-video] img').src = vimg;
  var tabs = $$('[data-dtabs] [role="tab"]');
  function selectTab(t) { tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; }); }
  $('[data-dtabs]').addEventListener('click', function (e) { var t = e.target.closest('[role="tab"]'); if (t) selectTab(t); });
  $('[data-dtabs]').addEventListener('keydown', function (e) { var i = tabs.indexOf(document.activeElement); if (i < 0) return; if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); selectTab(n); } });

  /* Reviews */
  var R = {
    hair: [['Very nice', 'My hair feels clean but not dry at all.', 'Mona', '12 Aug 2026', 'Colored hair', null], ['Calmed my itchy scalp', 'After two weeks the itching stopped and my hair is softer. I use it with the conditioner.', 'Rana M.', '3 Sep 2026', 'Dry scalp', 'assets/img/model-conditioner.jpg'], ['Gentle and fresh', 'Less foam than my old one but much less frizz. Will reorder.', 'Heba T.', '28 Sep 2026', 'Curly hair', 'assets/img/model-hairset.jpg']],
    skin: [['My spots faded', 'Dark spots faded after a month of daily use. Light, absorbs fast.', 'Nour A.', '2 Sep 2026', 'Combination skin', 'assets/img/model-cream.jpg'], ['Kind to sensitive skin', 'No irritation at all, and my tone looks more even.', 'Yasmin H.', '19 Sep 2026', 'Sensitive skin', null], ['Part of my routine', 'Cleanser, serum, cream every night. My skin looks fresh.', 'Laila F.', '5 Oct 2026', 'Oily skin', null]],
    body: [['Lasts all day', 'People keep asking what I am wearing. Still there in the evening.', 'Yasmin H.', '22 Aug 2026', 'Daily wear', 'assets/img/b-signature-glow.jpg'], ['Beautiful scent', 'Not too strong, very elegant. I bought both.', 'Aya F.', '9 Sep 2026', 'Gift', null], ['Great value', 'Big bottle and the scent lasts. Will reorder.', 'Salma K.', '1 Oct 2026', 'Daily wear', null]],
    nails: [['Nails stopped breaking', 'After four weeks my nails finally grew past my fingertips.', 'Mariam S.', '14 Aug 2026', 'Weak nails', 'assets/img/model-nail2.jpg'], ['Easy to use', 'One coat a day, dries fast. Nails feel stronger.', 'Dina R.', '30 Sep 2026', 'Brittle nails', null]]
  }[p.cat];
  $('[data-score]').textContent = p.rating.toFixed(1);
  $('[data-count]').textContent = p.reviews + ' reviews';
  var five = Math.round(p.reviews * .88), four = Math.round(p.reviews * .09), three = p.reviews - five - four;
  $('[data-bars]').innerHTML = [[5, five], [4, four], [3, three], [2, 0], [1, 0]].map(function (b) { return '<div><span style="width:24px">' + b[0] + '★</span><i><b style="width:' + Math.round(b[1] / p.reviews * 100) + '%"></b></i><span class="muted" style="width:28px;text-align:right">' + b[1] + '</span></div>'; }).join('');
  function reviews(f) {
    $('[data-reviews]').innerHTML = R.filter(function (r) { return f === 'all' || r[5]; }).map(function (r) {
      return '<article><div class="stack gap-10" style="flex:1"><div class="row between"><span class="stars" style="letter-spacing:2px;font-size:12px">★★★★★</span><span class="xs muted">' + r[3] + '</span></div><strong style="font-size:15px;font-weight:600">' + esc(r[0]) + '</strong><p style="font-size:14px;line-height:1.7;color:#3A302C">' + esc(r[1]) + '</p><span class="xs" style="font-weight:600;letter-spacing:.1em;text-transform:uppercase">' + esc(r[2]) + ' <span style="color:var(--green);font-weight:500;letter-spacing:0;text-transform:none">· Verified buyer · ' + esc(r[4]) + '</span></span></div>' + (r[5] ? '<img class="photo" src="' + r[5] + '" alt="Photo from ' + esc(r[2]) + '" loading="lazy">' : '') + '</article>';
    }).join('');
  }
  $('[data-rchips]').addEventListener('click', function (e) { var c = e.target.closest('[data-rf]'); if (!c) return; $$('[data-rf]').forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); }); reviews(c.getAttribute('data-rf')); });
  reviews('all');

  /* FAQ */
  $('[data-faq-title]').textContent = 'Questions about the ' + p.short.toLowerCase();
  var faq = {
    hair: [['How often should I use it?', '2–3 times a week gives the best balance for most scalps.'], ['Is it safe for colored hair?', 'Yes. The hair range is sulfate-free and gentle on color-treated hair.'], ['Will it help a dry, itchy scalp?', 'Urea and glycerin hydrate the scalp while tea tree oil helps keep it healthy.'], ['Why does it lather less?', 'Sulfate-free formulas foam softer. That means it is gentler.']],
    skin: [['When will I see results?', 'Most customers see a more even tone in 4–6 weeks of daily use.'], ['Can I use it on sensitive skin?', 'Yes, the formulas are gentle. Patch-test first if your skin reacts easily.'], ['Do I need sunscreen?', 'Yes. Brightening care works best with daily sunscreen.'], ['Can I combine it with other products?', 'Use cleanser, then serum, then cream for the full routine.']],
    body: [['How long does the scent last?', 'Most customers say it lasts from morning to evening.'], ['Can I layer the two scents?', 'Yes. Queen’s Spell for day, Midnight Desire for evening, or both together.'], ['Is it a good gift?', 'Very. The Signature Glow Set comes gift-ready.']],
    nails: [['How often do I apply it?', 'One coat a day on clean, dry nails.'], ['When will I see results?', 'Most customers see stronger nails in about 4 weeks.'], ['Can I use it under nail polish?', 'Yes, apply it first and let it dry for one minute.']]
  }[p.cat].concat([['Can I pay cash on delivery?', 'Yes. Cash on delivery, card and wallets all work.']]);
  $('[data-faq]').innerHTML = LV.faqHTML(faq, 0);

  /* Also like */
  var also = Object.keys(P).filter(function (k) { return k !== id && P[k].cat === p.cat; }).concat(Object.keys(P).filter(function (k) { return P[k].cat !== p.cat; }).sort(function (a, b) { return P[b].sales - P[a].sales; })).slice(0, 4);
  $('[data-also]').innerHTML = also.map(function (k) { return LV.productCard(k, { compact: true }); }).join('');
});
