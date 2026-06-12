import useCTOStore from '../../store/ctoStore';

const STAGES = [
  { status: 'Packing',          label: 'Order getting packed' },
  { status: 'Out for Delivery', label: 'Out for delivery' },
  { status: 'Delivered',        label: 'Delivered' },
];

const STATUS_ORDER = ['Payment Pending', 'Paid', 'Packing', 'Out for Delivery', 'Delivered'];

export default function SimulatorPanel({ orderId, currentStatus }) {
  const advanceStatus = useCTOStore(s => s.advanceStatus);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      background: 'rgba(18,18,24,0.92)',
      backdropFilter: 'blur(10px)',
      borderRadius: 16,
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
      border: '1px solid rgba(255,255,255,0.08)',
      maxWidth: '95vw',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 1, textTransform: 'uppercase' }}>
          Simulate
        </span>
      </div>

      {STAGES.map(({ status, label }) => {
        const stageIdx = STATUS_ORDER.indexOf(status);
        const isDone = currentIdx >= stageIdx;
        const isNext = stageIdx === currentIdx + 1 || (currentIdx < 1 && stageIdx === 2);

        return (
          <button
            key={status}
            onClick={() => advanceStatus(orderId, status)}
            disabled={isDone}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 14px',
              borderRadius: 10,
              border: 'none',
              cursor: isDone ? 'default' : 'pointer',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 0.15s',
              background: isDone
                ? 'rgba(255,255,255,0.06)'
                : isNext
                  ? '#c8102e'
                  : 'rgba(255,255,255,0.10)',
              color: isDone
                ? 'rgba(255,255,255,0.25)'
                : '#fff',
              textDecoration: isDone ? 'line-through' : 'none',
            }}
          >
            <span>{label}</span>
            {isDone && <span style={{ fontSize: 11, opacity: 0.5 }}>&#10003;</span>}
          </button>
        );
      })}
    </div>
  );
}
