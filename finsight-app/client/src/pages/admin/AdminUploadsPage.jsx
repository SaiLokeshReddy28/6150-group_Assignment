import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axiosClient";

const PAGE_SIZE = 8;

const AdminUploadsPage = () => {
  const [uploads, setUploads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedUpload, setSelectedUpload] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadUploads();
    // eslint-disable-next-line
  }, []);

  const loadUploads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/uploads", {
        params: {
          status: statusFilter || undefined,
        },
      });
      setUploads(res.data.uploads || []);
    } catch (err) {
      console.error("Admin uploads error:", err);
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  const deleteUpload = async (id) => {
    try {
      await api.delete(`/admin/uploads/${id}`);
      await loadUploads();
    } catch (err) {
      console.error("Delete upload error:", err);
    }
  };

  const openUploadModal = (upload) => {
    setSelectedUpload(upload);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setSelectedUpload(null);
    setShowUploadModal(false);
  };

  const openTransactionsModal = async (uploadId) => {
    try {
      const res = await api.get(`/uploads/${uploadId}/transactions`);
      setTransactions(res.data.transactions || []);
      setShowTransactionsModal(true);
    } catch (err) {
      console.error("Transactions load error:", err);
    }
  };

  const closeTransactionsModal = () => {
    setShowTransactionsModal(false);
    setTransactions([]);
  };

  // Client-side pagination
  const paginatedUploads = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return uploads.slice(start, start + PAGE_SIZE);
  }, [uploads, currentPage]);

  const totalPages = Math.ceil(uploads.length / PAGE_SIZE) || 1;

  return (
    <div>
      <h2 className="fw-bold mb-4">Uploads Management 📁</h2>

      {/* FILTERS */}
      <div className="card shadow-sm border-0 mb-4 p-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={loadUploads}
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply"}
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive p-3">
          <table className="table align-middle">
            <thead>
              <tr className="text-muted">
                <th>User</th>
                <th>File</th>
                <th>Status</th>
                <th>Size (KB)</th>
                <th>Date</th>
                <th style={{ width: "260px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUploads.map((u) => (
                <tr key={u._id}>
                  <td>{u.user?.email || "Unknown"}</td>
                  <td>{u.originalName}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.status === "completed"
                          ? "bg-success"
                          : u.status === "failed"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>{(u.size / 1024).toFixed(1)}</td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                  <td className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => openUploadModal(u)}
                    >
                      Details
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openTransactionsModal(u._id)}
                    >
                      Transactions
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteUpload(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedUploads.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No uploads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-between align-items-center px-3 pb-3">
          <small className="text-muted">
            Showing {paginatedUploads.length} of {uploads.length} uploads
          </small>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <button className="btn btn-sm btn-light" disabled>
              Page {currentPage} / {totalPages}
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* UPLOAD DETAILS MODAL */}
      {showUploadModal && selectedUpload && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeUploadModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>User:</strong>{" "}
                  {selectedUpload.user?.email || "Unknown"}
                </p>
                <p>
                  <strong>File:</strong> {selectedUpload.originalName}
                </p>
                <p>
                  <strong>Status:</strong> {selectedUpload.status}
                </p>
                <p>
                  <strong>Size:</strong>{" "}
                  {(selectedUpload.size / 1024).toFixed(1)} KB
                </p>
                <p>
                  <strong>Uploaded:</strong>{" "}
                  {new Date(selectedUpload.createdAt).toLocaleString()}
                </p>
                {selectedUpload.summary && (
                  <pre className="bg-light p-2 rounded small">
                    {JSON.stringify(selectedUpload.summary, null, 2)}
                  </pre>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeUploadModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTIONS MODAL */}
      {showTransactionsModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transactions</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeTransactionsModal}
                ></button>
              </div>
              <div className="modal-body">
                {transactions.length === 0 ? (
                  <p className="text-muted mb-0">
                    No transactions found for this upload.
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr className="text-muted">
                          <th>Date</th>
                          <th>Description</th>
                          <th>Amount</th>
                          <th>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t) => (
                          <tr key={t._id}>
                            <td>
                              {t.date
                                ? new Date(t.date).toLocaleDateString()
                                : "-"}
                            </td>
                            <td>{t.description}</td>
                            <td>{t.amount.toFixed(2)}</td>
                            <td>{t.category || "Other"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeTransactionsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploadsPage;
