import useCreateFlowStore from '../../store/createFlowStore';

export default function AddressDeliveryStep() {
  const {
    phone, customerData,
    selectedAddressId, selectedAddress,
    showAddressForm, newAddressForm,
    deliveryMethod, manualEta,
    setSelectedAddress, setShowAddressForm, setNewAddressField, confirmNewAddress,
    setDeliveryMethod, setManualEta,
    generateInStoreOrder, close,
  } = useCreateFlowStore();

  const savedAddresses = customerData?.savedAddresses || [];
  const canConfirm = selectedAddress && (deliveryMethod === 'shiprocket' || (deliveryMethod === 'manual' && manualEta.trim()));

  return (
    <div className="ctoc-addr-page">
      {/* Subheader */}
      <div className="ctoc-addr-subhdr">
        <div className="ctoc-addr-subhdr-title">Delivery Address</div>
        <button className="ctoc-abort-btn" onClick={close}>
          <img src="/icons/RedCrossIcon.svg" style={{ width: 13, height: 13 }} alt="" />
          Abort Order
        </button>
      </div>

      <div className="ctoc-addr-body">
        {/* Left — Address */}
        <div className="ctoc-addr-left">
          <div className="ctoc-addr-section-title">
            {phone ? `Saved addresses for +91 ${phone.slice(0,5)} ${phone.slice(5)}` : 'Guest — enter address below'}
          </div>

          {savedAddresses.length > 0 && (
            <div className="ctoc-addr-list">
              {savedAddresses.map(addr => (
                <div
                  key={addr.id}
                  className={`ctoc-addr-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <div className="ctoc-addr-radio">
                    {selectedAddressId === addr.id && <div className="ctoc-addr-radio-dot" />}
                  </div>
                  <div className="ctoc-addr-card-body">
                    <div className="ctoc-addr-label">{addr.label}</div>
                    <div className="ctoc-addr-line1">{addr.line1}</div>
                    <div className="ctoc-addr-line2">{addr.line2}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showAddressForm ? (
            <button className="ctoc-add-addr-btn" onClick={() => setShowAddressForm(true)}>
              + Add New Address
            </button>
          ) : (
            <div className="ctoc-new-addr-form">
              <div className="ctoc-addr-form-title">New Address</div>
              <div className="ctoc-form-field">
                <label className="ctoc-form-label">Flat / House No.</label>
                <input
                  className="ctoc-form-input"
                  placeholder="e.g. Flat 4B, Rainbow Apartments"
                  value={newAddressForm.line1}
                  onChange={e => setNewAddressField('line1', e.target.value)}
                />
              </div>
              <div className="ctoc-form-field">
                <label className="ctoc-form-label">Area / Street</label>
                <input
                  className="ctoc-form-input"
                  placeholder="e.g. Koramangala 5th Block"
                  value={newAddressForm.line2}
                  onChange={e => setNewAddressField('line2', e.target.value)}
                />
              </div>
              <div className="ctoc-form-row">
                <div className="ctoc-form-field">
                  <label className="ctoc-form-label">Pincode</label>
                  <input
                    className="ctoc-form-input"
                    placeholder="560095"
                    maxLength={6}
                    value={newAddressForm.pincode}
                    onChange={e => setNewAddressField('pincode', e.target.value.replace(/\D/g,'').slice(0,6))}
                  />
                </div>
                <div className="ctoc-form-field">
                  <label className="ctoc-form-label">City</label>
                  <input
                    className="ctoc-form-input"
                    placeholder="Bengaluru"
                    value={newAddressForm.city}
                    onChange={e => setNewAddressField('city', e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="ctoc-form-cancel-btn" onClick={() => setShowAddressForm(false)}>Cancel</button>
                <button
                  className="ctoc-form-save-btn"
                  disabled={!newAddressForm.line1 || !newAddressForm.city}
                  onClick={confirmNewAddress}
                >
                  Use This Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — Delivery Method */}
        <div className="ctoc-addr-right">
          <div className="ctoc-addr-section-title">Delivery Method</div>

          <div
            className={`ctoc-delivery-card ${deliveryMethod === 'shiprocket' ? 'selected' : ''}`}
            onClick={() => setDeliveryMethod('shiprocket')}
          >
            <div className="ctoc-delivery-radio">
              {deliveryMethod === 'shiprocket' && <div className="ctoc-addr-radio-dot" />}
            </div>
            <div>
              <div className="ctoc-delivery-name">Book Shiprocket</div>
              <div className="ctoc-delivery-sub">Auto-assign courier partner</div>
            </div>
          </div>

          <div
            className={`ctoc-delivery-card ${deliveryMethod === 'manual' ? 'selected' : ''}`}
            onClick={() => setDeliveryMethod('manual')}
          >
            <div className="ctoc-delivery-radio">
              {deliveryMethod === 'manual' && <div className="ctoc-addr-radio-dot" />}
            </div>
            <div style={{ flex: 1 }}>
              <div className="ctoc-delivery-name">Manual Delivery</div>
              <div className="ctoc-delivery-sub">Store delivers directly</div>
              {deliveryMethod === 'manual' && (
                <div style={{ marginTop: 10 }}>
                  <label className="ctoc-form-label">Estimated delivery time</label>
                  <input
                    className="ctoc-form-input"
                    style={{ marginTop: 6 }}
                    placeholder="e.g. 12:30 PM"
                    value={manualEta}
                    onChange={e => setManualEta(e.target.value)}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            className="ctoc-addr-confirm-btn"
            disabled={!canConfirm}
            onClick={generateInStoreOrder}
          >
            Confirm &amp; Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
