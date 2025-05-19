import React, { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { getMyDesignRequests } from "../services/cakeDesignService";
import "../styles/myOrdersStyles.css";

const MyOrdersPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusSteps = ["pending", "processing", "shipped", "delivered"];

  const renderStatusChart = (status) => (
    <div className="myorders-status-bar">
      {statusSteps.map((step, index) => (
        <div
          key={index}
          className={`myorders-step ${statusSteps.indexOf(status) >= index ? "active" : ""}`}
        >
          {step}
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, designData] = await Promise.all([
          getMyOrders(),
          getMyDesignRequests()
        ]);
        setOrders(ordersData);
        setDesigns(designData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="myorders-loading">Loading orders...</div>;

  return (
    <div className="myorders-page">
      <h2>My Orders</h2>

      <div className="myorders-tabs">
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          Orders
        </button>
        <button className={activeTab === "designs" ? "active" : ""} onClick={() => setActiveTab("designs")}>
          Cake Designs
        </button>
      </div>

      {activeTab === "orders" ? (
        orders.length === 0 ? (
          <p className="myorders-empty">You have no orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="myorders-card">
              <h3>Order #{order._id}</h3>
              <p><strong>Ordered At:</strong> {new Date(order.orderedAt).toLocaleString()}</p>
              <p><strong>Total Price:</strong> LKR {order.totalPrice.toLocaleString()}</p>
              <p><strong>Shipping Address:</strong><br />
                {order.shippingAddress.address}, {order.shippingAddress.city},<br />
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>

              {order.bakerOrders.map((bo, i) => (
                <div key={i} className="myorders-baker-section">
                  <h4>Baker: {bo.baker.name}</h4>
                  {renderStatusChart(bo.status)}
                  <div className="myorders-products">
                    {bo.products.map((p, j) => (
                      <div key={j} className="myorders-product-card">
                        <img src={p.product.imageUrl} alt={p.product.name} />
                        <div>
                          <p>{p.product.name}</p>
                          <p>Qty: {p.quantity}</p>
                          <p>Price: LKR {p.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p><strong>Subtotal:</strong> LKR {bo.subtotal.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ))
        )
      ) : (
        <div className="myorders-designs">
          {designs.length === 0 ? (
            <p className="myorders-empty">You haven't submitted any cake designs yet.</p>
          ) : (
            designs.map((d) => (
              <div key={d._id} className="myorders-design-card">
                <h3>Baker : {d.baker?.name}</h3>
                <p><strong>Status:</strong> {d.status}</p>
                <p><strong>Message:</strong> {d.message || "—"}</p>
                <p><strong>Created:</strong> {new Date(d.createdAt).toLocaleString()}</p>
                <div className="myorders-model">
                  <model-viewer
                    src={d.objectUrl}
                    alt="Cake 3D Preview"
                    auto-rotate
                    camera-controls
                    ar
                    style={{ width: "100%", height: "300px" }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;