import React from "react";
import Footer from "./Footer";

export default function Layout({
  children,
  tabs,
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ================= LEFT SIDEBAR ================= */}
      <aside
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #1B4332 0%, #40916C 100%)",
          color: "white",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo */}
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "24px",
            fontWeight: 700,
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          FarmChainX
        </h2>

        {/* User Info */}
        <p style={{ fontSize: "14px", marginBottom: "30px", opacity: 0.9 }}>
          Logged in as  <b>{currentUser.username}</b>
        </p>

        {/* Navigation Tabs */}
        <nav style={{ flexGrow: 1 }}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                marginBottom: "12px",
                borderRadius: "10px",
                background:
                  activeTab === tab.id
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                transition: "all 0.3s ease",
                fontWeight: 500,
                color: "white",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  activeTab === tab.id
                    ? "rgba(255,255,255,0.2)"
                    : "transparent")
              }
            >
              {tab.label}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            background: "linear-gradient(90deg, #95D5B2, #CFF2D6)",
            border: "none",
            padding: "12px 16px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#08321E",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            transition: "0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.filter = "brightness(1.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.filter = "brightness(1)")
          }
        >
          Logout
        </button>
      </aside>

      {/* ================= RIGHT CONTENT + FOOTER ================= */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #F6FFF8 0%, #E8F5E9 100%)",
        }}
      >
        {/* MAIN CONTENT */}
        <main
          style={{
            flex: 1,
            padding: "30px",
            overflowY: "auto",
            transition: "0.3s",
          }}
        >
          <div
            className="content"
            style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
              minHeight: "80vh",
            }}
          >
            {children}
          </div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
