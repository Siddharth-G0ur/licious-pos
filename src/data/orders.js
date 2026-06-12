export const SEED_ORDERS = [
  {
    id: 'CTO-005', phone: '••••6677', fullPhone: '+91 99876 56677', status: 'Out for Delivery',
    value: 3200, paidAt: '09:42 AM', timeAgo: '1h 22m ago',
    items: [
      { name: 'Goat Kheema',             qty: '2 Kg',    price: 1498 },
      { name: 'Mud Crab',                qty: '1 Kg',    price: 799  },
      { name: 'Chicken Breast Boneless', qty: '2 Kg',    price: 898  },
    ],
    subtotal: 3195, delivery: 0, discount: 0, total: 3200,
    address: '14, 2nd Cross, Indiranagar, Bengaluru 560038',
    sr: { status: 'ok', awb: 'SH8823412', eta: '12:30 PM', partner: 'Delhivery' },
  },
  {
    id: 'CTO-003', phone: '••••5512', fullPhone: '+91 98765 55512', status: 'Packing',
    value: 2100, paidAt: '10:39 AM', timeAgo: '25m ago',
    items: [
      { name: 'Full Chicken Skinless',     qty: '2 Kg',    price: 598 },
      { name: 'Seawater Prawns',           qty: '1 Kg',    price: 699 },
      { name: 'Classic Eggs - Pack Of 12', qty: '3 Units', price: 285 },
      { name: 'White Tuna',                qty: '1 Kg',    price: 549 },
    ],
    subtotal: 2131, delivery: 0, discount: 0, total: 2100,
    address: '8B, Koramangala 5th Block, Bengaluru 560095',
    sr: { status: 'ok', awb: 'SH8820099', eta: '10:15 AM', partner: 'Shiprocket Surface' },
  },
  {
    id: 'CTO-001', phone: '••••8734', fullPhone: '+91 91234 58734', status: 'Paid',
    value: 1840, paidAt: '10:52 AM', timeAgo: '12m ago',
    items: [
      { name: 'Chicken Breast Boneless',  qty: '2 Kg',    price: 898 },
      { name: 'Drumsticks',               qty: '1.5 Kg',  price: 404 },
      { name: 'Country Eggs - Pack Of 6', qty: '5 Units', price: 275 },
      { name: 'Afghani Masala - Raw',     qty: '1 Kg',    price: 249 },
    ],
    subtotal: 1826, delivery: 0, discount: 0, total: 1840,
    address: '22, HSR Layout Sector 4, Bengaluru 560102',
    sr: { status: 'failed', awb: null, eta: null, partner: null },
  },
  {
    id: 'CTO-002', phone: '••••2291', fullPhone: '+91 90876 52291', status: 'Payment Pending',
    value: 697, paidAt: null, timeAgo: '5m ago',
    items: [
      { name: 'Sardine', qty: '2 Kg', price: 398 },
      { name: 'Rohu',    qty: '1 Kg', price: 249 },
    ],
    subtotal: 647, delivery: 50, discount: 0, total: 697,
    address: null, sr: null,
  },
  {
    id: 'CTO-004', phone: '••••9043', fullPhone: '+91 87654 39043', status: 'Link Sent',
    value: 1148, paidAt: null, timeAgo: '2m ago',
    items: [
      { name: 'Goat Kheema', qty: '1 Kg',   price: 749 },
      { name: 'Goat Liver',  qty: '0.5 Kg', price: 175 },
    ],
    subtotal: 924, delivery: 0, discount: 0, total: 1148,
    address: null, sr: null,
  },
];
