import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/admin/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Admin Summary Error:", err));
  }, []);

  return (
    <div>
      <h2 className="fw-bold mb-4">Analytics Overview 📊</h2>

      {/* ================= METRIC CARDS ================= */}
      <div className="row g-4 mb-5">
      
        {/* USERS CARD */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center"
            style={{ background: "#E8F1FF" }}>
            <h6 className="text-primary">Total Users</h6>
            <h1 className="fw-bold text-primary">{summary?.users ?? "--"}</h1>
          </div>
        </div>

        {/* UPLOADS CARD */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center"
            style={{ background: "#E8FFF0" }}>
            <h6 className="text-success">Total Uploads</h6>
            <h1 className="fw-bold text-success">{summary?.uploads ?? "--"}</h1>
          </div>
        </div>

        {/* TRANSACTIONS CARD */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center"
            style={{ background: "#FFF4E8" }}>
            <h6 className="text-warning">Transactions</h6>
            <h1 className="fw-bold text-warning">{summary?.transactions ?? "--"}</h1>
          </div>
        </div>

      </div>

      {/* ================= CHARTS SECTION ================= */}
      <div className="row g-4">
        {/* Bar Chart */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3">Users vs Uploads</h5>
            <Bar
              data={{
                labels: ["Users", "Uploads"],
                datasets: [
                  {
                    label: "Count",
                    data: [summary?.users ?? 0, summary?.uploads ?? 0],
                    backgroundColor: ["#007BFF", "#28A745"],
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Line Chart */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3">Platform Growth</h5>
            <Line
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [
                  {
                    label: "Growth Trend",
                    data: [3, 6, 9, summary?.users ?? 10],
                    borderColor: "#FF5C5C",
                    backgroundColor: "rgba(255, 92, 92, 0.2)",
                    tension: 0.3,
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
