import React from "react";
import api from "../api/axiosClient";

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const InsightsPage = () => {
  const [selectedMonth, setSelectedMonth] = React.useState(
    getCurrentMonthKey()
  );
  const [data, setData] = React.useState(null);
  const [budgetSummary, setBudgetSummary] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadInsights = React.useCallback(async () => {
    setLoading(true);
    try {
      const [insightsRes, budgetRes] = await Promise.allSettled([
        api.get("/insights", { params: { month: selectedMonth } }),
        api.get("/budgets/summary", { params: { month: selectedMonth } }),
      ]);

      if (insightsRes.status === "fulfilled") {
        setData(insightsRes.value.data);
        setError(null);
      } else {
        console.error("Failed to load insights", insightsRes.reason);
        setData(null);
        setError("Unable to load insights data.");
      }

      if (budgetRes.status === "fulfilled") {
        setBudgetSummary(budgetRes.value.data);
      } else {
        console.warn("Failed to load budget summary", budgetRes.reason);
        setBudgetSummary(null);
      }
    } catch (err) {
      console.error("Unexpected insights error", err);
      setData(null);
      setBudgetSummary(null);
      setError("Unable to load insights data.");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  React.useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const monthlyTrend = data?.monthlyTrend || [];
  const categories = data?.categories || [];
  const topMerchants = data?.topMerchants || [];
  const recurringMerchants = data?.recurringMerchants || [];
  const alerts = data?.alerts || [];
  const cashflow = data?.cashflow || {};
  const budgetInsights = React.useMemo(() => {
    if (!budgetSummary) return [];
    const summary = budgetSummary.summary || {};
    const categories = budgetSummary.categories || [];
    const fallbackCategories = categories.length
      ? categories
      : (budgetSummary.uncategorized || []).map((cat) => ({
          ...cat,
          percentUsed: null,
          limit: null,
        }));
    const messages = [];

    fallbackCategories.slice(0, 4).forEach((cat) => {
      if (cat.percentUsed !== null && cat.percentUsed >= 90) {
        messages.push(
          `You have used ${cat.percentUsed}% of your ${cat.name} budget. Consider slowing down spending.`
        );
      } else if (cat.percentUsed !== null && cat.percentUsed <= 40) {
        messages.push(
          `${cat.name} spending is only ${cat.percentUsed}% of the budget. You could reallocate funds elsewhere.`
        );
      } else if (cat.percentUsed === null) {
        messages.push(
          `You have spent ${formatCurrency(
            cat.spent
          )} on ${cat.name} this month from your statements. Consider setting a budget.`
        );
      }
    });

    if (
      categories.length > 0 &&
      summary.totalLimit > 0 &&
      (summary.remaining || 0) < summary.totalLimit * 0.1
    ) {
      messages.push("Less than 10% of your monthly budget remains.");
    }

    return messages;
  }, [budgetSummary]);

  return (
    <div className="app-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-1">Insights</h1>
          <p className="text-muted mb-0">
            AI highlights and spending intelligence based on your statements.
          </p>
        </div>
        <div className="d-flex gap-2">
          <input
            type="month"
            className="form-control"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <button className="btn btn-outline-primary" onClick={loadInsights}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Income</p>
                  <h3 className="fw-bold text-success mb-0">
                    {formatCurrency(cashflow.income || 0)}
                  </h3>
                  <small className="text-muted">
                    vs last month: {formatCurrency(cashflow.previousExpenses || 0)}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Expenses</p>
                  <h3 className="fw-bold text-danger mb-0">
                    {formatCurrency(cashflow.expenses || 0)}
                  </h3>
                  <small className="text-muted">
                    Last month {formatCurrency(cashflow.previousExpenses || 0)}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Net Position</p>
                  <h3
                    className={`fw-bold ${
                      (cashflow.income || 0) - (cashflow.expenses || 0) >= 0
                        ? "text-success"
                        : "text-danger"
                    } mb-0`}
                  >
                    {formatCurrency(
                      (cashflow.income || 0) - (cashflow.expenses || 0)
                    )}
                  </h3>
                  <small className="text-muted">
                    {data?.month ? formatMonthLabel(data.month) : ""}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Monthly Cashflow Trend</h5>
                  <small className="text-muted">Last 6 months</small>
                </div>
                <div className="card-body">
                  {monthlyTrend.length === 0 ? (
                    <p className="text-muted mb-0">
                      Not enough data yet. Upload more statements.
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm align-middle">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Income</th>
                            <th>Expenses</th>
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
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Alerts</h5>
                </div>
                <div className="card-body">
                  {alerts.length === 0 ? (
                    <p className="text-muted mb-0">No alerts for this month.</p>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {alerts.map((message, idx) => (
                        <li className="mb-3 d-flex" key={idx}>
                          <span className="text-warning me-2">
                            <i className="fas fa-bell"></i>
                          </span>
                          <span>{message}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">AI Insights & Suggestions</h5>
                </div>
                <div className="card-body">
                  {!budgetSummary ? (
                    <p className="text-muted mb-0">
                      Budget insights are unavailable for this month.
                    </p>
                  ) : budgetInsights.length === 0 ? (
                    <p className="text-muted mb-0">
                      Great job! Your budgets look healthy this month.
                    </p>
                  ) : (
                    budgetInsights.map((message, idx) => (
                      <div
                        className="alert alert-info border-start border-info border-4"
                        key={idx}
                      >
                        <i className="fas fa-lightbulb me-2"></i>
                        {message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Category Performance</h5>
                  <small className="text-muted">
                    Current vs previous month
                  </small>
                </div>
                <div className="card-body">
                  {categories.length === 0 ? (
                    <p className="text-muted mb-0">
                      Upload a statement to see category insights.
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th className="text-end">This Month</th>
                            <th className="text-end">Last Month</th>
                            <th className="text-end">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((cat) => (
                            <tr key={cat.name}>
                              <td>{cat.name}</td>
                              <td className="text-end">
                                {formatCurrency(cat.current)}
                              </td>
                              <td className="text-end text-muted">
                                {formatCurrency(cat.previous)}
                              </td>
                              <td
                                className={`text-end ${
                                  cat.change >= 0 ? "text-danger" : "text-success"
                                }`}
                              >
                                {cat.change >= 0 ? "+" : "-"}
                                {formatCurrency(Math.abs(cat.change))}
                                {cat.percent !== null &&
                                  ` (${cat.percent > 0 ? "+" : ""}${
                                    cat.percent
                                  }%)`}
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
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Top Merchants</h5>
                </div>
                <div className="card-body">
                  {topMerchants.length === 0 ? (
                    <p className="text-muted mb-0">
                      No merchant data for this month.
                    </p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {topMerchants.map((merchant) => (
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center px-0"
                          key={merchant.name}
                        >
                          <div>
                            <strong>{merchant.name}</strong>
                            <div className="text-muted small">
                              {merchant.transactions} transactions
                            </div>
                          </div>
                          <span className="text-danger">
                            {formatCurrency(merchant.spent)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Recurring Merchants</h5>
                </div>
                <div className="card-body">
                  {recurringMerchants.length === 0 ? (
                    <p className="text-muted mb-0">
                      No recurring spend detected this month.
                    </p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {recurringMerchants.map((merchant) => (
                        <span
                          className="badge bg-light text-dark border"
                          key={merchant.name}
                        >
                          {merchant.name} · {merchant.transactions}x
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InsightsPage;
