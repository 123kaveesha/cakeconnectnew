import React, { useEffect, useState } from "react";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService";
import { placeOrder } from "../services/orderService";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cartPageStyles.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const deliveryFee = 300;

  const loadCart = async () => {
    try {
      const res = await fetchCart();
      setCartItems(res.items || []);
    } catch (err) {
      console.error("Failed to fetch cart", err.message);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    try {
      await updateCartItem(productId, quantity);
      loadCart();
    } catch (err) {
      console.error("Failed to update quantity", err.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(productId);
      loadCart();
    } catch (err) {
      console.error("Failed to remove item", err.message);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      loadCart();
    } catch (err) {
      console.error("Failed to clear cart", err.message);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const newOrder = await placeOrder();
      navigate("/payment", { state: { orderId: newOrder._id } });
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to place order";
      alert(errorMessage);
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1>Your Cart</h1>
        <p>Manage items and complete your order</p>
      </header>

      {loadingCart ? (
        <div className="loader">
          <div className="spinner" />
        </div>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart">
          <img src="/images/empty-cart.svg" alt="Empty Cart" />
          <h2>Your cart is empty</h2>
          <p>Start adding some tasty items!</p>
          <Link to="/products" className="browse-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            <div className="cart-items-header">
              <h2>Your Items</h2>
              <button className="clear-btn" onClick={handleClearCart}>
                Clear Cart
              </button>
            </div>

            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    loading="lazy"
                  />
                </div>
                <div className="item-info">
                  <h3>{item.product.name}</h3>
                  <p className="item-category">{item.product.category}</p>
                  <div className="item-controls">
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product._id,
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <span className="item-price">
                      LKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  className="remove-item"
                  onClick={() => handleRemoveItem(item.product._id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>LKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>LKR {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>

            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
