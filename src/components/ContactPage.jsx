import React, { useEffect, useState } from "react";
import { SectionCard, Input, PrimaryButton, tableStyle } from "./common";
import { apiSendContact, apiGetMyContacts } from "../api/api";

function ContactTab({ currentUser }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    apiGetMyContacts(currentUser.username).then(setContacts);
  }, [currentUser]);

  const submit = async (e) => {
    e.preventDefault();

    await apiSendContact({
      username: currentUser.username,
      role: currentUser.role,
      subject,
      message,
    });

    setSubject("");
    setMessage("");
    const updated = await apiGetMyContacts(currentUser.username);
    setContacts(updated);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* Contact Form */}
      <SectionCard title="📩 Contact Us">
        <form onSubmit={submit} style={{ maxWidth: 600 }}>
          <Input label="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          <Input label="Message" value={message} onChange={e => setMessage(e.target.value)} />
          <PrimaryButton type="submit">Send</PrimaryButton>
        </form>
      </SectionCard>

      {/* Replies */}
      <SectionCard title="📬 My Contact Messages">
        {contacts.length === 0 ? <p>No messages.</p> : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Message</th>
                <th>Admin Reply</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c.id}>
                  <td>{c.subject}</td>
                  <td>{c.message}</td>
                  <td>{c.adminReply || "Waiting for reply"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  );
}

export default ContactTab;
