// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import GISMap from "../components/GISMap.jsx";
import "./UserDashboard.css";

export default function UserDashboard({ user }) {
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [myReports, setMyReports] = useState([]);

  const [page, setPage] = useState("dashboard");

  const backend = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  /* ------------------------------------------------
     FETCH USER REPORTS
  ------------------------------------------------ */
  const fetchMyReports = async () => {
    try {
      const res = await fetch(`${backend}/api/reports/my/${user.mobile}`);
      const data = await res.json();
      setMyReports(data.reports || []);
    } catch (err) {
      setMessage("❌ Unable to load your reports.");
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  /* ------------------------------------------------
     GPS
  ------------------------------------------------ */
  const autoGPS = () => {
    if (!navigator.geolocation) {
      setMessage("❌ GPS not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMessage("📍 GPS detected");
      },
      () => setMessage("⚠️ Unable to fetch GPS"),
      { enableHighAccuracy: true }
    );
  };

  /* ------------------------------------------------
     FILE PICKERS
  ------------------------------------------------ */
  const handleImage = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setVideo(null);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleVideo = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setVideo(selected);
      setFile(null);
      setPreview(URL.createObjectURL(selected));
    }
  };

  /* ------------------------------------------------
     UPLOAD REPORT  (FINAL FIX)
  ------------------------------------------------ */
  const handleUpload = async () => {
    setMessage("");

    if (!file && !video) return setMessage("❗ Upload a photo or video.");
    if (!location) return setMessage("❗ Please pick a location.");

    setUploading(true);

    const form = new FormData();
    if (file) form.append("image", file);
    if (video) form.append("video", video);

    form.append("description", description);
    form.append("mobile", user.mobile);
    form.append("lat", location.lat.toString());
    form.append("lng", location.lng.toString());
    form.append("address", address);

    try {
      console.log("📤 Uploading to:", `${backend}/api/reports/upload-damage`);

      const res = await fetch(`${backend}/api/reports/upload-damage`, {
        method: "POST",

        // 🔥 DO NOT ADD Content-Type (browser sets it)
        headers: { Accept: "application/json" },

        body: form,
      });

      const data = await res.json();
      console.log("SERVER RESPONSE:", data);

      if (data.success) {
        setMessage("✅ Report submitted!");
        fetchMyReports();
        setPage("dashboard");
      } else {
        setMessage("❌ Upload failed: " + data.error);
      }
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      setMessage("❌ Server error.");
    }

    setUploading(false);
  };

  /* ------------------------------------------------
     UI
  ------------------------------------------------ */
  const DashboardPage = (
    <div>
      <h2>Welcome, {user?.mobile}</h2>
      <h3>Your Submitted Reports</h3>

      <button className="btn" onClick={() => setPage("new-report")}>
        ➕ New Report
      </button>

      {myReports.length === 0 ? (
        <p>No reports submitted yet.</p>
      ) : (
        <div className="report-list">
          {myReports.map((r, i) => (
            <div className="report-card" key={i}>
              <p><b>Status:</b> {r.status}</p>
              <p><b>Date:</b> {new Date(r.createdAt).toLocaleString()}</p>
              <p><b>Location:</b> {r.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const NewReportPage = (
    <div>
      <h2>Submit New Road Damage Report</h2>

      <button className="btn" onClick={() => setPage("dashboard")}>
        ⬅ Back
      </button>

      <input type="file" accept="image/*" onChange={handleImage} />
      <input type="file" accept="video/*" onChange={handleVideo} />

      {preview && (
        <div className="preview-box">
          {video ? <video src={preview} controls /> : <img src={preview} alt="" />}
        </div>
      )}

      <button className="btn gps-btn" onClick={autoGPS}>
        📍 Auto Detect GPS
      </button>

      <GISMap
        id="user-map"
        location={location}
        onLocationChange={setLocation}
        onAddress={setAddress}
        height="350px"
      />

      <textarea
        placeholder="Describe the road..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", minHeight: 100 }}
      />

      <button className="btn upload-btn" onClick={handleUpload}>
        {uploading ? "Uploading..." : "Submit Report"}
      </button>

      {message && <p className="msg">{message}</p>}
    </div>
  );

  return (
    <div className="userdash">
      {page === "dashboard" ? DashboardPage : NewReportPage}
    </div>
  );
}
