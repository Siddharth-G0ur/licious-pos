import { statusBadgeClass } from '../../utils/helpers';

export default function StatusBadge({ status }) {
  return <span className={`sbadge ${statusBadgeClass(status)}`}>{status}</span>;
}
