// src/pages/admin/AdminRequestsPage.jsx

import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminRequestsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  const getToken = () =>
    localStorage.getItem("finsight_token") ||
    sessionStorage.getItem("finsight_token");

  // Fetch pending admin requests
  const loadRequests = async () => {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) {
        console.error("No token found. Admin is not logged in.");
        setActionMessage("You are not authorized.");
        return;
      }

      const res = await api.get("/admin/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(res.data.pending || []);

    } catch (err) {
      console.error("Failed to load admin requests:", err);
      setActionMessage("Failed to load admin requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Approve admin access
  const approveRequest = async (id) => {
    try {
      const token = getToken();

      await api.patch(
        `/admin/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActionMessage("User has been promoted to admin!");
      loadRequests();
    } catch (err) {
      console.error("Approve error:", err);
      setActionMessage("Failed to approve request.");
    }
  };

  // Reject admin access
  const rejectRequest = async (id) => {
    try {
      const token = getToken();

      await api.patch(
        `/admin/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActionMessage("Admin request rejected.");
      loadRequests();
    } catch (err) {
      console.error("Reject error:", err);
      setActionMessage("Failed to reject request.");
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>
          <i className="fas fa-user-shield me-2"></i> Admin Access Requests
        </h2>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </header>

      {actionMessage && (
        <div className="alert alert-info mt-3">{actionMessage}</div>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="alert alert-success mt-4">
          🎉 No pending admin requests!
        </div>
      ) : (
        <div className="card shadow mt-4">
          <div className="card-body">
            <h5 className="card-title">Pending Requests</h5>

            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Requested On</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.name}</td>
                    <td>{req.email}</td>
                    <td>{new Date(req.createdAt).toLocaleString()}</td>

                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => approveRequest(req._id)}
                      >
                        <i className="fas fa-check"></i> Approve
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => rejectRequest(req._id)}
                      >
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequestsPage;
