import React from 'react';

function CartSidebar({ cart, isOpen, onClose, onUpdateQuantity, onRemove, onCheckout }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>Shopping Cart</h3>
        <button className="close-cart" onClick={onClose}>✕</button>
      </div>
      
      <div className="cart-items">
        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            Your cart is empty
          </p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">${item.price}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    style={{
                      padding: '0.3rem 0.8rem',
                      background: 'var(--card-bg)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-primary)',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0.3rem 0.8rem' }}>{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    style={{
                      padding: '0.3rem 0.8rem',
                      background: 'var(--card-bg)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-primary)',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    style={{
                      padding: '0.3rem 0.8rem',
                      background: '#ff4444',
                      border: 'none',
                      color: 'white',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginLeft: 'auto'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="cart-total">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <strong>Total:</strong>
            <strong className="total-amount">${total.toFixed(2)}</strong>
          </div>
          <button className="checkout-btn" onClick={onCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default CartSidebar;
