import React, { useState, useEffect } from "react";
import { SectionCard, Input, PrimaryButton } from "./common";

function DistributorSearchTab({ distributors = [] }) {
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);

  // Show all distributors initially
  useEffect(() => {
    setResults(distributors);
  }, [distributors]);

  const handleSearch = () => {
    const search = location.trim().toLowerCase();

    if (!search) {
      setResults(distributors); // show all if search is empty
      return;
    }

    const filtered = distributors.filter(
      (d) =>
        d.city?.toLowerCase().includes(search) ||
        d.state?.toLowerCase().includes(search)
    );

    setResults(filtered);
  };

  return (
    <SectionCard title="Search Distributors">
      <Input
        label="Enter City or State"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <PrimaryButton onClick={handleSearch} style={{ marginTop: "1rem" }}>
        Search
      </PrimaryButton>

      <div style={{ marginTop: "1rem", overflowX: "auto" }}>
        {results.length === 0 ? (
          <p>No distributors found for this location.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "600px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Company</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Phone</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>City</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>State</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Address</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {results.map((d) => (
                <tr key={d.distributorId}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {d.distributorId || "-"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {d.companyName || "-"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {d.phone || "-"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {d.city || "-"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {d.state || "-"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {d.warehouseAddress || "-"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {d.email || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SectionCard>
  );
}

export default DistributorSearchTab;
