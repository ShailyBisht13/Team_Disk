// src/pages/DetectDamage.jsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function DetectDamage() {
  const mapRef = useRef(null);
  const [reports, setReports] = useState([]);

  const backend = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Red icon for damage markers
  const damageIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
  });

  // Blue icon for user
  const blueIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/4871/4871211.png",
    iconSize: [32, 32],
  });

  // Function for reverse geocoding
  async function getAddress(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data.display_name || "Unknown location";
    } catch {
      return "Unknown location";
    }
  }

  // Load all reports from backend
  const loadDamageReports = async () => {
    try {
      const res = await fetch(`${backend}/api/reports/all`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error loading reports", err);
    }
  };

  /* ---------------------------- INIT MAP ----------------------------- */
  useEffect(() => {
    if (!mapRef.current) {
      const center = [30.0668, 79.0193]; // Uttarakhand center
      const bounds = [
        [28.8, 77.5], // SW
        [31.7, 81.0], // NE
      ];

      mapRef.current = L.map("detect-map", {
        center,
        zoom: 8,
        minZoom: 7,
        maxZoom: 19,
        maxBounds: bounds,
        maxBoundsViscosity: 1,
      });

      // Satellite Layer
      L.tileLayer(
        "https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 }
      ).addTo(mapRef.current);

      // Uttarakhand boundary
      L.rectangle(bounds, {
        color: "#0099ff",
        weight: 3,
        fillOpacity: 0,
      }).addTo(mapRef.current);

      loadDamageReports();
    }
  }, []);

  /* ---------------------------- DRAW MARKERS ----------------------------- */
  useEffect(() => {
    if (!mapRef.current || !Array.isArray(reports) || reports.length === 0) return;

    reports.forEach((r) => {
      if (!r.lat || !r.lng) return;

      L.marker([r.lat, r.lng], { icon: damageIcon })
        .addTo(mapRef.current)
        .bindPopup(
          `<b>Damage Reported</b><br>${r.address || "No address"}<br><br>
           <b>Submitted:</b> ${new Date(r.createdAt).toLocaleString()}
           ${r.aiImage
            ? `<br><br><b>AI Detection:</b><br><img src="${backend}${r.aiImage}" style="width:100%; border-radius:8px; margin-top:5px;" />`
            : ""
          }`
        );
    });
  }, [reports]);

  /* ---------------------------- LOCATE USER ----------------------------- */
  const locateUser = () => {
    if (!mapRef.current) return;

    mapRef.current.locate({ setView: true, maxZoom: 15 });

    mapRef.current.on("locationfound", async (e) => {
      const { lat, lng } = e.latlng;
      const address = await getAddress(lat, lng);

      L.marker([lat, lng], { icon: blueIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>You Are Here</b><br>${address}`)
        .openPopup();
    });

    mapRef.current.on("locationerror", () => {
      alert("Enable location permission in your browser settings.");
    });
  };

  return (
    <div style={{ padding: "10px" }}>
      <h2 style={{ textAlign: "center", color: "#004aad", fontWeight: "700" }}>
        🛰️ Satellite AI – Uttarakhand
      </h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <button
          onClick={locateUser}
          style={{
            padding: "10px 14px",
            background: "#004aad",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          📍 Locate Me
        </button>

        <button
          onClick={loadDamageReports}
          style={{
            padding: "10px 14px",
            background: "#e63946",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔄 Refresh Damage Reports
        </button>
      </div>

      <div
        id="detect-map"
        style={{
          height: "80vh",
          borderRadius: "14px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      ></div>
    </div>
  );
}
