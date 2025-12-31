import React, { useEffect, useState } from "react";
import { SectionCard, Input, PrimaryButton, tableStyle } from "./common";
import { apiSubmitFeedback, apiGetMyFeedback } from "../api/api";

function UserFeedback({ currentUser }) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser?.username) return;

    apiGetMyFeedback(currentUser.username)
      .then(setFeedbacks)
      .catch(() => setFeedbacks([]));
  }, [currentUser]);

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Feedback cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await apiSubmitFeedback({
        username: currentUser.username,
        role: currentUser.role,
        message,
        rating,
      });

      setMessage("");
      setRating(5);

      const updated = await apiGetMyFeedback(currentUser.username);
      setFeedbacks(updated);
    } catch {
      alert("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* SUBMIT FEEDBACK */}
      {currentUser.role !== "ADMIN" && (
        <SectionCard title="📝 Submit Feedback">
          <form onSubmit={submitFeedback} style={{ maxWidth: 600 }}>
            <Input
              label="Your Feedback"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <label>Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{ padding: 8, width: "100%", marginBottom: 12 }}
            >
              <option value={5}>⭐⭐⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={1}>⭐</option>
            </select>

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </PrimaryButton>
          </form>
        </SectionCard>
      )}

      {/* MY FEEDBACK + ADMIN REPLY */}
      <SectionCard title="📄 My Feedback & Admin Reply">
        {feedbacks.length === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Rating</th>
                  <th>Admin Reply</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f.id}>
                    <td>{f.message}</td>
                    <td>{"⭐".repeat(f.rating)}</td>
                    <td>
                      {f.adminReply ? (
                        <span style={{ color: "green", fontWeight: 600 }}>
                          {f.adminReply}
                        </span>
                      ) : (
                        <span style={{ color: "#888" }}>
                          Awaiting reply
                        </span>
                      )}
                    </td>
                    <td>{new Date(f.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

export default UserFeedback;
