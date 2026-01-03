import React from "react";
import "./AdminTopbar.css";

export default function AdminTopbar({ admin }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2 className="page-title">Admin Dashboard</h2>
      </div>

      <div className="topbar-center">
        <input
          type="text"
          placeholder="Search reports, locations..."
          className="search-input"
        />
      </div>

      <div className="topbar-right">
        <span className="admin-name">
          {admin?.adminId || "Admin"}
        </span>
        <div className="profile-circle">
          {admin?.adminId?.charAt(0) || "A"}
        </div>
      </div>
    </div>
  );
}
