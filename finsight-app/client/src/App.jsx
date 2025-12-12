import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import InsightsPage from "./pages/InsightsPage.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/welcome" element={<WelcomePage />} />

      {/* Protected pages (with AppLayout) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BudgetPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UploadPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InsightsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;