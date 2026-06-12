import { useState, useEffect } from 'react';
import useMicrositeStore from '../../store/micrositeStore';
import useCTOStore from '../../store/ctoStore';

const STAGES = [
  { key: 'packing',  label: 'Order is getting packed' },
  { key: 'delivery', label: 'Order is out for delivery' },
  { key: 'done',     label: 'Order delivered successfully' },
];

function getStageIndex(status) {
  if (status === 'Delivered') return 2;
  if (status === 'Out for Delivery') return 1;
  return 0;
}

export default function PaymentSuccess({ order }) {
  const etaMins = useMicrositeStore(s => s.etaMins);
  const advanceStatus = useCTOStore(s => s.advanceStatus);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (order && ['Payment Pending', 'Link Sent', 'Link Opened'].includes(order.status)) {
      advanceStatus(order.id, 'Paid');
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowModal(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const activeStage = getStageIndex(order.status);
  const etaText = etaMins <= 0 ? 'Arriving any moment' : `${etaMins} min${etaMins === 1 ? '' : 's'}`;

  return (
    <div className="ms-success">
      {showModal && (
        <div className="ms-pay-modal-overlay">
          <div className="ms-pay-modal">
            <div className="ms-pay-modal-check" />
            <div className="ms-pay-modal-title">Payment Successful</div>
            <div className="ms-pay-modal-sub">Your order has been confirmed</div>
          </div>
        </div>
      )}

      <div className="ms-tracker-header">
        <div className="ms-tracker-title">Order Status</div>
        <div className="ms-order-ref">{order.id}</div>
      </div>

      <div className="ms-tracker">
        {STAGES.map((stage, i) => {
          const isCompleted = i < activeStage;
          const isActive = i === activeStage;
          return (
            <div key={stage.key} className="ms-tracker-row">
              <div className="ms-tracker-spine">
                <div className={`ms-tracker-dot ${isCompleted ? 'completed' : isActive ? 'active' : 'pending'}`}>
                  {isCompleted && <div className="ms-tracker-check" />}
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`ms-tracker-line ${isCompleted ? 'completed' : ''}`} />
                )}
              </div>
              <div className="ms-tracker-content">
                <div className={`ms-tracker-label ${isActive ? 'active' : isCompleted ? 'done' : ''}`}>
                  {stage.label}
                </div>
                {isActive && i === 0 && etaMins > 0 && (
                  <div className="ms-tracker-eta">Estimated time: {etaText}</div>
                )}
                {isActive && i === 1 && (
                  <div className="ms-tracker-eta">Estimated arrival: {etaText}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0 18px', marginBottom: 10 }}>
        <div className="ms-section-title">Order summary</div>
      </div>
      <div className="ms-items-section">
        {order.items.map((item, i) => (
          <div key={i} className="ms-item-row">
            <div>
              <div className="ms-item-name">{item.name}</div>
              <div className="ms-item-qty">{item.qty}</div>
            </div>
            <div className="ms-item-price">&#8377;{item.price.toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>
      <div className="ms-bill" style={{ marginBottom: 100 }}>
        <div className="ms-bill-row">
          <span>Item total</span>
          <span>&#8377;{order.subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="ms-bill-row">
          <span>Delivery</span>
          <span style={{ color: order.delivery === 0 ? '#2e7d32' : '#111' }}>
            {order.delivery === 0 ? 'Free' : `₹${order.delivery}`}
          </span>
        </div>
        <hr className="ms-bill-divider" />
        <div className="ms-bill-total">
          <span>Total paid</span>
          <span style={{ color: '#2e7d32' }}>&#8377;{order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
