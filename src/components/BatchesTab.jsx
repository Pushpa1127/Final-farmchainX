import React, { useState, useEffect } from "react";
import {
  SectionCard,
  Input,
  Select,
  PrimaryButton,
  tableStyle,
} from "./common";

function BatchesTab({
  batches = [],
  crops = [],
  farmers = [],
  onAddBatch,
  currentUser,
}) {
  /* ================= STATE ================= */

  const [form, setForm] = useState({
    cropId: "",
    farmerId: "",
    quantity: "",
    quantityUnit: "kg",
    customUnit: "",
    harvestDate: "",
    pesticideName: "",
    pesticideType: "Chemical",
    totalCost: "",
  });

  /* ================= AUTO SET FARMER ================= */

  useEffect(() => {
    if (currentUser?.role === "FARMER" && currentUser?.farmerId) {
      setForm((prev) => ({
        ...prev,
        farmerId: currentUser.farmerId,
      }));
    }
  }, [currentUser]);

  /* ================= HELPERS ================= */

  const getCropName = (cropId) => {
    const crop = crops.find((c) => c.cropId === cropId);
    return crop ? crop.name : "Unknown Crop";
  };

  const getFarmerName = (farmerId) => {
    const farmer = farmers.find((f) => f.farmerId === farmerId);
    return farmer ? farmer.name : farmerId;
  };

  /* ================= SUBMIT ================= */

  const submit = (e) => {
    e.preventDefault();

    if (!form.cropId || !form.farmerId || !form.quantity || !form.totalCost) {
      alert("Please fill all required fields");
      return;
    }

    const batchData = {
      ...form,
      quantityUnit:
        form.quantityUnit === "Other" ? form.customUnit : form.quantityUnit,
    };

    onAddBatch(batchData);

    setForm({
      cropId: "",
      farmerId:
        currentUser?.role === "FARMER" ? currentUser?.farmerId : "",
      quantity: "",
      quantityUnit: "kg",
      customUnit: "",
      harvestDate: "",
      pesticideName: "",
      pesticideType: "Chemical",
      totalCost: "",
    });
  };

  /* ================= FILTER CURRENT USER BATCHES ================= */

  const visibleBatches =
    currentUser?.role === "ADMIN"
      ? batches
      : batches.filter((b) => b.farmerId === currentUser?.farmerId);

  /* ================= STYLES ================= */

  const gradientCardStyle = (from, to) => ({
    background: `linear-gradient(135deg, ${from}, ${to})`,
    borderRadius: "16px",
    padding: "20px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
  });

  const enhancedTableStyle = {
    ...tableStyle,
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    borderRadius: "12px",
    overflow: "hidden",
  };

  const statusBadge = (type) => ({
    padding: "4px 10px",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "600",
    background:
      type === "Chemical"
        ? "#e63946"
        : type === "Organic"
        ? "#2d6a4f"
        : "#f4a261",
  });

  /* ================= UI ================= */

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* ===== CREATE BATCH ===== */}
      <SectionCard
        title="Create Batch"
        style={gradientCardStyle("#40916C", "#74C69D")}
      >
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <Select
            label="Crop"
            value={form.cropId}
            onChange={(e) =>
              setForm({ ...form, cropId: e.target.value })
            }
          >
            <option value="">Select Crop</option>
            {crops.map((c) => (
              <option key={c.cropId} value={c.cropId}>
                {c.name}
              </option>
            ))}
          </Select>

          {/* FARMER FIELD */}
          {currentUser?.role === "FARMER" ? (
            <Input
              label="Farmer"
              value={currentUser?.name || currentUser?.farmerId}
              disabled
            />
          ) : (
            <Select
              label="Farmer"
              value={form.farmerId}
              onChange={(e) =>
                setForm({ ...form, farmerId: e.target.value })
              }
            >
              <option value="">Select Farmer</option>
              {farmers.map((f) => (
                <option key={f.farmerId} value={f.farmerId}>
                  {f.farmerId} – {f.name}
                </option>
              ))}
            </Select>
          )}

          <Input
            label="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <Select
            label="Unit"
            value={form.quantityUnit}
            onChange={(e) =>
              setForm({ ...form, quantityUnit: e.target.value })
            }
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="tons">tons</option>
            <option value="Other">Other</option>
          </Select>

          {form.quantityUnit === "Other" && (
            <Input
              label="Custom Unit"
              value={form.customUnit}
              onChange={(e) =>
                setForm({ ...form, customUnit: e.target.value })
              }
            />
          )}

          <Input
            type="date"
            label="Harvest Date"
            value={form.harvestDate}
            onChange={(e) =>
              setForm({ ...form, harvestDate: e.target.value })
            }
          />

          <Input
            label="Pesticide / Fertilizer Name"
            value={form.pesticideName}
            onChange={(e) =>
              setForm({ ...form, pesticideName: e.target.value })
            }
          />

          <Select
            label="Type"
            value={form.pesticideType}
            onChange={(e) =>
              setForm({ ...form, pesticideType: e.target.value })
            }
          >
            <option value="Chemical">Chemical</option>
            <option value="Organic">Organic</option>
            <option value="Bio">Bio</option>
          </Select>

          <Input
            type="number"
            label="Total Cost"
            value={form.totalCost}
            onChange={(e) =>
              setForm({ ...form, totalCost: e.target.value })
            }
          />

          <PrimaryButton type="submit">
            Create Batch
          </PrimaryButton>
        </form>
      </SectionCard>

      {/* ===== CURRENT USER BATCH DETAILS ===== */}
      <SectionCard
        title={
          currentUser?.role === "ADMIN"
            ? "All Batch Details"
            : "My Batch Details"
        }
        style={gradientCardStyle("#1b4332", "#95D5B2")}
      >
        {!visibleBatches.length ? (
          <p>No batch records available.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={enhancedTableStyle}>
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Crop</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Harvest Date</th>
                  <th>Pesticide</th>
                  <th>Type</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {visibleBatches.map((b) => (
                  <tr key={b.batchId}>
                    <td>{b.batchId}</td>
                    <td>{getCropName(b.cropId)}</td>
                    <td>{b.quantity}</td>
                    <td>{b.quantityUnit}</td>
                    <td>{b.harvestDate || "-"}</td>
                    <td>{b.pesticideName || "-"}</td>
                    <td>
                      <span style={statusBadge(b.pesticideType)}>
                        {b.pesticideType}
                      </span>
                    </td>
                    <td>{b.totalCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

export default BatchesTab;
