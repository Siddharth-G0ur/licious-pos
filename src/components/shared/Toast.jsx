import useCTOStore from '../../store/ctoStore';

export default function Toast() {
  const toast = useCTOStore(s => s.toast);
  return (
    <div className={`toast${toast ? ' show' : ''}${toast?.isError ? ' error' : ''}`}>
      {toast?.text}
    </div>
  );
}
