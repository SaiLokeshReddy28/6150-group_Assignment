// src/pages/UploadPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axiosClient";

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploads, setUploads] = useState([]);

  // --- Fetch uploads (reusable helper) -------------------------------

  const fetchUploads = useCallback(async () => {
    try {
      const res = await api.get("/uploads");
      setUploads(res.data.uploads || []);
    } catch (err) {
      console.error("Failed to fetch uploads:", err);
    }
  }, []);

  // Load existing uploads on mount
  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  // --- File selection / DnD helpers ----------------------------------

  const validateFile = (file) => {
    if (file.type !== "application/pdf") {
      return "Only PDF files are supported.";
    }
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return "File is too large. Max size is 10 MB.";
    }
    return null;
  };

  const handleFilesAdded = (files) => {
    setError("");
    setSuccess("");

    const fileArray = Array.from(files);
    const validFiles = [];
    for (const f of fileArray) {
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(f);
    }
    setSelectedFiles(validFiles);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesAdded(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    setError("");
    setSuccess("");
  };

  // --- Upload logic ---------------------------------------------------

  const handleUpload = async () => {
    setError("");
    setSuccess("");

    if (selectedFiles.length === 0) {
      setError("Please select at least one PDF first.");
      return;
    }

    setIsUploading(true);

    try {
      for (const file of selectedFiles) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          setIsUploading(false);
          return;
        }

        const formData = new FormData();
        // IMPORTANT: field name MUST be "statement"
        formData.append("statement", file);

        const res = await api.post("/uploads/statement", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000, // 60 seconds for AI processing
        });

        console.log("Upload response:", res.status, res.data);
      }

      // Refresh from backend so Recent Uploads shows the new file(s)
      await fetchUploads();

      // Clear selected files so they disappear from the "Selected Files" card
      setSelectedFiles([]);
      setSuccess("File(s) uploaded and processed successfully.");
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err?.response?.data?.message ||
        "Failed to upload one or more files. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // --- Delete upload --------------------------------------------------

  const handleDeleteUpload = async (uploadId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this upload and its transactions?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/uploads/${uploadId}`);
      setUploads((prev) =>
        prev.filter((u) => u.id !== uploadId && u._id !== uploadId)
      );
    } catch (err) {
      console.error("Delete upload error:", err);
      alert("Failed to delete this upload. Please try again.");
    }
  };

  // --- Helpers --------------------------------------------------------

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return "-";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getTxnCount = (upload) =>
    upload?.summary?.totalTransactions ?? "-";

  const renderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "processed") {
      return <span className="badge bg-success">Processed</span>;
    } else if (s === "pending" || s === "processing") {
      return <span className="badge bg-warning">Processing...</span>;
    } else if (s === "failed") {
      return <span className="badge bg-danger">Failed</span>;
    } else {
      return <span className="badge bg-secondary">{status || "Unknown"}</span>;
    }
  };

  // --- JSX ------------------------------------------------------------

  return (
    <div className="app-container">
      <h1 className="page-title">Upload Documents</h1>

      {/* Instructions Card */}
      <div className="card mb-4">
        <div className="card-body d-flex align-items-start">
          <div className="flex-shrink-0">
            <i className="fas fa-info-circle text-primary fa-2x"></i>
          </div>
          <div className="flex-grow-1 ms-3">
            <h5 className="mb-2">
              <i className="fas fa-lightbulb text-warning me-2"></i>
              How to Upload Documents
            </h5>
            <p className="mb-2">
              Drag and drop your bank or credit card statements or click to
              browse. Our AI will automatically analyze and categorize your
              transactions.
            </p>
            <p className="mb-0 text-muted small">
              <strong>Supported formats:</strong> PDF (Max 10MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* Upload Zone */}
      <div className="card upload-card mb-4">
        <div className="card-body p-5">
          <div
            className={`upload-zone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon mb-4">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <h4 className="mb-3">Drag &amp; Drop PDF Statements Here</h4>
            <p className="text-muted mb-4">
              or click the button below to browse
            </p>
            <input
              type="file"
              accept="application/pdf"
              multiple={false}
              hidden
              id="pdfFileInput"
              onChange={handleInputChange}
            />
            <button
              className="btn btn-primary btn-lg"
              onClick={() =>
                document.getElementById("pdfFileInput")?.click()
              }
              disabled={isUploading}
            >
              <i className="fas fa-folder-open me-2"></i>
              Browse Files
            </button>

            <div className="supported-formats mt-4">
              <span className="badge bg-light text-dark">
                <i className="fas fa-file-pdf text-danger me-1"></i>PDF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-file-alt me-2"></i>
              Selected Files ({selectedFiles.length})
            </h5>
            <button
              className="btn btn-sm btn-danger"
              onClick={clearSelectedFiles}
              disabled={isUploading}
            >
              <i className="fas fa-trash me-2"></i>
              Clear All
            </button>
          </div>
          <div className="card-body p-0">
            <ul className="list-group list-group-flush">
              {selectedFiles.map((file, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex align-items-center"
                >
                  <i className="fas fa-file-pdf text-danger me-3"></i>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{file.name}</div>
                    <div className="text-muted small">
                      {formatSize(file.size)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-footer d-flex justify-content-end bg-white">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={clearSelectedFiles}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload me-2"></i>
                  Upload Files
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Recent Uploads */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-history me-2"></i>
            Recent Uploads
          </h5>
        </div>
        <div className="card-body p-0">
          {uploads.length === 0 ? (
            <div className="p-4 text-center text-muted">
              No uploads yet. Try uploading a statement above.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Uploaded At</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Transactions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uploads.map((u) => {
                    const id = u._id || u.id;
                    return (
                      <tr key={id}>
                        <td>
                          <i className="fas fa-file-pdf text-danger me-2"></i>
                          {u.originalName}
                        </td>
                        <td>{formatDateTime(u.createdAt)}</td>
                        <td>{formatSize(u.size)}</td>
                        <td>{renderStatusBadge(u.status)}</td>
                        <td>{getTxnCount(u)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUpload(id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;