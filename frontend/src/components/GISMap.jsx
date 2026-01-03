// GISMap.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function GISMap({
  id,
  location,
  onLocationChange,
  onAddress,
  height,
  manualMode,
  liveTracking,
}) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const blueMarkerRef = useRef(null); // 🔵 BLUE marker reference

  const redIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
  });

  const blueDot = L.circleMarker([0, 0], {
    radius: 8,
    color: "#0066ff",
    fillColor: "#3399ff",
    fillOpacity: 0.9,
  });

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      onAddress(data.display_name || "Unknown location");
    } catch {
      onAddress("Unable to fetch address");
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(id).setView(
        location ? [location.lat, location.lng] : [20.5937, 78.9629],
        location ? 15 : 5
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add blue marker to map
      blueDot.addTo(mapRef.current);

      // Manual map click
      mapRef.current.on("click", (e) => {
        if (!manualMode) return;

        const { lat, lng } = e.latlng;

        if (markerRef.current) mapRef.current.removeLayer(markerRef.current);
        markerRef.current = L.marker([lat, lng], { icon: redIcon }).addTo(mapRef.current);

        onLocationChange({ lat, lng });
        fetchAddress(lat, lng);
      });
    }
  }, []);

  // Update markers when GPS or location changes
  useEffect(() => {
    if (!location || !mapRef.current) return;

    const { lat, lng } = location;

    // Red marker (selected location)
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon: redIcon }).addTo(mapRef.current);
    }

    // 🔵 BLUE MARKER (MY CURRENT LOCATION)
    if (blueDot) {
      blueDot.setLatLng([lat, lng]);
    }

    mapRef.current.setView([lat, lng], 16);
    fetchAddress(lat, lng);
  }, [location]);

  return (
    <div
      id={id}
      style={{
        width: "100%",
        height: height || "300px",
        borderRadius: "10px",
        overflow: "hidden",
        marginTop: "15px",
      }}
    ></div>
  );
}
