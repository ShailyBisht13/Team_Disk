import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";

export default function UserLogin({ setUser }) {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const intv = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(intv);
    }
  }, [timer]);

  /* ---------------------------------
        SEND OTP
  ----------------------------------*/
  const sendOtp = async () => {
    if (mobile.length !== 10) {
      setMessage("❗ Enter valid 10-digit mobile number");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (data.success) {
        setIsOtpSent(true);
        setTimer(60);
        setMessage("📩 OTP sent successfully!");
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("⚠️ Backend not responding");
    }

    setLoading(false);
  };

  /* ---------------------------------
        VERIFY OTP
  ----------------------------------*/
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setMessage("❗ Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await res.json();

      if (data.success) {
        setUser({ mobile });
        navigate("/dashboard");
      } else {
        setMessage("❌ Invalid OTP");
      }
    } catch (err) {
      setMessage("⚠️ Verification failed");
    }

    setLoading(false);
  };

  return (
    <div className="userlogin-container">
      <div className="userlogin-card">
        <h2>User Login (OTP)</h2>

        {!isOtpSent ? (
          <>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              maxLength="10"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <button disabled={loading} onClick={sendOtp}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button disabled={loading} onClick={verifyOtp}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {timer > 0 ? (
              <p>Resend OTP in {timer}s</p>
            ) : (
              <button onClick={sendOtp}>Resend OTP</button>
            )}
          </>
        )}

        {message && <p className="msg-box">{message}</p>}
      </div>
    </div>
  );
}
