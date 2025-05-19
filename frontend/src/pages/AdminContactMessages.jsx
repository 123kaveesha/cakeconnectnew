import React, { useEffect, useState } from "react";
import { getAllContacts } from "../services/contactService";
import "../styles/adminContactMessagesPageStyles.css";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getAllContacts();
        setMessages(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  return (
    <div className="admin-contact-messages">
      <h2>Contact Messages</h2>
      {loading ? (
        <div className="spinner" />
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : messages.length === 0 ? (
        <p>No messages submitted yet.</p>
      ) : (
        <div className="messages-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m, i) => (
                <tr key={m._id}>
                  <td>{i + 1}</td>
                  <td>{m.name || "Anonymous"}</td>
                  <td>{m.email}</td>
                  <td>{m.subject}</td>
                  <td>{m.message}</td>
                  <td>{new Date(m.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
