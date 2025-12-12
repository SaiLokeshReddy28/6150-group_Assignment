import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#F4F5FA" }}>

      {/* ====================== SIDEBAR ====================== */}
      <aside
        style={{
          width: sidebarOpen ? "250px" : "80px",
          background: "#121421",
          color: "white",
          transition: "0.3s",
          padding: "20px 15px",
          borderRight: "1px solid #2E3146",
        }}
      >
        <h4
          style={{
            opacity: sidebarOpen ? 1 : 0,
            transition: "0.3s",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Admin Panel
        </h4>

        <div className="d-flex flex-column gap-3">

          <NavLink
            to="/admin/dashboard"
            className="text-white nav-link"
            style={{ fontSize: "1rem" }}
          >
            📊 {sidebarOpen && "Analytics"}
          </NavLink>

          <NavLink
            to="/admin/users"
            className="text-white nav-link"
            style={{ fontSize: "1rem" }}
          >
            👥 {sidebarOpen && "Users"}
          </NavLink>

          <NavLink
            to="/admin/uploads"
            className="text-white nav-link"
            style={{ fontSize: "1rem" }}
          >
            📁 {sidebarOpen && "Uploads"}
          </NavLink>

          <NavLink
            to="/admin/requests"
            className="text-white nav-link"
            style={{ fontSize: "1rem" }}
          >
            🛡️ {sidebarOpen && "Admin Requests"}
          </NavLink>


          <hr style={{ borderColor: "#444" }} />

          <button
            className="btn btn-outline-light w-100"
            onClick={() => navigate("/dashboard")}
          >
            {sidebarOpen ? "Back to User View" : "↩"}
          </button>
        </div>
      </aside>

      {/* ====================== MAIN CONTENT ====================== */}
      <div className="flex-grow-1">

        {/* TOP NAVBAR */}
        <header
          className="px-4 py-3 d-flex justify-content-between align-items-center shadow-sm"
          style={{ background: "white" }}
        >
          <button
            className="btn btn-outline-secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "⬅" : "➡"}
          </button>

          <h4 className="fw-bold m-0">Admin Control Center</h4>

          <button
            className="btn btn-danger"
            onClick={() => navigate("/auth?tab=login")}
          >
            Logout
          </button>
        </header>

        {/* CONTENT */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
