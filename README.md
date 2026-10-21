# Luvira Cosmetics: storefront (HTML, CSS, JS)

A responsive static build of the Luvira redesign. Each page works on desktop and mobile.

## Open it
Open `index.html` in a browser. A local server works best, so the cart is kept between pages:

```
cd luvira-site
python3 -m http.server 8000
# then open http://localhost:8000
```

## Pages
| File | Page |
|---|---|
| `index.html` | Home |
| `collection.html` | Collection. Use `?cat=skin|hair|body|nails|bundles`, `?concern=spots|oily|frizz|dry|nails|scent` or `?q=serum` |
| `product.html?id=shampoo` | Product page, for any product id in `data.js` |
| `bundle.html?id=complete-hair` | Bundle page, for any bundle id in `data.js` |
| `cart.html` | Cart page |
| `black-friday.html` | Luvira Friday (Black Friday) |
| Side cart | Slide-out drawer on every page; opens from the cart icon or after adding to cart |

## Files
```
assets/css/style.css        all styles (brand tokens at the top, breakpoints at 1023px and 719px)
assets/js/data.js           products, bundles, before/after customers, Black Friday prices
assets/js/main.js           cart (localStorage), side cart, header, mega menu, mobile menu, toasts, FAQ, before/after slider
assets/js/home.js           page scripts…
assets/js/product.js
assets/js/bundle.js
assets/js/collection.js
assets/js/cart-page.js
assets/js/black-friday.js
assets/img/                 real images from luviracosmetics.com
assets/img/ba/              before/after placeholder portraits (replace these)
```

## What works
- **Cart:** add, change quantity and remove items, from any page. The cart is saved in the browser, and the count in the header updates.
- **Offer logic:** free shipping and 10% off over 850 EGP. Bundles and sale prices are not combined with the 10% off. Shipping is 95 EGP below 850.
- **Side cart:** a progress bar, a "Switch to bundle" upsell based on what is in the cart, and "Complete your routine" products.
- **Product page:**
  - gallery (with swipe on mobile)
  - choice between the single product and the bundle that contains it, with quantity
  - before/after slider with switchable customers
  - "best used with" builder, tabs, reviews filter and FAQ
  - a sticky add bar that appears after you scroll past the buy box
- **Collection:** category tabs, concern and price filters (a bottom sheet on mobile), sort, search and a bundle promo tile.
- **Black Friday:**
  - live countdown, gift tiers that unlock as the cart grows, deal of the day and Friday bundles
  - pick-3 box for 25% off, everything 20% off with tabs, early-access form
  - a sticky gift progress bar
- **Cart page:** swap to a bundle, upsells, delivery estimate, and "Order on WhatsApp" (it prefills the order in the message).

## Before launch
1. **Before/after photos:** replace the drawn placeholders in `assets/img/ba/` with real customer photos of the same person, Day 1 and after. You can also set `imgBefore` / `imgAfter` per customer in `data.js`.
2. **Text in [brackets]:** confirm it, for example the exchange days, email, ingredients for products other than the shampoo, and "only [12] left".
3. **Sample content:** reviews, customer names and Black Friday prices are samples or proposals. Edit them in `data.js` (`RESULTS`, `FRIDAY`).
4. **Checkout:** the "Secure checkout" button shows a message. Connect it to Shopify checkout or Paymob.
5. **Shopify theme:** to use this on Shopify, move the markup into Liquid sections and replace `data.js` with product data from Shopify. The CSS and JS can be reused as they are.
