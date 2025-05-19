import React, { useEffect, useState } from "react";
import { getBakerDesignRequests, updateCakeRequestStatus } from "../services/cakeDesignService";
import "../styles/bakerCakeRequestsStyles.css"; // Make sure this file exists

const BakerCakeRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getBakerDesignRequests();
        setRequests(res);
      } catch (err) {
        console.error("Failed to load cake design requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await updateCakeRequestStatus(requestId, newStatus);
      setStatusMsg("Status updated successfully");
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      setStatusMsg("Failed to update status");
      console.error(err);
    }

    setTimeout(() => setStatusMsg(""), 3000);
  };

  return (
    <div className="baker-cake-requests">
      <h2 className="page-title">Cake Design Requests</h2>
      {statusMsg && <div className="status-msg">{statusMsg}</div>}

      {loading ? (
        <div className="loader">Loading...</div>
      ) : requests.length === 0 ? (
        <p>No design requests found.</p>
      ) : (
        <div className="request-list">
          {requests.map((req) => (
            <div key={req._id} className="request-card">
              <model-viewer
                src={req.objectUrl}
                alt="3D Cake Design"
                auto-rotate
                camera-controls
                ar
                style={{ width: "100%", height: "300px" }}
              ></model-viewer>

              <div className="request-info">
                <p><strong>Customer:</strong> {req.customer?.name || "Unknown"}</p>
                <p><strong>Status:</strong> {req.status}</p>
                {req.message && <p><strong>Message:</strong> {req.message}</p>}

                <label>
                  Change Status:
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BakerCakeRequestsPage;