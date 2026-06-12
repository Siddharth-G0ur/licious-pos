import useCreateFlowStore from '../../store/createFlowStore';
import CategoryTabs from './CategoryTabs';
import ProductGrid from './ProductGrid';
import CartPanel from './CartPanel';
import WeightModal from './WeightModal';

export default function ProductsStep() {
  const { phone, searchQuery, setSearchQuery, close } = useCreateFlowStore();

  return (
    <div className="ctoc-products-page" style={{ position: 'relative' }}>
      {/* Subheader */}
      <div className="ctoc-prod-subhdr">
        <div className="ctoc-cust-meta">
          <div className="ctoc-meta-item">
            <div className="ctoc-meta-lbl">Customer Phone No</div>
            <div className="ctoc-meta-val">{phone || 'Guest'}</div>
          </div>
          <div className="ctoc-meta-divider" />
          <div className="ctoc-meta-item">
            <div className="ctoc-meta-lbl">Customer Name</div>
            <div className="ctoc-meta-val" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <img src="/icons/EditPencil.svg" style={{ width: 13, height: 13 }} alt="" />
              New User
            </div>
          </div>
          <div className="ctoc-meta-divider" />
          <div className="ctoc-meta-item">
            <div className="ctoc-meta-lbl">Token no</div>
            <input className="ctoc-token-input" type="text" maxLength={4} />
          </div>
        </div>
        <div className="ctoc-prod-actions">
          <button className="ctoc-order-hist-btn">
            <img src="/icons/OrderHistoryIcon.svg" style={{ width: 15, height: 15 }} alt="" />
            Order History
          </button>
          <button className="ctoc-abort-btn" onClick={close}>
            <img src="/icons/RedCrossIcon.svg" style={{ width: 13, height: 13 }} alt="" />
            Abort Order
          </button>
        </div>
      </div>

      {/* Body: catalog + cart */}
      <div className="ctoc-prod-body">
        <div className="ctoc-catalog-section">
          <div className="ctoc-catalog-hdr">
            <span className="ctoc-all-items">All Items</span>
            <div className="ctoc-search-wrap">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="ctoc-search-input"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CategoryTabs />
          <ProductGrid />
        </div>
        <CartPanel />
      </div>

      {/* Modals */}
      <WeightModal />
    </div>
  );
}
