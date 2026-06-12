import useMicrositeStore from '../../store/micrositeStore';

export default function AddressAdd() {
  const { newAddressForm, setNewAddressField, saveNewAddress, setScreen } = useMicrositeStore();
  const { flat, area, pincode, city } = newAddressForm;
  const canSave = flat.trim() && area.trim() && pincode.trim() && city.trim();

  return (
    <>
      <div className="ms-back-bar">
        <button className="ms-back-btn" onClick={() => setScreen('address-select')}>
          ← Back
        </button>
      </div>

      <div className="ms-page">
        <div className="ms-page-title">Add delivery address</div>
        <div className="ms-page-sub">Where should we deliver your order?</div>

        <div className="ms-form">
          <div>
            <label className="ms-field-label">Flat / House No / Building</label>
            <input
              className="ms-field"
              placeholder="e.g. Flat 4B, Rainbow Apartments"
              value={flat}
              onChange={e => setNewAddressField('flat', e.target.value)}
            />
          </div>
          <div>
            <label className="ms-field-label">Street / Area / Locality</label>
            <input
              className="ms-field"
              placeholder="e.g. Koramangala 5th Block"
              value={area}
              onChange={e => setNewAddressField('area', e.target.value)}
            />
          </div>
          <div className="ms-field-row">
            <div>
              <label className="ms-field-label">Pincode</label>
              <input
                className="ms-field"
                placeholder="560095"
                maxLength={6}
                value={pincode}
                onChange={e => setNewAddressField('pincode', e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div>
              <label className="ms-field-label">City</label>
              <input
                className="ms-field"
                placeholder="Bengaluru"
                value={city}
                onChange={e => setNewAddressField('city', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ms-footer">
        <button className="ms-cta" disabled={!canSave} onClick={saveNewAddress}>
          Save &amp; Continue
        </button>
      </div>
    </>
  );
}
