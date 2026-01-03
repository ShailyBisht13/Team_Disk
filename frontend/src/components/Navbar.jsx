// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

import ukLogo from "../assets/uttarakhand_logo.png";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* Brand / Logo */}
      <Link to="/" className="navbar-brand">
        <img src={ukLogo} alt="Uttarakhand Logo" className="navbar-logo" />

        <div className="brand-text">
          <span className="brand-bold">Smart</span>
          <span className="brand-highlight">Uttarakhand</span>
        </div>
      </Link>

      {/* Links */}
      <div className="navbar-links">

        <Link
          to="/"
          className={`navbar-link ${
            location.pathname === "/" ? "active-link" : ""
          }`}
        >
          Home
        </Link>

        {/* ❌ Report Damage Removed */}

        <Link
          to="/detectdamage"
          className={`navbar-link ${
            location.pathname === "/detectdamage" ? "active-link" : ""
          }`}
        >
          Satellite AI
        </Link>

        <Link
          to="/about"
          className={`navbar-link ${
            location.pathname === "/about" ? "active-link" : ""
          }`}
        >
          About
        </Link>

        {/* Login Dropdown */}
        <div className="dropdown">
          <button className="navbar-link dropdown-btn">
            Login ▾
          </button>
          <div className="dropdown-menu">
            <Link to="/user-login">User Login</Link>
            <Link to="/admin-login">Admin Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
