import React, { useEffect, useState } from "react";
import { SectionCard, Input, PrimaryButton, tableStyle } from "./common";
import { apiGetAllFeedback, apiReplyFeedback } from "../api/api";

function AdminFeedbackTab() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    const data = await apiGetAllFeedback();
    setFeedbacks(data);
  };

  const submitReply = async (id) => {
    if (!replyText[id]) return alert("Reply cannot be empty");

    await apiReplyFeedback(id, replyText[id]);
    alert("Reply sent ✅");
    setReplyText({ ...replyText, [id]: "" });
    loadFeedback();
  };

  return (
    <SectionCard title="📨 User Feedback (Admin)">
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead style={{ background: "#2a7455ff", color: "#fff" }}>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Message</th>
              <th>Rating</th>
              <th>Admin Reply</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f) => (
              <tr key={f.id}>
                <td>{f.username}</td>
                <td>{f.role}</td>
                <td>{f.message}</td>
                <td>{"⭐".repeat(f.rating)}</td>
                <td>
                  {f.adminReply ? (
                    <span style={{ color: "green" }}>{f.adminReply}</span>
                  ) : (
                    <Input
                      placeholder="Type reply..."
                      value={replyText[f.id] || ""}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [f.id]: e.target.value })
                      }
                    />
                  )}
                </td>
                <td>
                  {!f.adminReply && (
                    <PrimaryButton onClick={() => submitReply(f.id)}>
                      Reply
                    </PrimaryButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

export default AdminFeedbackTab;
