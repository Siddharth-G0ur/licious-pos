import useCreateFlowStore from '../../store/createFlowStore';
import { calcTotals } from '../../utils/helpers';

export default function CartPanel() {
  const { step, cart, removeFromCart, clearCart, updateCartWeight, proceedToPayment } = useCreateFlowStore();
  const t = calcTotals(cart);
  const isPayStep = step === 3;

  return (
    <div className="ctoc-cart-section">
      <div className="ctoc-cart-hdr">
        <div className="ctoc-step-indicator">
          <div className={`ctoc-step-dot${isPayStep ? ' done' : ' active'}`}>
            {isPayStep ? '✓' : '1'}
          </div>
          <div className={`ctoc-step-line${isPayStep ? ' done' : ''}`} />
          <div className={`ctoc-step-dot${isPayStep ? ' active' : ''}`}>2</div>
        </div>
        <div className="ctoc-cart-title-row">
          <span className="ctoc-cart-title">{isPayStep ? 'Order Payment' : 'New Order'}</span>
          {!isPayStep && (
            <button className="ctoc-clear-cart" onClick={clearCart}>Clear Cart</button>
          )}
        </div>
      </div>

      {isPayStep ? (
        <PaymentView totals={t} />
      ) : (
        <CartView
          cart={cart}
          totals={t}
          removeFromCart={removeFromCart}
          updateCartWeight={updateCartWeight}
          proceedToPayment={proceedToPayment}
        />
      )}
    </div>
  );
}

function CartView({ cart, totals, removeFromCart, updateCartWeight, proceedToPayment }) {
  return (
    <>
      <div className="ctoc-cart-items">
        {cart.length === 0 ? (
          <div className="ctoc-cart-empty">
            <img src="/icons/QRScanIcon.svg" style={{ width: 32, height: 32, opacity: 0.4 }} alt="" />
            <div>Scan barcode to add items</div>
          </div>
        ) : (
          cart.map(ci => (
            <div key={ci.plu} className="ctoc-cart-item">
              <div className="ctoc-cart-item-body">
                <div className="ctoc-cart-item-name">{ci.name}</div>
                <div className="ctoc-cart-item-meta">
                  {ci.uom === 'Kg' ? (
                    <>
                      <span className="ctoc-wgt-lbl">Wgt:</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>{ci.qty.toFixed(3)}</span>
                      <span className="ctoc-wgt-unit">KG</span>
                    </>
                  ) : (
                    <>
                      <span className="ctoc-wgt-lbl">Qty:</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>{ci.qty}</span>
                      <span className="ctoc-wgt-unit">pc</span>
                    </>
                  )}
                </div>
              </div>
              <div className="ctoc-cart-item-right">
                <span className="ctoc-item-price">₹{Math.round(ci.price * ci.qty)}</span>
                <button className="ctoc-delete-btn" onClick={() => removeFromCart(ci.plu)}>
                  <img src="/icons/deleteIcon.svg" style={{ width: 16, height: 16, opacity: 0.5 }} alt="✕" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="ctoc-cart-footer">
        <div className="ctoc-cart-totals">
          <div>No. of Items: {cart.length}</div>
          <div>Incl. shipping: ₹{totals.delivery}</div>
          <div className="ctoc-cart-grand">
            Total: <span className="ctoc-total-amt">₹{totals.total}</span>
          </div>
        </div>
        <button
          className="ctoc-proceed-btn"
          disabled={cart.length === 0}
          onClick={proceedToPayment}
        >
          Proceed to pay
        </button>
      </div>
    </>
  );
}

function PaymentView({ totals }) {
  const { orderType, generateLink, proceedToAddress } = useCreateFlowStore();
  const isInStore = orderType === 'remote2';
  return (
    <>
      <div className="ctoc-payment-body">
        <div className="ctoc-bill-summary">
          <div className="ctoc-bill-title">Bill Summary</div>
          <div className="ctoc-bill-row">
            <span>Item total</span><span>₹{totals.subtotal}</span>
          </div>
          <div className="ctoc-bill-row">
            <span>Shipping Charges</span><span>₹{totals.delivery}</span>
          </div>
          <div className="ctoc-bill-divider" />
          <div className="ctoc-bill-row ctoc-bill-total">
            <span>To be paid</span><span>₹{totals.total}</span>
          </div>
        </div>
      </div>
      <div className="ctoc-payment-footer">
        <div>
          <div className="ctoc-net-lbl">Net Payable Amt:</div>
          <div className="ctoc-net-amt">₹{totals.total}</div>
        </div>
        {isInStore ? (
          <button className="ctoc-pay-btn" onClick={proceedToAddress}>
            Add Delivery Address
          </button>
        ) : (
          <button className="ctoc-pay-btn" onClick={generateLink}>
            Proceed to Pay
            <div className="ctoc-pay-sublabel">(Via send link)</div>
          </button>
        )}
      </div>
    </>
  );
}
