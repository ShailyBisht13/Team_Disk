import React from "react";
import "./DashboardCards.css";

export default function DashboardCards({ stats }) {
  return (
    <div className="cards-container">

      <div className="card">
        <div className="card-title">Total Reports</div>
        <div className="card-value">{stats.total || 0}</div>
      </div>

      <div className="card">
        <div className="card-title">Pending</div>
        <div className="card-value pending">{stats.pending || 0}</div>
      </div>

      <div className="card">
        <div className="card-title">In Progress</div>
        <div className="card-value inprogress">{stats.inProgress || 0}</div>
      </div>

      <div className="card">
        <div className="card-title">Resolved</div>
        <div className="card-value resolved">{stats.resolved || 0}</div>
      </div>

    </div>
  );
}
