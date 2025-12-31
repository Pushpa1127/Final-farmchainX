import React from "react";

function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        padding: "12px 20px",
        textAlign: "center",
        background: "linear-gradient(90deg, #1B4332, #40916C)",
        color: "#fff",
        fontSize: "14px",
      }}
    >
      © {new Date().getFullYear()} FarmChainX · Secure Farm to Fork Traceability
    </footer>
  );
}

export default Footer;
