import { create } from 'zustand';

const SAVED_ADDRESSES = [
  { id: 1, label: 'Home', flat: 'Flat 4B, Rainbow Apartments', area: 'Koramangala 5th Block', city: 'Bengaluru', pincode: '560095' },
  { id: 2, label: 'Office', flat: '3rd Floor, WeWork Galaxy', area: 'Residency Road', city: 'Bengaluru', pincode: '560025' },
  { id: 3, label: 'Parents', flat: '12, Seshadri Road', area: 'Gandhinagar', city: 'Bengaluru', pincode: '560009' },
];

const useMicrositeStore = create((set, get) => ({
  // Screen: 'address-select' | 'address-add' | 'checkout' | 'payment-processing' | 'payment-success' | 'delivered'
  screen: 'address-select',
  selectedAddressId: null,
  savedAddresses: SAVED_ADDRESSES,
  newAddressForm: { flat: '', area: '', pincode: '', city: '' },
  etaMins: 35,
  etaInterval: null,

  setScreen: (screen) => set({ screen }),

  selectAddress: (id) => set({ selectedAddressId: id }),

  setNewAddressField: (field, val) => set((state) => ({
    newAddressForm: { ...state.newAddressForm, [field]: val },
  })),

  saveNewAddress: () => {
    const { newAddressForm, savedAddresses } = get();
    const newAddr = {
      id: Date.now(),
      label: 'New Address',
      ...newAddressForm,
    };
    set({
      savedAddresses: [...savedAddresses, newAddr],
      selectedAddressId: newAddr.id,
      newAddressForm: { flat: '', area: '', pincode: '', city: '' },
      screen: 'checkout',
    });
  },

  startPayment: () => {
    set({ screen: 'payment-processing' });
    setTimeout(() => {
      set({ screen: 'payment-success' });
      get().startEtaCountdown();
    }, 2000);
  },

  startEtaCountdown: () => {
    const interval = setInterval(() => {
      set((state) => {
        if (state.etaMins <= 1) {
          clearInterval(interval);
          return { etaMins: 0, etaInterval: null };
        }
        return { etaMins: state.etaMins - 1 };
      });
    }, 60000); // 1 minute real time
    set({ etaInterval: interval });
  },

  reset: () => {
    const { etaInterval } = get();
    if (etaInterval) clearInterval(etaInterval);
    set({
      screen: 'address-select',
      selectedAddressId: null,
      newAddressForm: { flat: '', area: '', pincode: '', city: '' },
      etaMins: 35,
      etaInterval: null,
    });
  },
}));

export default useMicrositeStore;
