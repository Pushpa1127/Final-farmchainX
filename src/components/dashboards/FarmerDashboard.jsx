import React from "react";
import { tableStyle } from "../common";
import DistributorSearchTab from "../DistributorSearchTab";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function FarmerDashboard({
  currentUser = {},
  crops = [],
  batches = [],
  distributors = [],
  getCropName,
}) {
  const farmerId = currentUser?.farmerId || "F001";
  const farmerName = currentUser?.name || currentUser?.username || "Farmer";

  /* =========================
     DATA FILTERING
  ========================= */
  const myBatches = batches.filter((b) => b.farmerId === farmerId);
  const myCrops = crops.filter((c) =>
    myBatches.some((b) => b.cropId === c.cropId)
  );

  /* =========================
     STATS
  ========================= */
  const deliveredCount = myBatches.filter(
    (b) => b.status === "DELIVERED"
  ).length;

  const activeCount = myBatches.filter(
    (b) => b.status === "TRANSPORT" || b.status === "IN_TRANSIT"
  ).length;

  /* =========================
     CHART DATA
  ========================= */

  // Crop-wise batch count
  const cropMap = {};
  myBatches.forEach((b) => {
    const cropName = getCropName?.(b.cropId) || b.cropId;
    cropMap[cropName] = (cropMap[cropName] || 0) + 1;
  });

  const cropData = {
    labels: Object.keys(cropMap),
    datasets: [
      {
        label: "Batches",
        data: Object.values(cropMap),
        backgroundColor: "#1B4332",
        borderWidth: 0,
        maxBarThickness: 48,
      },
    ],
  };

  // Farming type distribution
  const typeMap = { Organic: 0, Chemical: 0, Bio: 0, Other: 0 };
  myBatches.forEach((b) => {
    const type = b.pesticideType || "Other";
    typeMap[type] = (typeMap[type] || 0) + 1;
  });

  const typeData = {
    labels: Object.keys(typeMap),
    datasets: [
      {
        data: Object.values(typeMap),
        backgroundColor: ["#2D6A4F", "#EF5350", "#95D5B2", "#AB47BC"],
        borderColor: "#ffffff",
        borderWidth: 1.5,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, padding: 10, usePointStyle: true },
      },
    },
  };

  /* =========================
     STAT CARD
  ========================= */
  const StatCard = ({ title, value, gradientFrom }) => (
    <div
      style={{
        flex: 1,
        background: `linear-gradient(135deg, ${gradientFrom}, #95D5B2)`,
        color: "white",
        padding: "1.6rem",
        borderRadius: 18,
        boxShadow: "0 18px 40px rgba(15, 50, 30, 0.12)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 38, fontWeight: 800, marginTop: 8 }}>
        {value}
      </div>
    </div>
  );

  /* =========================
     RENDER
  ========================= */
  return (
    <div
      style={{
        padding: 28,
        minHeight: "100%",
        background:
          "linear-gradient(180deg, #F6FFF8 0%, #E8F5E9 100%)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#fff",
          padding: 18,
          borderRadius: 14,
          boxShadow: "0 10px 30px rgba(5, 30, 18, 0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          borderLeft: "6px solid #2D6A4F",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1B4332",
            }}
          >
            👨‍🌾 Welcome, {farmerName}
          </div>
          <div style={{ marginTop: 6, color: "#3b3b3b", fontSize: 13 }}>
            ID: <b>{farmerId}</b> — overview of your farms and batches
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <StatCard
          title="🌾 Total Crops"
          value={myCrops.length}
          gradientFrom="#2D6A4F"
        />
        <StatCard
          title="📦 Total Batches"
          value={myBatches.length}
          gradientFrom="#40916C"
        />
        <StatCard
          title="✅ Delivered"
          value={deliveredCount}
          gradientFrom="#1B4332"
        />
        <StatCard
          title="🚚 In Transit"
          value={activeCount}
          gradientFrom="#74C69D"
        />
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <div
          style={{
            width: "65%",
            minHeight: 400,
            background: "#fff",
            borderRadius: 14,
            padding: 14,
            boxShadow: "0 12px 30px rgba(10, 40, 20, 0.06)",
          }}
        >
          <h3 style={{ color: "#1B4332" }}>🌾 Production by Crop</h3>
          <div style={{ height: 340 }}>
            <Bar data={cropData} options={chartOptions} />
          </div>
        </div>

        <div
          style={{
            width: "30%",
            minHeight: 400,
            background: "#fff",
            borderRadius: 14,
            padding: 14,
            boxShadow: "0 12px 30px rgba(10, 40, 20, 0.06)",
          }}
        >
          <h3 style={{ color: "#1B4332" }}>🧪 Farming Type Used</h3>
          <div style={{ height: 340 }}>
            <Doughnut data={typeData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* DISTRIBUTOR SEARCH */}
      <div style={{ marginBottom: 20 }}>
        <DistributorSearchTab distributors={distributors} />
      </div>

      {/* RECENT BATCHES */}
      {myBatches.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 16,
            boxShadow: "0 12px 30px rgba(10, 40, 20, 0.06)",
            borderTop: "6px solid #2D6A4F",
          }}
        >
          <h3 style={{ color: "#1B4332" }}>📦 Recent Batches</h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                ...tableStyle,
                minWidth: 900,
                borderRadius: 10,
              }}
            >
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Crop</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Harvest Date</th>
                  <th>Status</th>
                  <th>Farming Type</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {myBatches
                  .slice()
                  .reverse()
                  .slice(0, 12)
                  .map((b) => (
                    <tr key={b.batchId}>
                      <td style={{ fontWeight: 700 }}>{b.batchId}</td>
                      <td>{getCropName?.(b.cropId)}</td>
                      <td>{b.quantity}</td>
                      <td>{b.quantityUnit || "-"}</td>
                      <td>{b.harvestDate || "-"}</td>
                      <td>{b.status}</td>
                      <td>{b.pesticideType || "N/A"}</td>
                      <td>₹ {b.totalCost || "0"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
