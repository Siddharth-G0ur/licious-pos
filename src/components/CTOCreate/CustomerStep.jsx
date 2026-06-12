import useCreateFlowStore from '../../store/createFlowStore';

export default function CustomerStep() {
  const {
    phone, orderType, customerData,
    setPhone, setOrderType, checkCustomer,
    submitPhone, proceedAsGuest,
  } = useCreateFlowStore();

  const canSubmit = phone.length === 10;

  return (
    <div className="ctoc-customer-page">
      <div className="ctoc-customer-center">
        <div className="ctoc-customer-card">
          <div className="ctoc-card-title">Customer Detail</div>

          <label className="ctoc-field-label">Enter Customer Phone Number</label>
          <div className="ctoc-phone-row">
            <span className="ctoc-prefix">+91</span>
            <input
              id="ctoc-phone"
              type="tel"
              className="ctoc-phone-input"
              maxLength={10}
              placeholder="Enter Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canSubmit && submitPhone()}
              autoFocus
            />
            {phone && (
              <button className="ctoc-clear-btn" onClick={() => setPhone('')}>✕</button>
            )}
          </div>

          <div className="ctoc-order-type-box">
            <div className="ctoc-ot-title">Order type</div>
            <div className="ctoc-ot-options">
              {['instore', 'remote'].map(t => (
                <label key={t} className="ctoc-radio-label">
                  <input
                    type="radio"
                    name="ctoc-ot"
                    value={t}
                    checked={orderType === t}
                    onChange={() => setOrderType(t)}
                  />
                  {t === 'instore' ? 'In-Store Order' : 'Remote Order'}
                </label>
              ))}
            </div>
          </div>

          {customerData && (
            <CustomerCard data={customerData} />
          )}
          {customerData === false && (
            <div className="cust-card">
              <div className="cust-card-hdr">
                <div className="cust-card-name">New Customer</div>
                <span className="tag-new">No history</span>
              </div>
              <div className="cust-card-body" style={{ color: '#888', fontSize: 12 }}>
                First order on this number.
              </div>
            </div>
          )}

          <div className="ctoc-btn-row" style={{ marginTop: customerData === null && customerData !== false ? 0 : 16 }}>
            <button className="ctoc-guest-btn" onClick={proceedAsGuest}>Order As Guest</button>
            <button
              className="ctoc-submit-btn"
              disabled={!canSubmit}
              onClick={submitPhone}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerCard({ data }) {
  const { useTemplate, submitPhone } = useCreateFlowStore();

  return (
    <div className="cust-card" style={{ marginBottom: 16 }}>
      <div className="cust-card-hdr">
        <div className="cust-card-name">Customer Found</div>
        <span className={data.orderCount > 0 ? 'tag-repeat' : 'tag-new'}>
          {data.orderCount > 0 ? `Repeat · ${data.orderCount} orders` : 'New Customer'}
        </span>
      </div>
      {data.lastOrder ? (
        <div className="cust-card-body">
          <div className="last-order-box">
            <div className="lo-label">Last Order</div>
            <div className="lo-items">{data.lastOrder.items.map(i => i.name).join(', ')}</div>
            <div className="lo-meta">{data.lastOrder.date} · ₹{data.lastOrder.value.toLocaleString('en-IN')}</div>
          </div>
          <div className="cust-actions">
            <button className="btn-template" onClick={useTemplate}>↺ Use as Template</button>
            <button className="btn-fresh" onClick={submitPhone}>Start Fresh</button>
          </div>
        </div>
      ) : (
        <div className="cust-card-body" style={{ color: '#888', fontSize: 12 }}>
          No previous orders on this number.
        </div>
      )}
    </div>
  );
}
