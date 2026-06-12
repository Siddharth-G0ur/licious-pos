export const STATUS_CLASS = {
  'Link Sent':        's-link-sent',
  'Link Opened':      's-link-opened',
  'Payment Pending':  's-pay-pending',
  'Paid':             's-paid',
  'Packing':          's-packing',
  'Ready for Pickup': 's-ready',
  'Out for Delivery': 's-out-delivery',
  'Delivered':        's-delivered',
  'Cancelled':        's-cancelled',
};

export const STATUS_FLOW = [
  'Link Sent', 'Paid', 'Packing', 'Ready for Pickup', 'Out for Delivery', 'Delivered',
];

export function statusBadgeClass(status) {
  return STATUS_CLASS[status] || '';
}

export function calcTotals(cart) {
  const subtotal = cart.reduce((s, ci) => s + ci.price * ci.qty, 0);
  const delivery = cart.length === 0 ? 0 : subtotal >= 1000 ? 0 : 49;
  const total = Math.round(subtotal + delivery);
  return { subtotal: Math.round(subtotal), delivery, total };
}

export function formatCountdown(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

export function getStageLine(order) {
  const { status, paidAt, sr } = order;
  if (status === 'Delivered') return 'Delivered';
  if (status === 'Out for Delivery' && sr?.eta) return `Out for Delivery · ETA ${sr.eta}`;
  if (['Ready for Pickup', 'Packing'].includes(status) && paidAt) return `${status} · Paid ${paidAt}`;
  if (status === 'Paid' && paidAt) return `Paid · ${paidAt}`;
  return status;
}
