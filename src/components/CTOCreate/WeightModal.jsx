import { useState, useEffect, useRef } from 'react';
import useCreateFlowStore from '../../store/createFlowStore';
import { CATALOG } from '../../data/catalog';

export default function WeightModal() {
  const { weightModalPlu, cart, confirmWeight, closeWeightModal } = useCreateFlowStore();
  const [weightStr, setWeightStr] = useState('1');
  const inputRef = useRef(null);

  const prod = weightModalPlu ? CATALOG.find(p => p.plu === weightModalPlu) : null;
  const existing = weightModalPlu ? cart.find(c => c.plu === weightModalPlu) : null;

  useEffect(() => {
    if (weightModalPlu) {
      const initial = existing ? existing.qty.toFixed(3) : '1';
      setWeightStr(initial);
      setTimeout(() => { inputRef.current?.select(); }, 60);
    }
  }, [weightModalPlu]);

  if (!weightModalPlu || !prod) return null;

  const n = parseFloat(weightStr);
  const valid = !isNaN(n) && n > 0;
  const livePrice = valid ? `₹${(prod.price * n).toFixed(2)}` : '';

  function handleConfirm() {
    if (!valid) return;
    confirmWeight(n);
    setWeightStr('1');
  }

  return (
    <div className="ctoc-wt-overlay" onClick={closeWeightModal}>
      <div className="ctoc-wt-modal" onClick={e => e.stopPropagation()}>
        <div className="ctoc-wt-hdr">
          <div>
            <div className="ctoc-wt-title">Add weight</div>
            <div className="ctoc-wt-plu">ID: {prod.plu}</div>
          </div>
          <button className="ctoc-wt-close" onClick={closeWeightModal}>
            <img src="/icons/RedCrossIcon.svg" style={{ width: 16, height: 16 }} alt="✕" />
          </button>
        </div>
        <div className="ctoc-wt-product">
          <img
            className="ctoc-wt-img"
            src={prod.img}
            alt={prod.name}
            onError={e => { e.target.style.background = '#eee'; }}
          />
          <div>
            <div className="ctoc-wt-name">{prod.name}</div>
            <div className="ctoc-wt-rate">₹{prod.price} /KG</div>
          </div>
        </div>
        <div className="ctoc-wt-body">
          <label className="ctoc-wt-lbl">Enter weight in KG:</label>
          <div className="ctoc-wt-input-row">
            <input
              ref={inputRef}
              className="ctoc-wt-input"
              type="number"
              min="0.001"
              step="0.001"
              placeholder="0.000"
              value={weightStr}
              onChange={e => setWeightStr(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConfirm()}
            />
            <span className="ctoc-wt-kg">KG</span>
          </div>
          <div className="ctoc-wt-price">{livePrice}</div>
        </div>
        <button className="ctoc-wt-confirm" disabled={!valid} onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}
