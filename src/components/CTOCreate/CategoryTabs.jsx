import useCreateFlowStore from '../../store/createFlowStore';
import { CATEGORY_DATA } from '../../data/categories';

export default function CategoryTabs() {
  const { catFilter, setCatFilter } = useCreateFlowStore();
  return (
    <div className="ctoc-cat-tabs">
      {CATEGORY_DATA.map(c => (
        <div
          key={c.name}
          className={`ctoc-cat-tab${catFilter === c.name ? ' active' : ''}`}
          onClick={() => setCatFilter(c.name)}
        >
          <img
            className="ctoc-cat-img"
            src={c.img}
            alt={c.name}
            onError={e => { e.target.style.background = '#eee'; }}
          />
          <span>{c.name}</span>
        </div>
      ))}
    </div>
  );
}
