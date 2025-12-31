import React, { useState,useEffect, useMemo } from "react";
import { SectionCard, PrimaryButton, tableStyle } from "../common";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  apiBlockUser,
  apiUnblockUser,
  apiMakeAdmin,
} from "../../api/api";

const COLORS = ["#1B4332", "#40916C", "#52B788", "#74C69D"];

function AdminDashboard({ users:initialUsers = [], crops = [], batches = [] }) {
  /* ================= STATE ================= */
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
const [users, setUsers] = useState(initialUsers);

useEffect(() => {
  setUsers(initialUsers);
}, [initialUsers]);

  /* ================= COUNTS ================= */
  const admins = users.filter((u) => u.role === "ADMIN");
  const farmers = users.filter((u) => u.role === "FARMER");
  const distributors = users.filter((u) => u.role === "DISTRIBUTOR");
  const consumers = users.filter((u) => u.role === "CONSUMER");
  

  /* ================= FILTER USERS ================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.username
        ?.toLowerCase()
        .includes(searchText.toLowerCase());

      const matchRole =
        roleFilter === "ALL" || u.role === roleFilter;

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && !u.blocked) ||
        (statusFilter === "BLOCKED" && u.blocked);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchText, roleFilter, statusFilter]);

  /* ================= CHART DATA ================= */

  // PieChart → Users by Role
  const userRoleData = [
    { name: "Admins", value: admins.length },
    { name: "Farmers", value: farmers.length },
    { name: "Distributors", value: distributors.length },
    { name: "Consumers", value: consumers.length },
  ];

  // BarChart → Batch Status
  const batchStatusData = Object.values(
    batches.reduce((acc, b) => {
      acc[b.status] = acc[b.status] || {
        name: b.status,
        count: 0,
      };
      acc[b.status].count++;
      return acc;
    }, {})
  );

  /* ================= ACTIONS ================= */
  const updateUserLocally = (id, updates) => {
  setUsers(prev =>
    prev.map(u =>
      u.id === id ? { ...u, ...updates } : u
    )
  );
};
const makeAdmin = async (id) => {
  if (!window.confirm("Make this user Admin?")) return;

  try {
    await apiMakeAdmin(id);
    updateUserLocally(id, { role: "ADMIN" });
    alert("User promoted to Admin");
  } catch (err) {
    alert("Failed to make admin");
  }
};
const blockUser = async (id) => {
  await apiBlockUser(id);
  updateUserLocally(id, { blocked: true });
};
const unblockUser = async (id) => {
  await apiUnblockUser(id);
  updateUserLocally(id, { blocked: false });
};



  /* ================= STYLES ================= */
  const statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  };

  const statCard = (bg) => ({
    background: bg,
    color: "#fff",
    padding: "22px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
  });

  const chartCard = {
    background: "#fff",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
  };

  /* ================= RENDER ================= */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <h1 style={{ color: "#1B4332" }}>🌱 Admin Dashboard</h1>

      {/* ================= STATS ================= */}
      <SectionCard title="Platform Overview">
        <div style={statsGrid}>
          <div style={statCard("linear-gradient(135deg,#1B4332,#40916C)")}>
            <h1>{users.length}</h1>
            <p>Total Users</p>
          </div>
          <div style={statCard("linear-gradient(135deg,#40916C,#52B788)")}>
            <h1>{farmers.length}</h1>
            <p>Farmers</p>
          </div>
          <div style={statCard("linear-gradient(135deg,#2D6A4F,#74C69D)")}>
            <h1>{distributors.length}</h1>
            <p>Distributors</p>
          </div>
          <div style={statCard("linear-gradient(135deg,#52B788,#95D5B2)")}>
            <h1>{consumers.length}</h1>
            <p>Consumers</p>
          </div>
        </div>
      </SectionCard>

      {/* ================= CHARTS ================= */}
      <SectionCard title="Analytics & Insights">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Pie Chart */}
          <div style={chartCard}>
            <h3 style={{ textAlign: "center", color: "#1B4332" }}>
              Users by Role
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {userRoleData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div style={chartCard}>
            <h3 style={{ textAlign: "center", color: "#1B4332" }}>
              Batch Status Overview
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={batchStatusData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#40916C"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SectionCard>

      {/* ================= SEARCH ================= */}
      <SectionCard title="Search & Filter Users">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "16px",
            padding: "20px",
            background: "linear-gradient(135deg,#E9F5EE,#F1FBF6)",
            borderRadius: "18px",
          }}
        >
          <input
            placeholder="🔍 Search by username"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "14px",
              border: "1px solid #b7e4c7",
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: "12px", borderRadius: "14px" }}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="FARMER">Farmer</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="CONSUMER">Consumer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "12px", borderRadius: "14px" }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </SectionCard>

      {/* ================= USER TABLE ================= */}
      <SectionCard title="User Management">
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead style={{ background: "#2a7455ff", color: "#fff" }}>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr
                  key={u._id}
                  style={{ background: i % 2 ? "#fff" : "#f0f5f1" }}
                >
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>{u.blocked ? "🚫 Blocked" : "✅ Active"}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    {u.role !== "ADMIN" && (
                      <PrimaryButton
                        onClick={() => makeAdmin(u.id)}
                        style={{ background: "#40916C" }}
                      >
                        Make Admin
                      </PrimaryButton>
                    )}

                    {u.blocked ? (
                      <PrimaryButton
                        onClick={() => unblockUser(u.id)}
                        style={{ background: "#52B788" }}
                      >
                        Unblock
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        onClick={() => blockUser(u.id)}
                        style={{ background: "#D00000" }}
                      >
                        Block
                      </PrimaryButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export default AdminDashboard;
