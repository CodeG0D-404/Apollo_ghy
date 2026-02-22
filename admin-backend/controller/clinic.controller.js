// =======================================================
// 📁 controllers/clinic.controller.js
// PURPOSE:
// Handles clinic/admin authentication using:
// - OTP login via email
// - JWT session stored in httpOnly cookie
//
// SECURITY MODEL:
// - Only approved admin emails allowed
// - OTP expires in 5 minutes
// - JWT expires in 8 hours
// - Token stored ONLY in cookies (not localStorage)
// =======================================================


const Clinic = require("../models/Clinic");
const { sendOtpEmail } = require("../services/emailService");
const jwt = require("jsonwebtoken");
const isProduction = process.env.NODE_ENV === "production";
const validate = require("../middleware/validate");
const { requestOtpSchema, verifyOtpSchema } = require("../validators/clinic.validator");



// =======================================================
// 🔐 ADMIN ACCESS CONTROL
// Only listed emails can log into clinic dashboard
// =======================================================
const allowedEmails = [
  "nehealthcaremedicalservice@gmail.com"
];


// =======================================================
// 📩 REQUEST OTP
// ROUTE: POST /api/clinic/login
//
// FLOW:
// 1️⃣ Admin enters email
// 2️⃣ Check if email is allowed
// 3️⃣ Generate OTP
// 4️⃣ Save OTP + expiry in DB
// 5️⃣ Send OTP to email
//
// ACCESS: Public
// =======================================================
exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 🔒 Allow only whitelisted admin emails
    if (!allowedEmails.includes(email)) {
      return res.status(401).json({ message: "Email not allowed" });
    }

    // 🔢 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ⏰ OTP expiry: 5 minutes
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // 🔎 Find clinic admin record or create one
    let clinic = await Clinic.findOne({ email });
    if (!clinic) clinic = new Clinic({ email });

    // 💾 Save OTP to DB
    clinic.otp = otp;
    clinic.otpExpires = otpExpires;
    await clinic.save();

// 📩 Send OTP via Resend
await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// =======================================================
// 🔑 VERIFY OTP + CREATE SESSION COOKIE
// ROUTE: POST /api/clinic/verify-otp
//
// FLOW:
// 1️⃣ Validate email + OTP
// 2️⃣ Check OTP expiry
// 3️⃣ Generate JWT
// 4️⃣ Store JWT in httpOnly cookie
// 5️⃣ Clear OTP from DB
//
// RESULT:
// Admin is authenticated
//
// ACCESS: Public
// =======================================================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const clinic = await Clinic.findOne({ email });

    // ❌ Invalid email
if (!clinic) {
  return res.status(400).json({ message: "Invalid email" });
}

// 🔐 Check if OTP attempts are blocked
if (clinic.otpBlockedUntil && new Date() < clinic.otpBlockedUntil) {
  return res.status(429).json({
    message: "Too many failed attempts. Try again later."
  });
}

// ❌ OTP expired
if (new Date() > clinic.otpExpires) {
  return res.status(400).json({ message: "OTP expired. Request a new one." });
}


// ❌ OTP mismatch
if (clinic.otp !== otp) {

  clinic.otpAttempts += 1;

  // 🚫 Lock after 5 failed attempts
  if (clinic.otpAttempts >= 5) {
    clinic.otpBlockedUntil = new Date(Date.now() + 10 * 60 * 1000); // block 10 minutes
    clinic.otpAttempts = 0;

    await clinic.save();

    return res.status(429).json({
      message: "Too many incorrect OTP attempts. Login blocked for 10 minutes."
    });
  }

  await clinic.save();

  return res.status(400).json({
    message: `Invalid OTP. ${5 - clinic.otpAttempts} attempts remaining.`
  });
}


    // 🔐 Create JWT token
    const token = jwt.sign(
      { id: clinic._id, email: clinic.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 🧹 Clear OTP after successful login
    // 🧹 Clear OTP after successful login
      clinic.otp = null;
      clinic.otpExpires = null;

      // 🔓 Reset OTP protection
      clinic.otpAttempts = 0;
      clinic.otpBlockedUntil = null;

await clinic.save();

    // 🍪 Store JWT in httpOnly cookie
res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,        // true on Render
  sameSite: isProduction ? "none" : "lax", // allow cross-domain in prod
  maxAge: 8 * 60 * 60 * 1000,
});


    res.json({ message: "Login successful" });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// =======================================================
// 🔓 LOGOUT ADMIN
// ROUTE: POST /api/clinic/logout
//
// PURPOSE:
// - Clears JWT cookie
// - Ends admin session
//
// IMPORTANT:
// - Must be called with credentials: include
// =======================================================
exports.logout = async (req, res) => {
res.clearCookie("token", {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
});


  res.json({ message: "Logged out successfully" });
};
