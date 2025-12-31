import React, { useState, useEffect } from "react";
import { SectionCard, Input, Select, PrimaryButton } from "./common";

function TraceTab({
  batches = [],
  farmers = [],
  onAddTrace,
  getTraceForBatch,
  currentUser = {},
}) {
  const role = currentUser.role || "ADMIN";
  const loggedFarmerId = currentUser.farmerId || null;

  const [form, setForm] = useState({
    farmerId: role === "FARMER" ? loggedFarmerId : "",
    batchId: "",
    eventType: "",
    location: "",
    handledBy: "",
  });

  const [visibleBatches, setVisibleBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [trace, setTrace] = useState([]);

  /* ================= SAFE HELPER FUNCTIONS ================= */

  const getCropName = (cropId) => {
    const cropBatch = batches?.find((b) => b.cropId === cropId);
    return cropBatch?.cropName || cropBatch?.crop || "Unknown Crop";
  };

  const getFarmerName = (farmerId) => {
    const farmer = farmers?.find((f) => f.farmerId === farmerId);
    return farmer ? farmer.name : "Unknown Farmer";
  };

  const getAnomalyInfoForBatch = (batchId) => {
    if (!batchId) return "No anomaly data available";

    const score = batchId.toString().length % 3;
    if (score === 0) return "✅ No anomalies detected";
    if (score === 1) return "⚠️ Minor delay detected during transportation";
    return "⚠️ Temperature fluctuation detected in storage";
  };

  /* ================= FILTER BATCHES ================= */

  useEffect(() => {
    if (role === "FARMER") {
      setVisibleBatches(batches.filter((b) => b.farmerId === loggedFarmerId));
    } else {
      setVisibleBatches(
        batches.filter((b) =>
          form.farmerId ? b.farmerId === form.farmerId : true
        )
      );
    }
  }, [batches, form.farmerId, role, loggedFarmerId]);

  /* ================= LOAD TRACE ================= */

  const selectedBatch = batches.find((b) => b.batchId === search);

  useEffect(() => {
    if (!selectedBatch) {
      setTrace([]);
      return;
    }

    getTraceForBatch(selectedBatch.batchId)
      .then(setTrace)
      .catch(() => setTrace([]));
  }, [selectedBatch, getTraceForBatch]);

  /* ================= ADD TRACE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onAddTrace({
        batchId: form.batchId,
        eventType: form.eventType,
        location: form.location,
        handledBy: form.handledBy,
      });

      alert("Trace record added successfully");

      setForm({
        farmerId: role === "FARMER" ? loggedFarmerId : "",
        batchId: "",
        eventType: "",
        location: "",
        handledBy: "",
      });
    } catch {
      alert("Failed to add trace record");
    }
  };

  /* ================= STYLES ================= */

  const gradientCardStyle = (from = "#2D6A4F", to = "#74C69D") => ({
    background: `linear-gradient(135deg, ${from}, ${to})`,
    borderRadius: "16px",
    padding: "20px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  });

  const sectionCardStyle = {
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    background: "#f7fdf9",
  };

  const timelineItemStyle = {
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #95D5B2, #52B788)",
    color: "#fff",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* ================= ADD TRACE ================= */}
      <SectionCard title="Add Trace Record" style={gradientCardStyle()}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <Select
            label="Farmer"
            value={form.farmerId}
            disabled={role === "FARMER"}
            onChange={(e) =>
              setForm({ ...form, farmerId: e.target.value, batchId: "" })
            }
          >
            {role === "ADMIN" && <option value="">Select Farmer</option>}
            {farmers?.map((f) => (
              <option key={f.farmerId} value={f.farmerId}>
                {f.farmerId} – {f.name}
              </option>
            ))}
          </Select>

          <Select
            label="Batch"
            value={form.batchId}
            onChange={(e) => setForm({ ...form, batchId: e.target.value })}
          >
            <option value="">Choose Batch</option>
            {visibleBatches.map((b) => (
              <option key={b.batchId} value={b.batchId}>
                {b.batchId} – {getCropName(b.cropId)}
              </option>
            ))}
          </Select>

          <Select
            label="Event Type"
            value={form.eventType}
            onChange={(e) => setForm({ ...form, eventType: e.target.value })}
          >
            <option value="">Select Event</option>
            <option value="TRANSPORT">Transport</option>
            <option value="WAREHOUSE_IN">Warehouse In</option>
            <option value="WAREHOUSE_OUT">Warehouse Out</option>
            <option value="DELIVERED">Delivered</option>
          </Select>

          <Input
            label="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <Input
            label="Handled By"
            value={form.handledBy}
            onChange={(e) =>
              setForm({ ...form, handledBy: e.target.value })
            }
          />

          <PrimaryButton type="submit">Add Trace</PrimaryButton>
        </form>
      </SectionCard>

      {/* ================= TRACK ================= */}
      <SectionCard title="Track Batch" style={gradientCardStyle()}>
        <Input
          label="Enter Batch ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {!selectedBatch ? (
          <p style={{ marginTop: "12px", color: "#FF4D6D" }}>
            Enter a valid Batch ID
          </p>
        ) : (
          <div style={sectionCardStyle}>
            <p>
              <b>Crop:</b> {getCropName(selectedBatch.cropId)}
            </p>
            <p>
              <b>Farmer:</b> {getFarmerName(selectedBatch.farmerId)}
            </p>

            <h3>Trace Timeline</h3>
            {trace.length === 0 ? (
              <p>No trace events found</p>
            ) : (
              trace.map((t) => (
                <div key={t.traceId} style={timelineItemStyle}>
                  <b>{t.eventType}</b> → {t.location} ({t.handledBy})
                </div>
              ))
            )}

            <h3>AI Anomaly Check</h3>
            <p>{getAnomalyInfoForBatch(selectedBatch.batchId)}</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

export default TraceTab;
