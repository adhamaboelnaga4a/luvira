/* Collection page · collection.html?cat=skin|hair|body|nails|bundles&concern=…&q=… */
document.addEventListener('DOMContentLoaded', function () {
  var $ = LV.$, $$ = LV.$$, P = LV.P, B = LV.B, D = LV.data, esc = LV.esc;
  var CATS = [['all', 'Shop all'], ['skin', 'Skin care'], ['hair', 'Hair care'], ['body', 'Body care'], ['nails', 'Nail care'], ['bundles', 'Bundles']];
  var st = { cat: LV.param('cat') || 'all', concerns: {}, price: {}, sort: 'best', q: (LV.param('q') || '').toLowerCase() };
  if (!CATS.some(function (c) { return c[0] === st.cat; })) st.cat = 'all';
  if (LV.param('concern')) st.concerns[LV.param('concern')] = true;

  var count = function (cat) { return cat === 'bundles' ? Object.keys(B).length : Object.keys(P).filter(function (k) { return cat === 'all' || P[k].cat === cat; }).length; };
  function tabs() {
    $('[data-cats]').innerHTML = CATS.map(function (c) { return '<button class="tab" role="tab" aria-selected="' + (st.cat === c[0]) + '" data-cat="' + c[0] + '">' + ({ all: 'All', skin: 'Skin', hair: 'Hair', body: 'Body', nails: 'Nails', bundles: 'Bundles' }[c[0]]) + ' <small>(' + count(c[0]) + ')</small></button>'; }).join('');
  }
  $('[data-concern-list]').innerHTML = D.CONCERNS.map(function (k) { return '<label class="check"><input type="checkbox" data-concern="' + k[0] + '"' + (st.concerns[k[0]] ? ' checked' : '') + '>' + esc(k[1]) + '</label>'; }).join('');

  function render() {
    var title = CATS.filter(function (c) { return c[0] === st.cat; })[0][1];
    if (st.q) title = 'Results for “' + st.q + '”';
    $('[data-title]').textContent = title; $('[data-crumb]').textContent = title;
    document.title = title + ' · Luvira Cosmetics';
    var activeK = Object.keys(st.concerns).filter(function (k) { return st.concerns[k]; });
    var items = [];
    if (st.cat === 'bundles') {
      items = Object.keys(B).map(function (k) { return { t: 'b', id: k, price: B[k].price, rating: 4.9, sales: B[k].was - B[k].price, name: B[k].name.toLowerCase() + ' ' + LV.bundleContents(B[k]).toLowerCase(), k: [] }; });
    } else {
      items = Object.keys(P).filter(function (k) { return st.cat === 'all' || P[k].cat === st.cat; }).map(function (k) { var p = P[k]; return { t: 'p', id: k, price: p.price, rating: p.rating, sales: p.sales, name: (p.name + ' ' + p.benefit + ' ' + p.cat).toLowerCase(), k: p.concerns }; });
    }
    items = items.filter(function (x) {
      if (st.q && x.name.indexOf(st.q) < 0) return false;
      if (activeK.length && x.t === 'p' && !x.k.some(function (k) { return activeK.indexOf(k) > -1; })) return false;
      if (st.price.under || st.price.mid) { var ok = (st.price.under && x.price < 350) || (st.price.mid && x.price >= 350 && x.price <= 400); if (!ok) return false; }
      return true;
    });
    var sorters = { best: function (a, b) { return b.sales - a.sales; }, low: function (a, b) { return a.price - b.price; }, high: function (a, b) { return b.price - a.price; }, rated: function (a, b) { return b.rating - a.rating; } };
    items.sort(sorters[st.sort]);
    var html = items.map(function (x) { return x.t === 'b' ? LV.bundleCard(x.id, { white: true }) : LV.productCard(x.id); });
    if (st.cat !== 'bundles' && items.length > 3 && !st.q) {
      var promoB = st.cat === 'skin' ? B['skin-nail'] : st.cat === 'body' ? B['signature-glow'] : B['complete-hair'];
      html.splice(3, 0, '<a class="promo" href="bundle.html?id=' + promoB.id + '"><div class="promo__copy"><span class="eyebrow">Bundle &amp; save</span><strong style="font-size:28px;font-weight:300;line-height:1.1">' + esc(promoB.name) + '</strong><span>' + LV.fmt(promoB.price) + ' EGP <s class="was">' + LV.fmt(promoB.was) + '</s></span><span class="link-u" style="align-self:flex-start">Save ' + LV.fmt(promoB.was - promoB.price) + ' EGP →</span></div><img src="' + promoB.img + '" alt="" loading="lazy"></a>');
    }
    $('[data-grid]').innerHTML = html.join('');
    $('[data-grid]').classList.toggle('coll-grid--bundles', st.cat === 'bundles');
    $('[data-count]').textContent = items.length;
    $('[data-result-count]').textContent = items.length + (items.length === 1 ? ' item' : ' items');
    $('[data-empty]').hidden = items.length > 0;
    var chips = D.CONCERNS.filter(function (k) { return st.concerns[k[0]]; }).map(function (k) { return '<button class="filter-chip" data-chip="' + k[0] + '">' + esc(k[1]) + ' ✕</button>'; });
    if (st.q) chips.push('<button class="filter-chip" data-chip-q>“' + esc(st.q) + '” ✕</button>');
    $('[data-chips]').innerHTML = chips.join('');
    tabs();
    var url = new URL(location.href); url.searchParams.set('cat', st.cat); if (!st.q) url.searchParams.delete('q'); url.searchParams.delete('concern');
    history.replaceState(null, '', url);
  }

  $('[data-cats]').addEventListener('click', function (e) { var t = e.target.closest('[data-cat]'); if (t) { st.cat = t.getAttribute('data-cat'); render(); } });
  $('[data-filters]').addEventListener('change', function (e) {
    var c = e.target.getAttribute('data-concern'); if (c) st.concerns[c] = e.target.checked;
    var p = e.target.getAttribute('data-price'); if (p) st.price[p] = e.target.checked;
    render();
  });
  $('[data-sort]').addEventListener('change', function (e) { st.sort = e.target.value; render(); });
  document.addEventListener('click', function (e) {
    var ch = e.target.closest('[data-chip]'); if (ch) { var k = ch.getAttribute('data-chip'); st.concerns[k] = false; var box = $('[data-concern="' + k + '"]'); if (box) box.checked = false; render(); }
    if (e.target.closest('[data-chip-q]')) { st.q = ''; render(); }
    if (e.target.closest('[data-clear]')) { st.concerns = {}; st.price = {}; st.q = ''; st.cat = 'all'; $$('[data-filters] input').forEach(function (i) { i.checked = false; }); render(); }
    if (e.target.closest('[data-open-filters]')) { $('[data-filters]').classList.add('is-open'); $('[data-filters-overlay]').classList.add('is-open'); }
    if (e.target.closest('[data-close-filters]')) { $('[data-filters]').classList.remove('is-open'); $('[data-filters-overlay]').classList.remove('is-open'); }
  });
  render();
});
