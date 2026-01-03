import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard({ admin }) {
  const backend = "http://localhost:5000";
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  // ----------------------------------------------------
  // Fetch all reports (correct and universal)
  // ----------------------------------------------------
  const fetchReports = async () => {
    try {
      const res = await fetch(`${backend}/api/reports/all`);
      const data = await res.json();

      // Backend always returns: { success: true, reports: [...] }
      setReports(data.reports || []);

    } catch (err) {
      console.log("Fetch error:", err);
      setReports([]);
    }
  };

  // ----------------------------------------------------
  // Stats
  // ----------------------------------------------------
  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "Pending").length,
    inProgress: reports.filter((r) => r.status === "In-Progress").length,
    resolved: reports.filter((r) => r.status === "Resolved").length,
  };

  // ----------------------------------------------------
  // Logout
  // ----------------------------------------------------
  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin-login";
  };

  // ----------------------------------------------------
  // Open Satellite View (latest report)
  // ----------------------------------------------------
  const viewLatestSatellite = () => {
    if (reports.length === 0) {
      alert("No reports available.");
      return;
    }

    const r = reports[0];
    window.location.href = `/satellite?lat=${r.lat}&lng=${r.lng}`;
  };

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h2>👋 Welcome, Admin</h2>
          <p>AI-powered road damage reporting management panel.</p>
        </div>

        <button className="logout-btn" onClick={logoutAdmin}>
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card total">
          <h3>{stats.total}</h3>
          <p>Total Reports</p>
        </div>

        <div className="stat-card pending">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>

        <div className="stat-card progress">
          <h3>{stats.inProgress}</h3>
          <p>In Progress</p>
        </div>

        <div className="stat-card resolved">
          <h3>{stats.resolved}</h3>
          <p>Resolved</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="overview-box">
        <h3>Quick Actions</h3>
        <p>Manage and verify road issues using AI results.</p>

        <a href="/reports-page" className="btn-view-reports">
          📄 View All Reports →
        </a>

        <button
          className="btn-view-reports"
          style={{ marginTop: 10 }}
          onClick={viewLatestSatellite}
        >
          🛰 View Satellite Map →
        </button>
      </div>

      {/* RECENT REPORTS */}
      <div className="recent-reports">
        <h3>Recent Reports (AI Processed)</h3>

        {reports.slice(0, 5).map((r, i) => (
          <div className="report-box" key={i}>

            <div className="report-row">
              <p><b>Mobile:</b> {r.mobile}</p>
              <p><b>Status:</b> {r.status}</p>
            </div>

            <p><b>Location:</b> {r.address || `${r.lat}, ${r.lng}`}</p>
            <p><b>Description:</b> {r.description}</p>

            <p><b>AI Result:</b> {r.aiResult}</p>

            {/* IMAGES */}
            <div className="report-images">
              {r.image && (
                <img
                  src={`${backend}${r.image}`}   // Correct path
                  alt="Uploaded"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}

              {r.aiImage && (
                <img
                  src={`${backend}${r.aiImage}`}   // Correct path
                  alt="AI Output"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>

            {/* AI LABELS */}
            {r.aiLabels && r.aiLabels.length > 0 && (
              <div className="ai-box">
                <p><b>AI Detections:</b></p>
                {r.aiLabels.map((d, idx) => (
                  <p key={idx}>• Class {d.class} — Confidence {d.confidence}</p>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
