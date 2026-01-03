// src/pages/AdminRegister.jsx
import React, { useState } from "react";
import "./AdminLogin.css";  // Using same style file

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const signup = async (e) => {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMsg(data.success ? "🎉 Check your email for admin ID & password" : data.error);
  };

  return (
    <div className="login-container">   {/* FIXED */}
      <div className="login-card">       {/* FIXED */}

        <h2 className="login-title">Create Admin Account</h2>
        <p className="login-subtitle">Admin credentials will be emailed to you</p>

        <form className="login-form" onSubmit={signup}>
          <label>Admin Email</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Create Account</button>
        </form>

        {msg && <p className="error-text">{msg}</p>}
      </div>
    </div>
  );
}
