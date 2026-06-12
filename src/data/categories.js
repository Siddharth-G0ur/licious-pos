export const CATEGORY_DATA = [
  { name: 'Chicken',       img: 'https://assets.licious.in/OMS-Category/65e96db7-5d87-2564-73a6-08206ae38bdc/original/1740034655963.png' },
  { name: 'Mutton',        img: 'https://dao54xqhg9jfa.cloudfront.net/OMS-Category/657d6f9d-2d9c-5275-91d3-8d37f94cf6e3/original/Mutton_(1)_(1).png' },
  { name: 'Fish & Seafood',img: 'https://dao54xqhg9jfa.cloudfront.net/OMS-Category/533c11ee-a0b7-0295-b7a5-79b8a4c827b4/original/Fish_(1)_(1)_(1).png' },
  { name: 'Ready to Cook', img: 'https://assets.licious.in/OMS-Category/43b8a8cd-6802-060f-ba92-62810f0898d6/original/1706766999426.png' },
  { name: 'Meat Masala',   img: 'https://dao54xqhg9jfa.cloudfront.net/OMS-Category/5d0aec03-956e-73f4-9a18-5124f725954c/original/Masala_1.png' },
  { name: 'Eggs',          img: 'https://dao54xqhg9jfa.cloudfront.net/OMS-Category/e931d464-bb6b-8e96-4cca-fb2fc172f43a/original/Eggs.png' },
];

export const VARIANT_GROUPS = {
  'full-chicken': ['737992', '432742', '868972'],
};

export const VARIANT_GROUP_BY_PLU = Object.fromEntries(
  Object.entries(VARIANT_GROUPS).flatMap(([gid, plus]) => plus.map(p => [p, gid]))
);

export const CUSTOMER_DB = {
  '9876543210': {
    orderCount: 4,
    lastOrder: {
      date: '05/06/26', value: 1240,
      items: [
        { plu: '178325', name: 'Chicken Breast Boneless', uom: 'Kg',    price: 449, qty: 1.5 },
        { plu: '876115', name: 'Drumsticks',              uom: 'Kg',    price: 269, qty: 1   },
        { plu: '700345', name: 'Classic Eggs - Pack Of 12', uom: 'Units', price: 95, qty: 2  },
      ],
    },
  },
};
