/* Luvira catalog data.
   Prices and contents match luviracosmetics.com (October 2026).
   Copy in [brackets] is placeholder text to confirm before launch. */
(function () {
  var IMG = 'assets/img/';

  var PRODUCTS = {
    serum: {
      id: 'serum', name: 'Whitening Face Serum', short: 'Face Serum', size: '30 ml', price: 390, cat: 'skin',
      badge: 'Bestseller', benefit: 'Fades dark spots', rating: 4.8, reviews: 214, sales: 10, concerns: ['spots'],
      img: IMG + 'p-faceserum.jpg',
      desc: 'A lightweight serum with niacinamide and hyaluronic acid that fades the look of dark spots, evens skin tone and keeps skin hydrated. Absorbs fast, no stickiness.',
      facts: [['Targets', 'Dark spots, uneven tone'], ['Suitable for', 'Most skin types'], ['Key ingredients', 'Niacinamide, Hyaluronic acid'], ['Results', 'Brighter look in 4 weeks']],
      ingredients: [['Niacinamide', 'Targets dark spots and evens skin tone.'], ['Hyaluronic Acid', 'Draws in moisture for plump-looking skin.'], ['[Full list]', '[Copy the full ingredient list from the label.]']],
      howto: ['Cleanse your face with the Facial Cleanser Gel.', 'Apply 2–3 drops to face and neck, morning and evening.', 'Follow with sunscreen during the day.'],
      routine: ['clean', 'serum', 'cream']
    },
    shampoo: {
      id: 'shampoo', name: 'Sulfate-Free Shampoo', short: 'Shampoo', size: '300 ml', price: 330, cat: 'hair',
      badge: 'New', benefit: 'Gentle, no stripping', rating: 4.9, reviews: 86, sales: 6, concerns: ['frizz', 'dry'],
      img: IMG + 'p-shampoo.jpg',
      desc: 'Cleanses without stripping your scalp’s natural moisture. Tea tree oil, aloe vera and urea detangle, hydrate and support a healthier-looking scalp. Gentle enough for color-treated and sensitive hair.',
      facts: [['Targets', 'Dry scalp, frizz, tangles'], ['Suitable for', 'All hair, incl. colored'], ['Key ingredients', 'Urea, Aloe, Tea tree'], ['Results', 'Softer hair in 2 weeks']],
      ingredients: [['Urea', 'Powerful moisturizer, ideal for dry scalp.'], ['Panthenol', 'Moisturizing, gives a healthy shine.'], ['Aloe Vera Extract', 'Nourishes, protects, reduces frizz.'], ['Polyquaternium-7', 'Detangles and reduces frizz.'], ['Tea Tree Oil', 'Supports a healthy scalp.'], ['Glycerin', 'Draws in and holds moisture.']],
      howto: ['Apply a suitable amount to wet hair.', 'Gently massage the scalp and leave on for 2–3 minutes.', 'Rinse thoroughly with water.', 'Use 2–3 times per week. Follow with the Conditioner.'],
      routine: ['shampoo', 'cond', 'mask', 'hserum']
    },
    hserum: {
      id: 'hserum', name: 'Hair Serum', short: 'Hair Serum', size: '120 ml', price: 400, cat: 'hair',
      badge: '', benefit: 'Frizz control & shine', rating: 4.8, reviews: 132, sales: 8, concerns: ['frizz'],
      img: IMG + 'p-hairserum.jpg',
      desc: 'A light, non-greasy serum that tames frizz, smooths flyaways and adds shine from the first use. Use on damp or dry ends.',
      facts: [['Targets', 'Frizz, flyaways, dullness'], ['Suitable for', 'All hair types'], ['Key ingredients', '[Confirm from label]'], ['Results', 'Frizz tamed on first use']],
      ingredients: [['[Full list]', '[Copy the full ingredient list from the label.]']],
      howto: ['Warm a few drops between your palms.', 'Smooth over damp or dry lengths and ends.', 'Style as usual. Use daily.'],
      routine: ['shampoo', 'cond', 'mask', 'hserum']
    },
    cream: {
      id: 'cream', name: 'Sensitive Area Whitening Cream', short: 'Whitening Cream', size: '60 g', price: 380, cat: 'skin',
      badge: 'Most loved', benefit: 'Evens delicate areas', rating: 4.7, reviews: 178, sales: 9, concerns: ['spots'],
      img: IMG + 'p-cream.jpg',
      desc: 'A gentle whitening cream with niacinamide and licorice root that reduces discoloration and evens tone on delicate areas, kind to sensitive skin.',
      facts: [['Targets', 'Discoloration, uneven tone'], ['Suitable for', 'Sensitive, delicate areas'], ['Key ingredients', 'Niacinamide, Licorice root'], ['Results', 'More even tone in 6 weeks']],
      ingredients: [['Niacinamide', 'Helps even out tone and reduce discoloration.'], ['Licorice Root Extract', 'Brightens and calms the skin.'], ['[Full list]', '[Copy the full ingredient list from the label.]']],
      howto: ['Apply a thin layer to clean, dry skin.', 'Massage gently until absorbed.', 'Use twice a day for best results.'],
      routine: ['clean', 'serum', 'cream']
    },
    mask: {
      id: 'mask', name: 'Hair Mask', short: 'Hair Mask', size: '450 g', price: 400, cat: 'hair',
      badge: '', benefit: 'Deep repair for dry ends', rating: 4.8, reviews: 97, sales: 5, concerns: ['dry'],
      img: IMG + 'p-mask.jpg',
      desc: 'A rich weekly treatment with urea and aloe vera that repairs dry, damaged ends and reduces breakage.',
      facts: [['Targets', 'Dryness, damage, breakage'], ['Suitable for', 'Dry and treated hair'], ['Key ingredients', 'Urea, Aloe vera'], ['Results', 'Less breakage after 4 masks']],
      ingredients: [['Urea', 'Deep hydration for dry lengths.'], ['Aloe Vera', 'Nourishes and reduces frizz.'], ['[Full list]', '[Copy the full ingredient list from the label.]']],
      howto: ['After shampoo, apply to lengths and ends.', 'Leave on for 10 minutes.', 'Rinse well. Use once a week instead of conditioner.'],
      routine: ['shampoo', 'cond', 'mask', 'hserum']
    },
    midnight: {
      id: 'midnight', name: 'Body Splash · Midnight Desire', short: 'Midnight Desire', size: '240 ml', price: 380, cat: 'body',
      badge: '', benefit: 'Warm evening scent', rating: 4.9, reviews: 121, sales: 7, concerns: ['scent'],
      img: IMG + 'p-midnight.jpg',
      desc: 'A warm, long-lasting evening scent. Light enough to layer, strong enough to last from morning to night.',
      facts: [['Scent', 'Warm, evening'], ['Lasts', 'All day'], ['Size', '240 ml'], ['Pairs with', 'Queen’s Spell']],
      ingredients: [['[Full list]', '[Copy the full ingredient list from the label.]']],
      howto: ['Spray on pulse points and clothes from 20 cm.', 'Reapply as you like.'],
      routine: ['midnight', 'queens', 'cream']
    },
    clean: {
      id: 'clean', name: 'Facial Cleanser Gel', short: 'Cleanser', size: '250 ml', price: 300, cat: 'skin',
      badge: '', benefit: 'Deep, non-drying cleanse', rating: 4.7, reviews: 64, sales: 3, concerns: ['oily'],
      img: IMG + 'p-cleanser.jpg',
      desc: 'A fresh gel cleanser that removes oil and impurities without drying, leaving skin clean and ready for serum.',
      facts: [['Targets', 'Oil, dullness, pores'], ['Suitable for', 'Most skin types'], ['Key ingredients', '[Confirm from label]'], ['Results', 'Clearer-looking pores']],
      ingredients: [['[Full list]', '[Copy the full ingredient list from the label.]']],
      howto: ['Massage onto damp skin for 30 seconds.', 'Rinse with lukewarm water.', 'Use morning and evening.'],
      routine: ['clean', 'serum', 'cream']
    },
    queens: {
      id: 'queens', name: 'Body Splash · Queen’s Spell', short: 'Queen’s Spell', size: '240 ml', price: 380, cat: 'body',
      badge: '', benefit: 'Elegant floral scent', rating: 4.8, reviews: 88, sales: 4, concerns: ['scent'],
      img: IMG + 'p-queens.jpg',
      desc: 'An elegant, soft floral scent for every day. Fresh in the morning and still there in the evening.',
      facts: [['Scent', 'Floral, everyday'], ['Lasts', 'All day'], ['Size', '240 ml'], ['Pairs with', 'Midnight Desire']],
      ingredients: [['[Full list]', '[Copy the full ingredient list from the label.]']],
      howto: ['Spray on pulse points and clothes from 20 cm.', 'Reapply as you like.'],
      routine: ['queens', 'midnight', 'cream']
    },
    cond: {
      id: 'cond', name: 'Conditioner', short: 'Conditioner', size: '300 ml', price: 350, cat: 'hair',
      badge: 'New', benefit: 'Detangles, prevents protein loss', rating: 4.8, reviews: 73, sales: 2, concerns: ['frizz'],
      img: IMG + 'p-conditioner.jpg',
      desc: 'A smoothing conditioner that detangles, prevents protein loss and leaves hair soft and easy to comb.',
      facts: [['Targets', 'Tangles, frizz'], ['Suitable for', 'All hair types'], ['Key ingredients', '[Confirm from label]'], ['Results', 'Smoother after first use']],
      ingredients: [['[Full list]', '[Copy the full ingredient list from the label.]']],
      howto: ['After shampoo, apply to lengths and ends.', 'Leave on for 2 minutes.', 'Rinse thoroughly.'],
      routine: ['shampoo', 'cond', 'mask', 'hserum']
    },
    nail: {
      id: 'nail', name: 'Nail Lotion', short: 'Nail Lotion', size: '5 ml', price: 280, cat: 'nails',
      badge: '', benefit: 'Strengthens & lengthens', rating: 4.6, reviews: 59, sales: 1, concerns: ['nails'],
      img: IMG + 'p-nail.jpg',
      desc: 'A strengthening treatment that helps weak, breaking nails grow longer and stronger.',
      facts: [['Targets', 'Weak, breaking nails'], ['Suitable for', 'Natural nails'], ['Key ingredients', '[Confirm from label]'], ['Results', 'Stronger nails in 4 weeks']],
      ingredients: [['[Full list]', '[Copy the full ingredient list from the label.]']],
      howto: ['Apply one coat to clean, dry nails.', 'Let dry for 1 minute.', 'Use daily.'],
      routine: ['nail', 'cream', 'serum']
    }
  };

  var BUNDLES = {
    'complete-hair': { id: 'complete-hair', name: 'Complete Hair Routine', price: 1258, was: 1480, items: ['shampoo', 'cond', 'mask', 'hserum'], img: IMG + 'b-complete-hair.jpg', badge: 'Most popular', group: 'hair', steps: '4 steps', cat: 'hair', desc: 'Everything your hair needs: a sulfate-free cleanse, a conditioner that stops protein loss, a weekly repair mask and a serum for frizz and shine.' },
    'hair-routine': { id: 'hair-routine', name: 'Hair Care Routine', price: 899, was: 1080, items: ['shampoo', 'cond', 'mask'], img: IMG + 'b-hair-routine.jpg', badge: '3-step routine', group: 'hair', steps: '3 steps', cat: 'hair', desc: 'Cleanse gently, nourish deeply and condition for softer, healthier-looking hair.' },
    'fresh-radiant': { id: 'fresh-radiant', name: 'Fresh & Radiant Set', price: 1233, was: 1450, items: ['clean', 'serum', 'midnight', 'queens'], img: IMG + 'b-radiant.jpg', badge: 'Glow routine', cat: 'skin', desc: 'A brightening face routine plus both signature body splashes. Clean, glowing skin and a scent for day and night.' },
    'skin-nail': { id: 'skin-nail', name: 'Skin & Nail Set', price: 1148, was: 1350, items: ['clean', 'serum', 'cream', 'nail'], img: IMG + 'b-skin-nail.jpg', badge: 'Skin + nails', cat: 'skin', desc: 'Cleanser, face serum and whitening cream for an even tone, plus the nail lotion for stronger nails.' },
    'signature-glow': { id: 'signature-glow', name: 'Signature Glow Set', price: 999, was: 1140, items: ['midnight', 'queens', 'cream'], img: IMG + 'b-signature-glow.jpg', badge: 'Gift favorite', cat: 'body', desc: 'Both signature body splashes with the sensitive area whitening cream. Our most gifted set.' },
    'one-routine': { id: 'one-routine', name: 'One Complete Routine', price: 850, was: 970, items: ['clean', 'serum', 'nail'], img: IMG + 'b-one-routine.jpg', badge: 'Starter set', cat: 'skin', desc: 'Cleanser, face serum and nail lotion. A simple daily routine to start with.' },
    'complete-set': { id: 'complete-set', name: 'The Complete Luvira Set', price: 2870, was: 3590, items: ['serum', 'shampoo', 'hserum', 'cream', 'mask', 'midnight', 'clean', 'queens', 'cond', 'nail'], img: IMG + 'b-complete-set.jpg', badge: 'Best value', cat: 'all', desc: 'All 10 full-size Luvira products in one gift box: skin, hair, body and nails.' }
  };

  /* Customer before & after. Replace the placeholder images with real photos
     (same person, same light): before = Day 1, after = the "to" week. */
  var BA = 'assets/img/ba/';
  var RESULTS = {
    hair: [
      { i: 'H', name: 'Heba T.', age: 27, type: 'Thick, frizzy hair', used: 'Shampoo + Conditioner', from: 'Day 1', to: 'Week 2', before: 'Frizzy, dry, hard to brush', after: 'Smooth, soft, natural shine', quote: 'Less frizz from the first week and my hair finally feels soft again. I use it 3 times a week.', imgBefore: BA + 'hair-before.svg', imgAfter: BA + 'hair-after.svg' },
      { i: 'R', name: 'Rana M.', age: 31, type: 'Dry, itchy scalp', used: 'Sulfate-Free Shampoo', from: 'Day 1', to: 'Week 2', before: 'Flaky, itchy scalp', after: 'Calm, clean scalp', quote: 'The itching stopped after two weeks and no more flakes on my clothes.', imgBefore: BA + 'hair-before.svg', imgAfter: BA + 'hair-after.svg' },
      { i: 'M', name: 'Mona A.', age: 24, type: 'Colored hair', used: 'Complete Hair Routine', from: 'Day 1', to: 'Week 3', before: 'Faded, dull color', after: 'Color looks fresher, shinier', quote: 'Very gentle. My color lasts longer and my hair is shiny without heaviness.', imgBefore: BA + 'hair-before.svg', imgAfter: BA + 'hair-after.svg' },
      { i: 'S', name: 'Salma K.', age: 29, type: 'Hair fall', used: 'Shampoo + Hair Serum', from: 'Day 1', to: 'Week 4', before: 'Thin, breaking ends', after: 'Fuller, less breakage', quote: 'Much less hair in the brush. The serum with the shampoo made a real difference.', imgBefore: BA + 'hair-before.svg', imgAfter: BA + 'hair-after.svg' }
    ],
    skin: [
      { i: 'N', name: 'Nour A.', age: 26, type: 'Dark spots', used: 'Whitening Face Serum', from: 'Week 0', to: 'Week 4', before: 'Visible dark spots', after: 'Lighter, more even tone', quote: 'My dark spots faded after a month of daily use. Light, absorbs fast, no stickiness.', imgBefore: BA + 'skin-before.svg', imgAfter: BA + 'skin-after.svg' },
      { i: 'Y', name: 'Yasmin H.', age: 33, type: 'Uneven tone', used: 'Serum + Whitening Cream', from: 'Week 0', to: 'Week 6', before: 'Uneven, dull tone', after: 'Brighter, even tone', quote: 'Using both together made the biggest difference. My skin looks fresh without makeup.', imgBefore: BA + 'skin-before.svg', imgAfter: BA + 'skin-after.svg' },
      { i: 'L', name: 'Laila F.', age: 22, type: 'Oily skin', used: 'Cleanser + Serum', from: 'Week 0', to: 'Week 3', before: 'Shiny, clogged pores', after: 'Clearer, balanced skin', quote: 'The cleanser does not dry my skin at all and my pores look smaller.', imgBefore: BA + 'skin-before.svg', imgAfter: BA + 'skin-after.svg' }
    ],
    nails: [
      { i: 'M', name: 'Mariam S.', age: 28, type: 'Weak, breaking nails', used: 'Nail Lotion', from: 'Week 0', to: 'Week 4', before: 'Short, peeling nails', after: 'Longer, stronger nails', quote: 'My nails stopped breaking and finally grew past my fingertips.', imgBefore: BA + 'nails-before.svg', imgAfter: BA + 'nails-after.svg' },
      { i: 'D', name: 'Dina R.', age: 35, type: 'Brittle nails', used: 'Nail Lotion', from: 'Week 0', to: 'Week 6', before: 'Brittle, splitting', after: 'Smooth and strong', quote: 'One coat a day, and after six weeks no more splitting.', imgBefore: BA + 'nails-before.svg', imgAfter: BA + 'nails-after.svg' }
    ]
  };

  var CATS = [
    { id: 'skin', name: 'Skin care', line: 'Brighten & even tone', img: IMG + 'model-cream.jpg', pos: '62% 30%' },
    { id: 'hair', name: 'Hair care', line: 'Repair & tame frizz', img: IMG + 'model-conditioner.jpg', pos: '55% 30%' },
    { id: 'body', name: 'Body care', line: 'Signature scents', img: IMG + 'b-signature-glow.jpg', pos: '50% 50%' },
    { id: 'nails', name: 'Nail care', line: 'Stronger nails', img: IMG + 'model-nail.jpg', pos: '40% 40%' }
  ];

  var CONCERNS = [['spots', 'Dark spots & uneven tone'], ['oily', 'Dull, oily skin'], ['frizz', 'Frizzy hair'], ['dry', 'Dry, damaged hair'], ['nails', 'Weak nails'], ['scent', 'Long-lasting scent']];

  var GALLERY = {
    hair: [IMG + 'model-hairset.jpg', IMG + 'model-conditioner.jpg', IMG + 'b-complete-hair.jpg', IMG + 'b-hair-routine.jpg'],
    skin: [IMG + 'model-cream.jpg', IMG + 'b-one-routine.jpg', IMG + 'b-radiant.jpg', IMG + 'b-skin-nail.jpg'],
    body: [IMG + 'b-signature-glow.jpg', IMG + 'b-radiant.jpg', IMG + 'b-pampering.jpg'],
    nails: [IMG + 'model-nail.jpg', IMG + 'model-nail2.jpg', IMG + 'b-one-routine.jpg']
  };

  /* Luvira Friday (Black Friday) · proposal prices, edit here */
  var FRIDAY = {
    start: '2026-11-27T00:00:00+02:00',
    end: '2026-11-30T23:59:59+02:00',
    sitewide: 0.20,  /* everything 20% off */
    boxOff: 0.25,    /* pick any 3 */
    tiers: [[850, 'Free shipping + extra 10% off', 'clean'], [1200, 'Free Nail Lotion (worth 280 EGP)', 'nail'], [1800, 'Free Body Splash (worth 380 EGP)', 'midnight']],
    deals: {
      'bf-dotd': { of: 'complete-set', price: 2499 },
      'bf-fresh-radiant': { of: 'fresh-radiant', price: 1099 },
      'bf-skin-nail': { of: 'skin-nail', price: 1049 },
      'bf-complete-hair': { of: 'complete-hair', price: 999 }
    }
  };

  window.LV_DATA = { PRODUCTS: PRODUCTS, BUNDLES: BUNDLES, RESULTS: RESULTS, CATS: CATS, CONCERNS: CONCERNS, GALLERY: GALLERY, FRIDAY: FRIDAY, IMG: IMG };
})();
