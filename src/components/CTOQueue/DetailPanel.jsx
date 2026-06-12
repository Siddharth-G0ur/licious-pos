import useCTOStore from '../../store/ctoStore';
import OrderDetail from './OrderDetail';

export default function DetailPanel() {
  const { orders, selectedOrderId } = useCTOStore();
  const order = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="cto-detail-panel">
      {!order ? (
        <div className="cto-empty-state">
          <div className="cto-empty-icon">📋</div>
          <div className="cto-empty-text">Select an order to view details</div>
        </div>
      ) : (
        <OrderDetail order={order} />
      )}
    </div>
  );
}
