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
  orderType: 'remote1',

  cart: [],
  catFilter: 'Chicken',
  searchQuery: '',

  weightModalPlu: null,

  countdownSecs: 900,
  pendingOrderId: null,

  // In-store address + delivery state
  selectedAddressId: null,
  selectedAddress: null,
  showAddressForm: false,
  newAddressForm: { line1: '', line2: '', pincode: '', city: '' },
  deliveryMethod: 'shiprocket',   // 'shiprocket' | 'manual'
  manualEta: '',

  open: () => set({
    isOpen: true, step: 1, isGenerating: false,
    phone: '', customerData: null, orderType: 'remote1',
    cart: [], catFilter: 'Chicken', searchQuery: '',
    weightModalPlu: null,
    countdownSecs: 900, pendingOrderId: null,
    selectedAddressId: null, selectedAddress: null,
    showAddressForm: false, newAddressForm: { line1: '', line2: '', pincode: '', city: '' },
    deliveryMethod: 'shiprocket', manualEta: '',
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
    const { phone } = get();
    if (phone.length < 10) return;
    set({ step: 2, customerData: CUSTOMER_DB[phone] || false });
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

  // In-store: from payment review → address step
  proceedToAddress: () => set({ step: 4 }),

  // In-store: address form helpers
  setSelectedAddress: (addr) => set({ selectedAddressId: addr.id, selectedAddress: addr, showAddressForm: false }),
  setShowAddressForm: (v) => set({ showAddressForm: v, selectedAddressId: null, selectedAddress: null }),
  setNewAddressField: (field, val) => set((state) => ({
    newAddressForm: { ...state.newAddressForm, [field]: val },
  })),
  confirmNewAddress: () => {
    const { newAddressForm } = get();
    const addr = {
      id: Date.now(),
      label: 'New Address',
      line1: newAddressForm.line1,
      line2: `${newAddressForm.city} ${newAddressForm.pincode}`.trim(),
    };
    set({ selectedAddressId: addr.id, selectedAddress: addr, showAddressForm: false,
          newAddressForm: { line1: '', line2: '', pincode: '', city: '' } });
  },

  setDeliveryMethod: (m) => set({ deliveryMethod: m, manualEta: '' }),
  setManualEta: (eta) => set({ manualEta: eta }),

  // Remote flow: generate payment link → step 4 (success)
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

  // In-store flow: create order with address + delivery → step 5 (WA success)
  generateInStoreOrder: () => {
    const { selectedAddress, deliveryMethod, manualEta, phone, cart } = get();
    set({ isGenerating: true });
    setTimeout(() => {
      const t = calcTotals(cart);
      const ctoStore = useCTOStore.getState();
      const oid = `CTO-${ctoStore.nextOrderNum}`;
      const sr = deliveryMethod === 'manual'
        ? { status: 'manual', awb: null, eta: manualEta || 'TBD', partner: 'Store Delivery' }
        : { status: 'ok', awb: 'SH88' + Math.floor(Math.random() * 90000 + 10000), eta: '02:00 PM', partner: 'Delhivery' };
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
        address: selectedAddress
          ? `${selectedAddress.line1}, ${selectedAddress.line2}`
          : null,
        sr,
      };
      ctoStore.addOrder(newOrder);
      set({ isGenerating: false, step: 5, pendingOrderId: oid });
    }, 1600);
  },

  tickCountdown: () => set((state) => ({ countdownSecs: Math.max(0, state.countdownSecs - 1) })),
}));

export default useCreateFlowStore;
