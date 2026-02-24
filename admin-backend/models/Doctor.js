// =============================================
// 📁 models/Doctor.js
// Doctor Schema & Model
// =============================================

const mongoose = require("mongoose");
const slugify = require("slugify");

// ============================
// START: Doctor Schema
// ============================

const doctorSchema = new mongoose.Schema(
  {
    // 🔹 Full name of the doctor
    name: { type: String, required: true, trim: true },

    // 🔹 Slug (auto-generated from name)
    slug: { type: String, unique: true, lowercase: true, trim: true },

    // 🔹 Specialty reference
    specialty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialty",
      required: true,
      default: null,
    },

    // 🔹 Academic qualification
    qualification: { type: String, required: true, trim: true },

    // 🔹 Years of professional experience
    experience: { type: Number, min: 0, required: true },

    // 🔹 Languages spoken by the doctor
    language: {
      type: [String],
      enum: [
  "Hindi",
  "English",
  "Bengali",
  "Tamil",
  "Telugu",
  "Assamese",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Odia",
  "Punjabi",
  "Urdu",
],

      default: [],
    },

    // 🔹 Types of consultations doctor offers
    visitTypes: {
      type: [String],
      enum: ["OPD", "Telemedicine", "Hospital Visit"],
      default: [],
    },

    // 🔹 OPD Dates (stored as array of Date objects)
    opdDates: {
      type: [Date],
      default: [],
    },

    // 🔹 Doctor's photo
    photo: { type: String, default: "" },

    // 🔹 Conditions treated
    conditionsTreated: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Condition",
        },
      ],
      default: [],
    },

    // 🔹 Short biography/intro
    bio: { type: String, trim: true },
  },
  { timestamps: true }
);

// ============================
// 🔹 Helper function
// ============================

// Filters OPD dates → keeps only future dates
function filterFutureDates(dates = []) {
  const today = new Date();
  return dates.filter((d) => new Date(d) >= today);
}

// ============================
// 🔹 Consistency Middleware
// Keeps visitTypes and opdDates always in sync
// ============================

function syncOPD(next) {
  const doc = this._update ? this._update : this;

  // ✅ Step 1: Clean OPD dates → keep only future ones
  if (doc.opdDates) {
    doc.opdDates = filterFutureDates(doc.opdDates);
  }

  // ✅ Step 2: If OPD is unchecked, clear opdDates
  if (doc.visitTypes && !doc.visitTypes.includes("OPD")) {
    doc.opdDates = [];
  }

  // ✅ Step 3: If opdDates exist → ensure OPD is in visitTypes
  if (doc.opdDates && doc.opdDates.length > 0) {
    if (!doc.visitTypes.includes("OPD")) {
      doc.visitTypes.push("OPD");
    }
  }

  // ✅ Step 4: If no opdDates → remove OPD from visitTypes
  if (!doc.opdDates || doc.opdDates.length === 0) {
    if (doc.visitTypes) {
      doc.visitTypes = doc.visitTypes.filter((t) => t !== "OPD");
    }
  }

  next();
}

// 🔹 Auto-generate slug before save
doctorSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// 🔹 Auto-generate slug on update
doctorSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.name) {
    this._update.slug = slugify(this._update.name, { lower: true, strict: true });
  }
  syncOPD.call(this, next);
});

// Apply sync middleware for save
doctorSchema.pre("save", syncOPD);

// ============================
// 🔹 Virtual Display Name
// Adds "Dr." prefix without modifying DB
// ============================

doctorSchema.virtual("displayName").get(function () {
  if (!this.name) return "";
  return `Dr. ${this.name}`;
});

// Ensure virtuals are included when sending JSON
doctorSchema.set("toJSON", { virtuals: true });
doctorSchema.set("toObject", { virtuals: true });

// ============================
// END: Doctor Schema
// ============================



const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;

// ============================
// END: Doctor Model Export
// ============================
