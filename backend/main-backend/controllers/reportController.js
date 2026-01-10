// main-backend/controllers/reportController.js

import UserReport from "../models/UserReport.js";
import { runAIDetection } from "../utils/aiProcessor.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------------------------
// ⭐ Convert WINDOWS path → /uploads/... (URL Safe)
// ----------------------------------------------------
const cleanPath = (fullPath) => {
  if (!fullPath) return null;

  // 1. Handle Uploads
  if (fullPath.includes("uploads")) {
    const idx = fullPath.indexOf("uploads");
    return "/" + fullPath.substring(idx).replace(/\\/g, "/");
  }

  // 2. Handle AI Runs (mapped to /ai-output)
  if (fullPath.includes("runs")) {
    const idx = fullPath.indexOf("runs");
    // runs is 4 chars. Get everything AFTER "runs"
    // e.g. ...\runs\detect\predict\img.jpg -> \detect\predict\img.jpg
    let relative = fullPath.substring(idx + 4).replace(/\\/g, "/");

    // Ensure leading slash
    if (!relative.startsWith("/")) relative = "/" + relative;

    return "/ai-output" + relative;
  }

  return null;
};

// ----------------------------------------------------
// ⭐ AI Severity Calculator
// ----------------------------------------------------
const calculateSeverity = (labels) => {
  if (!labels || labels.length === 0) return "Low";

  let avgConfidence =
    labels.reduce((sum, d) => sum + d.confidence, 0) / labels.length;

  if (avgConfidence > 0.80) return "Critical";
  if (avgConfidence > 0.60) return "Medium";
  return "Low";
};

// ----------------------------------------------------
// ⭐ UPLOAD DAMAGE (FINAL FIXED VERSION)
// ----------------------------------------------------
export const uploadDamage = async (req, res) => {
  console.log("🔥 uploadDamage endpoint HIT!");

  try {
    if (!req.files || (!req.files.image && !req.files.video)) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image or video.",
      });
    }

    console.log("📁 req.files =", req.files);
    console.log("📨 req.body =", req.body);

    const { mobile, description, lat, lng, address, sensorType } = req.body;

    const imageFile = req.files?.image?.[0] || null;
    const videoFile = req.files?.video?.[0] || null;

    // --- Windows absolute path (full)
    let aiInputAbsPath = null;
    if (imageFile) aiInputAbsPath = imageFile.path;
    else if (videoFile) aiInputAbsPath = videoFile.path;

    // --- Convert to relative for Python (IMPORTANT FIX)
    const relativeInputPath = aiInputAbsPath
      ? path.relative(process.cwd(), aiInputAbsPath)
      : null;

    console.log("⭐ Python Input Path =", relativeInputPath);

    let aiDetections = [];
    let aiOutputMedia = aiInputAbsPath; // default to original if fail
    let aiResult = "AI Not Executed";

    // ---------------- AI PROCESS WITH TIMEOUT ----------------
    if (relativeInputPath) {
      try {
        const result = await Promise.race([
          runAIDetection(relativeInputPath), // IMPORTANT
          new Promise((_, reject) =>
            // Increase timeout for video (5 minutes)
            setTimeout(() => reject(new Error("AI Timeout")), 300000)
          ),
        ]);

        aiDetections = result?.detections || [];
        aiOutputMedia = result?.outputImage || aiInputAbsPath;
        aiResult = "AI Analysis Completed";

      } catch (err) {
        console.log("❌ AI Error:", err.message);
        aiDetections = [];
        aiOutputMedia = aiInputAbsPath;
        aiResult = `AI Failed: ${err.message}`;
      }
    }

    // ---------------- CALCULATE SEVERITY ----------------
    const severity = calculateSeverity(aiDetections);

    // ---------------- CLEAN PATHS FOR FRONTEND ----------------
    // ---------------- CLEAN PATHS FOR FRONTEND ----------------
    const cleanUploaded = cleanPath(imageFile ? imageFile.path : null);
    const cleanVideo = cleanPath(videoFile ? videoFile.path : null);
    const cleanAiImage = cleanPath(aiOutputMedia);

    // ---------------- SAVE REPORT TO DB ----------------
    const report = await UserReport.create({
      mobile,
      description,
      lat: Number(lat),
      lng: Number(lng),
      address,
      sensorType,

      image: cleanUploaded,
      video: cleanVideo,

      aiImage: cleanAiImage,
      aiLabels: aiDetections,
      aiResult,
      severity,

      status: "Pending",
    });

    return res.json({
      success: true,
      message: "Report submitted successfully!",
      report,
    });

  } catch (err) {
    console.log("❌ Upload Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ----------------------------------------------------
// GET USER REPORTS
// ----------------------------------------------------
export const getUserReports = async (req, res) => {
  try {
    const reports = await UserReport.find({ mobile: req.params.mobile })
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ----------------------------------------------------
// ADMIN SUBMIT MANUAL REPORT
// ----------------------------------------------------
export const submitReport = async (req, res) => {
  try {
    const report = await UserReport.create({
      ...req.body,
      status: "Pending",
    });

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ----------------------------------------------------
// GET ALL REPORTS
// ----------------------------------------------------
export const getAllReports = async (req, res) => {
  try {
    const reports = await UserReport.find().sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ----------------------------------------------------
// UPDATE STATUS (Digital Order Flow)
// ----------------------------------------------------
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const valid = ["Pending", "In-Progress", "Resolved"];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid Status" });
    }

    const report = await UserReport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ----------------------------------------------------
// DELETE REPORT
// ----------------------------------------------------
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await UserReport.findByIdAndDelete(id);
    res.json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
