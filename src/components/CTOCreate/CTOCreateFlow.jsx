import useCreateFlowStore from '../../store/createFlowStore';
import CustomerStep from './CustomerStep';
import ProductsStep from './ProductsStep';
import AddressDeliveryStep from './AddressDeliveryStep';
import SuccessStep from './SuccessStep';

export default function CTOCreateFlow() {
  const { isOpen, step, orderType, isGenerating } = useCreateFlowStore();

  if (!isOpen) return null;

  const isInStore = orderType === 'remote2';
  // Remote:   1 → 2/3 → 4 (success)
  // In-store: 1 → 2/3 → 4 (address+delivery) → 5 (WA success)
  const showAddress = isInStore && step === 4;
  const showSuccess = isInStore ? step === 5 : step === 4;

  return (
    <>
      <div className="ctoc-create-view">
        {step === 1 && <CustomerStep />}
        {(step === 2 || step === 3) && <ProductsStep />}
        {showAddress && <AddressDeliveryStep />}
        {showSuccess && <SuccessStep />}
      </div>

      {isGenerating && (
        <div className="ctoc-loading-overlay">
          <div className="ctoc-loading-card">
            <div className="ctoc-loading-spinner" />
            <div className="ctoc-loading-title">Please wait...</div>
            <div className="ctoc-loading-sub">
              {isInStore ? 'Creating order & booking delivery…' : 'Sending payment link to customer'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
