// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // temporary: show a spinner so we don’t get a blank page
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Checking login...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth?tab=login`} replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;