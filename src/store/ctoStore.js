import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SEED_ORDERS } from '../data/orders';

const useCTOStore = create(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,
      nextOrderNum: 1048,
      selectedOrderId: null,
      queueTab: 'all',

      cancelOrderId: null,
      manualOrderId: null,
      handoverOrderId: null,
      toast: null,

      selectOrder: (id) => set({ selectedOrderId: id }),
      setQueueTab: (tab) => set({ queueTab: tab }),

      advanceStatus: (id, newStatus) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status: newStatus } : o),
      })),

      cancelOrder: (id) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o),
        cancelOrderId: null,
      })),

      addOrder: (order) => set((state) => ({
        orders: [...state.orders, order],
        nextOrderNum: state.nextOrderNum + 1,
      })),

      retrySR: (id) => {
        setTimeout(() => {
          const awb = 'SH88' + Math.floor(Math.random() * 90000 + 10000);
          set((state) => ({
            orders: state.orders.map(o =>
              o.id === id
                ? { ...o, sr: { status: 'ok', awb, eta: '01:00 PM', partner: 'Delhivery' } }
                : o
            ),
          }));
          get().showToast(`✓ Shiprocket booked — AWB ${awb}`);
        }, 1400);
      },

      setManualDelivery: (id, eta) => set((state) => ({
        orders: state.orders.map(o =>
          o.id === id
            ? { ...o, status: 'Out for Delivery', sr: { status: 'manual', awb: null, eta, partner: 'Store Delivery' } }
            : o
        ),
        manualOrderId: null,
      })),

      openModal: (type, id) => set({ [`${type}OrderId`]: id }),
      closeModal: (type) => set({ [`${type}OrderId`]: null }),

      showToast: (text, isError = false) => {
        set({ toast: { text, isError } });
        setTimeout(() => set({ toast: null }), 2800);
      },
    }),
    {
      name: 'licious-cto-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist orders and counter — not transient UI state
      partialize: (state) => ({
        orders: state.orders,
        nextOrderNum: state.nextOrderNum,
      }),
    }
  )
);

export default useCTOStore;
