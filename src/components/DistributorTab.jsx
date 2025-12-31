import React, { useState, useEffect } from "react";
import { SectionCard, Input, PrimaryButton } from "./common";

function DistributorTab({ currentUser = {}, onUpdateDistributor }) {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    distributorId: "",
    companyName: "",
    email: "",
    phone: "",
    altPhone: "",
    warehouseAddress: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    licenseNumber: "",
  });

  /* ✅ Keep form synced with logged-in distributor */
  useEffect(() => {
    setForm({
      distributorId: currentUser.distributorId || "",
      companyName: currentUser.companyName || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      altPhone: currentUser.altPhone || "",
      warehouseAddress: currentUser.warehouseAddress || "",
      country: currentUser.country || "",
      state: currentUser.state || "",
      city: currentUser.city || "",
      pincode: currentUser.pincode || "",
      licenseNumber: currentUser.licenseNumber || "",
    });
  }, [currentUser]);

  const saveChanges = (e) => {
    e.preventDefault();

    if (typeof onUpdateDistributor !== "function") {
      alert("Update service not available");
      return;
    }

    if (!form.companyName || !form.email || !form.phone) {
      return alert("Company Name, Email and Phone are required");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      return alert("Phone number must be 10 digits");
    }

    if (form.altPhone && !phoneRegex.test(form.altPhone)) {
      return alert("Alternate phone must be 10 digits");
    }

    onUpdateDistributor(form);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({
      distributorId: currentUser.distributorId || "",
      companyName: currentUser.companyName || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      altPhone: currentUser.altPhone || "",
      warehouseAddress: currentUser.warehouseAddress || "",
      country: currentUser.country || "",
      state: currentUser.state || "",
      city: currentUser.city || "",
      pincode: currentUser.pincode || "",
      licenseNumber: currentUser.licenseNumber || "",
    });
  };

  return (
    <SectionCard title="Distributor Profile">
      <form onSubmit={saveChanges} style={{ maxWidth: "600px" }}>
        {[
          ["Distributor ID", "distributorId", true],
          ["Company Name", "companyName"],
          ["Email", "email"],
          ["Phone", "phone"],
          ["Alternate Phone", "altPhone"],
          ["Warehouse Address", "warehouseAddress"],
          ["Country", "country"],
          ["State", "state"],
          ["City", "city"],
          ["Pincode", "pincode"],
          ["License Number", "licenseNumber"],
        ].map(([label, key, alwaysDisabled]) => (
          <Input
            key={key}
            label={label}
            value={form[key]}
            disabled={!isEditing || alwaysDisabled}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}

        {!isEditing ? (
          <PrimaryButton type="button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </PrimaryButton>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <PrimaryButton type="submit">Save Changes</PrimaryButton>
            <PrimaryButton
              type="button"
              onClick={cancelEdit}
              style={{ background: "#ccc", color: "#000" }}
            >
              Cancel
            </PrimaryButton>
          </div>
        )}
      </form>
    </SectionCard>
  );
}

export default DistributorTab;
