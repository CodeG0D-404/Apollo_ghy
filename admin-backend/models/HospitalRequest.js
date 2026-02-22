// =============================
// 📁 models/HospitalRequest.js
// Lead-first Hospital Request Model
// Inquiry-style intake + HMS lifecycle ready
// =============================

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const hospitalRequestSchema = new mongoose.Schema(
  {
    // =============================
    // 🔹 Identifiers
    // =============================
    requestId: {
      type: String,
      unique: true,
      required: true,
      default: () => "HR-" + uuidv4(),
    },

    shortId: {
      type: String,
      unique: true,
      required: true,
      default: () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      },
    },

    // =============================
    // 🔹 Patient Link (ONLY after conversion)
    // =============================
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },

    // Soft CRM reference (badge only)
    existingPatientRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },

    isExistingPatient: {
      type: Boolean,
      default: false,
    },

    // =============================
    // 🔹 Snapshot Intake Data
    // Stored exactly as submitted from form
    // =============================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    whatsapp: {
      type: String,
      trim: true,
      default: null,
    },

    email: {
      type: String,
      trim: true,
      default: null,
    },

    city: {
      type: String,
      trim: true,
      default: null,
    },

    message: {
      type: String,
      trim: true,
      default: null,
    },

    // =============================
    // 🔹 Coordinator Inputs
    // Filled AFTER lead contact
    // =============================
    code: {
      type: String,
      default: null,
    },

    doctorName: {
      type: String,
      trim: true,
      default: null,
    },

    visitDate: {
      type: Date,
      default: null,
    },

    // =============================
    // 🔹 Workflow State
    // =============================
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted", "Closed"],
      default: "New",
      index: true,
    },

    assignedCoordinator: {assignedCoordinator: String},

    // =============================
    // 🔹 Conversion Tracking
    // =============================
    convertedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    // =============================
    // 🔹 Archive State
    // =============================
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },

    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// =============================
// 🔹 Indexes (Performance)
// =============================
hospitalRequestSchema.index({ createdAt: -1 });
hospitalRequestSchema.index({ isExistingPatient: 1 });


// =============================
// 🔹 Export
// =============================
module.exports = mongoose.model("HospitalRequest", hospitalRequestSchema);