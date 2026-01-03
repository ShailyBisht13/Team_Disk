import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import cmImage from '../assets/uttarakhand_cm.jpg';
import digitalIndiaLogo from '../assets/Government_of_India_logo.svg.png';

export default function Home() {
  return (
    <div className="home-page">

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <img src={digitalIndiaLogo} alt="Government of India Logo" className="digital-india-logo" />

          <h1 className="hero-title">
            Smart Uttarakhand — <br />
            <span className="highlight">AI • Satellite • GIS Road Monitoring</span>
          </h1>

          <p className="hero-subtitle">
            A next-generation platform that uses AI, satellite imagery, and GIS mapping to detect, 
            track, and predict road damage across Uttarakhand — ensuring faster repairs and safer travel for all citizens.
          </p>

          <Link to="/flow" className="btn btn-primary cta-button">
            Start Road Damage Detection
          </Link>
        </div>
      </section>

      {/* ----------------- HOW IT WORKS ----------------- */}
      <section className="content-section">
        <h2 className="section-title">How the System Works</h2>

        <div className="steps-container">

          <div className="step-card">
            <div className="step-icon">📸</div>
            <h3>1. Citizen Reporting</h3>
            <p>
              Users upload/capture road images or videos. GPS is auto-detected and the AI model analyzes damage severity instantly.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon">🛰️</div>
            <h3>2. Satellite Auto-Scan</h3>
            <p>
              The system periodically scans satellite imagery to automatically detect potholes in critical areas — even without user reporting.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon">🗺️</div>
            <h3>3. GIS Visualization</h3>
            <p>
              All detections appear in a real-time GIS dashboard where officials can view location, severity, images, and past repair history.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon">⚡</div>
            <h3>4. Smart Assignment</h3>
            <p>
              The system automatically assigns nearby PWD/municipal teams based on zone, workload, and past response speed.
            </p>
          </div>

        </div>
      </section>

      {/* ----------------- KEY FEATURES ----------------- */}
      <section className="content-section feature-section">

        <div className="feature-image-container">
          <img src={cmImage} alt="Chief Minister of Uttarakhand" className="cm-image-features-section" />
          <p className="cm-quote-features-section">
            “Using AI and satellite intelligence to build a pothole-free Uttarakhand.”
          </p>
        </div>

        <div className="feature-list">
          <h2 className="section-title">What Makes This Platform Powerful</h2>

          <div className="feature-item">
            <div className="feature-icon">🧠</div>
            <div>
              <h4>AI Damage Classification</h4>
              <p>
                Deep learning (CNN) identifies cracks, potholes, water-logging, road erosion, and structural damage.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📡</div>
            <div>
              <h4>Satellite-Driven Surveillance</h4>
              <p>
                High-resolution satellite imagery ensures detection even in remote mountainous regions.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">💬</div>
            <div>
              <h4>Two-Way Updates</h4>
              <p>
                Citizens get notifications when their report is verified, assigned, repaired, and closed.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <div>
              <h4>District & State-Level Analytics</h4>
              <p>
                Heatmaps, severity charts, zone-wise risk scores, and repair time analytics help governments prioritize work.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🔐</div>
            <div>
              <h4>Role-Based Access</h4>
              <p>
                Citizens, field engineers, PWD officials, and administrators each get tailored dashboards.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------- MISSION ----------------- */}
      <section className="content-section mission-section">
        <h2 className="section-title">Our Mission</h2>
        <p className="mission-text">
          The Smart Uttarakhand Road Intelligence System integrates AI, GIS, satellite imaging, 
          and public participation into a unified digital platform.  
          Our mission is to predict, detect, and resolve road issues before they become accidents — making every journey safer, faster, and smoother.
        </p>
      </section>

    </div>
  );
}
