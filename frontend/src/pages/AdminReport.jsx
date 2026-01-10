import React, { useEffect, useState } from "react";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const backend = "http://localhost:5000";

  /* -------------------------------------------------------
     🟦 Fetch all reports (Correct & Safe)
  ------------------------------------------------------- */
  const fetchReports = async () => {
    try {
      const res = await fetch(`${backend}/api/reports/all`);
      const data = await res.json();

      // Backend format: { success: true, reports: [...] }
      const list = data.reports || [];

      // Auto-calculate severity from aiLabels
      const enriched = list.map((r) => {
        const count = r.aiLabels?.length || 0;

        let severity = "No Damage";
        if (count >= 7) severity = "High";
        else if (count >= 3) severity = "Medium";
        else if (count >= 1) severity = "Low";

        return { ...r, severity };
      });

      setReports(enriched);
    } catch (err) {
      console.log("Error loading reports:", err);
      setReports([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  /* -------------------------------------------------------
     🟧 UPDATE STATUS (Digital Order)
  ------------------------------------------------------- */
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${backend}/api/reports/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Status updated!");
        fetchReports();
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-reports-page">
      <h1>📄 All Road Damage Reports</h1>

      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        reports.map((r, index) => (
          <div className="report-card" key={r._id}>

            {/* HEADER */}
            <div className="report-header">
              <h3>Report #{index + 1}</h3>
              <span className={`status-tag ${r.status.toLowerCase()}`}>
                {r.status}
              </span>
            </div>

            {/* BASIC INFO */}
            <p><b>Mobile:</b> {r.mobile}</p>
            <p><b>Description:</b> {r.description}</p>
            <p><b>Address:</b> {r.address || `${r.lat}, ${r.lng}`}</p>

            {/* SEVERITY */}
            <p>
              <b>Severity:</b>{" "}
              <span className={`severity-label ${r.severity?.toLowerCase()}`}>
                {r.severity}
              </span>
            </p>

            {/* IMAGES */}
            <div className="image-box">

              {r.image && (
                <div>
                  <p><b>Uploaded Image</b></p>
                  <img
                    src={`${backend}${r.image}`}
                    alt="Uploaded"
                    className="report-img"
                  />
                </div>
              )}

              {r.aiImage && (
                <div>
                  <p><b>AI Processed Output</b></p>
                  {r.aiImage.toLowerCase().match(/\.(mp4|webm|ogg|mov|avi)$/) ? (
                    <video
                      src={`${backend}${r.aiImage}`}
                      controls
                      width="280"
                      className="report-img" // using same class for styling consisteny if needed, or remove
                    />
                  ) : (
                    <img
                      src={`${backend}${r.aiImage}`}
                      alt="AI Output"
                      className="report-img"
                    />
                  )}
                </div>
              )}

            </div>

            {/* VIDEO */}
            {r.video && (
              <div style={{ marginTop: "10px" }}>
                <p><b>Uploaded Video:</b></p>
                <video
                  src={`${backend}${r.video}`}
                  controls
                  width="280"
                />
              </div>
            )}

            {/* AI DETECTIONS */}
            {r.aiLabels?.length > 0 && (
              <div className="ai-box">
                <p><b>AI Detected Objects:</b></p>

                {r.aiLabels.map((d, i) => (
                  <p key={i}>• Class {d.class} — Confidence {d.confidence}</p>
                ))}
              </div>
            )}

            {/* MAP LINK */}
            <a
              href={`https://maps.google.com/?q=${r.lat},${r.lng}`}
              target="_blank"
              rel="noreferrer"
              className="map-link"
            >
              📍 View on Google Maps
            </a>

            {/* DIGITAL ORDER PDF */}
            <a
              className="order-btn"
              href={`${backend}/api/orders/generate/${r._id}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 Generate Digital Work Order (PDF)
            </a>

            {/* STATUS BUTTONS */}
            <div className="status-buttons">
              <button onClick={() => updateStatus(r._id, "Pending")}>
                Pending
              </button>

              <button
                className="progress"
                onClick={() => updateStatus(r._id, "In-Progress")}
              >
                Approve → In-Progress
              </button>

              <button
                className="resolved"
                onClick={() => updateStatus(r._id, "Resolved")}
              >
                Mark Resolved
              </button>

              <button
                style={{ backgroundColor: "#ff4d4d", color: "white", marginLeft: "10px" }}
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this report?")) {
                    try {
                      const res = await fetch(`${backend}/api/reports/delete/${r._id}`, {
                        method: "DELETE"
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert("Report deleted!");
                        fetchReports();
                      }
                    } catch (err) {
                      alert("Failed to delete report");
                    }
                  }
                }}
              >
                Delete
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}
