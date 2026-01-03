// main-backend/routes/reportRoutes.js
import express from "express";
import {
  uploadDamage,
  getUserReports,
  submitReport,
  getAllReports,
  updateReportStatus   // ✅ IMPORT STATUS UPDATE CONTROLLER
} from "../controllers/reportController.js";

import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 🔧 File storage
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) =>
    cb(null, "input_" + Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/* ----------------------------------------------------------
   🟦 USER — UPLOAD DAMAGE
---------------------------------------------------------- */
router.post(
  "/upload-damage",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  uploadDamage
);

/* ----------------------------------------------------------
   🟩 USER — GET USER REPORTS
---------------------------------------------------------- */
router.get("/my/:mobile", getUserReports);

/* ----------------------------------------------------------
   🟧 ADMIN — CREATE MANUAL REPORT
---------------------------------------------------------- */
router.post("/submit", submitReport);

/* ----------------------------------------------------------
   🟥 ADMIN — GET ALL REPORTS
---------------------------------------------------------- */
router.get("/all", getAllReports);

/* ----------------------------------------------------------
   🟨 ADMIN — UPDATE REPORT STATUS (Correct Route)
   PUT /api/reports/status/<reportId>
---------------------------------------------------------- */
router.put("/status/:id", updateReportStatus);   // ✅ WORKS WITH FRONTEND

export default router;
