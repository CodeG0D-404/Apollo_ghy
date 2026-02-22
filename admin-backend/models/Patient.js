// =============================================
// 📁 models/Patient.js
// Patient Schema (Production Safe + Merge Ready)
// Cleaned + Structured + No Logic Removed
// =============================================

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// =====================================================
// 📞 PHONE SUB-SCHEMA
// =====================================================
const phoneSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      match: [/^\+91\d{10}$/, "Invalid Indian mobile number"],
      required: true,
    },
    label: {
      type: String,
      enum: ["Primary", "Secondary", "WhatsApp", "Home", "Other"],
      default: "Primary",
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    isWhatsApp: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);


// =====================================================
// 📧 EMAIL SUB-SCHEMA
// =====================================================
const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
    label: {
      type: String,
      enum: ["Primary", "Personal", "Work", "Family", "Other"],
      default: "Primary",
    },
  },
  { _id: false }
);

// =====================================================
// 👨‍⚕️ DOCTOR CONNECTION HISTORY
// =====================================================
const doctorConnectionSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    specialtyId: { type: mongoose.Schema.Types.ObjectId, ref: "Specialty" },
    firstVisit: Date,
    lastVisit: Date,
    visitCount: { type: Number, default: 0 },
  },
  { _id: false }
);

// =====================================================
// 🔀 MERGE HISTORY
// =====================================================
const mergeHistorySchema = new mongoose.Schema(
  {
    mergedPatientId: String,
    mergedIntoPatientId: String,
    date: { type: Date, default: Date.now },
    mergedBy: { type: String },
  },
  { _id: false }
);

// =====================================================
// 🧾 MAIN PATIENT SCHEMA
// =====================================================
const patientSchema = new mongoose.Schema(
  {
    // =================================================
    // 🆔 SYSTEM IDENTIFIERS
    // =================================================
    patientId: {
      type: String,
      unique: true,
      immutable: true,
      default: () => "PT-" + uuidv4(),
      index: true,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    // =================================================
// 🆔 HUMAN FRIENDLY ID (Reception / Dashboard)
// =================================================
      shortId: {
        type: String,
        unique: true,
        index: true,
      },

    // =================================================
    // 👤 CORE PATIENT INFO
    // =================================================
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    age: {
      type: Number,
      required: true,
      min: [0, "Age cannot be negative"],
      max: [120, "Invalid age"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
      trim: true,
    },

    symptoms: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // 📍 ADDRESS
    // =================================================
    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    localArea: { type: String, trim: true, default: "" },

    zip: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{6}$/, "Invalid Indian ZIP code"],
    },

    // =================================================
    // 🆕 MULTI CONTACT SUPPORT
    // =================================================
    phones: {
      type: [phoneSchema],
      default: [],
      validate: [
        {
          validator: function (arr) {
            return arr.length <= 5;
          },
          message: "Maximum 5 phone numbers allowed",
        },
        {
          validator: function (arr) {
            const primaryCount = arr.filter((p) => p.isPrimary).length;
            return primaryCount <= 1;
          },
          message: "Only one primary phone allowed",
        },
      ],
    },

    emails: {
      type: [emailSchema],
      default: [],
    },

    // =================================================
    // 👨‍⚕️ DOCTOR CONNECTION HISTORY
    // =================================================
    doctorConnections: {
      type: [doctorConnectionSchema],
      default: [],
    },

    // =================================================
    // 🔀 MERGE SYSTEM
    // =================================================
    duplicateOf: {
      type: Boolean,
      default: false,
      index: true,
    },

    mergedInto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
      index: true,
    },

    referencePatientIds: {
      type: [String],
      default: [],
    },

    mergeHistory: {
      type: [mergeHistorySchema],
      default: [],
    },

    // =================================================
    // 🧾 AUDIT TRAIL
    // =================================================
    auditTrail: [
      {
        action: { type: String },
        performedBy: { type: String },
        date: { type: Date, default: Date.now },
        meta: { type: Object },
      },
    ],
  },
  { timestamps: true }
);

// =====================================================
// 🔍 INDEXES FOR PERFORMANCE
// =====================================================
patientSchema.index({ "phones.number": 1 });


// =====================================================
// 🔢 Generate human readable patient ID
// PAT-XXXXXXX
// Auto retry until unique
// =====================================================
const generateShortId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "PAT-";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

patientSchema.pre("save", async function (next) {
  if (this.shortId) return next();

  let unique = false;

  while (!unique) {
    const id = generateShortId();

    const exists = await mongoose.models.Patient.findOne({ shortId: id });

    if (!exists) {
      this.shortId = id;
      unique = true;
    }
  }

  next();
});


// =====================================================
// 📤 EXPORT
// =====================================================
module.exports = mongoose.model("Patient", patientSchema);
