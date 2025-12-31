import React, { useState, useEffect } from "react";
import { SectionCard, Input } from "./common";

function ConsumerTab({
  batches = [],
  getCropName,
  getFarmerName,
  getTraceForBatch,
  getAnomalyInfoForBatch,
}) {
  const [id, setId] = useState("");
  const [trace, setTrace] = useState([]);

  const batch = batches.find((b) => b.batchId === id);

  /* ===============================
     LOAD TRACE DATA (ASYNC)
  =============================== */
  useEffect(() => {
    if (!batch) {
      setTrace([]);
      return;
    }

    getTraceForBatch(batch.batchId)
      .then(setTrace)
      .catch(() => setTrace([]));
  }, [batch, getTraceForBatch]);

  return (
    <SectionCard title="Consumer – Track Your Food">
      <Input
        label="Enter Batch ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      {!batch ? (
        <p>Enter a valid batch ID</p>
      ) : (
        <>
          <h3>Product Info</h3>
          <p><b>Crop:</b> {getCropName(batch.cropId)}</p>
          <p><b>Farmer:</b> {getFarmerName(batch.farmerId)}</p>
          <p><b>Status:</b> {batch.status}</p>
          <p><b>Location:</b> {batch.currentLocation}</p>

          <h3>Product Journey</h3>
          {trace.length === 0 ? (
            <p>No trace records found</p>
          ) : (
            <ul>
              {trace.map((t) => (
                <li key={t.traceId}>
                  <b>{t.eventType}</b> at {t.location} ({t.handledBy})
                </li>
              ))}
            </ul>
          )}

          <h3>AI Freshness Check</h3>
          <p>{getAnomalyInfoForBatch(batch.batchId)}</p>
        </>
      )}
    </SectionCard>
  );
}

export default ConsumerTab;
