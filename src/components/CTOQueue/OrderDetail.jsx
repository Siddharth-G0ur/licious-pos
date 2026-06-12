import StatusBadge from '../shared/StatusBadge';
import StatusStepper from './StatusStepper';
import useCTOStore from '../../store/ctoStore';

export default function OrderDetail({ order }) {
  const { advanceStatus, openModal, retrySR, showToast } = useCTOStore();
  const hasFail = order.sr?.status === 'failed';
  const isUnpaid = ['Link Sent', 'Link Opened', 'Payment Pending'].includes(order.status);

  function ActionButtons() {
    if (isUnpaid) return (
      <button className="btn-act-danger" onClick={() => openModal('cancel', order.id)}>Cancel Order</button>
    );
    if (order.status === 'Paid' && !hasFail) return (
      <button className="btn-act-primary" onClick={() => advanceStatus(order.id, 'Packing')}>Mark as Packing</button>
    );
    if (order.status === 'Packing') return (
      <button className="btn-act-primary" onClick={() => advanceStatus(order.id, 'Ready for Pickup')}>Mark Ready for Pickup</button>
    );
    if (order.status === 'Ready for Pickup') return (
      <button className="btn-act-primary" onClick={() => openModal('handover', order.id)}>Confirm Handover to Delivery</button>
    );
    if (order.status === 'Out for Delivery' && order.sr?.status === 'manual') return (
      <button className="btn-act-primary" onClick={() => advanceStatus(order.id, 'Delivered')}>Mark as Delivered</button>
    );
    return null;
  }

  return (
    <div className="cto-detail-inner">
      <div className="cto-det-hdr">
        <div>
          <div className="cto-det-title">{order.id}</div>
          <div className="cto-det-sub">{order.fullPhone} · {order.timeAgo}</div>
        </div>
        <div>
          <div style={{ textAlign: 'right', marginBottom: 4 }}>
            <StatusBadge status={order.status} />
          </div>
          <div className="cto-det-value">₹{order.value.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {hasFail && (
        <div className="sr-fail-bar">
          <div className="sr-fail-text">⚠ Shiprocket booking failed — auto-retry exhausted</div>
          <div className="sr-fail-actions">
            <button className="btn-retry" onClick={() => retrySR(order.id)}>↻ Retry</button>
            <button className="btn-manual-del" onClick={() => openModal('manual', order.id)}>Manual Delivery</button>
          </div>
        </div>
      )}

      <StatusStepper status={order.status} />

      <div className="cto-det-body">
        {/* Items */}
        <div className="det-section">
          <div className="det-section-title">Items</div>
          <table className="det-items-tbl">
            <tbody>
              {order.items.map((it, i) => (
                <tr key={i}>
                  <td>
                    <div className="det-item-name">{it.name}</div>
                    <div className="det-item-qty">{it.qty}</div>
                  </td>
                  <td className="det-item-price">₹{it.price.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {order.discount > 0 && (
            <div className="det-total-row">
              <span>Discount</span>
              <span style={{ color: '#2e7d32' }}>−₹{order.discount}</span>
            </div>
          )}
          <div className="det-total-row">
            <span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="det-total-row">
            <span>Delivery</span>
            <span>{order.delivery === 0 ? <span style={{ color: '#2e7d32' }}>Free</span> : `₹${order.delivery}`}</span>
          </div>
          <div className="det-total-row grand">
            <span>Total</span><span>₹{order.value.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Address */}
        {order.address && (
          <div className="det-section">
            <div className="det-section-title">Delivery Address</div>
            <div className="det-row"><div className="det-val">{order.address}</div></div>
          </div>
        )}

        {/* Logistics */}
        {order.sr?.status === 'ok' && (
          <div className="det-section">
            <div className="det-section-title">Logistics</div>
            <div className="det-row"><div className="det-lbl">Shiprocket AWB</div><div className="det-val">{order.sr.awb}</div></div>
            <div className="det-row"><div className="det-lbl">Partner</div><div className="det-val">{order.sr.partner}</div></div>
            <div className="det-row"><div className="det-lbl">Pickup ETA</div><div className="det-val">{order.sr.eta}</div></div>
          </div>
        )}
        {order.sr?.status === 'manual' && (
          <div className="det-section">
            <div className="det-section-title">Logistics</div>
            <div className="det-row"><div className="det-lbl">Mode</div><div className="det-val">Manual Delivery</div></div>
            <div className="det-row"><div className="det-lbl">ETA</div><div className="det-val">{order.sr.eta}</div></div>
          </div>
        )}

        {/* Payment */}
        {order.paidAt && (
          <div className="det-section">
            <div className="det-section-title">Payment</div>
            <div className="det-row"><div className="det-lbl">Paid at</div><div className="det-val">{order.paidAt}</div></div>
            <div className="det-row"><div className="det-lbl">Method</div><div className="det-val">Razorpay (UPI)</div></div>
          </div>
        )}
      </div>

      <div className="cto-det-actions">
        <ActionButtons />
      </div>
    </div>
  );
}
