import useCreateFlowStore from '../../store/createFlowStore';
import CustomerStep from './CustomerStep';
import ProductsStep from './ProductsStep';
import SuccessStep from './SuccessStep';

export default function CTOCreateFlow() {
  const { isOpen, step, isGenerating } = useCreateFlowStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="ctoc-create-view">
        {step === 1 && <CustomerStep />}
        {(step === 2 || step === 3) && <ProductsStep />}
        {step === 4 && <SuccessStep />}
      </div>

      {isGenerating && (
        <div className="ctoc-loading-overlay">
          <div className="ctoc-loading-card">
            <div className="ctoc-loading-spinner" />
            <div className="ctoc-loading-title">Please wait...</div>
            <div className="ctoc-loading-sub">Sending payment link to customer</div>
          </div>
        </div>
      )}
    </>
  );
}
