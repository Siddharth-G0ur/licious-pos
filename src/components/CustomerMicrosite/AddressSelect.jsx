import useMicrositeStore from '../../store/micrositeStore';

export default function AddressSelect({ order }) {
  const { savedAddresses, selectedAddressId, selectAddress, setScreen } = useMicrositeStore();

  return (
    <>
      <div className="ms-page">
        <div className="ms-page-title">Deliver to</div>
        <div className="ms-page-sub">Choose a saved address or add a new one</div>

        <div className="ms-addr-list">
          {savedAddresses.map(addr => {
            const sel = addr.id === selectedAddressId;
            return (
              <div
                key={addr.id}
                className={`ms-addr-card${sel ? ' selected' : ''}`}
                onClick={() => selectAddress(addr.id)}
              >
                <div className="ms-addr-radio">
                  {sel && <div className="ms-addr-radio-dot" />}
                </div>
                <div className="ms-addr-body">
                  <div className="ms-addr-label">{addr.label}</div>
                  <div className="ms-addr-line1">{addr.flat}</div>
                  <div className="ms-addr-line2">{addr.area}, {addr.city} — {addr.pincode}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="ms-add-addr-btn" onClick={() => setScreen('address-add')}>
          + Add New Address
        </button>
      </div>

      <div className="ms-footer">
        <button
          className="ms-cta"
          disabled={!selectedAddressId}
          onClick={() => setScreen('checkout')}
        >
          Continue to Checkout
        </button>
      </div>
    </>
  );
}
