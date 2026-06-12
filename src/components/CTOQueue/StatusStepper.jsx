import { STATUS_FLOW } from '../../utils/helpers';

export default function StatusStepper({ status }) {
  const mapped = status === 'Payment Pending' ? 'Link Sent' : status;
  const idx = STATUS_FLOW.indexOf(mapped);

  return (
    <div className="status-stepper">
      {STATUS_FLOW.map((s, i) => {
        const done = i < idx;
        const cur = i === idx;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div className="st-step">
              <div className={`st-dot ${done ? 'done' : cur ? 'cur' : ''}`} />
              <div className={`st-label ${done ? 'done' : cur ? 'cur' : ''}`}>
                {s.replace(' for ', ' ')}
              </div>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div className={`st-line ${done ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
