import StatusBadge from '../shared/StatusBadge';
import { getStageLine } from '../../utils/helpers';

export default function OrderCard({ order, selected, onClick }) {
  const hasFail = order.sr?.status === 'failed';

  return (
    <div
      className={`cto-card${selected ? ' sel' : ''}${hasFail ? ' has-alert' : ''}`}
      onClick={onClick}
    >
      <div className="cto-card-r1">
        <span className="cto-card-id">{order.id}</span>
        <StatusBadge status={order.status} />
      </div>
      <div className="cto-card-r2">
        <span className="cto-card-phone">{order.fullPhone}</span>
        <span className="cto-card-value">₹{order.value.toLocaleString('en-IN')}</span>
      </div>
      <div className="cto-card-meta">{getStageLine(order)}</div>
      {hasFail && (
        <div className="cto-card-alert">⚠ Shiprocket booking failed</div>
      )}
    </div>
  );
}
