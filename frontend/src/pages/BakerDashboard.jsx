import React, { useEffect, useState } from "react";
import {
  getBakerOrders,
  updateBakerOrderStatus,
} from "../services/orderService";
import "../styles/bakerDashboardStyles.css";

const BakerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getBakerOrders();
        setOrders(data);
      } catch (err) {
        setMessage("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateBakerOrderStatus(orderId, newStatus);
      setMessage("Status updated!");
      const updated = await getBakerOrders();
      setOrders(updated);
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Failed to update order status."
      );
    }
  };

  // Calculate total income from all orders
  const total = orders.reduce(
    (sum, o) => sum + (o.bakerOrder?.subtotal || 0),
    0
  );
  const commission = total * 0.1;
  const netIncome = total - commission;

  return (
    <div className="baker-dashboard">
      <h2 className="baker-dashboard-title">Baker Dashboard</h2>
      {message && <div className="baker-dashboard-msg">{message}</div>}

      <div className="baker-dashboard-container">
        {/* Left: Orders */}
        <div className="baker-dashboard-orders">
          {loading ? (
            <div className="spinner" />
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="baker-dashboard-order-card">
                <h4>Order ID: {order._id}</h4>
                <p>
                  <strong>Customer:</strong> {order.customer?.name || "Unknown"}
                </p>
                <p>
                  <strong>Shipping:</strong>
                  <br />
                  {order.shippingAddress?.address}
                  <br />
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.postalCode}
                  <br />
                  {order.shippingAddress?.country}
                </p>
                <p>
                  <strong>Ordered At:</strong>{" "}
                  {new Date(order.orderedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="baker-dashboard-status">
                    {order.bakerOrder.status}
                  </span>
                </p>
                <p>
                  <strong>Order Total:</strong>{" "}
                  <span className="baker-dashboard-total">
                    LKR {order.bakerOrder.subtotal.toLocaleString()}
                  </span>
                </p>

                <div className="baker-dashboard-product-list">
                  {order.bakerOrder.products.map((item, index) => (
                    <div key={index} className="baker-dashboard-product">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                      />
                      <div>
                        <p>{item.product.name}</p>
                        <p>
                          Qty: {item.quantity} × LKR{" "}
                          {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="baker-dashboard-actions">
                  <select
                    value={order.bakerOrder.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Income Summary */}
        <div className="baker-dashboard-summary">
          <h3>Income Summary</h3>
          <p>
            <strong>Total Earnings:</strong>{" "}
            <span style={{ color: "green" }}>LKR {total.toLocaleString()}</span>
          </p>
          <p>
            <strong>Platform Fee (10%):</strong>{" "}
            <span style={{ color: "red" }}>
              - LKR {commission.toLocaleString()}
            </span>
          </p>
          <div
            style={{
              height: "1px",
              background: "#ccc",
              margin: "1rem 0",
            }}
          />
          <p>
            <strong>Net Income:</strong>{" "}
            <span style={{ color: "#2980b9", fontWeight: "bold" }}>
              LKR {netIncome.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BakerDashboard;
