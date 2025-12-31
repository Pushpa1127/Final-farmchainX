import React, { useState } from "react";
import {
  SectionCard,
  Input,
  Select,
  PrimaryButton,
  tableStyle,
} from "./common";

function CropsTab({
  crops = [],
  farmers = [],
  onAddCrop,
  currentUser = {},
}) {
  const farmerId = currentUser?.farmerId || "";

  const [form, setForm] = useState({
    name: "",
    category: "",
    season: "",
    status: "Planted",
    field: "",
    area: "",
    farmerId: currentUser?.role === "FARMER" ? currentUser?.farmerId : "",
  });

  /* ================= SAFE HELPER FUNCTIONS ================= */

  const getFarmerName = (farmerId) => {
    const farmer = farmers?.find((f) => f.farmerId === farmerId);
    return farmer ? farmer.name : "Unknown Farmer";
  };

  const getPredictedYieldForCrop = (cropId) => {
    if (!cropId) return "N/A";
    // simple deterministic mock prediction (safe placeholder)
    const base = cropId.toString().length * 15;
    return `${base + 30} kg / acre`;
  };

  /* ================= SUBMIT ================= */

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.category ||
      !form.season ||
      !form.field ||
      form.area === ""
    ) {
      alert("Please fill all required fields");
      return;
    }

    onAddCrop({
      ...form,
      farmerId,
      area: Number(form.area),
      timestamp: new Date().toISOString(),
    });

    setForm({
      name: "",
      category: "",
      season: "",
      status: "Planted",
      field: "",
      area: "",
      farmerId: currentUser?.role === "FARMER" ? currentUser?.farmerId : "",
    });
  };

  /* ================= VISIBLE CROPS ================= */

  const visibleCrops =
    currentUser?.role === "ADMIN"
      ? crops
      : crops.filter((c) => c.farmerId === currentUser?.farmerId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* ================= ADD CROP ================= */}
      <SectionCard title="Add Crop">
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={{ fontWeight: "bold", color: "#2D6A4F" }}>
            Farmer: {getFarmerName(farmerId) || "Admin"}
          </div>

          <Input
            label="Crop Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="Grain">Grain</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Fruit">Fruit</option>
            <option value="Other">Other</option>
          </Select>

          <Select
            label="Season"
            value={form.season}
            onChange={(e) => setForm({ ...form, season: e.target.value })}
          >
            <option value="">Select Season</option>
            <option value="Rainy">Rainy</option>
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
            <option value="Autumn">Autumn</option>
          </Select>

          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Planted">Planted</option>
            <option value="Growing">Growing</option>
          </Select>

          <Input
            label="Field / Location"
            value={form.field}
            onChange={(e) => setForm({ ...form, field: e.target.value })}
          />

          <Input
            label="Area (Acres / Hectares)"
            type="number"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          />

          <PrimaryButton type="submit">Add Crop</PrimaryButton>
        </form>
      </SectionCard>

      {/* ================= CROPS TABLE ================= */}
      <SectionCard title="All Crops">
        {!visibleCrops.length ? (
          <p>No crops available.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Crop ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Season</th>
                  <th>Status</th>
                  <th>Field</th>
                  <th>Area</th>
                  <th>Farmer</th>
                  {currentUser?.role === "ADMIN" && <th>Created At</th>}
                  <th>AI Yield</th>
                </tr>
              </thead>
              <tbody>
                {visibleCrops.map((c) => (
                  <tr key={c.cropId || c._id}>
                    <td>{c.cropId || c._id}</td>
                    <td>{c.name}</td>
                    <td>{c.category}</td>
                    <td>{c.season}</td>
                    <td>{c.status}</td>
                    <td>{c.field}</td>
                    <td>{c.area}</td>
                    <td>{getFarmerName(c.farmerId)}</td>
                    {currentUser?.role === "ADMIN" && (
                      <td>
                        {c.timestamp
                          ? new Date(c.timestamp).toLocaleString()
                          : "-"}
                      </td>
                    )}
                    <td>{getPredictedYieldForCrop(c.cropId || c._id)}</td>
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

export default CropsTab;
