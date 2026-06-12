import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCTOStore from '../../store/ctoStore';
import useMicrositeStore from '../../store/micrositeStore';
import AddressSelect from './AddressSelect';
import AddressAdd from './AddressAdd';
import Checkout from './Checkout';
import PaymentSuccess from './PaymentSuccess';
import DeliveredScreen from './DeliveredScreen';
import SimulatorPanel from './SimulatorPanel';
import '../../customer.css';

export default function CustomerMicrosite() {
  const { orderId } = useParams();
  const orders = useCTOStore(s => s.orders);
  const order = orders.find(o => o.id === orderId);

  const { screen, setScreen, reset } = useMicrositeStore();

  useEffect(() => {
    reset();
  }, [orderId]);

  // Cross-tab sync: rehydrate when POS tab writes to localStorage
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'licious-cto-store') {
        useCTOStore.persist.rehydrate();
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Auto-transition to delivered when order status becomes Delivered
  useEffect(() => {
    if (order?.status === 'Delivered') {
      setScreen('delivered');
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="ms-root">
        <div className="ms-shell" style={{ alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 32 }}>
          <img src="/icons/LiciousLogo.svg" style={{ height: 22 }} alt="Licious" />
          <div style={{ fontSize: 17, fontWeight: 700, color: '#111', marginTop: 8 }}>Link not found</div>
          <div style={{ fontSize: 14, color: '#999' }}>This payment link may have expired or is invalid.</div>
        </div>
      </div>
    );
  }

  const effectiveScreen = order.status === 'Delivered' ? 'delivered' : screen;
  const showSimulator = ['payment-success', 'checkout'].includes(effectiveScreen);
  const orderValue = `${order.items.length} item${order.items.length > 1 ? 's' : ''} · ₹${order.total.toLocaleString('en-IN')}`;

  return (
    <div className="ms-root">
      {/* Extra bottom padding so simulator panel never covers the Pay/CTA button */}
      <div className="ms-shell" style={showSimulator ? { paddingBottom: 88 } : {}}>
        {effectiveScreen !== 'delivered' && (
          <div className="ms-header">
            <img src="/icons/LiciousLogo.svg" className="ms-logo" alt="Licious" />
            <div className="ms-order-pill">
              <span>{orderValue}</span>
            </div>
          </div>
        )}

        {effectiveScreen === 'payment-processing' && (
          <div className="ms-processing">
            <div className="ms-spinner" />
            <div className="ms-processing-title">Redirecting to Razorpay…</div>
            <div className="ms-processing-sub">Please wait while we set up your payment</div>
          </div>
        )}

        {effectiveScreen === 'address-select' && <AddressSelect order={order} />}
        {effectiveScreen === 'address-add'    && <AddressAdd />}
        {effectiveScreen === 'checkout'       && <Checkout order={order} />}
        {effectiveScreen === 'payment-success'&& <PaymentSuccess order={order} />}
        {effectiveScreen === 'delivered'      && <DeliveredScreen order={order} />}
      </div>

      {showSimulator && (
        <SimulatorPanel orderId={order.id} currentStatus={order.status} />
      )}
    </div>
  );
}
