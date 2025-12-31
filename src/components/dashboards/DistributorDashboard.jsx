import React, { useEffect, useState } from "react";
import { tableStyle } from "../common";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  apiGetOrdersByDistributor,
  apiUpdateOrderStatus,
} from "../../api/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DistributorDashboard({
  currentUser = {},
  batches = [],
  getFarmerName,
  getCropName,
  getAnomalyInfoForBatch,
}) {
  const distributorId = currentUser?.distributorId;
  const userName = currentUser?.username || "Distributor";

  const [orders, setOrders] = useState([]);

  /* ======================
     LOAD ORDERS FROM DB
  ====================== */
  useEffect(() => {
    if (!distributorId) return;

    apiGetOrdersByDistributor(distributorId)
      .then(setOrders)
      .catch(console.error);
  }, [distributorId]);

  /* ======================
     APPROVE / REJECT
  ====================== */
  const handleApproveReject = async (orderId, status) => {
    try {
      await apiUpdateOrderStatus(orderId, status);

      // reload orders from DB
      const refreshed = await apiGetOrdersByDistributor(distributorId);
      setOrders(refreshed);
    } catch (err) {
      alert("Failed to update order status");
      console.error(err);
    }
  };

  /* ======================
     SHIPMENT STATS
  ====================== */
  const visibleBatches = batches.filter(
    (b) => b.distributorId === distributorId
  );

  const eventTypesCount = {
    WAREHOUSE_IN: 0,
    WAREHOUSE_OUT: 0,
    TRANSPORT: 0,
    DELIVERED: 0,
  };

  visibleBatches.forEach((b) => {
    if (b.status in eventTypesCount) eventTypesCount[b.status]++;
  });

  const barData = {
    labels: Object.keys(eventTypesCount),
    datasets: [
      {
        label: "Shipments",
        data: Object.values(eventTypesCount),
        backgroundColor: ["#1B5E20", "#2E7D32", "#52B788", "#74C69D"],
      },
    ],
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🚚 Welcome, {userName}</h2>
      <p>Distributor ID: <b>{distributorId}</b></p>

      <Bar data={barData} />

      {/* ======================
           ORDERS FROM DATABASE
      ====================== */}
      <h3 style={{ marginTop: "2rem" }}>🛒 Consumer Orders</h3>

      {orders.length === 0 ? (
        <p>No consumer orders yet.</p>
      ) : (
        <table style={{ ...tableStyle, width: "100%" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Batch</th>
              <th>Consumer</th>
              <th>Quantity</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td>{o.orderId}</td>
                <td>{o.batchId}</td>
                <td>{o.consumerId}</td>
                <td>{o.quantity}</td>
                <td>{o.expectedDelivery}</td>
                <td>{o.status}</td>
                <td>
                  {o.status === "PENDING" && (
                    <>
                      <button onClick={() => handleApproveReject(o.orderId, "APPROVED")}>
                        Approve
                      </button>
                      <button onClick={() => handleApproveReject(o.orderId, "REJECTED")}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
