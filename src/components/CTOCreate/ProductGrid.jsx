import useCreateFlowStore from '../../store/createFlowStore';
import { CATALOG } from '../../data/catalog';

const FALLBACK_IMG = 'https://cdn.licious.in/web-assets/images/LiciousPOSSmileyIcon.png';

export default function ProductGrid() {
  const { catFilter, searchQuery, cart, tapProduct } = useCreateFlowStore();
  const q = searchQuery.toLowerCase();

  const items = CATALOG.filter(p =>
    p.cat === catFilter &&
    (q === '' || p.name.toLowerCase().includes(q) || p.plu.includes(q))
  );

  if (items.length === 0) {
    return (
      <div className="ctoc-catalog-grid">
        <div style={{ gridColumn: '1/-1', padding: 40, textAlign: 'center', color: '#bbb', fontSize: 13 }}>
          No products found
        </div>
      </div>
    );
  }

  return (
    <div className="ctoc-catalog-grid">
      {items.map(p => {
        const inCart = cart.some(c => c.plu === p.plu);
        return (
          <div
            key={p.plu}
            className={`ctoc-prod-card${inCart ? ' in-cart' : ''}`}
            onClick={() => tapProduct(p.plu)}
          >
            <div className="ctoc-prod-img-wrap">
              <img
                className="ctoc-prod-img"
                src={p.img}
                alt={p.name}
                onError={e => { e.target.src = FALLBACK_IMG; }}
              />
              {inCart && <div className="ctoc-incart-badge">✓</div>}
            </div>
            <div className="ctoc-prod-info">
              <div className="ctoc-prod-plu">ID: {p.plu}</div>
              <div className="ctoc-prod-name">{p.name}</div>
              <div className="ctoc-prod-price">
                ₹{p.price}
                {p.uom === 'Kg' && <span className="ctoc-uom"> / KG</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
