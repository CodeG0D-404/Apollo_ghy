// =============================
// 📁 Login.jsx
// Handles clinic admin login (Dummy Login: admin / password)
// Email + OTP commented out per instructions
// =============================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/apollo-logo.png";

// const API = `${import.meta.env.VITE_API_URL}/api`;

function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  /*
  // =============================
  // 🔹 Email + OTP Login (Commented out)
  // =============================
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

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
  */

  // =============================
  // 🔹 Dummy Login Handler (User: admin, Password: password)
  // =============================
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    if (username.trim() === "admin" && password === "password") {
      setSuccess("✅ Login successful! Redirecting...");
      localStorage.setItem("adminAuth", "true");
      setTimeout(() => {
        navigate("/clinic/dashboard");
      }, 500);
    } else {
      setError("❌ Invalid username or password. (Hint: user: admin / Password: password)");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f7ff 0%, #e2eeff 100%)",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 12px 35px rgba(16, 42, 77, 0.12)",
          border: "1px solid #e0e8f2",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link to="/">
            <img
              src={logo}
              alt="ApexCare Logo"
              style={{ height: "48px", objectFit: "contain", marginBottom: "16px" }}
            />
          </Link>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: "0 0 6px" }}>
            Clinic Admin Portal
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Sign in to access clinic appointments & management
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: "100%",
                padding: "11px 14px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "11px 14px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#f8fafc",
              border: "1px dashed #cbd5e1",
              fontSize: "12px",
              color: "#475569",
              marginBottom: "20px",
            }}
          >
            <strong>Default Credentials:</strong><br />
            User: <code style={{ color: "#0052cc", fontWeight: "600" }}>admin</code> &nbsp;|&nbsp;
            Password: <code style={{ color: "#0052cc", fontWeight: "600" }}>password</code>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#ffffff",
              background: "linear-gradient(135deg, #0052cc 0%, #003d99 100%)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0, 82, 204, 0.25)",
            }}
          >
            Sign In
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fee2e2",
              color: "#b91c1c",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #dcfce7",
              color: "#15803d",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        {/*
        // =============================
        // 🔹 Commented out Email OTP UI
        // =============================
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
        */}

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link
            to="/"
            style={{
              fontSize: "13px",
              color: "#64748b",
              textDecoration: "none",
            }}
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
