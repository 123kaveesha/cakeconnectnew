import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    // Generate order ID
    setOrderId('ORD-' + Date.now().toString().slice(-8));
  }, []);

  // Calculate order totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryOption === 'delivery' ? 500 : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app, you would send this data to your backend
    const orderData = {
      orderId,
      customer,
      items: cart,
      deliveryOption,
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      date: new Date().toISOString()
    };

    // Simulate API call
    try {
      console.log('Order submitted:', orderData);
      
      // Simulate SMS notification
      if (customer.phone) {
        console.log(`SMS sent to ${customer.phone}: Your order #${orderId} has been received. Total: LKR ${total.toLocaleString()}`);
      }
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Show success
      setOrderSuccess(true);
      
      // In a real app, you might redirect to order confirmation page
      // navigate(`/order-confirmation/${orderId}`);
      
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <img src="/images/empty-cart.svg" alt="Empty cart" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items yet</p>
          <button onClick={() => navigate('/browse')} className="browse-btn">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="order-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p className="order-id">Your Order ID: <strong>{orderId}</strong></p>
          <p>Thank you for your purchase. We've sent the details to {customer.phone}.</p>
          <p>Our team will contact you shortly to confirm your order.</p>
          <button onClick={() => navigate('/browse')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p className="order-id">Order ID: {orderId}</p>
        </div>

        <div className="checkout-grid">
          <div className="customer-details">
            <h2>Customer Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customer.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={customer.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={customer.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Order Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={customer.notes}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <h2>Delivery Method</h2>
              <div className="delivery-options">
                <label className="delivery-option">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryOption === 'delivery'}
                    onChange={() => setDeliveryOption('delivery')}
                  />
                  <div className="option-content">
                    <span className="option-title">Home Delivery</span>
                    <span className="option-price">LKR 500.00</span>
                    <span className="option-desc">We'll deliver to your address</span>
                  </div>
                </label>

                <label className="delivery-option">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryOption === 'pickup'}
                    onChange={() => setDeliveryOption('pickup')}
                  />
                  <div className="option-content">
                    <span className="option-title">Store Pickup</span>
                    <span className="option-price">FREE</span>
                    <span className="option-desc">Pick up from our bakery</span>
                  </div>
                </label>
              </div>

              <h2>Payment Method</h2>
              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                  />
                  <div className="method-content">
                    <span className="method-title">Cash on Delivery</span>
                    <span className="method-desc">Pay when you receive your order</span>
                  </div>
                </label>

                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="method-content">
                    <span className="method-title">Credit/Debit Card</span>
                    <span className="method-desc">Pay securely with your card</span>
                  </div>
                </label>

                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'dialog'}
                    onChange={() => setPaymentMethod('dialog')}
                  />
                  <div className="method-content">
                    <span className="method-title">Dialog eZ Cash</span>
                    <span className="method-desc">Pay via Dialog mobile payment</span>
                  </div>
                </label>

                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'mcb'}
                    onChange={() => setPaymentMethod('mcb')}
                  />
                  <div className="method-content">
                    <span className="method-title">MCB FriMi</span>
                    <span className="method-desc">Pay via MCB mobile banking</span>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardName">Name on Card *</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={cardDetails.cardName}
                      onChange={handleCardChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiry">Expiry Date *</label>
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV *</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">× {item.quantity}</span>
                  </div>
                  <div className="item-price">LKR {(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee</span>
                <span>LKR {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>LKR {total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="place-order-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>

            <p className="secure-checkout">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M12,11.99h7c-0.53,4.12-3.28,7.79-7,8.94V12H5V6.3l7-3.11V11.99z"/>
              </svg>
              Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;