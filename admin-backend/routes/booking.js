// ==================================================
// 📁 routes/booking.js
// PURPOSE:
// Defines HTTP routes for booking APIs.
// - Routes decide WHO can access
// - Controllers decide WHAT happens
//
// PUBLIC:
// - Create booking (patient)
//
// ADMIN (Bearer Token Required):
// - List bookings
// - Update booking
// - View single booking
// ==================================================

const express = require("express");
const router = express.Router();

// ================================
// 🔹 Middleware
// ================================
const { verifyToken } = require("../middleware/auth");

// ================================
// 🔹 Controllers
// ================================
const {
  createBooking,
  getBookings,
  updateBooking,
  getBookingById,
} = require("../controller/booking.controller");

const { sendBookingNotification } = require("../controller/bookingNotification.controller");


// ==================================================
// 🔹 PUBLIC ROUTES
// ==================================================

// ================================
// 🔹 POST: Create a new booking (PUBLIC)
// ROUTE: POST /api/bookings
// AUTH: ❌ No
//
// Used by:
// - Website booking form
// - Patients (no login required)
// ================================
router.post("/", createBooking);

// ==================================================
// 🔹 ADMIN ROUTES (Bearer Token Protected)
// ==================================================

// ================================
// 🔹 GET: List bookings (ADMIN)
// ROUTE: GET /api/bookings
// AUTH: ✅ Bearer Token
//
// Features:
// - Query-time auto-archive (past dates)
// - Filters (visitType, archived, status)
// - Search (shortId, patient, doctor, phone, email)
// ================================
router.get("/", verifyToken, getBookings);

// ================================
// 🔹 GET: Single booking by ID (ADMIN)
// ROUTE: GET /api/bookings/:id
// AUTH: ✅ Bearer Token
//
// Used by:
// - Booking detail view
// - Admin inspection
// ================================
router.get("/:id", verifyToken, getBookingById);

// ================================
// 🔹 PATCH: Update booking (ADMIN)
// ROUTE: PATCH /api/bookings/:id
// AUTH: ✅ Bearer Token
//
// Supports:
// - Confirm
// - Decline (auto-archive)
// - Manual archive
// - Restore (only if future date)
// - Assign appointment date
// ================================
router.patch("/:id", verifyToken, updateBooking);



// 🆕 SEND WHATSAPP/SMS NOTIFICATION (ADMIN MANUAL)
router.post("/:id/notify", verifyToken, sendBookingNotification);

// ==================================================
// 🔹 Export Router
// ==================================================
module.exports = router;
