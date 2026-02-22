// ==================================================
// 📁 routes/hospitalRequest.js
// Hospital Request Routes (Inquiry-style + HMS lifecycle)
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
  createHospitalRequest,
  getHospitalRequests,
  getHospitalRequestById,
  updateHospitalRequest,
} = require("../controller/hospitalRequest.controller");


// ==================================================
// 🔹 PUBLIC ROUTES
// ==================================================

/**
 * POST /api/hospital-requests
 * Lead intake (Inquiry-style)
 * - Creates hospital request
 * - Soft-check existing patient
 * - Stores badge only
 * - DOES NOT create patient
 */
router.post("/", createHospitalRequest);


// ==================================================
// 🔹 ADMIN ROUTES (Protected)
// ==================================================

/**
 * GET /api/hospital-requests
 * List hospital requests
 * Features:
 * - Pagination
 * - Search
 * - Status filter
 * - Archive filter
 * - Existing patient badge
 */
router.get("/", verifyToken, getHospitalRequests);


/**
 * GET /api/hospital-requests/:id
 * View single hospital request
 * Used for:
 * - Coordinator workflow
 * - Conversion stage
 */
router.get("/:id", verifyToken, getHospitalRequestById);


/**
 * PATCH /api/hospital-requests/:id
 * Lifecycle controller
 *
 * Supports:
 * - status update (New → Contacted → Converted → Closed)
 * - assign coordinator
 * - visit info update
 * - archive / restore
 * - conversion → patient creation handled internally
 *
 * Examples:
 * { status: "Contacted" }
 * { archived: true }
 * { archived: false }
 * { status: "Converted" }
 */
router.patch("/:id", verifyToken, updateHospitalRequest);


// ==================================================
// 🔹 FUTURE ROUTE (Recommended)
// Conversion → Booking
// ==================================================

// router.post("/:id/convert-booking", verifyToken, convertHospitalRequestToBooking);


// ==================================================
// 🔹 Export Router
// ==================================================
module.exports = router;