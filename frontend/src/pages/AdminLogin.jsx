import React, { useState } from "react";
import "./AdminLogin.css";

export default function AdminLogin({ setAdmin }) {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Checking...");

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password }),
      });

      const data = await res.json();

      if (!data.success) {
        return setMsg("❌ " + data.error);
      }

      // ⭐ SAVE ADMIN IN LOCAL STORAGE
      localStorage.setItem("admin", JSON.stringify(data.admin));

      // ⭐ UPDATE REACT STATE
      setAdmin(data.admin);

      // ⭐ REDIRECT TO DASHBOARD
      window.location.href = "/admin-dashboard";

    } catch (error) {
      setMsg("❌ Server not responding");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <p>Enter your Admin ID and Password</p>

        <form onSubmit={handleSubmit}>
          <label>Admin ID</label>
          <input
            type="text"
            required
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {msg && <p className="msg-box">{msg}</p>}

        <p style={{ marginTop: "10px" }}>
          Don’t have an account? <a href="/admin-register">Create one</a>
        </p>
      </div>
    </div>
  );
}
