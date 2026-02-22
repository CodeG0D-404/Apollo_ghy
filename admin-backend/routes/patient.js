// =============================================
// 📁 routes/patient.js
// Patient Routes (Production Ready)
// Cookie-auth protected | Admin-safe
// =============================================

const express = require("express");
const router = express.Router();

const patientController = require("../controller/patient.controller");
const { mergePatientAccounts } = require("../controller/patientMerge.controller");

const { verifyToken } = require("../middleware/auth");
const allowBookingIP = require("../middleware/allowBookingIP");

// destructure AFTER require to avoid undefined binding
const {
  getPatients,
  getPatientById,
  getPatientDetails,
  createPatient,
  softDeletePatient,
  updatePatient,
  addPatientPhone,
  removePatientPhone,
  setPrimaryPhone,
  addPatientEmail,
  removePatientEmail,
  setPrimaryEmail,
} = patientController;


// =====================================================
// 🌍 BOOKING SERVER ONLY (NOT PUBLIC INTERNET)
// =====================================================
router.post("/", allowBookingIP, createPatient);


// =====================================================
// 🔒 ADMIN ROUTES
// =====================================================

// Get paginated patient list
router.get("/", verifyToken, getPatients);

// IMPORTANT: details BEFORE :id
router.get("/:id/details", verifyToken, getPatientDetails);

// Get single patient basic info
router.get("/:id", verifyToken, getPatientById);

// Update patient
router.patch("/:id", verifyToken, updatePatient);

// Merge patients
router.post("/merge", verifyToken, mergePatientAccounts);

// =====================================================
// PHONE MANAGEMENT
// =====================================================
if (addPatientPhone)
  router.post("/:id/phone", verifyToken, addPatientPhone);

if (removePatientPhone)
  router.delete("/:id/phone", verifyToken, removePatientPhone);

if (setPrimaryPhone)
  router.patch("/:id/phone/primary", verifyToken, setPrimaryPhone);


// =====================================================
// EMAIL MANAGEMENT
// =====================================================
if (addPatientEmail)
  router.post("/:id/email", verifyToken, addPatientEmail);

if (removePatientEmail)
  router.delete("/:id/email", verifyToken, removePatientEmail);

if (setPrimaryEmail)
  router.patch("/:id/email/primary", verifyToken, setPrimaryEmail);


// =====================================================
// SOFT DELETE (ARCHIVE)
// =====================================================
router.delete("/:id", verifyToken, softDeletePatient);


module.exports = router;
