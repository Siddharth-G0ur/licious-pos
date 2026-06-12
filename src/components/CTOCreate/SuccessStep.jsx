import { useState } from 'react';
import useCreateFlowStore from '../../store/createFlowStore';
import useCTOStore from '../../store/ctoStore';
import { calcTotals } from '../../utils/helpers';

export default function SuccessStep() {
  const { phone, cart, close, pendingOrderId, orderType, selectedAddress, deliveryMethod, manualEta } = useCreateFlowStore();
  const showToast = useCTOStore(s => s.showToast);
  const t = calcTotals(cart);
  const isInStore = orderType === 'instore';
  const payLink = pendingOrderId ? `${window.location.origin}/pay/${pendingOrderId}` : null;

  const [waSent, setWaSent] = useState(false);

  function sendWA() {
    setWaSent(true);
    showToast('Payment link sent via WhatsApp');
  }

  if (isInStore) {
    return (
      <div className="ctoc-success-page">
        <div className="ctoc-success-card" style={{ maxWidth: 600 }}>
          <img
            src="/icons/OrderSuccessIcon.svg"
            style={{ width: 48, height: 48, margin: '0 auto 12px', display: 'block' }}
            alt="success"
          />
          <div className="ctoc-success-msg">Order created successfully</div>

          {/* Summary row */}
          <div className="ctoc-success-summary">
            Phone : <strong>{phone || 'Guest'}</strong>
            &nbsp;|&nbsp;
            Amount : <strong className="ctoc-amount">₹{t.total}</strong>
          </div>

          {/* Address + delivery details */}
          <div className="ctoc-instore-details">
            {selectedAddress && (
              <div className="ctoc-instore-detail-row">
                <span className="ctoc-instore-detail-lbl">Deliver to</span>
                <span className="ctoc-instore-detail-val">
                  {selectedAddress.line1}, {selectedAddress.line2}
                </span>
              </div>
            )}
            <div className="ctoc-instore-detail-row">
              <span className="ctoc-instore-detail-lbl">Delivery via</span>
              <span className="ctoc-instore-detail-val">
                {deliveryMethod === 'shiprocket' ? 'Shiprocket — booking confirmed' : `Manual Delivery · ETA ${manualEta}`}
              </span>
            </div>
          </div>

          {/* WhatsApp send */}
          {!waSent ? (
            <button className="ctoc-wa-btn" onClick={sendWA}>
              Send Payment Link via WhatsApp
            </button>
          ) : (
            <div className="ctoc-wa-sent">
              <div className="ctoc-wa-sent-title">Payment link sent via WhatsApp</div>
              <div className="ctoc-wa-sent-sub">
                A confirmation message will be sent automatically once payment is received.
              </div>
            </div>
          )}

          <div className="ctoc-success-btns" style={{ marginTop: 16 }}>
            <button className="ctoc-resend-btn" onClick={() => showToast('Payment link resent via WhatsApp!')}>
              Resend
            </button>
          </div>
          <button className="ctoc-view-orders-btn" onClick={close}>
            View Orders
          </button>
        </div>
      </div>
    );
  }

  // Remote flow (unchanged)
  return (
    <div className="ctoc-success-page">
      <div className="ctoc-success-card">
        <img
          src="/icons/OrderSuccessIcon.svg"
          style={{ width: 48, height: 48, margin: '0 auto 12px', display: 'block' }}
          alt="success"
        />
        <div className="ctoc-success-msg">
          Order Confirmation Link successfully sent via SMS and WhatsApp
        </div>
        <div className="ctoc-success-summary">
          Phone : <strong>{phone || 'Guest'}</strong>
          &nbsp;|&nbsp;
          Amount : <strong className="ctoc-amount">₹{t.total}</strong>
        </div>
        <div className="ctoc-success-btns">
          <button className="ctoc-resend-btn" onClick={() => showToast('Payment link resent!')}>
            Resend Link
          </button>
        </div>
        <button className="ctoc-view-orders-btn" onClick={close}>
          View Orders
        </button>

        {payLink && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: 11, color: '#bbb' }}>Demo · </span>
            <a
              href={payLink}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 11, color: '#bbb', textDecoration: 'underline' }}
            >
              Preview customer flow
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
