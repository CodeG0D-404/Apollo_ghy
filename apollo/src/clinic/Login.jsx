// =============================
// 📁 Login.jsx
// Handles clinic admin login with email + OTP (cookie auth)
// =============================

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL}/api`;

function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // =============================
  // 🔹 Step 1: Request OTP
  // =============================
  const requestOTP = () => {
    fetch(`${API}/clinic/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include", // 🔐 allow cookies
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || "OTP sent");
        if (data.message === "OTP sent to email") {
          setStep(2);
        }
      })
      .catch(() => setMessage("❌ Error sending OTP"));
  };

  // =============================
  // 🔹 Step 2: Verify OTP
  // =============================
  const verifyOTP = () => {
    fetch(`${API}/clinic/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include", // 🔐 REQUIRED for cookie login
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Login successful") {
          setMessage("✅ Login successful!");
          navigate("/clinic/dashboard");
        } else {
          setMessage(data.message || "❌ OTP invalid");
        }
      })
      .catch(() => setMessage("❌ Error verifying OTP"));
  };

  // =============================
  // 🔹 UI
  // =============================
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      
      {step === 1 && (
        <>
          <h2>Login with Email</h2>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={requestOTP} style={{ width: "100%", padding: "10px" }}>
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Enter OTP</h2>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={verifyOTP} style={{ width: "100%", padding: "10px" }}>
            Verify OTP
          </button>
        </>
      )}

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}

export default Login;
