import useMicrositeStore from '../../store/micrositeStore';

export default function Checkout({ order }) {
  const { savedAddresses, selectedAddressId, setScreen, startPayment } = useMicrositeStore();
  const addr = savedAddresses.find(a => a.id === selectedAddressId);

  const subtotal = order.subtotal;
  const delivery = order.delivery;
  const total = order.total;

  return (
    <>
      <div className="ms-back-bar">
        <button className="ms-back-btn" onClick={() => setScreen('address-select')}>
          ← Back
        </button>
      </div>

      <div className="ms-page" style={{ paddingTop: 4 }}>
        {/* Delivery address */}
        {addr && (
          <div className="ms-delivery-box">
            <div>
              <div className="ms-delivery-label">Delivering to</div>
              <div className="ms-delivery-addr">
                {addr.flat}<br />
                {addr.area}, {addr.city} {addr.pincode}
              </div>
            </div>
            <button className="ms-change-link" onClick={() => setScreen('address-select')}>Change</button>
          </div>
        )}

        {/* Items */}
        <div className="ms-items-section">
          <div className="ms-section-title">Your items</div>
          {order.items.map((item, i) => (
            <div key={i} className="ms-item-row">
              <div>
                <div className="ms-item-name">{item.name}</div>
                <div className="ms-item-qty">{item.qty}</div>
              </div>
              <div className="ms-item-price">₹{item.price.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        {/* Bill */}
        <div className="ms-bill">
          <div className="ms-bill-row">
            <span>Item total</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="ms-bill-row">
            <span>Delivery charges</span>
            <span style={{ color: delivery === 0 ? '#2e7d32' : '#111' }}>
              {delivery === 0 ? 'Free' : `₹${delivery}`}
            </span>
          </div>
          <hr className="ms-bill-divider" />
          <div className="ms-bill-total">
            <span>Total payable</span>
            <span style={{ color: '#c8102e' }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="ms-footer">
        <button className="ms-cta" onClick={startPayment}>
          Pay ₹{total.toLocaleString('en-IN')}
        </button>
      </div>
    </>
  );
}
