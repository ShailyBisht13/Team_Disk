import express from "express";
import twilio from "twilio";

const router = express.Router();
let otpStore = {}; // In-memory OTP store

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 📤 Send OTP
router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ success: false, error: "Mobile number required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[mobile] = otp;

    await client.messages.create({
      body: `Your Smart Uttarakhand OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobile}`
    });

    console.log("OTP:", otp);
    res.json({ success: true, message: "OTP sent" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✔ Verify OTP
router.post("/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;

  if (otpStore[mobile] && otpStore[mobile] == otp) {
    delete otpStore[mobile];
    return res.json({ success: true, message: "OTP verified" });
  }

  res.status(400).json({ success: false, error: "Invalid OTP" });
});

export default router;
