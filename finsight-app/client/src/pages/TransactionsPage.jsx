// src/pages/TransactionsPage.jsx
import React from "react";
import api from "../api/axiosClient";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const TransactionsPage = () => {
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [sort, setSort] = React.useState("date-desc");

  React.useEffect(() => {
    let mounted = true;
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const res = await api.get("/transactions");
        if (!mounted) return;
        setTransactions(res.data.transactions || []);
        setError(null);
      } catch (err) {
        console.error("Failed to load transactions", err);
        if (mounted) setError("Unable to load transactions.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadTransactions();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = React.useMemo(() => {
    const set = new Set();
    transactions.forEach((tx) => {
      if (tx.category) set.add(tx.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  const filteredTransactions = React.useMemo(() => {
    let list = [...transactions];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (tx) =>
          tx.description?.toLowerCase().includes(term) ||
          tx.category?.toLowerCase().includes(term)
      );
    }

    if (categoryFilter !== "all") {
      list = list.filter((tx) => tx.category === categoryFilter);
    }

    if (sort === "amount-desc") {
      list.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    } else if (sort === "amount-asc") {
      list.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
    } else if (sort === "date-asc") {
      list.sort(
        (a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
      );
    } else {
      list.sort(
        (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      );
    }

    return list;
  }, [transactions, search, categoryFilter, sort]);

  return (
    <div className="app-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-1">Transactions</h1>
          <p className="text-muted mb-0">
            Review every transaction extracted from your uploaded statements.
          </p>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Merchant, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Sort By</label>
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="date-desc">Date (newest)</option>
                <option value="date-asc">Date (oldest)</option>
                <option value="amount-desc">Amount (high → low)</option>
                <option value="amount-asc">Amount (low → high)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No transactions match your filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th className="text-end">Amount</th>
                    <th>Source Upload</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn) => {
                    const uploadLabel =
                      typeof txn.upload === "string"
                        ? txn.upload.slice(-6)
                        : txn.upload?._id
                        ? txn.upload._id.slice(-6)
                        : "N/A";
                    return (
                      <tr key={txn._id}>
                        <td>
                          {txn.date
                            ? new Date(txn.date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>{txn.description}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {txn.category || "Other"}
                          </span>
                        </td>
                        <td
                          className={`text-end ${
                            txn.amount < 0 ? "text-danger" : "text-success"
                          }`}
                        >
                          {txn.amount < 0 ? "-" : "+"}
                          {formatCurrency(Math.abs(txn.amount))}
                        </td>
                        <td>{uploadLabel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
