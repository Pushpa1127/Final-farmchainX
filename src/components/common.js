import React from "react";

export const TabButton = ({ id, label, activeTab, setActiveTab }) => (
  <button
    className={`tab-btn ${activeTab === id ? "active" : ""}`}
    onClick={() => setActiveTab(id)}
  >
    {label}
  </button>
);

export const SectionCard = ({ title, children }) => (
  <div className="card">
    <h2 style={{ marginBottom: "10px" }}>{title}</h2>
    {children}
  </div>
);

export const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: "12px" }}>
    <label style={{ fontSize: "13px", fontWeight: 500 }}>{label}</label>
    <input {...props} />
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div style={{ marginBottom: "12px" }}>
    <label style={{ fontSize: "13px", fontWeight: 500 }}>{label}</label>
    <select {...props}>{children}</select>
  </div>
);

export const PrimaryButton = ({ children, ...props }) => (
  <button {...props} className="primary-btn">
    {children}
  </button>
);

export const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};
