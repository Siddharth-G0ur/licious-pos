import { useState, useRef } from 'react';
import useCTOStore from '../../store/ctoStore';

const DEMO_OTP = '1234';

export default function HandoverModal() {
  const { handoverOrderId, advanceStatus, closeModal, showToast } = useCTOStore();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const refs = [useRef(), useRef(), useRef(), useRef()];

  if (!handoverOrderId) return null;

  function handleInput(idx, val) {
    const d = val.replace(/\D/g, '').slice(0, 1);
    const next = [...digits];
    next[idx] = d;
    setDigits(next);
    setError('');
    if (d && idx < 3) refs[idx + 1].current?.focus();
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs[idx - 1].current?.focus();
    }
  }

  function handleVerify() {
    const entered = digits.join('');
    if (entered !== DEMO_OTP) {
      setError('Incorrect OTP. Try 1234 for demo.');
      return;
    }
    const orderId = handoverOrderId;
    closeModal('handover');
    setDigits(['', '', '', '']);
    setError('');
    advanceStatus(orderId, 'Out for Delivery');
    showToast('Handover confirmed — order is out for delivery');
  }

  const allFilled = digits.every(d => d !== '');

  return (
    <div className="mini-modal-overlay" onClick={() => { closeModal('handover'); setDigits(['','','','']); setError(''); }}>
      <div className="mini-modal" onClick={e => e.stopPropagation()}>
        <div className="mini-modal-title">Confirm Handover to Delivery</div>
        <div className="mini-modal-desc" style={{ marginBottom: 16 }}>
          Enter the 4-digit OTP to confirm handover. (Demo OTP: 1234)
        </div>
        <div className="otp-input-row">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              className="otp-digit"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              autoFocus={i === 0}
            />
          ))}
        </div>
        {error && <div className="otp-error">{error}</div>}
        <div className="mini-modal-actions">
          <button className="btn-act-secondary" onClick={() => { closeModal('handover'); setDigits(['','','','']); setError(''); }}>
            Cancel
          </button>
          <button className="btn-act-primary" disabled={!allFilled} onClick={handleVerify}>
            Verify & Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
