// src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/auth?tab=login");
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

        <li className={`menu-item ${isActive("/transactions") ? "active" : ""}`}>
          <Link to="/transactions" className="menu-link">
            <i className="fas fa-list"></i>
            <span>Transactions</span>
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

      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
