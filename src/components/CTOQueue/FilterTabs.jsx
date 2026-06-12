import useCTOStore from '../../store/ctoStore';

const TABS = [
  { key: 'all',     label: 'All' },
  { key: 'unpaid',  label: 'Unpaid' },
  { key: 'paid',    label: 'Paid' },
  { key: 'transit', label: 'In Transit' },
];

export default function FilterTabs() {
  const { queueTab, setQueueTab } = useCTOStore();
  return (
    <div className="cto-filter-tabs">
      {TABS.map(t => (
        <button
          key={t.key}
          className={`cto-tab${queueTab === t.key ? ' active' : ''}`}
          onClick={() => setQueueTab(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
