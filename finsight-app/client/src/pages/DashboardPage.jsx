// src/pages/DashboardPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatCurrency = (value = 0) => currencyFormatter.format(value);

const formatMonthLabel = (monthKey) => {
  if (!monthKey) return "-";
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const defaultAlertCategories = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Housing",
  "Utilities",
  "Healthcare",
  "Education",
  "Income",
  "Fees",
  "Other",
];

const loadStoredAlerts = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("finsight_alerts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const fallbackStats = {
  summary: {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    monthlyIncome: 0,
    monthlySpending: 0,
    budgetUsage: null,
  },
  categories: [],
  monthlyTrend: [],
  recentTransactions: [],
  budget: null,
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.fullName || "User";

  const [transactions, setTransactions] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [statsLoading, setStatsLoading] = React.useState(true);
  const [txLoading, setTxLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showAlertModal, setShowAlertModal] = React.useState(false);
  const [alertForm, setAlertForm] = React.useState({ category: "", threshold: "" });
  const [alertFeedback, setAlertFeedback] = React.useState(null);
  const [savedAlerts, setSavedAlerts] = React.useState(loadStoredAlerts);

  React.useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const res = await api.get("/transactions/dashboard");
        if (!isMounted) return;
        setStats(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
        if (isMounted) {
          setStats(fallbackStats);
          setError("Unable to load dashboard data right now.");
        }
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    };

    const loadTransactions = async () => {
      setTxLoading(true);
      try {
        const res = await api.get("/transactions");
        if (!isMounted) return;
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        if (isMounted) setTxLoading(false);
      }
    };

    loadStats();
    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("finsight_alerts", JSON.stringify(savedAlerts));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("finsight-alerts-updated"));
      }
    } catch (err) {
      console.error("Failed to persist alerts", err);
    }
  }, [savedAlerts]);

  React.useEffect(() => {
    if (!alertFeedback) return undefined;
    const timer = setTimeout(() => setAlertFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [alertFeedback]);

  const summary = stats?.summary || {};
  const categories = stats?.categories || [];
  const monthlyTrend = stats?.monthlyTrend || [];
  const budgetUsage = summary?.budgetUsage;
  const topCategory = categories[0];
  const categoryOptions = React.useMemo(() => {
    const set = new Set(categories.map((cat) => cat.name).filter(Boolean));
    defaultAlertCategories.forEach((cat) => set.add(cat));
    return Array.from(set);
  }, [categories]);

  const insightMessage = statsLoading
    ? "Crunching the latest numbers..."
    : topCategory
    ? `Your top spending category this month is ${topCategory.name} with ${formatCurrency(
        topCategory.spent
      )}.`
    : "Upload a statement to unlock personalized insights.";

  return (
    <>
      <div className="card welcome-card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="mb-2">Welcome back, {displayName}! 👋</h2>
              <p className="text-muted mb-0">
                Here&apos;s the latest snapshot of your finances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && !stats && (
        <div className="alert alert-warning">{error}</div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="stat-details">
              <p className="stat-label">Total Balance</p>
              <h3 className="stat-value">
                {statsLoading
                  ? "..."
                  : formatCurrency(summary.totalBalance || 0)}
              </h3>
              <span className="stat-change positive">
                Lifetime income {formatCurrency(summary.totalIncome || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-card-danger">
            <div className="stat-icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <div className="stat-details">
              <p className="stat-label">Monthly Spending</p>
              <h3 className="stat-value">
                {statsLoading
                  ? "..."
                  : formatCurrency(summary.monthlySpending || 0)}
              </h3>
              <span className="stat-change negative">
                Expenses YTD {formatCurrency(summary.totalExpenses || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-card-success">
            <div className="stat-icon">
              <i className="fas fa-coins"></i>
            </div>
            <div className="stat-details">
              <p className="stat-label">Monthly Income</p>
              <h3 className="stat-value">
                {statsLoading
                  ? "..."
                  : formatCurrency(summary.monthlyIncome || 0)}
              </h3>
              <span className="stat-change positive">
                Net {formatCurrency(
                  (summary.monthlyIncome || 0) - (summary.monthlySpending || 0)
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="stat-details">
              <p className="stat-label">Budget Used</p>
              <h3 className="stat-value">
                {budgetUsage ? `${budgetUsage.percent}%` : "No budget"}
              </h3>
              <span className="stat-change neutral">
                {budgetUsage
                  ? `${formatCurrency(
                      budgetUsage.spent
                    )} of ${formatCurrency(budgetUsage.limit)}`
                  : "Set up a monthly budget"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>Spending Trend
              </h5>
              <small className="text-muted">Last 6 months</small>
            </div>
            <div className="card-body">
              {statsLoading ? (
                <p className="text-muted mb-0">Loading trend data...</p>
              ) : monthlyTrend.length === 0 ? (
                <p className="text-muted mb-0">
                  Upload statements to see month-over-month trends.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th className="text-success">Income</th>
                        <th className="text-danger">Expenses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyTrend.map((item) => (
                        <tr key={item.month}>
                          <td>{formatMonthLabel(item.month)}</td>
                          <td className="text-success">
                            {formatCurrency(item.income)}
                          </td>
                          <td className="text-danger">
                            {formatCurrency(item.expenses)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>Categories
              </h5>
            </div>
            <div className="card-body">
              {statsLoading ? (
                <p className="text-muted mb-0">Loading categories...</p>
              ) : categories.length === 0 ? (
                <p className="text-muted mb-0">
                  No categorized spend for this month yet.
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {categories.slice(0, 5).map((cat) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                      key={cat.name}
                    >
                      <span>{cat.name}</span>
                      <strong className="text-danger">
                        {formatCurrency(cat.spent)}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">
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
                <button
                  className="quick-action-btn"
                  onClick={() => setShowAlertModal(true)}
                >
                  <i className="fas fa-bell"></i>
                  <span>Set Alert</span>
                </button>
              </div>
              {alertFeedback && (
                <div className="alert alert-success mt-3 mb-0 py-2">
                  <i className="fas fa-check-circle me-2"></i>
                  {alertFeedback}
                </div>
              )}
              {savedAlerts.length > 0 && (
                <div className="mt-4">
                  <h6 className="text-muted text-uppercase small mb-2">
                    Active Alerts
                  </h6>
                  <ul className="list-group list-group-flush">
                    {savedAlerts.map((alert) => (
                      <li
                        className="list-group-item px-0 d-flex justify-content-between align-items-center"
                        key={alert.id}
                      >
                        <div>
                          <strong>{alert.category}</strong>{" "}
                          <span className="text-muted small">
                            {`>${formatCurrency(alert.threshold)}`}
                          </span>
                        </div>
                        <button
                          className="btn btn-sm btn-link text-danger"
                          onClick={() =>
                            setSavedAlerts((prev) =>
                              prev.filter((item) => item.id !== alert.id)
                            )
                          }
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>Recent Transactions
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/transactions")}
              >
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
                    {txLoading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          No transactions found. Upload a statement to get
                          started.
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
                              <div
                                className="icon-circle bg-light text-primary me-2 rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                              >
                                <i className="fas fa-receipt"></i>
                              </div>
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                                title={txn.description}
                              >
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
                            {txn.amount < 0 ? "-" : "+"}
                            {formatCurrency(Math.abs(txn.amount))}
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

      <div className="row g-4">
        <div className="col-12">
          <div
            className="alert alert-info alert-dismissible fade show"
            role="alert"
          >
            <i className="fas fa-lightbulb me-2"></i>
            <strong>Insight:</strong> {insightMessage}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={(e) =>
                e.currentTarget.closest(".alert")?.classList.add("d-none")
              }
            ></button>
          </div>
        </div>
      </div>

      {showAlertModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-bell me-2"></i>Create Spending Alert
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAlertModal(false)}
                  ></button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!alertForm.category || !alertForm.threshold) return;
                    const newAlert = {
                      id: Date.now(),
                      category: alertForm.category,
                      threshold: Number(alertForm.threshold),
                      createdAt: new Date().toISOString(),
                    };
                    setSavedAlerts((prev) => [...prev, newAlert]);
                    setAlertForm({ category: "", threshold: "" });
                    setShowAlertModal(false);
                    setAlertFeedback(
                      `Alert saved for ${newAlert.category} spending above ${formatCurrency(
                        newAlert.threshold
                      )}.`
                    );
                  }}
                >
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={alertForm.category}
                        onChange={(e) =>
                          setAlertForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select a category</option>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Monthly Threshold ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={alertForm.threshold}
                        onChange={(e) =>
                          setAlertForm((prev) => ({
                            ...prev,
                            threshold: e.target.value,
                          }))
                        }
                        placeholder="500"
                      />
                    </div>
                    <p className="text-muted small mb-0">
                      Alerts are stored locally for now — we&apos;ll remind you when
                      a category exceeds your limit.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowAlertModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!alertForm.category || !alertForm.threshold}
                    >
                      Save Alert
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default DashboardPage;
