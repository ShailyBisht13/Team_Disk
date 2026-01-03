import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Dashboard.css";

// Custom marker icon
const potholeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function Dashboard() {
  const [potholes, setPotholes] = useState([]);

  // Simulated pothole data
  useEffect(() => {
    setPotholes([
      {
        id: 1,
        location: "Rajpur Road, Dehradun",
        lat: 30.345,
        lng: 78.052,
        severity: "High",
        status: "Pending",
      },
      {
        id: 2,
        location: "Haldwani Main Road",
        lat: 29.22,
        lng: 79.528,
        severity: "Medium",
        status: "In Progress",
      },
      {
        id: 3,
        location: "Pithoragarh Market Area",
        lat: 29.583,
        lng: 80.217,
        severity: "Low",
        status: "Resolved",
      },
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>🗺️ Uttarakhand GIS Road Damage Dashboard</h1>
        <p>Visualize and monitor pothole reports across the state in real time.</p>
      </header>

      {/* Map Section */}
      <section className="map-section">
        <MapContainer center={[30.3165, 78.0322]} zoom={8} className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {potholes.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={potholeIcon}>
              <Popup>
                <strong>📍 {p.location}</strong>
                <br />
                <b>Severity:</b> {p.severity}
                <br />
                <b>Status:</b> {p.status}
              </Popup>
              <Circle
                center={[p.lat, p.lng]}
                radius={
                  p.severity === "High" ? 1500 : p.severity === "Medium" ? 1000 : 700
                }
                color={
                  p.severity === "High"
                    ? "red"
                    : p.severity === "Medium"
                    ? "orange"
                    : "green"
                }
              />
            </Marker>
          ))}
        </MapContainer>
      </section>

      {/* Summary Section */}
      <section className="dashboard-summary">
        <h2>📊 Summary</h2>
        <div className="stats-grid">
          <div className="stat-card red">
            <h3>High Severity</h3>
            <p>{potholes.filter((p) => p.severity === "High").length}</p>
          </div>
          <div className="stat-card orange">
            <h3>Medium Severity</h3>
            <p>{potholes.filter((p) => p.severity === "Medium").length}</p>
          </div>
          <div className="stat-card green">
            <h3>Low Severity</h3>
            <p>{potholes.filter((p) => p.severity === "Low").length}</p>
          </div>
        </div>
      </section>
    </div>
  );
}