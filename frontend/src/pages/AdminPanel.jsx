import React, { useEffect, useState } from "react";
import { getAllOrders } from "../services/orderService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/adminPanelStyles.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [siteEarnings, setSiteEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState({});

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);

        let totalEarnings = 0;
        const monthMap = {};

        data.forEach((order) => {
          const date = new Date(order.createdAt);
          const month = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

          if (!monthMap[month]) {
            monthMap[month] = {
              count: 0,
              commission: 0,
            };
          }

          monthMap[month].count += 1;

          if (order.paymentStatus === "paid") {
            const commission = order.totalPrice * 0.1;
            totalEarnings += commission;
            monthMap[month].commission += commission;
          }
        });

        setMonthlyStats(monthMap);
        setSiteEarnings(totalEarnings);
      } catch (err) {
        console.error("Failed to fetch orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const months = Object.keys(monthlyStats);
  const orderCounts = months.map((m) => monthlyStats[m].count);
  const commissions = months.map((m) => monthlyStats[m].commission);

  const ordersChartData = {
    labels: months,
    datasets: [
      {
        label: "Orders",
        data: orderCounts,
        backgroundColor: "#3498db",
      },
    ],
  };

  const commissionChartData = {
    labels: months,
    datasets: [
      {
        label: "Commission (LKR)",
        data: commissions,
        backgroundColor: "#2ecc71",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="cakehub-admin-panel">
      <h2 className="cakehub-admin-title">Admin Panel - Orders Overview</h2>

      <div className="cakehub-admin-layout">
        {/* Orders List */}
        <div className="cakehub-admin-orders">
          {loading ? (
            <div className="cakehub-spinner" />
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => {
              const orderCommission =
                order.paymentStatus === "paid" ? order.totalPrice * 0.1 : 0;

              return (
                <div key={order._id} className="cakehub-admin-order-card">
                  <h4>Order ID: {order._id}</h4>
                  <p>
                    <strong>Items:</strong>{" "}
                    {order.bakerOrders.reduce(
                      (sum, bo) =>
                        sum +
                        bo.products.reduce((s, p) => s + (p.quantity || 0), 0),
                      0
                    )}
                  </p>
                  <p>
                    <strong>Total:</strong> LKR{" "}
                    {order.totalPrice.toLocaleString()}
                  </p>
                  <p>
                    <strong>Commission:</strong>{" "}
                    {order.paymentStatus === "paid" ? (
                      <>LKR {orderCommission.toLocaleString()}</>
                    ) : (
                      <span className="cakehub-admin-unpaid">Not Paid</span>
                    )}
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    <span
                      className={
                        order.paymentStatus === "paid"
                          ? "cakehub-admin-paid"
                          : "cakehub-admin-unpaid"
                      }
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Panel */}
        <div className="cakehub-admin-summary">
          <h3>Site Earnings</h3>
          <p style={{ marginBottom: "2rem" }}>
            <strong>Total Commission:</strong>{" "}
            <span className="cakehub-admin-earnings">
              LKR {siteEarnings.toLocaleString()}
            </span>
          </p>

          <div className="cakehub-admin-chart-container">
            <h4>Monthly Orders</h4>
            <Bar data={ordersChartData} options={chartOptions} />

            <h4 style={{ marginTop: "2rem" }}>Monthly Commission</h4>
            <Bar data={commissionChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
