import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FarmerSignup.css";

function FarmerSignup({ onLogout }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    UserName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadhaar: "",
    address: "",
    landProof: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "landProof") {
      setForm({ ...form, landProof: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (
      !form.UserName ||
      !form.mobile ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.aadhaar ||
      !form.address
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Farmer Registered:", form);
    alert("Farmer registration successful! Please log in.");

  // Clear the form
  setForm({
    UserName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadhaar: "",
    address: "",
    landProof: null,
  });

  // Navigate to login page
  navigate("/login"); // make sure this route exists in your app
  };

  return (
    <div className="farmer-signup-wrapper">
      <div className="farmer-signup-card">
        {/* Logout button at top */}
        <div className="signup-header">
          <h2>👨‍🌾 Farmer Registration</h2>
          <button
            className="logout-btn"
            onClick={() => {
              if (onLogout) onLogout();
              navigate("/"); // redirect to landing page
            }}
          >
            Logout
          </button>
        </div>

        <p className="subtitle">Join FarmChainX and start tracing your crops!</p>

        <form onSubmit={handleSubmit} className="farmer-signup-form">
          <input
            type="text"
            name="UserName"
            placeholder="UserName"
            value={form.UserName}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <input
            type="text"
            name="aadhaar"
            placeholder="Aadhaar Number"
            value={form.aadhaar}
            onChange={handleChange}
          />
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <label className="file-label">
            Land Ownership Proof <span>(Upload PDF/JPG/PNG)</span>
          </label>
          <input
            type="file"
            name="landProof"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmerSignup;
