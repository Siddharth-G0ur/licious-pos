import { create } from 'zustand';
import { CATALOG } from '../data/catalog';
import { CUSTOMER_DB } from '../data/categories';
import { calcTotals } from '../utils/helpers';
import useCTOStore from './ctoStore';

const useCreateFlowStore = create((set, get) => ({
  isOpen: false,
  step: 1,
  isGenerating: false,
  phone: '',
  customerData: null,
  orderType: 'remote',

  cart: [],
  catFilter: 'Chicken',
  searchQuery: '',

  weightModalPlu: null,

  countdownSecs: 900,
  pendingOrderId: null,

  open: () => set({
    isOpen: true, step: 1, isGenerating: false,
    phone: '', customerData: null, orderType: 'remote',
    cart: [], catFilter: 'Chicken', searchQuery: '',
    weightModalPlu: null,
    countdownSecs: 900, pendingOrderId: null,
  }),

  close: () => set({ isOpen: false, isGenerating: false }),

  setStep: (n) => set({ step: n }),

  setPhone: (p) => set({ phone: p.replace(/\D/g, '').slice(0, 10) }),

  setOrderType: (t) => set({ orderType: t }),

  checkCustomer: () => {
    const { phone } = get();
    if (phone.length < 10) return;
    set({ customerData: CUSTOMER_DB[phone] || false });
  },

  useTemplate: () => {
    const { customerData } = get();
    if (!customerData?.lastOrder) return;
    set({ cart: customerData.lastOrder.items.map(i => ({ ...i })), step: 2 });
  },

  proceedAsGuest: () => set({ phone: '', customerData: null, step: 2 }),

  submitPhone: () => {
    if (get().phone.length < 10) return;
    set({ step: 2 });
  },

  setCatFilter: (cat) => set({ catFilter: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  tapProduct: (plu) => {
    const prod = CATALOG.find(p => p.plu === plu);
    if (!prod) return;
    if (prod.uom === 'Kg') {
      set({ weightModalPlu: plu });
    } else {
      set((state) => {
        const existing = state.cart.find(c => c.plu === plu);
        if (existing) {
          return { cart: state.cart.map(c => c.plu === plu ? { ...c, qty: c.qty + 1 } : c) };
        }
        return { cart: [...state.cart, { plu: prod.plu, name: prod.name, uom: prod.uom, price: prod.price, qty: 1 }] };
      });
    }
  },

  // Always adds the tapped product directly — parent-child sourcing is tracked in backend, not at order level
  confirmWeight: (weight) => {
    const { weightModalPlu } = get();
    if (!weightModalPlu) return;
    const prod = CATALOG.find(p => p.plu === weightModalPlu);
    const qty = parseFloat(weight.toFixed(3));
    set((state) => {
      const existing = state.cart.find(c => c.plu === weightModalPlu);
      const cart = existing
        ? state.cart.map(c => c.plu === weightModalPlu ? { ...c, qty } : c)
        : [...state.cart, { plu: prod.plu, name: prod.name, uom: prod.uom, price: prod.price, qty }];
      return { cart, weightModalPlu: null };
    });
  },

  closeWeightModal: () => set({ weightModalPlu: null }),

  removeFromCart: (plu) => set((state) => ({ cart: state.cart.filter(c => c.plu !== plu) })),
  clearCart: () => set({ cart: [] }),

  updateCartWeight: (plu, val) => {
    const n = parseFloat(val);
    if (isNaN(n) || n <= 0) return;
    set((state) => ({
      cart: state.cart.map(c => c.plu === plu ? { ...c, qty: parseFloat(n.toFixed(3)) } : c),
    }));
  },

  proceedToPayment: () => set({ step: 3 }),

  generateLink: () => {
    set({ isGenerating: true });
    setTimeout(() => {
      const { phone, cart } = get();
      const t = calcTotals(cart);
      const ctoStore = useCTOStore.getState();
      const oid = `CTO-${ctoStore.nextOrderNum}`;
      const newOrder = {
        id: oid,
        phone: '••••' + (phone || '0000').slice(-4),
        fullPhone: '+91 ' + (phone || '').slice(0, 5) + ' ' + (phone || '').slice(5),
        status: 'Payment Pending',
        value: t.total,
        paidAt: null,
        timeAgo: 'Just now',
        items: cart.map(ci => ({
          name: ci.name,
          qty: ci.qty + ' ' + ci.uom,
          price: Math.round(ci.price * ci.qty),
        })),
        subtotal: t.subtotal,
        delivery: t.delivery,
        discount: 0,
        total: t.total,
        address: null,
        sr: null,
      };
      ctoStore.addOrder(newOrder);
      set({ isGenerating: false, step: 4, pendingOrderId: oid, countdownSecs: 900 });
    }, 2200);
  },

  tickCountdown: () => set((state) => ({ countdownSecs: Math.max(0, state.countdownSecs - 1) })),
}));

export default useCreateFlowStore;
