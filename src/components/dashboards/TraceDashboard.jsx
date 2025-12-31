import React from "react";

export default function TraceDashboard({
  orders = [],
  getTraceForBatch,
  getCropName,
  onBack,
}) {
  // Assume orders contains only the selected order
  const order = orders[0];

  if (!order) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={onBack} style={{ marginBottom: 15 }}>
          ⬅ Back
        </button>
        <p>No order selected.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack} style={{ marginBottom: 15 }}>
        ⬅ Back
      </button>

      <h2>Traceability – {order.product}</h2>

      {(getTraceForBatch(order.batchId) || []).map((trace, index) => (
        <div
          key={index}
          style={{
            padding: 10,
            marginBottom: 8,
            borderLeft: "4px solid #2196F3",
            background: "#fff",
          }}
        >
          <p>
            <b>Event:</b> {trace.eventType}
          </p>
          <p>
            <b>Actor:</b> {trace.actorRole}
          </p>
          <p>
            <b>Location:</b> {trace.location || "N/A"}
          </p>
          <p>
            <b>Date:</b>{" "}
            {trace.timestamp
              ? new Date(trace.timestamp).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
}
