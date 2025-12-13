// src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear auth state and storage
    logout();
    
    // Force redirect to login page
    navigate("/auth?tab=login", { replace: true });
    
    // Optional: Force page reload to clear any cached state
    // setTimeout(() => window.location.href = "/auth?tab=login", 100);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${isOpen ? "" : "collapsed"}`} id="sidebar">
      <div className="sidebar-header">
        <i className="fas fa-wallet"></i>
        <span className="sidebar-brand">Finsight</span>
      </div>

      <ul className="sidebar-menu">
        <li className={`menu-item ${isActive("/dashboard") ? "active" : ""}`}>
          <Link to="/dashboard" className="menu-link">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className={`menu-item ${isActive("/budget") ? "active" : ""}`}>
          <Link to="/budget" className="menu-link">
            <i className="fas fa-wallet"></i>
            <span>Budget Planning</span>
          </Link>
        </li>

        <li className={`menu-item ${isActive("/upload") ? "active" : ""}`}>
          <Link to="/upload" className="menu-link">
            <i className="fas fa-cloud-upload-alt"></i>
            <span>Upload Documents</span>
          </Link>
        </li>

        <li className={`menu-item ${isActive("/insights") ? "active" : ""}`}>
          <Link to="/insights" className="menu-link">
            <i className="fas fa-chart-line"></i>
            <span>View Insights</span>
          </Link>
        </li>

        <li className="menu-item">
          <button type="button" className="menu-link menu-link-btn">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </button>
        </li>
      </ul>

      <div className="sidebar-footer">
        {user && (
          <div className="user-info" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", color: "#888" }}>
            <div>{user.name}</div>
            <div style={{ fontSize: "0.75rem" }}>{user.email}</div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;