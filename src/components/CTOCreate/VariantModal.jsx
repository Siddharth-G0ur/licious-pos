import { useState, useEffect } from 'react';
import useCreateFlowStore from '../../store/createFlowStore';
import { CATALOG } from '../../data/catalog';
import { VARIANT_GROUPS } from '../../data/categories';

export default function VariantModal() {
  const { variantModal, confirmVariants, closeVariantModal } = useCreateFlowStore();
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    if (variantModal) {
      const initial = {};
      VARIANT_GROUPS[variantModal.groupId]?.forEach(plu => { initial[plu] = ''; });
      setInputs(initial);
    }
  }, [variantModal]);

  if (!variantModal) return null;

  const { triggerPlu, weight, groupId } = variantModal;
  const plus = VARIANT_GROUPS[groupId] || [];
  const anySelected = Object.values(inputs).some(v => parseFloat(v) > 0);

  function handleRadio(plu) {
    const next = {};
    plus.forEach(p => { next[p] = p === plu ? weight.toFixed(3) : ''; });
    setInputs(next);
  }

  function handleInput(plu, val) {
    setInputs(prev => ({ ...prev, [plu]: val }));
  }

  function handleConfirm() {
    const selections = plus.map(plu => ({ plu, qty: parseFloat(inputs[plu] || '') }));
    confirmVariants(selections);
  }

  return (
    <div className="ctoc-variant-overlay" onClick={closeVariantModal}>
      <div className="ctoc-variant-modal" onClick={e => e.stopPropagation()}>
        <div className="ctoc-variant-hdr">
          <span className="ctoc-variant-title">Choose product type</span>
          <button className="ctoc-variant-close" onClick={closeVariantModal}>
            <img src="/icons/RedCrossIcon.svg" style={{ width: 18, height: 18 }} alt="✕" />
          </button>
        </div>
        <div className="ctoc-variant-total-bar">
          <span>Total weight in KG</span>
          <span className="ctoc-variant-total-val">{weight.toFixed(3)} KG</span>
        </div>
        <div className="ctoc-variant-cols">
          {plus.map(plu => {
            const p = CATALOG.find(x => x.plu === plu);
            if (!p) return null;
            return (
              <div key={plu} className="ctoc-variant-col">
                <div className="ctoc-variant-prod-name">{p.name}</div>
                <img
                  className="ctoc-variant-prod-img"
                  src={p.img}
                  alt={p.name}
                  onError={e => { e.target.src = 'https://via.placeholder.com/72x72?text=?'; }}
                />
                <span className="ctoc-variant-wgt-lbl">Enter Weight in KG</span>
                <input
                  className="ctoc-variant-wgt-input"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={inputs[plu] || ''}
                  onChange={e => handleInput(plu, e.target.value)}
                />
                <span className="ctoc-variant-or">(or)</span>
                <label className="ctoc-variant-radio-label">
                  <input
                    type="radio"
                    name="variant-radio"
                    checked={parseFloat(inputs[plu]) === weight}
                    onChange={() => handleRadio(plu)}
                  />
                  {p.name} {weight.toFixed(3)} KG
                </label>
              </div>
            );
          })}
        </div>
        <div className="ctoc-variant-footer">
          <button className="ctoc-variant-confirm" disabled={!anySelected} onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
