import { useEffect } from 'react';
import Header from './components/Header/Header';
import CTOQueueView from './components/CTOQueue/CTOQueueView';
import CTOCreateFlow from './components/CTOCreate/CTOCreateFlow';
import CancelModal from './components/shared/CancelModal';
import ManualDeliveryModal from './components/shared/ManualDeliveryModal';
import HandoverModal from './components/shared/HandoverModal';
import Toast from './components/shared/Toast';
import useCreateFlowStore from './store/createFlowStore';

export default function App() {
  const open = useCreateFlowStore(s => s.open);

  // HTML version opens directly to the create flow (Customer Detail) on load
  useEffect(() => {
    open();
  }, []);

  return (
    <>
      <Header />
      <div className="layout">
        <CTOQueueView />
      </div>
      <CTOCreateFlow />
      <CancelModal />
      <ManualDeliveryModal />
      <HandoverModal />
      <Toast />
    </>
  );
}
