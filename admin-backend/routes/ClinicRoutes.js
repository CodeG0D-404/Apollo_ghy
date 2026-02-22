// =======================================================
// 📁 routes/ClinicRoutes.js
// =======================================================

const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const { requestOtpSchema, verifyOtpSchema } = require("../validators/clinic.validator");

// =======================================================
// 🔹 Controllers  ← MOVE THIS ABOVE ROUTES
// =======================================================
const {
  requestOTP,
  verifyOTP,
  logout,
} = require("../controller/clinic.controller");

// =======================================================
// 🔹 Middleware
// =======================================================
const { verifyToken } = require("../middleware/auth");


// =======================================================
// 🔐 AUTH ROUTES
// =======================================================

// 🟡 Request OTP
router.post("/login", validate(requestOtpSchema), requestOTP);

// 🟡 Verify OTP
router.post("/verify-otp", validate(verifyOtpSchema), verifyOTP);


// =======================================================
// 🔐 PROTECTED TEST ROUTE
// =======================================================
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.email}`,
  });
});


// =======================================================
// 🔓 LOGOUT ROUTE
// =======================================================
router.post("/logout", logout);


// =======================================================
// 🔹 Export Router
// =======================================================
module.exports = router;
