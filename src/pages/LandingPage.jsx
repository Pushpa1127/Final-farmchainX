import React, { useEffect, useState } from "react";

export default function LandingPage({ onLoginClick }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0ffd8 0%, #a0e0a0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1100px",
          background: "#fff",
          borderRadius: "25px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
          overflow: "hidden",
          display: "flex",
          transform: loaded ? "scale(1)" : "scale(0.95)",
          transition: "all 0.6s ease",
        }}
      >
        {/* LEFT CONTENT */}
        <div
          style={{
            padding: "60px 40px",
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s ease 0.3s",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              marginBottom: "20px",
              lineHeight: "1.2",
              background: "linear-gradient(90deg, #0f9d58, #34a853)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transform: loaded ? "translateY(0)" : "translateY(-20px)",
              transition: "all 0.8s ease 0.4s",
            }}
          >
            FarmChainX: Trace & Trust Agro Products
          </h1>

          <p
            style={{
              color: "#333",
              fontSize: "18px",
              lineHeight: "1.8",
              marginBottom: "15px",
            }}
          >
            Ensure full transparency and traceability of agricultural products from farm to consumer with FarmChainX.
          </p>

          <p
            style={{
              color: "#555",
              fontSize: "16px",
              marginBottom: "30px",
            }}
          >
            Authenticate product origin, track every step, and build trust in the supply chain with our secure, blockchain-powered platform.
          </p>

          {/* FARM CHAIN ICONS */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
            {["🌱 Farm", "🚚 Transport", "🏬 Market", "🛒 Consumer"].map(
              (step, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    background: "#f0fdf4",
                    padding: "10px 0",
                    borderRadius: "12px",
                    textAlign: "center",
                    fontWeight: "500",
                    color: "#14532d",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-5px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  {step}
                </div>
              )
            )}
          </div>

          {/* LOGIN BUTTON */}
          <button
            style={{
              padding: "14px 36px",
              background: "linear-gradient(90deg, #0f9d58, #34a853)",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
            }}
            onClick={onLoginClick}
          >
            Login Now
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div
          style={{
            width: "50%",
            position: "relative",
            overflow: "hidden",
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s ease 0.5s",
          }}
        >
          <img
            src="https://t3.ftcdn.net/jpg/04/60/35/96/360_F_460359613_XPekKlmgsCbsGrg67s3wB9lOI5x2hvKG.jpg"
            alt="Farmer"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              padding: "10px 20px",
              background: "rgba(0,0,0,0.4)",
              color: "#fff",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Empowering Farmers with Transparency
          </div>
        </div>
      </div>
    </div>
  );
}
