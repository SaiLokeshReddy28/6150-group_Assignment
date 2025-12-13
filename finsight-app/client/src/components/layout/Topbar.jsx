// src/components/layout/Topbar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const routeTitleMap = {
  "/dashboard": "Dashboard Overview",
  "/transactions": "Transactions",
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
  const notificationIconRef = React.useRef(null);
  const notificationPanelRef = React.useRef(null);

  const [notifications, setNotifications] = React.useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("finsight_alerts");
      const parsed = raw ? JSON.parse(raw) : [];
      return parsed.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    } catch {
      return [];
    }
  });
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const refreshNotifications = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("finsight_alerts");
      const parsed = raw ? JSON.parse(raw) : [];
      parsed.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setNotifications(parsed);
    } catch (err) {
      console.error("Failed to load alerts", err);
      setNotifications([]);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const storageListener = (event) => {
      if (event.key === "finsight_alerts") {
        refreshNotifications();
      }
    };
    const customListener = () => refreshNotifications();

    window.addEventListener("storage", storageListener);
    window.addEventListener("finsight-alerts-updated", customListener);

    return () => {
      window.removeEventListener("storage", storageListener);
      window.removeEventListener("finsight-alerts-updated", customListener);
    };
  }, [refreshNotifications]);

  React.useEffect(() => {
    if (!notificationsOpen || typeof document === "undefined") return undefined;
    const handleClickOutside = (event) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target) &&
        notificationIconRef.current &&
        !notificationIconRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

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

        <div
          className={`notification-icon ${
            notificationsOpen ? "active" : ""
          }`}
          ref={notificationIconRef}
          onClick={() => {
            if (!notificationsOpen) refreshNotifications();
            setNotificationsOpen((prev) => !prev);
          }}
        >
          <i className="fas fa-bell"></i>
          {notifications.length > 0 && (
            <span className="badge bg-danger">
              {Math.min(notifications.length, 9)}
              {notifications.length > 9 ? "+" : ""}
            </span>
          )}
          {notificationsOpen && (
            <div className="notification-panel" ref={notificationPanelRef}>
              <div className="notification-panel__header">
                <strong>Alerts</strong>
                <button
                  type="button"
                  className="btn btn-sm btn-link"
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  Manage
                </button>
              </div>
              <div className="notification-panel__body">
                {notifications.length === 0 ? (
                  <p className="text-muted mb-0">
                    No alerts yet. Create one from your dashboard.
                  </p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {notifications.slice(0, 5).map((alert) => (
                      <li className="notification-panel__item" key={alert.id}>
                        <div>
                          <strong>{alert.category}</strong>
                          <div className="text-muted small">
                            Threshold {Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(alert.threshold || 0)}
                          </div>
                        </div>
                        <small className="text-muted">
                          {alert.createdAt
                            ? new Date(alert.createdAt).toLocaleDateString()
                            : ""}
                        </small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
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
