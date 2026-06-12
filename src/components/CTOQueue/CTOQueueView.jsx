import NavBar from './NavBar';
import QueuePanel from './QueuePanel';
import DetailPanel from './DetailPanel';

export default function CTOQueueView() {
  return (
    <div className="content" style={{ display: 'flex' }}>
      <NavBar />
      <QueuePanel />
      <DetailPanel />
    </div>
  );
}
