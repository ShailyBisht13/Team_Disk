import React from "react";
import "./About.css";

// ⭐ Use your uploaded citizen image
import citizenImage from "../assets/citizen.jpeg";

// ⭐ Keep online images for AI, GIS, HERO
const heroImage =
  "https://images.unsplash.com/photo-1598346762291-892db1e4ac65?auto=format&fit=crop&w=1400&q=80";

const aiImage =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80";

const gisImage =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80";

export default function About() {
  return (
    <div className="about-page">

      {/* ---------------- HERO SECTION ---------------- */}
      <header className="about-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="about-overlay"></div>
        <div className="about-hero-content">
          <h1>Smart Uttarakhand 2.0</h1>
          <p>AI • GIS • Citizen Reporting • Road Safety Revolution</p>
        </div>
      </header>

      {/* ---------------- VISION SECTION ---------------- */}
      <section className="about-section intro-section">
        <div className="about-text">
          <h2>Our Vision</h2>
          <p>
            Smart Uttarakhand 2.0 uses <b>AI, GIS Mapping, and Citizen Participation</b>
            to build a safe and intelligent road monitoring ecosystem.
          </p>
        </div>

        <div className="about-image">
          <img src={aiImage} alt="AI Detection" />
        </div>
      </section>

      {/* ---------------- MISSION SECTION ---------------- */}
      <section className="about-section mission-section">
        <h2>Our Mission</h2>
        <ul className="mission-list">
          <li>🚧 AI-powered pothole and crack detection</li>
          <li>🛰️ Satellite + GIS-based mapping</li>
          <li>📱 Citizen reporting with GPS</li>
          <li>📊 Government dashboard analytics</li>
          <li>⚡ Faster road repair workflow</li>
        </ul>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section className="about-section features-section">
        <h2>Smart Uttarakhand 2.0 – Key Features</h2>

        <div className="features-grid">

          <div className="feature-card">
            <img src={aiImage} alt="AI" className="feature-image" />
            <h3>AI Road Damage Detection</h3>
            <p>Automatically detects potholes, cracks, and damages.</p>
          </div>

          <div className="feature-card">
            <img src={gisImage} alt="GIS" className="feature-image" />
            <h3>Satellite + GIS Mapping</h3>
            <p>Live visualization of roads and reported damage.</p>
          </div>

          <div className="feature-card">
            <img src={citizenImage} alt="Citizen" className="feature-image" />
            <h3>Citizen Reporting</h3>
            <p>Instant road issue reporting with photo/video + GPS.</p>
          </div>

        </div>
      </section>

      {/* ---------------- IOT HARDWARE SECTION (NEW) ---------------- */}
      <section className="about-section iot-section">
        <h2>📡 IoT Hardware Integration</h2>
        <p>Our system isn't just software. We deploy advanced <b>IoT Sensor Units</b> on municipal vehicles for real-time monitoring.</p>

        <div className="features-grid">
          <div className="feature-card iot-card">
            <h3>🍓 Raspberry Pi 4</h3>
            <p>The brain of the operation. Processes vibration data and captures images on the edge.</p>
          </div>

          <div className="feature-card iot-card">
            <h3>📉 MPU6050 Accelerometer</h3>
            <p>Detects road anomalies by measuring G-force z-axis vertical vibrations.</p>
          </div>

          <div className="feature-card iot-card">
            <h3>🔄 Sensor Fusion Logic</h3>
            <p>Combines <b>Vibration Data + AI Vision</b> to eliminate false positives (like speed bumps).</p>
          </div>
        </div>
      </section>

      {/* ---------------- IMPACT SECTION ---------------- */}
      <section className="about-section impact-section">
        <h2>The Impact</h2>
        <p>
          Smart Uttarakhand 2.0 shifts traditional road inspection toward an
          <b> AI-driven, transparent, and fast repair model.</b>
        </p>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="about-footer">
        <p>© 2025 Smart Uttarakhand 2.0 • AI-Powered Road Management System</p>
      </footer>

    </div>
  );
}
