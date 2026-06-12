import { useRef } from 'react';
import useCTOStore from '../../store/ctoStore';

export default function ManualDeliveryModal() {
  const { manualOrderId, setManualDelivery, closeModal, showToast } = useCTOStore();
  const inputRef = useRef(null);

  if (!manualOrderId) return null;

  function handleConfirm() {
    const eta = inputRef.current?.value.trim();
    if (!eta) return;
    setManualDelivery(manualOrderId, eta);
    showToast(`Manual delivery set — ETA ${eta}`);
  }

  return (
    <div className="mini-modal-overlay" onClick={() => closeModal('manual')}>
      <div className="mini-modal" onClick={e => e.stopPropagation()}>
        <div className="mini-modal-title">Set Manual Delivery ETA</div>
        <div className="mini-modal-desc">Enter the expected delivery time for this order.</div>
        <input
          ref={inputRef}
          className="mini-modal-input"
          placeholder="e.g. 2:30 PM"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
        />
        <div className="mini-modal-actions">
          <button className="btn-act-secondary" onClick={() => closeModal('manual')}>Cancel</button>
          <button className="btn-act-primary" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
