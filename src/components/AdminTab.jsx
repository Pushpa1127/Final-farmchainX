import React from "react";
import { SectionCard, tableStyle } from "./common";

function AdminTab({ farmers, crops, batches }) {

  const getFarmerName = (id) =>
    farmers.find((f) => f.id === id)?.name || "Unknown";

  const getCropName = (id) =>
    crops.find((c) => c.id === id)?.name || "Unknown";

  return (
    <>
      <SectionCard title="Admin Overview">
        <p>Total Farmers: {farmers.length}</p>
        <p>Total Crops: {crops.length}</p>
        <p>Total Batches: {batches.length}</p>
      </SectionCard>

      <SectionCard title="All Batches – Admin View">
        {!batches.length ? (
          <p>No batches found.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Batch Code</th>
                <th>Crop</th>
                <th>Farmer</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id}>
                  <td>{b.batchCode}</td>
                  <td>{getCropName(b.cropId)}</td>
                  <td>{getFarmerName(b.farmerId)}</td>
                  <td>{b.status}</td>
                  <td>{b.currentLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </>
  );
}

export default AdminTab;
