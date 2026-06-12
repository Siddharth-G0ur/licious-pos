import useCreateFlowStore from '../../store/createFlowStore';
import useCTOStore from '../../store/ctoStore';
import { calcTotals } from '../../utils/helpers';

export default function SuccessStep() {
  const { phone, cart, close, pendingOrderId } = useCreateFlowStore();
  const showToast = useCTOStore(s => s.showToast);
  const t = calcTotals(cart);
  const payLink = pendingOrderId ? `${window.location.origin}/pay/${pendingOrderId}` : null;

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
