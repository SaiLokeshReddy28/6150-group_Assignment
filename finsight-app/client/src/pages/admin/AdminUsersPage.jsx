import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axiosClient";

const PAGE_SIZE = 8;

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  /* ===================== LOAD USERS ===================== */
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users", {
        params: {
          search: search || undefined,
          role: roleFilter || undefined,
          isActive:
            statusFilter === ""
              ? undefined
              : statusFilter === "active"
                ? "true"
                : "false",
        },
      });

      setUsers(res.data.users || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Admin users error:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  /* ===================== VIEW USER ===================== */
  const handleViewUser = async (id) => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setSelectedUser(res.data.user);
      setShowUserModal(true);
    } catch (err) {
      alert("Failed to load user details");
    }
  };



  /* ===================== TOGGLE ACTIVE ===================== */
  const toggleStatus = async (user) => {
    try {
      await api.patch(`/admin/users/${user._id}/status`, {
        isActive: !user.isActive,
      });
      await loadUsers();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  
  


  /* ===================== PAGINATION ===================== */
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [users, currentPage]);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

  /* ===================== RENDER ===================== */
  return (
    <div>
      <h2 className="fw-bold mb-4">Manage Users 👥</h2>

      {/* SEARCH & FILTERS */}
      <div className="card shadow-sm border-0 mb-4 p-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadUsers()}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={loadUsers}
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply"}
            </button>
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive p-3">
          <table className="table align-middle">
            <thead>
              <tr className="text-muted">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ width: "240px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${u.role === "admin" ? "bg-primary" : "bg-secondary"
                        }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${u.isActive ? "bg-success" : "bg-danger"
                        }`}
                    >
                      {u.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleViewUser(u._id)}
                    >
                      View
                    </button>
                    <button
                      className={`btn btn-sm ${u.isActive
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                        }`}
                      onClick={() => toggleStatus(u)}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                    

                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-between align-items-center px-3 pb-3">
          <small className="text-muted">
            Showing {paginatedUsers.length} of {users.length} users
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

      {/* USER DETAILS MODAL */}
      {showUserModal && selectedUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  User Details – {selectedUser.name}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowUserModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Status:</strong> {selectedUser.isActive ? "Active" : "Inactive"}</p>
                <p><strong>Age:</strong> {selectedUser.age}</p>
                <p><strong>Phone:</strong> {selectedUser.countryCode} {selectedUser.phone}</p>
                <p><strong>Gender:</strong> {selectedUser.gender}</p>
                <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowUserModal(false)}
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

export default AdminUsersPage;
