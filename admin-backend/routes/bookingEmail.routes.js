// ==================================================
// 📁 routes/bookingEmail.routes.js
// PURPOSE:
// Admin-only routes for explicit email sending
// ==================================================

const express = require("express");
const router = express.Router();

const {
  sendConfirmationEmail,
  sendDateUpdateEmail,
  sendCancellationEmail,
} = require("../controller/bookingEmail.controller");

// 🔐 NOTE:
// Protect these routes with admin auth middleware
// if not already applied globally

router.post("/:id/send-confirmation-email", sendConfirmationEmail);
router.post("/:id/send-date-update-email", sendDateUpdateEmail);
router.post("/:id/send-cancellation-email", sendCancellationEmail);

module.exports = router;
