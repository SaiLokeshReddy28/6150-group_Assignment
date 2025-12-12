// src/pages/BudgetPage.jsx
import React, { useState } from "react";

const BudgetPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">💰 Budget Planning</h2>
          <p className="text-muted mb-0">
            Create and manage your monthly budgets
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="fas fa-plus me-2"></i> Create New Budget
        </button>
      </div>

      {/* Budget Summary Cards */}
      <div className="row g-4 mb-4">
        {/* Total Monthly Budget */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total Monthly Budget</p>
                  <h3 className="mb-0 fw-bold">$3,500</h3>
                </div>
                <div className="icon-box bg-primary-subtle text-primary">
                  <i className="fas fa-wallet"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total Spent</p>
                  <h3 className="mb-0 fw-bold text-danger">$2,845</h3>
                </div>
                <div className="icon-box bg-danger-subtle text-danger">
                  <i className="fas fa-credit-card"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Remaining</p>
                  <h3 className="mb-0 fw-bold text-success">$655</h3>
                </div>
                <div className="icon-box bg-success-subtle text-success">
                  <i className="fas fa-piggy-bank"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Used */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Budget Used</p>
                  <h3 className="mb-0 fw-bold">81%</h3>
                </div>
                <div className="icon-box bg-warning-subtle text-warning">
                  <i className="fas fa-chart-pie"></i>
                </div>
              </div>
              <div className="progress mt-2" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{ width: "81%" }}
                  aria-valuenow="81"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Options */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center g-3">
            <div className="col-12 col-md-4">
              <label className="form-label small mb-1">
                Filter by Category
              </label>
              <select className="form-select" id="categoryFilter">
                <option value="all">All Categories</option>
                <option value="housing">Housing</option>
                <option value="food">Food & Dining</option>
                <option value="transport">Transportation</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small mb-1">Time Period</label>
              <select className="form-select" id="periodFilter">
                <option value="current">This Month</option>
                <option value="last">Last Month</option>
                <option value="next">Next Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small mb-1">View Type</label>
              <div className="btn-group w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="viewType"
                  id="monthlyView"
                  defaultChecked
                />
                <label className="btn btn-outline-primary" htmlFor="monthlyView">
                  Monthly
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="viewType"
                  id="yearlyView"
                />
                <label className="btn btn-outline-primary" htmlFor="yearlyView">
                  Yearly
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights & Suggestions */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0">
            <i className="fas fa-lightbulb text-warning me-2"></i>
            AI Insights & Suggestions
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <div className="alert alert-warning border-start border-warning border-4 mb-0">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="alert-heading mb-2">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Entertainment Budget Alert
                    </h6>
                    <p className="mb-0 small">
                      You've used 85% of your entertainment budget. Consider
                      reducing spending by $50 this week.
                    </p>
                  </div>
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

            <div className="col-12 col-lg-6">
              <div className="alert alert-success border-start border-success border-4 mb-0">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="alert-heading mb-2">
                      <i className="fas fa-check-circle me-2"></i>
                      Great Savings!
                    </h6>
                    <p className="mb-0 small">
                      You saved $200 in transportation this month compared to
                      last month. Keep it up!
                    </p>
                  </div>
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

            <div className="col-12 col-lg-6">
              <div className="alert alert-info border-start border-info border-4 mb-0">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="alert-heading mb-2">
                      <i className="fas fa-info-circle me-2"></i>
                      Spending Pattern
                    </h6>
                    <p className="mb-0 small">
                      You're spending 30% more on food this month. Consider meal
                      planning to save money.
                    </p>
                  </div>
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

            <div className="col-12 col-lg-6">
              <div className="alert alert-primary border-start border-primary border-4 mb-0">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="alert-heading mb-2">
                      <i className="fas fa-chart-line me-2"></i>
                      Budget Optimization
                    </h6>
                    <p className="mb-0 small">
                      Consider reducing dining out budget by $100 and increase
                      your savings budget.
                    </p>
                  </div>
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
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="row g-4">
        {/* Housing */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card budget-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="category-icon bg-primary-subtle text-primary me-3">
                    <i className="fas fa-home"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Housing</h6>
                    <small className="text-muted">Rent & Utilities</small>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item">
                        <i className="fas fa-edit me-2"></i>Edit
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger">
                        <i className="fas fa-trash me-2"></i>Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">$800 of $1,200</span>
                  <span className="small fw-bold text-success">67%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: "67%" }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between text-muted small">
                <span>Remaining: $400</span>
                <span className="badge bg-success-subtle text-success">
                  On Track
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Food & Dining */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card budget-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="category-icon bg-warning-subtle text-warning me-3">
                    <i className="fas fa-utensils"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Food & Dining</h6>
                    <small className="text-muted">
                      Groceries & Restaurants
                    </small>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item">
                        <i className="fas fa-edit me-2"></i>Edit
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger">
                        <i className="fas fa-trash me-2"></i>Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">$425 of $500</span>
                  <span className="small fw-bold text-warning">85%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between text-muted small">
                <span>Remaining: $75</span>
                <span className="badge bg-warning-subtle text-warning">
                  Caution
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transportation */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card budget-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="category-icon bg-info-subtle text-info me-3">
                    <i className="fas fa-car"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Transportation</h6>
                    <small className="text-muted">
                      Gas & Public Transit
                    </small>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item">
                        <i className="fas fa-edit me-2"></i>Edit
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger">
                        <i className="fas fa-trash me-2"></i>Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">$150 of $300</span>
                  <span className="small fw-bold text-success">50%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between text-muted small">
                <span>Remaining: $150</span>
                <span className="badge bg-success-subtle text-success">
                  Good
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Entertainment */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card budget-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="category-icon bg-danger-subtle text-danger me-3">
                    <i className="fas fa-film"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Entertainment</h6>
                    <small className="text-muted">Movies & Recreation</small>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item">
                        <i className="fas fa-edit me-2"></i>Edit
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger">
                        <i className="fas fa-trash me-2"></i>Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">$340 of $400</span>
                  <span className="small fw-bold text-danger">85%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between text-muted small">
                <span>Remaining: $60</span>
                <span className="badge bg-danger-subtle text-danger">
                  Warning
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Utilities */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card budget-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="category-icon bg-secondary-subtle text-secondary me-3">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Utilities</h6>
                    <small className="text-muted">Electric & Internet</small>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item">
                        <i className="fas fa-edit me-2"></i>Edit
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger">
                        <i className="fas fa-trash me-2"></i>Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">$180 of $200</span>
                  <span className="small fw-bold text-warning">90%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-secondary"
                    role="progressbar"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between text-muted small">
                <span>Remaining: $20</span>
                <span className="badge bg-warning-subtle text-warning">
                  Almost
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shopping */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card budget-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="category-icon bg-success-subtle text-success me-3">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Shopping</h6>
                    <small className="text-muted">
                      Clothing & Personal
                    </small>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item">
                        <i className="fas fa-edit me-2"></i>Edit
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger">
                        <i className="fas fa-trash me-2"></i>Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">$170 of $400</span>
                  <span className="small fw-bold text-success">43%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: "43%" }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between text-muted small">
                <span>Remaining: $230</span>
                <span className="badge bg-success-subtle text-success">
                  Excellent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export button */}
      <div className="text-center mt-4 mb-2">
        <button className="btn btn-outline-primary">
          <i className="fas fa-download me-2"></i> Export Budget Report
        </button>
      </div>

      {/* CREATE BUDGET MODAL */}
      {showCreateModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-labelledby="createBudgetModalLabel"
          aria-modal="true"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createBudgetModalLabel">
                  <i className="fas fa-plus-circle me-2"></i> Create New Budget
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeCreateModal}
                ></button>
              </div>
              <div className="modal-body">
                <form id="createBudgetForm">
                  {/* Monthly Income */}
                  <div className="mb-3">
                    <label htmlFor="monthlyIncome" className="form-label">
                      Monthly Income
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        id="monthlyIncome"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="mb-3">
                    <label htmlFor="budgetCategory" className="form-label">
                      Category
                    </label>
                    <select className="form-select" id="budgetCategory">
                      <option value="">Choose category...</option>
                      <option value="housing">🏠 Housing</option>
                      <option value="food">🍽️ Food & Dining</option>
                      <option value="transport">🚗 Transportation</option>
                      <option value="entertainment">🎬 Entertainment</option>
                      <option value="utilities">⚡ Utilities</option>
                      <option value="shopping">🛍️ Shopping</option>
                      <option value="healthcare">🏥 Healthcare</option>
                      <option value="education">📚 Education</option>
                      <option value="savings">💰 Savings</option>
                      <option value="other">📌 Other</option>
                    </select>
                  </div>

                  {/* Budget Amount */}
                  <div className="mb-3">
                    <label htmlFor="budgetAmount" className="form-label">
                      Budget Amount
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        id="budgetAmount"
                        placeholder="500"
                      />
                    </div>
                  </div>

                  {/* Time Period */}
                  <div className="mb-3">
                    <label htmlFor="timePeriod" className="form-label">
                      Time Period
                    </label>
                    <select className="form-select" id="timePeriod">
                      <option value="current">This Month</option>
                      <option value="next">Next Month</option>
                      <option value="quarter">Next 3 Months</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="mb-3">
                    <label htmlFor="budgetNotes" className="form-label">
                      Notes (Optional)
                    </label>
                    <textarea
                      className="form-control"
                      id="budgetNotes"
                      rows="2"
                      placeholder="Add any notes..."
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  id="saveBudgetBtn"
                  onClick={closeCreateModal} // later: save to backend
                >
                  <i className="fas fa-save me-2"></i> Create Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetPage;