// src/pages/DashboardPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";

const DashboardPage = () => {
  const { user } = useAuth();
  const displayName = user?.name || user?.fullName || "User";
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <>
      {/* Welcome Card */}
      <div className="card welcome-card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-2">Welcome back, {displayName}! 👋</h2>
              <p className="text-muted mb-0">
                Here's what's happening with your finances today.
              </p>
            </div>
            <button className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>Quick Add
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        {/* Total Balance */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="stat-details">
              <p className="stat-label">Total Balance</p>
              <h3 className="stat-value">$12,450</h3>
              <span className="stat-change positive">
                <i className="fas fa-arrow-up"></i> 12.5%
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-card-danger">
            <div className="stat-icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <div className="stat-details">
              <p className="stat-label">Monthly Spending</p>
              <h3 className="stat-value">$2,845</h3>
              <span className="stat-change negative">
                <i className="fas fa-arrow-down"></i> 3.2%
              </span>
            </div>
          </div>
        </div>

        {/* Savings Goal */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-card-success">
            <div className="stat-icon">
              <i className="fas fa-piggy-bank"></i>
            </div>
            <div className="stat-details">
              <p className="stat-label">Savings Goal</p>
              <h3 className="stat-value">$8,200</h3>
              <span className="stat-change positive">
                <i className="fas fa-arrow-up"></i> 82%
              </span>
            </div>
          </div>
        </div>

        {/* Budget Used */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="stat-details">
              <p className="stat-label">Budget Used</p>
              <h3 className="stat-value">81%</h3>
              <span className="stat-change neutral">
                <i className="fas fa-minus"></i> On track
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        {/* Spending Trend */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>
                <i className="fas fa-chart-line me-2"></i>Spending Trend
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">
                Charts coming soon – data visualization will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>
                <i className="fas fa-chart-pie me-2"></i>Categories
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">
                Category breakdown chart will go here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Transactions */}
      <div className="row g-4 mb-4">
        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>
                <i className="fas fa-bolt me-2"></i>Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="quick-action-grid">
                <Link to="/budget" className="quick-action-btn">
                  <i className="fas fa-wallet"></i>
                  <span>Create Budget</span>
                </Link>
                <Link to="/upload" className="quick-action-btn">
                  <i className="fas fa-upload"></i>
                  <span>Upload Doc</span>
                </Link>
                <Link to="/insights" className="quick-action-btn">
                  <i className="fas fa-chart-bar"></i>
                  <span>View Insights</span>
                </Link>
                <button className="quick-action-btn">
                  <i className="fas fa-bell"></i>
                  <span>Set Alert</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>
                <i className="fas fa-list me-2"></i>Recent Transactions
              </h5>
              <button className="btn btn-sm btn-outline-primary">
                View All
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          No transactions found. Upload a statement to get started.
                        </td>
                      </tr>
                    ) : (
                      transactions.slice(0, 5).map((txn) => (
                        <tr key={txn._id}>
                          <td>
                            {txn.date
                              ? new Date(txn.date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="icon-circle bg-light text-primary me-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <i className="fas fa-receipt"></i>
                              </div>
                              <span className="text-truncate" style={{ maxWidth: '200px' }} title={txn.description}>
                                {txn.description}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {txn.category || "Other"}
                            </span>
                          </td>
                          <td
                            className={
                              txn.amount < 0 ? "text-danger" : "text-success"
                            }
                          >
                            {txn.amount < 0 ? "-" : "+"}$
                            {Math.abs(txn.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Alert */}
      <div className="row g-4">
        <div className="col-12">
          <div
            className="alert alert-info alert-dismissible fade show"
            role="alert"
          >
            <i className="fas fa-lightbulb me-2"></i>
            <strong>Insight:</strong> You're spending 25% more on dining out
            this month. Consider meal planning to save $150!
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={(e) =>
                e.target.closest(".alert")?.classList.add("d-none")
              }
            ></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;