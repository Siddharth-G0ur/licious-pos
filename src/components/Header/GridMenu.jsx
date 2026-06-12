import { useState, useEffect, useRef } from 'react';
import useCreateFlowStore from '../../store/createFlowStore';

export default function GridMenu() {
  const [open, setOpen] = useState(false);
  const closeCreateFlow = useCreateFlowStore(s => s.close);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function goToOrderHistory() {
    setOpen(false);
    closeCreateFlow(); // closes create flow overlay → reveals CTO queue behind it
  }

  return (
    <div className="grid-menu-wrap" ref={wrapRef}>
      <button className="grid-menu-btn" onClick={() => setOpen(o => !o)}>
        {Array.from({ length: 9 }).map((_, i) => <span key={i} />)}
      </button>
      {open && (
        <div className="grid-menu-dropdown">
          <button className="grid-menu-item" onClick={() => setOpen(false)}>
            <img src="/icons/InventoryPageIcon.svg" className="grid-menu-icon" style={{ width: 28, height: 28 }} alt="" />
            Inventory
          </button>
          <button className="grid-menu-item" onClick={goToOrderHistory}>
            <img src="/icons/OrderHistoryIcon.svg" className="grid-menu-icon" style={{ width: 28, height: 28 }} alt="" />
            Order History
          </button>
        </div>
      )}
    </div>
  );
}
