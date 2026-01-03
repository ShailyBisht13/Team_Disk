// src/pages/Satellite.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Satellite() {
  // Read coordinates from URL query
  const params = new URLSearchParams(window.location.search);
  const lat = parseFloat(params.get("lat")) || 30.3468;
  const lng = parseFloat(params.get("lng")) || 77.9349;

  // Custom Red Dot Marker
  const redDotIcon = L.divIcon({
    html: `<div style="
      width:12px;
      height:12px;
      background:red;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 10px red;
    "></div>`,
    className: "",
  });

  return (
    <div className="satellite-page">
      <h2>🛰 Satellite View of Damage Location</h2>

      <MapContainer
        center={[lat, lng]}
        zoom={18}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "10px",
          marginTop: "15px"
        }}
      >
        {/* ⭐ Esri Satellite Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />

        {/* ⭐ RED DOT ON DAMAGE LOCATION */}
        <Marker position={[lat, lng]} icon={redDotIcon}>
          <Popup>
            <b>Damage Location</b> <br />
            Lat: {lat}, Lng: {lng}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
