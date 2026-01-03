import express from "express";
import twilio from "twilio";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// FIX ENV for this route file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const router = express.Router();

// Debug
console.log("OTP ROUTE ENV CHECK:");
console.log("TWILIO_SID:", process.env.TWILIO_ACCOUNT_SID ? "Loaded" : "Missing");
console.log("TWILIO_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "Missing");
console.log("TWILIO_VERIFY_SID:", process.env.TWILIO_VERIFY_SID || "Missing");

// Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ success: false, error: "Mobile required" });

    const result = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: `+91${mobile}`, channel: "sms" });

    console.log("OTP SENT:", result.status);
    res.json({ success: true });
  } catch (err) {
    console.log("OTP ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const check = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: `+91${mobile}`, code: otp });

    if (check.status === "approved") {
      return res.json({ success: true });
    }

    res.status(400).json({ success: false, error: "Invalid OTP" });
  } catch (err) {
    console.log("VERIFY ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
