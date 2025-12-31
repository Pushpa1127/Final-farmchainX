import React, { useEffect, useState } from "react";
import { SectionCard, Input, PrimaryButton, tableStyle } from "./common";
import { apiGetAllContacts, apiReplyContact } from "../api/api";

function AdminContactTab() {
  const [contacts, setContacts] = useState([]);
  const [reply, setReply] = useState({});
  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD CONTACTS
  ===================== */
  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await apiGetAllContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load contacts", err);
      alert("Failed to load contact messages");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  /* =====================
     SEND REPLY
  ===================== */
  const sendReply = async (id) => {
    if (!reply[id] || !reply[id].trim()) {
      alert("Reply cannot be empty");
      return;
    }

    try {
      await apiReplyContact(id, reply[id]);
      alert("Reply sent ✅");
      setReply((prev) => ({ ...prev, [id]: "" }));
      loadContacts();
    } catch (err) {
      console.error("Reply failed", err);
      alert("Failed to send reply");
    }
  };

  return (
    <SectionCard title="📨 Contact Messages (Admin)">
      {loading ? (
        <p>Loading contact messages...</p>
      ) : contacts.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead style={{ background: "#2a7455ff", color: "#fff" }}>
              <tr>
                <th>User</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Admin Reply</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.username}</td>
                  <td>{c.subject}</td>
                  <td>{c.message}</td>
                  <td>
                    {c.adminReply ? (
                      <span style={{ color: "green", fontWeight: 600 }}>
                        {c.adminReply}
                      </span>
                    ) : (
                      <Input
                        placeholder="Type reply..."
                        value={reply[c.id] || ""}
                        onChange={(e) =>
                          setReply((prev) => ({
                            ...prev,
                            [c.id]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </td>
                  <td>
                    {!c.adminReply && (
                      <PrimaryButton onClick={() => sendReply(c.id)}>
                        Reply
                      </PrimaryButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

export default AdminContactTab;
