// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/* -----------------------------------
   📌 FIX __dirname FOR ES MODULES
----------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -----------------------------------
   ⭐ LOAD .env BEFORE ANY ROUTES
----------------------------------- */
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("\n🔍 ENV Loaded From:", path.join(__dirname, ".env"));
console.log("TWILIO_SID:", process.env.TWILIO_ACCOUNT_SID || "❌ Missing");
console.log("TWILIO_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "❌ Missing");
console.log("TWILIO_NUMBER:", process.env.TWILIO_PHONE_NUMBER || "❌ Missing");
console.log("TWILIO_VERIFY_SID:", process.env.TWILIO_VERIFY_SID || "❌ Missing");
console.log("");

const app = express();

/* -----------------------------------
   🌐 CORS
----------------------------------- */
app.use(
   cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
   })
);

/* -----------------------------------
   📦 BODY PARSER
----------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------------------------
   🌐 CONNECT MONGODB
----------------------------------- */
console.log("🛠️ DEBUG: Trying to connect with URI:", process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ":****@") : "UNDEFINED");
mongoose
   .connect(process.env.MONGO_URI)
   .then(() => console.log("✅ MongoDB Connected"))
   .catch((err) => console.log("❌ Mongo Error:", err.message));

/* -----------------------------------
   📁 STATIC FOLDERS
----------------------------------- */

// 🔹 USER UPLOADS
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
app.use("/uploads", express.static(uploadPath));

// 🔹 AI OUTPUT IMAGES (runs/detect/predict)
const aiOutputPath = path.join(__dirname, "main-backend", "ai", "runs");
if (!fs.existsSync(aiOutputPath)) fs.mkdirSync(aiOutputPath, { recursive: true });
app.use("/ai-output", express.static(aiOutputPath));

/* -----------------------------------
   🚦 ROUTES
----------------------------------- */
import adminRoutes from "./main-backend/routes/adminRoutes.js";
import reportRoutes from "./main-backend/routes/reportRoutes.js";
import satelliteRoutes from "./main-backend/routes/satelliteRoutes.js";
import userOtpRoutes from "./main-backend/routes/userOtpRoutes.js";
import aiRoutes from "./main-backend/routes/aiRoutes.js";
import orderRoutes from "./main-backend/routes/orderRoutes.js";

app.use("/api/otp", userOtpRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/satellite", satelliteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/orders", orderRoutes);

/* -----------------------------------
   🟢 HEALTH CHECK
----------------------------------- */
app.get("/", (req, res) => {
   res.json({
      success: true,
      message: "Backend running successfully",
      twilioVerifyLoaded: !!process.env.TWILIO_VERIFY_SID,
   });
});

/* -----------------------------------
   🚀 START SERVER
----------------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
