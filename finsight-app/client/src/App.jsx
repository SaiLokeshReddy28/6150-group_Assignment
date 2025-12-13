import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import InsightsPage from "./pages/InsightsPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";



// Admin pages
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminUploadsPage from "./pages/admin/AdminUploadsPage.jsx";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage.jsx"; // ✅ NEW

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
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TransactionsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />


      {/* Admin routes (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* /admin → dashboard */}
        <Route index element={<AdminDashboard />} />
        {/* /admin/dashboard → also dashboard (for your sidebar link) */}
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* /admin/users */}
        <Route path="users" element={<AdminUsersPage />} />

        {/* /admin/uploads */}
        <Route path="uploads" element={<AdminUploadsPage />} />

        {/* /admin/requests → NEW admin approval page */}
        <Route path="requests" element={<AdminRequestsPage />} />


      </Route>
    </Routes>
  );
}

export default App;
