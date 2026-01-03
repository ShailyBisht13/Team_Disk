import React, { useState } from "react";
import "./AdminRegister.css";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Processing...");

    try {
      const res = await fetch("http://localhost:5000/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      setMsg(data.message || data.error);
    } catch (err) {
      setMsg("❌ Server not responding");
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-card">
        <h2>Create Admin Account</h2>
        <p>Credentials will be sent to your email</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Create Account</button>
        </form>

        {msg && <p className="msg-box">{msg}</p>}
      </div>
    </div>
  );
}
