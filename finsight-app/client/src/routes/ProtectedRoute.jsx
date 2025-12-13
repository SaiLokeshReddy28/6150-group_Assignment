// src/routes/ProtectedRoute.jsx
import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication on mount and when user/token changes
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      console.log("🚫 Not authenticated, redirecting to login...");
      navigate("/auth?tab=login", { replace: true, state: { from: location } });
    }
  }, [user, token, loading, isAuthenticated, navigate, location]);

  if (loading) {
    // Show loading spinner while checking auth
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // If no user or token, redirect to login
  if (!user || !token) {
    return <Navigate to="/auth?tab=login" replace state={{ from: location }} />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;