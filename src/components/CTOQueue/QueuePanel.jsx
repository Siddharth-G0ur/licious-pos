import useCTOStore from '../../store/ctoStore';
import FilterTabs from './FilterTabs';
import OrderCard from './OrderCard';

function filterOrders(orders, tab) {
  if (tab === 'unpaid') return orders.filter(o => ['Link Sent', 'Link Opened', 'Payment Pending'].includes(o.status));
  if (tab === 'paid')   return orders.filter(o => ['Paid', 'Packing', 'Ready for Pickup'].includes(o.status));
  if (tab === 'transit')return orders.filter(o => o.status === 'Out for Delivery');
  return orders;
}

export default function QueuePanel() {
  const { orders, queueTab, selectedOrderId, selectOrder } = useCTOStore();
  const filtered = filterOrders(orders, queueTab);

  return (
    <div className="cto-queue-panel">
      <div className="cto-queue-hdr">
        <div className="cto-queue-title">CTO Orders</div>
      </div>
      <FilterTabs />
      <div className="cto-queue-list">
        {filtered.map(o => (
          <OrderCard
            key={o.id}
            order={o}
            selected={o.id === selectedOrderId}
            onClick={() => selectOrder(o.id)}
          />
        ))}
      </div>
    </div>
  );
}
