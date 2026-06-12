import useCTOStore from '../../store/ctoStore';

export default function CancelModal() {
  const { orders, cancelOrderId, cancelOrder, closeModal, showToast } = useCTOStore();
  if (!cancelOrderId) return null;

  const order = orders.find(o => o.id === cancelOrderId);
  if (!order) return null;

  function handleConfirm() {
    cancelOrder(cancelOrderId);
    showToast(`Order ${cancelOrderId} cancelled.`);
  }

  return (
    <div className="mini-modal-overlay" onClick={() => closeModal('cancel')}>
      <div className="mini-modal" onClick={e => e.stopPropagation()}>
        <div className="mini-modal-title">Cancel Order</div>
        <div className="mini-modal-desc">
          Cancel order {cancelOrderId} for {order.fullPhone}? A refund will be initiated if already paid.
        </div>
        <div className="mini-modal-actions">
          <button className="btn-act-secondary" onClick={() => closeModal('cancel')}>Keep Order</button>
          <button className="btn-act-danger" onClick={handleConfirm}>Yes, Cancel</button>
        </div>
      </div>
    </div>
  );
}
