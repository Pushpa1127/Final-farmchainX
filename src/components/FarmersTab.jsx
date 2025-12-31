import React, { useState, useEffect } from "react";
import { SectionCard, Input, PrimaryButton, tableStyle } from "./common";

function FarmersTab({
  farmers = [],
  onAddFarmer,
  currentUser = {},
  farmerChanges = [],
}) {
  const role = currentUser.role || "ADMIN";
  const loggedFarmerId = currentUser.farmerId || null;

  /* ================= CURRENT FARMER ================= */
  const currentFarmer =
    role === "FARMER"
      ? farmers.find((f) => f.farmerId === loggedFarmerId)
      : null;

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    name: "",
    location: "",
    contact: "",
  });

  /* ================= SYNC FORM WHEN FARMER DATA CHANGES ================= */
  useEffect(() => {
    if (role === "FARMER" && currentFarmer) {
      setForm({
        name: currentFarmer.name || currentFarmer.username || "",
        location: currentFarmer.location || "",
        contact: currentFarmer.contact || "",
      });
    }
  }, [currentFarmer, role]);

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.location || !form.contact) {
      alert("Please fill all fields");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.contact)) {
      alert("Contact must be exactly 10 digits");
      return;
    }

    const payload =
      role === "FARMER"
        ? {
            ...form,
            farmerId: loggedFarmerId, // ✅ VERY IMPORTANT
          }
        : form;

    onAddFarmer(payload);
    alert("Saved successfully!");
  };

  /* ================= VISIBLE FARMERS ================= */
  const visibleFarmers =
    role === "ADMIN"
      ? [...farmers] // force re-render
      : farmers.filter((f) => f.farmerId === loggedFarmerId);

  /* ================= ADMIN CHANGE HISTORY ================= */
  const changeHistoryRows =
    role === "ADMIN"
      ? farmerChanges.map((log) => {
          const farmer = farmers.find((f) => f.farmerId === log.farmerId);
          return {
            ...farmer,
            timestamp: log.timestamp,
            changedBy: log.changedBy,
          };
        })
      : [];

  /* ================= STYLES ================= */
  const gradientStyle = {
    background: "linear-gradient(135deg, #2D6A4F 0%, #95D5B2 100%)",
    borderRadius: "16px",
    padding: "20px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  };

  const enhancedTableStyle = {
    ...tableStyle,
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    borderRadius: "12px",
    overflow: "hidden",
  };

  /* ================= UI ================= */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* ===== ADD / EDIT FARMER ===== */}
      <SectionCard
        title={role === "ADMIN" ? "Add Farmer" : "Your Farmer Profile"}
        style={gradientStyle}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <Input
            label="Farmer Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            label="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <Input
            label="Phone Number"
            type="tel"
            maxLength={10}
            value={form.contact}
            placeholder="Enter 10-digit number"
            onChange={(e) =>
              setForm({
                ...form,
                contact: e.target.value.replace(/\D/g, ""),
              })
            }
          />

          <PrimaryButton type="submit">
            {role === "ADMIN" ? "Add Farmer" : "Save Changes"}
          </PrimaryButton>
        </form>
      </SectionCard>

      {/* ===== FARMER DETAILS TABLE ===== */}
      <SectionCard title="Farmer Details">
        {!visibleFarmers.length ? (
          <p>No farmers found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={enhancedTableStyle}>
              <thead>
                <tr>
                  <th>Farmer ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {visibleFarmers.map((f) => (
                  <tr key={f.farmerId}>
                    <td>{f.farmerId}</td>
                    <td>{f.name || f.username}</td>
                    <td>{f.location || "-"}</td>
                    <td>{f.contact || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* ===== ADMIN ONLY: CHANGE HISTORY ===== */}
      {role === "ADMIN" && changeHistoryRows.length > 0 && (
        <SectionCard title="Farmer Change History">
          <div style={{ overflowX: "auto" }}>
            <table style={enhancedTableStyle}>
              <thead>
                <tr>
                  <th>Farmer ID</th>
                  <th>Name</th>
                  <th>Changed By</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {changeHistoryRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.farmerId}</td>
                    <td>{row.name || row.username}</td>
                    <td>{row.changedBy}</td>
                    <td>{new Date(row.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

export default FarmersTab;
