import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { markOrderAsPaid, getOrderById } from "../services/orderService";
import "../styles/paymentPageStyles.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [form, setForm] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateCardNumber = (num) => {
    const sanitized = num.replace(/\D/g, "");
    let sum = 0;
    let shouldDouble = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const validateForm = () => {
    const { name, email, cardNumber, expiry, cvv } = form;
    if (!name || !email || !cardNumber || !expiry || !cvv) {
      setMessage("All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email.");
      return false;
    }

    if (!validateCardNumber(cardNumber)) {
      setMessage("Invalid card number.");
      return false;
    }

    const expiryMatch = expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
    if (!expiryMatch) {
      setMessage("Expiry must be MM/YY.");
      return false;
    }

    const [mm, yy] = expiry.split("/").map(Number);
    const now = new Date();
    const expDate = new Date(2000 + yy, mm);
    if (expDate < now) {
      setMessage("Card expired.");
      return false;
    }

    if (!/^\d{3}$/.test(cvv)) {
      setMessage("CVV must be 3 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await markOrderAsPaid(orderId);
      const order = await getOrderById(orderId);
      setOrderDetails(order);
      setShowPopup(true);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to process payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    navigate("/products");
  };

  return (
    <div className="pay-page">
      <h2>Secure Payment</h2>
      <form className="pay-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number (XXXX XXXX XXXX XXXX)"
          maxLength="19"
          value={form.cardNumber}
          onChange={(e) =>
            handleChange({
              target: {
                name: "cardNumber",
                value: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim(),
              },
            })
          }
        />
        <div className="pay-row">
          <input type="text" name="expiry" placeholder="MM/YY" maxLength="5" value={form.expiry} onChange={handleChange} />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            maxLength="3"
            value={form.cvv}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "cvv",
                  value: e.target.value.replace(/\D/g, ""),
                },
              })
            }
          />
        </div>

        {loading ? <div className="pay-spinner" /> : <button type="submit" className="pay-btn">Pay Now</button>}
        {message && <p className="pay-message">{message}</p>}
      </form>

      {showPopup && orderDetails && (
        <div className="pay-popup">
          <div className="pay-popup-content">
            <button className="pay-close-btn" onClick={handleClosePopup}>×</button>
            <h3>Payment Successful</h3>
            <p>Your order <strong>#{orderDetails._id}</strong> has been placed successfully.</p>

            <h4>Shipping To:</h4>
            <p>
              {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}<br />
              {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.country}
            </p>

            <h4>Order Summary</h4>
            {orderDetails.bakerOrders.map((bo, i) => (
              <div key={i} className="pay-baker-order">
                <h5>Baker: {bo.baker.name}</h5>
                <ul>
                  {bo.products.map((p, j) => (
                    <li key={j}>
                      {p.product.name} - {p.quantity} x LKR {p.price.toLocaleString()}
                    </li>
                  ))}
                </ul>
                <p><strong>Subtotal:</strong> LKR {bo.subtotal.toLocaleString()}</p>
              </div>
            ))}
            <p><strong>Total:</strong> LKR {orderDetails.totalPrice.toLocaleString()}</p>

            <button className="pay-done-btn" onClick={handleClosePopup}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;