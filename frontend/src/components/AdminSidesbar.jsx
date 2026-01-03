import React from "react";
import "./AdminSidebar.css";

export default function AdminSidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-title">
        Smart Uttarakhand
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => (window.location.href = "/admin-dashboard")}>
          🏠 Dashboard
        </li>

        <li onClick={() => (window.location.href = "/admin-dashboard#reports")}>
          📄 Reports
        </li>

        <li onClick={() => (window.location.href = "/map-view")}>
          🗺️ Map View
        </li>

        <li onClick={() => (window.location.href = "/settings")}>
          ⚙️ Settings
        </li>
      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
