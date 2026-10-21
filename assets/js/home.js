/* Home page */
document.addEventListener('DOMContentLoaded', function () {
  var $ = LV.$, $$ = LV.$$, P = LV.P, D = LV.data;

  /* Hero slider */
  var slides = $$('.hero__slide'), dots = $('[data-dots]'), cur = 0, timer;
  dots.innerHTML = slides.map(function (_, i) { return '<button aria-label="Show slide ' + (i + 1) + '" aria-current="' + (i === 0) + '" data-go="' + i + '"><span></span></button>'; }).join('');
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === cur); });
    $$('button', dots).forEach(function (b, k) { b.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
  }
  function auto() { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 7000); }
  dots.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) { go(Number(b.getAttribute('data-go'))); auto(); } });
  $$('[data-slide]').forEach(function (b) { b.addEventListener('click', function () { go(cur + Number(b.getAttribute('data-slide'))); auto(); }); });
  var hero = $('.hero'); hero.addEventListener('mouseenter', function () { clearInterval(timer); }); hero.addEventListener('mouseleave', auto);
  var sx = null; hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { go(cur + (dx < 0 ? 1 : -1)); auto(); } sx = null; });
  auto();

  var cd = $('[data-hero-countdown]');
  LV.countdown(new Date(D.FRIDAY.start).getTime(), function (t) { cd.innerHTML = LV.countdownHTML(t, ['Days', 'Hrs', 'Min', 'Sec']); });

  /* Categories + concerns */
  var counts = { skin: 0, hair: 0, body: 0, nails: 0 };
  Object.keys(P).forEach(function (k) { counts[P[k].cat]++; });
  $('[data-cats]').innerHTML = D.CATS.map(function (c) {
    return '<a class="cat-card" href="collection.html?cat=' + c.id + '"><div class="cat-card__media"><img src="' + c.img + '" alt="" loading="lazy" style="object-position:' + c.pos + '"><span class="pill pill--light">' + counts[c.id] + (counts[c.id] === 1 ? ' product' : ' products') + '</span></div><div class="cat-card__name"><b>' + c.name + '</b><span class="xs muted">' + c.line + '</span></div></a>';
  }).join('');
  $('[data-concerns]').innerHTML = D.CONCERNS.map(function (k) { return '<a href="collection.html?concern=' + k[0] + '">' + LV.esc(k[1]) + '</a>'; }).join('');

  /* Bestsellers with tabs */
  var order = ['serum', 'shampoo', 'hserum', 'cream', 'mask', 'midnight', 'clean', 'queens', 'cond', 'nail'];
  function best(tab) {
    var list = order.filter(function (id) { var c = P[id].cat; return tab === 'all' || (tab === 'body' ? (c === 'body' || c === 'nails') : c === tab); }).slice(0, 4);
    $('[data-best]').innerHTML = list.map(function (id) { return LV.productCard(id); }).join('');
  }
  $('[data-best-tabs]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]'); if (!b) return;
    $$('[data-tab]', this).forEach(function (t) { t.setAttribute('aria-selected', t === b ? 'true' : 'false'); });
    best(b.getAttribute('data-tab'));
  });
  best('all');

  /* Bundles */
  $('[data-bundles]').innerHTML = ['complete-hair', 'fresh-radiant', 'complete-set'].map(function (id, i) { return LV.bundleCard(id, { featured: i === 2 }); }).join('');

  /* Videos */
  var V = [['Texture', 'Face Serum', 'serum', '#E8EEF0'], ['How to', 'Hair Mask', 'mask', '#F1E9DF'], ['Routine', 'Hair Routine', null, '#ECEFE9'], ['Scent', 'Body Splash', 'midnight', '#EFEAF2'], ['Results', 'Nail Lotion', 'nail', '#F3E6E2']];
  $('[data-videos]').innerHTML = V.map(function (v) {
    var img = v[2] ? '<img class="contain" src="' + P[v[2]].img + '" alt="" loading="lazy">' : '<img src="assets/img/b-hair-routine.jpg" alt="" loading="lazy">';
    var href = v[2] ? 'product.html?id=' + v[2] : 'bundle.html?id=complete-hair';
    var price = v[2] ? P[v[2]].price + ' EGP' : '1,258 EGP';
    return '<figure class="video"><div class="video__media" style="background:' + v[3] + '">' + img + '<button class="play" aria-label="Play video: ' + v[1] + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button><span class="pill pill--light">' + v[0] + '</span></div><figcaption><span style="font-weight:500">' + v[1] + '</span><a href="' + href + '" style="font-weight:600">' + price + '</a></figcaption></figure>';
  }).join('');

  /* New arrivals */
  $('[data-arrivals]').innerHTML = ['shampoo', 'cond', 'queens', 'nail'].map(function (id) { return LV.productCard(id, { compact: true, tag: 'New' }); }).join('');

  /* FAQ */
  $('[data-faq]').innerHTML = LV.faqHTML([
    ['How fast is delivery?', 'Orders arrive in 2–4 working days to every governorate in Egypt. You get a WhatsApp message when your order ships.'],
    ['Can I pay cash on delivery?', 'Yes. Pay cash when your order arrives, or pay online by card or mobile wallet, secured by Paymob.'],
    ['How do I get free shipping and 10% off?', 'Add 850 EGP or more to your cart and both apply automatically. Bundles are already discounted, so they are not combined with this offer.'],
    ['Which products suit my skin type?', 'The Facial Cleanser Gel and Whitening Face Serum suit most skin types. Not sure? Send us a photo on WhatsApp and we will build your routine.'],
    ['Are the products safe for colored hair?', 'Yes. The Sulfate-Free Shampoo is gentle enough for color-treated and sensitive hair.'],
    ['Can I exchange a product?', 'Unopened products can be exchanged within [14] days of delivery.']
  ], 0);

  LV.initCompare(document);
});
