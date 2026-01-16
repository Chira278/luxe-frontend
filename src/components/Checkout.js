import React, { useState, useEffect } from 'react';
import { 
  createOrder, 
  validateCheckout, 
  calculateShipping, 
  calculateTax,
  processPayment,
  getPaymentMethods,
  validateCoupon
} from '../services/api';
import './Checkout.css';

function Checkout({ cart, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Customer Info
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  });
  
  // Billing Address
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState({});
  
  // Shipping Method
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  
  // Payment
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Pricing
  const [pricing, setPricing] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
  });
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setPricing(prev => ({ ...prev, subtotal }));
    loadPaymentMethods();
  }, [cart]);
  
  useEffect(() => {
    if (step === 3 && shippingAddress.state) {
      loadShippingOptions();
      loadTax();
    }
  }, [step, shippingAddress]);
  
  useEffect(() => {
    calculateTotal();
  }, [pricing.subtotal, pricing.shipping, pricing.tax, pricing.discount]);
  
  const loadPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods.filter(m => m.enabled));
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };
  
  const loadShippingOptions = async () => {
    try {
      const result = await calculateShipping(cart, shippingAddress);
      setShippingOptions(result.options);
      if (result.options.length > 0) {
        setSelectedShipping(result.options[0]);
        setPricing(prev => ({ ...prev, shipping: result.options[0].price }));
      }
    } catch (error) {
      console.error('Failed to load shipping options:', error);
    }
  };
  
  const loadTax = async () => {
    try {
      const result = await calculateTax(pricing.subtotal, shippingAddress);
      setPricing(prev => ({ ...prev, tax: result.taxAmount }));
    } catch (error) {
      console.error('Failed to calculate tax:', error);
    }
  };
  
  const calculateTotal = () => {
    const total = pricing.subtotal + pricing.shipping + pricing.tax - pricing.discount;
    setPricing(prev => ({ ...prev, total: parseFloat(total.toFixed(2)) }));
  };
  
  const handleApplyCoupon = async () => {
    try {
      setLoading(true);
      const result = await validateCoupon(couponCode, pricing.subtotal);
      setAppliedCoupon(result);
      setPricing(prev => ({ ...prev, discount: result.discount }));
      setError('');
    } catch (error) {
      setError(error.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setPricing(prev => ({ ...prev, discount: 0 }));
    } finally {
      setLoading(false);
    }
  };
  
  const handleNextStep = async () => {
    setError('');
    
    if (step === 1) {
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        setError('Please fill in all customer information');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
        setError('Please fill in all shipping address fields');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedShipping) {
        setError('Please select a shipping method');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      await handlePlaceOrder();
    }
  };
  
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate payment details
      if (selectedPayment === 'card') {
        if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
          setError('Please fill in all payment details');
          return;
        }
      }
      
      // Process payment
      const paymentResult = await processPayment(
        selectedPayment,
        paymentDetails,
        pricing.total
      );
      
      // Create order
      const order = await createOrder(
        'session_' + Date.now(),
        cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        customerInfo,
        shippingAddress,
        sameAsShipping ? shippingAddress : billingAddress,
        appliedCoupon?.code,
        paymentResult
      );
      
      onSuccess(order);
    } catch (error) {
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Contact</div>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Shipping</div>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Delivery</div>
          </div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Payment</div>
          </div>
        </div>
        
        <div className="checkout-content">
          {error && <div className="error-message">{error}</div>}
          
          {step === 1 && (
            <div className="checkout-step">
              <h3>Contact Information</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              />
            </div>
          )}
          
          {step === 2 && (
            <div className="checkout-step">
              <h3>Shipping Address</h3>
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
              />
              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={shippingAddress.apartment}
                onChange={(e) => setShippingAddress({...shippingAddress, apartment: e.target.value})}
              />
              <div className="form-row">
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={shippingAddress.zip}
                  onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                />
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="checkout-step">
              <h3>Shipping Method</h3>
              {shippingOptions.map(option => (
                <div
                  key={option.id}
                  className={`shipping-option ${selectedShipping?.id === option.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedShipping(option);
                    setPricing(prev => ({ ...prev, shipping: option.price }));
                  }}
                >
                  <div>
                    <div className="option-name">{option.name}</div>
                    <div className="option-description">{option.description}</div>
                  </div>
                  <div className="option-price">
                    {option.price === 0 ? 'FREE' : `$${option.price}`}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {step === 4 && (
            <div className="checkout-step">
              <h3>Payment Method</h3>
              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <span className="payment-icon">{method.icon}</span>
                    <span>{method.name}</span>
                  </div>
                ))}
              </div>
              
              {selectedPayment === 'card' && (
                <div className="card-details">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                    maxLength="19"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                  />
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                      maxLength="5"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                      maxLength="4"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="checkout-sidebar">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-quantity">Qty: {item.quantity}</div>
                </div>
                <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="coupon-section">
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button onClick={handleApplyCoupon} disabled={loading}>
              Apply
            </button>
          </div>
          
          {appliedCoupon && (
            <div className="applied-coupon">
              ✓ {appliedCoupon.code} applied
            </div>
          )}
          
          <div className="pricing-details">
            <div className="pricing-row">
              <span>Subtotal:</span>
              <span>${pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="pricing-row">
              <span>Shipping:</span>
              <span>{pricing.shipping === 0 ? 'FREE' : `$${pricing.shipping.toFixed(2)}`}</span>
            </div>
            <div className="pricing-row">
              <span>Tax:</span>
              <span>${pricing.tax.toFixed(2)}</span>
            </div>
            {pricing.discount > 0 && (
              <div className="pricing-row discount">
                <span>Discount:</span>
                <span>-${pricing.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pricing-row total">
              <span>Total:</span>
              <span>${pricing.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="checkout-actions">
            {step > 1 && (
              <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            <button
              className="btn-primary"
              onClick={handleNextStep}
              disabled={loading}
            >
              {loading ? 'Processing...' : step === 4 ? 'Place Order' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
