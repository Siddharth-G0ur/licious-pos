import { useState } from 'react';

export default function DeliveredScreen({ order }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [liked, setLiked] = useState('');
  const [disliked, setDisliked] = useState('');
  const [done, setDone] = useState(false);

  const displayed = hovered || rating;

  return (
    <div className="ms-delivered">
      <div className="ms-delivered-icon-wrap">
        <div className="ms-delivered-check" />
      </div>
      <div className="ms-delivered-title">Delivered!</div>
      <div className="ms-delivered-divider" />
      <div className="ms-delivered-sub">
        Your order was delivered successfully. Thank you for shopping with Licious!
      </div>

      <div className="ms-delivered-items">
        <div className="ms-delivered-items-title">What you ordered</div>
        {order.items.map((item, i) => (
          <div key={i} className="ms-item-row">
            <div>
              <div className="ms-item-name">{item.name}</div>
              <div className="ms-item-qty">{item.qty}</div>
            </div>
            <div className="ms-item-price">&#8377;{item.price.toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>

      {!done ? (
        <div className="ms-feedback-section">
          <div className="ms-feedback-label">Rate your experience</div>
          <div className="ms-rating">
            {[1, 2, 3, 4, 5].map(s => (
              <span
                key={s}
                className={`ms-rating-star ${s <= displayed ? 'selected' : ''}`}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
              >
                &#9733;
              </span>
            ))}
          </div>

          {rating > 0 && (
            <div className="ms-feedback-form">
              {rating > 3 ? (
                <div className="ms-feedback-field">
                  <label className="ms-feedback-field-label">What did you like?</label>
                  <textarea
                    className="ms-feedback-textarea"
                    placeholder="Freshness, packaging, delivery speed..."
                    value={liked}
                    onChange={e => setLiked(e.target.value)}
                    rows={3}
                  />
                </div>
              ) : (
                <div className="ms-feedback-field">
                  <label className="ms-feedback-field-label">What could be better?</label>
                  <textarea
                    className="ms-feedback-textarea"
                    placeholder="Let us know how we can improve..."
                    value={disliked}
                    onChange={e => setDisliked(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
              <button className="ms-feedback-done-btn" onClick={() => setDone(true)}>
                Mark as Done
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="ms-feedback-thanks">
          <div className="ms-feedback-thanks-title">Thank you for your feedback!</div>
          <div className="ms-feedback-thanks-sub">Your response helps us serve you better.</div>
        </div>
      )}

      <img src="/icons/LiciousLogo.svg" style={{ height: 18, marginTop: 16, opacity: 0.4 }} alt="Licious" />
    </div>
  );
}
