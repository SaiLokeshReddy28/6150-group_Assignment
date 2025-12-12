// src/components/layout/Topbar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const routeTitleMap = {
  "/dashboard": "Dashboard Overview",
  "/budget": "Budget Planning",
  "/upload": "Upload Documents",
  "/insights": "View Insights",
  "/profile": "My Profile",
  "/settings": "Settings",
};

const Topbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle =
    routeTitleMap[location.pathname] || "Finsight Dashboard";

  const displayName = user?.name || user?.fullName || "User";

  // 👉 Navigation handlers
  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth?tab=login");
  };

  return (
    <header className="top-header">
      <button
        className="menu-toggle"
        id="menuToggle"
        onClick={onToggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>

      <h1 className="page-title">{pageTitle}</h1>

      <div className="header-actions">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search..."
            className="form-control"
          />
        </div>

        <div className="notification-icon">
          <i className="fas fa-bell"></i>
          <span className="badge bg-danger">3</span>
        </div>

        <div className="dropdown">
          <button
            className="profile-btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-user-circle"></i>
            <span>{displayName}</span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            {/* 🎯 PROFILE BUTTON */}
            <li>
              <button className="dropdown-item" onClick={handleProfile}>
                <i className="fas fa-user me-2"></i> Profile
              </button>
            </li>

            {/* 🎯 SETTINGS BUTTON */}
            <li>
              <button className="dropdown-item" onClick={handleSettings}>
                <i className="fas fa-cog me-2"></i> Settings
              </button>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            {/* 🔴 LOGOUT */}
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
