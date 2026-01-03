import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

// User Pages
import Home from "./pages/Home";
import About from "./pages/About";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";
import DetectDamage from "./pages/DetectDamage";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReport";   // ⭐ NEW
import Satellite from "./pages/Satellite";         // ⭐ NEW

import "./App.css";

function App() {
  // Load user/admin from localStorage so login stays persistent
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin")) || null
  );

  // Save login state automatically on changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (admin) localStorage.setItem("admin", JSON.stringify(admin));
    else localStorage.removeItem("admin");
  }, [admin]);

  return (
    <Router>
      <div className="app">

        {/* Navbar Receives Both */}
        <Navbar user={user} admin={admin} setUser={setUser} setAdmin={setAdmin} />

        <main className="main-content">
          <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* USER LOGIN */}
            <Route path="/user-login" element={<UserLogin setUser={setUser} />} />

            <Route
              path="/dashboard"
              element={
                user ? <UserDashboard user={user} /> : <Navigate to="/user-login" />
              }
            />

            {/* DAMAGE DETECTION */}
            <Route path="/detectdamage" element={<DetectDamage />} />
            <Route path="/report" element={<DetectDamage />} />

            {/* ADMIN AUTH */}
            <Route path="/admin-register" element={<AdminRegister />} />

            <Route
              path="/admin-login"
              element={<AdminLogin setAdmin={setAdmin} />}
            />

            {/* ⭐ ADMIN DASHBOARD */}
            <Route
              path="/admin-dashboard"
              element={
                admin ? (
                  <AdminDashboard admin={admin} />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />

            {/* ⭐ VIEW ALL REPORTS PAGE */}
            <Route
              path="/reports-page"
              element={
                admin ? <AdminReports /> : <Navigate to="/admin-login" />
              }
            />

            {/* ⭐ SATELLITE PAGE */}
            <Route
              path="/satellite"
              element={
                admin ? <Satellite /> : <Navigate to="/admin-login" />
              }
            />

            {/* 404 PAGE */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <h2>404 - Page Not Found</h2>
                  <p>This page does not exist.</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
