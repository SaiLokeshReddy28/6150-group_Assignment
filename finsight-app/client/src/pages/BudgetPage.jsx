// src/pages/BudgetPage.jsx
import React from "react";
import api from "../api/axiosClient";

const CATEGORY_OPTIONS = [
  "Housing",
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
  "Income",
  "Fees",
  "Other",
];

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const formatCurrency = (value = 0, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const generateCategoryId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `cat-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const CATEGORY_LOCKS = new Set(["Housing", "Food & Dining"]);

const createCategoryEntry = (name = "", limit = "") => ({
  id: generateCategoryId(),
  name,
  limit:
    limit === undefined || limit === null || Number.isNaN(limit)
      ? ""
      : String(limit),
  locked: CATEGORY_LOCKS.has(name),
});

const buildEmptySummaryData = (month) => ({
  month,
  currency: "USD",
  summary: {
    totalLimit: 0,
    totalSpent: 0,
    totalIncome: 0,
    remaining: 0,
    percentUsed: null,
  },
  categories: [],
  uncategorized: [],
  notes: "",
});

const buildFormState = (month, budget, summary) => ({
  month,
  totalLimit:
    budget?.totalLimit ??
    summary?.summary?.totalLimit ??
    summary?.summary?.totalSpent ??
    "",
  currency: budget?.currency || summary?.currency || "USD",
  manualIncome:
    budget?.manualIncome ??
    summary?.summary?.manualIncome ??
    summary?.summary?.actualIncome ??
    "",
  notes: budget?.notes || "",
  categories:
    budget?.categories?.length
      ? budget.categories.map((cat) => ({
        ...createCategoryEntry(cat.name, cat.limit),
      }))
      : summary?.categories?.length
        ? summary.categories.map((cat) => ({
          ...createCategoryEntry(cat.name, cat.limit ?? cat.spent ?? 0),
        }))
        : [createCategoryEntry()],
});

const initialMonthKey = getCurrentMonthKey();

const BudgetPage = () => {
  const [selectedMonth, setSelectedMonth] =
    React.useState(initialMonthKey);
  const [summaryData, setSummaryData] = React.useState(
    buildEmptySummaryData(initialMonthKey)
  );
  const [budget, setBudget] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [formData, setFormData] = React.useState(
    buildFormState(initialMonthKey, null, buildEmptySummaryData(initialMonthKey))
  );
  const [saving, setSaving] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState([]);

  const loadBudgetData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [budgetResult, summaryResult] = await Promise.allSettled([
        api.get("/budgets", { params: { month: selectedMonth } }),
        api.get("/budgets/summary", { params: { month: selectedMonth } }),
      ]);

      const resolvedBudget =
        budgetResult.status === "fulfilled"
          ? budgetResult.value.data.budget || null
          : null;
      if (budgetResult.status === "rejected") {
        console.error("Budget fetch failed:", budgetResult.reason);
      }

      const resolvedSummary =
        summaryResult.status === "fulfilled"
          ? summaryResult.value.data
          : buildEmptySummaryData(selectedMonth);
      if (summaryResult.status === "rejected") {
        console.error("Budget summary fetch failed:", summaryResult.reason);
      }

      setBudget(resolvedBudget);
      setSummaryData(resolvedSummary);
      setFormData(buildFormState(selectedMonth, resolvedBudget, resolvedSummary));

      const bothFailed =
        budgetResult.status === "rejected" &&
        summaryResult.status === "rejected";
      const someFailed =
        budgetResult.status === "rejected" ||
        summaryResult.status === "rejected";

      setError(
        bothFailed
          ? "Unable to load budget data. Please try again."
          : someFailed
            ? "Some budget data could not be loaded. Showing latest available information."
            : null
      );
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  React.useEffect(() => {
    loadBudgetData();
  }, [loadBudgetData]);

  const currency = summaryData?.currency || "USD";
  const summary = summaryData?.summary || {};
  const categories = summaryData?.categories || [];
  const uncategorized = summaryData?.uncategorized || [];
  const manualIncomeValue = Number(summary?.manualIncome || 0);
  const actualIncomeValue = Number(
    summary?.actualIncome ?? summary?.totalIncome ?? 0
  );
  const incomeDisplay =
    manualIncomeValue > 0 ? manualIncomeValue : actualIncomeValue;
  const incomeLabel =
    manualIncomeValue > 0 ? "Planned Income (manual)" : "Income from statements";
  const displayCategories =
    categories.length > 0
      ? categories.map((cat) => ({ ...cat, hasBudget: true }))
      : (uncategorized || []).map((cat) => ({
        ...cat,
        hasBudget: false,
      }));

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMonthFieldChange = (value) => {
    setSelectedMonth(value);
    setFormErrors([]);
    setFormData((prev) => ({
      ...prev,
      month: value,
    }));
  };

  const handleCategoryChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.categories];
      if (field === "name") {
        updated[index] = {
          ...updated[index],
          name: value,
          locked: CATEGORY_LOCKS.has(value),
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, categories: updated };
    });
  };

  const addCategoryRow = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, createCategoryEntry()],
    }));
  };

  const removeCategoryRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = [];

    if (!formData.month || !/^\d{4}-\d{2}$/.test(formData.month)) {
      validationErrors.push("Please select a valid month.");
    }

    if (!formData.totalLimit || Number(formData.totalLimit) <= 0) {
      validationErrors.push("Total budget must be greater than zero.");
    }

    const categoryPayload = formData.categories
      .filter((cat) => cat.name.trim())
      .map((cat) => ({
        name: cat.name.trim(),
        limit: Math.max(Number(cat.limit) || 0, 0),
        locked: cat.locked ?? CATEGORY_LOCKS.has(cat.name),
      }));

    if (formData.manualIncome && Number(formData.manualIncome) < 0) {
      validationErrors.push("Monthly income cannot be negative.");
    }

    if (!categoryPayload.length) {
      validationErrors.push("Add at least one category with a limit.");
    }

    const hasEmptyLimit = categoryPayload.some((cat) => cat.limit <= 0);
    if (hasEmptyLimit) {
      validationErrors.push("Each category limit must be greater than zero.");
    }

    const categoriesTotal = categoryPayload.reduce(
      (sum, cat) => sum + cat.limit,
      0
    );
    if (categoriesTotal > Number(formData.totalLimit || 0)) {
      validationErrors.push(
        "Total of category budgets cannot exceed the overall budget."
      );
    }

    if (validationErrors.length) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors([]);
    setSaving(true);
    try {
      const payload = {
        month: formData.month,
        totalLimit: Number(formData.totalLimit) || 0,
        currency: formData.currency,
        manualIncome: Number(formData.manualIncome) || 0,
        notes: formData.notes,
        categories: categoryPayload,
      };

      await api.post("/budgets", payload);
      setError(null);
      loadBudgetData();
    } catch (err) {
      console.error("Failed to save budget", err);
      const msg =
        err.response?.data?.message || err.message || "Unknown error";
      setFormErrors([`Unable to save budget: ${msg}`]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="h3 mb-1">💰 Budget Planning</h2>
          <p className="text-muted mb-0">
            Track how your actual spending compares to your targets.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Budget Setup</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Month</label>
                <input
                  type="month"
                  className="form-control"
                  value={formData.month}
                  onChange={(e) => handleMonthFieldChange(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Currency</label>
                <input
                  type="text"
                  className="form-control"
                  value="USD"
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Total Budget</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.totalLimit}
                  min="1"
                  onChange={(e) =>
                    handleFormChange("totalLimit", e.target.value)
                  }
                  placeholder="3500"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Projected Monthly Income</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.manualIncome}
                  min="0"
                  onChange={(e) =>
                    handleFormChange("manualIncome", e.target.value)
                  }
                  placeholder="4000"
                />
                <small className="text-muted">
                  Leave blank to rely on detected income from statements.
                </small>
              </div>
              <div className="col-md-6">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.notes}
                  onChange={(e) =>
                    handleFormChange("notes", e.target.value)
                  }
                  placeholder="Optional notes"
                />
              </div>
            </div>

            <hr className="my-4" />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Category Budgets</h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={addCategoryRow}
              >
                <i className="fas fa-plus me-2"></i>Add Category
              </button>
            </div>

            {formData.categories.map((cat, index) => (
              <div className="row g-3 align-items-end mb-2" key={cat.id}>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={cat.name}
                    onChange={(e) =>
                      handleCategoryChange(index, "name", e.target.value)
                    }
                    required
                    disabled={cat.locked}
                  >
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    value={cat.limit}
                    min="1"
                    onChange={(e) =>
                      handleCategoryChange(index, "limit", e.target.value)
                    }
                    placeholder="1200"
                    required
                    disabled={cat.locked}
                  />
                </div>
                <div className="col-md-2 text-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={() => removeCategoryRow(index)}
                    disabled={formData.categories.length === 1 || cat.locked}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            {formErrors.length > 0 && (
              <div className="alert alert-warning mt-3" role="alert">
                <ul className="mb-0">
                  {formErrors.map((message, idx) => (
                    <li key={idx}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : budget
                    ? "Update Budget"
                    : "Create Budget"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Total Monthly Budget</p>
                  <h3 className="fw-bold mb-0">
                    {formatCurrency(summary.totalLimit || 0, currency)}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Total Spent</p>
                  <h3 className="fw-bold text-danger mb-0">
                    {formatCurrency(summary.totalSpent || 0, currency)}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Remaining</p>
                  <h3 className="fw-bold text-success mb-0">
                    {formatCurrency(summary.remaining || 0, currency)}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Budget Used</p>
                  <h3 className="fw-bold mb-2">
                    {summary.percentUsed !== null
                      ? `${summary.percentUsed}%`
                      : "--"}
                  </h3>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{
                        width: `${Math.min(summary.percentUsed || 0, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">{incomeLabel}</p>
                  <h3 className="fw-bold mb-0">
                    {formatCurrency(incomeDisplay || 0, currency)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Budget Categories</h5>
                  <small className="text-muted">
                    {categories.length > 0
                      ? `Actual spend vs plan for ${selectedMonth}`
                      : `Statement spend captured for ${selectedMonth}`}
                  </small>
                </div>
                <div className="card-body">
                  {displayCategories.length === 0 ? (
                    <p className="text-muted mb-0">
                      Upload a statement to start tracking spending for this
                      month.
                    </p>
                  ) : (
                    <div className="row g-3">
                      {displayCategories.map((cat) => (
                        <div className="col-12 col-md-6" key={cat.name}>
                          <div className="border rounded p-3 h-100">
                            <div className="d-flex justify-content-between mb-2">
                              <div>
                                <h6 className="mb-1">{cat.name}</h6>
                                <small className="text-muted">
                                  {cat.hasBudget && cat.limit !== null
                                    ? `${formatCurrency(
                                      cat.spent,
                                      currency
                                    )} / ${formatCurrency(
                                      cat.limit || 0,
                                      currency
                                    )}`
                                    : `Spent ${formatCurrency(
                                      cat.spent,
                                      currency
                                    )} from your card statements`}
                                </small>
                              </div>
                              {cat.hasBudget && (
                                <span
                                  className={
                                    cat.percentUsed >= 90
                                      ? "badge bg-danger-subtle text-danger"
                                      : cat.percentUsed >= 70
                                        ? "badge bg-warning-subtle text-warning"
                                        : "badge bg-success-subtle text-success"
                                  }
                                >
                                  {cat.percentUsed !== null
                                    ? `${cat.percentUsed}%`
                                    : "--"}
                                </span>
                              )}
                            </div>
                            {cat.hasBudget ? (
                              <>
                                <div
                                  className="progress"
                                  style={{ height: "6px" }}
                                >
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${Math.min(
                                        cat.percentUsed || 0,
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-2 text-muted small">
                                  <span>
                                    Remaining:{" "}
                                    {formatCurrency(cat.remaining, currency)}
                                  </span>
                                  <span>
                                    Spent: {formatCurrency(cat.spent, currency)}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <p className="text-muted small mt-2 mb-0">
                                No budget set yet. Values come directly from
                                your uploaded statements.
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {uncategorized.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Uncategorized Spending</h5>
                <small className="text-muted">
                  Assign these merchants to keep your budget accurate.
                </small>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th className="text-end">Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uncategorized.map((item) => (
                        <tr key={item.name}>
                          <td>{item.name}</td>
                          <td className="text-end">
                            {formatCurrency(item.spent, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </>
  );
};

export default BudgetPage;
