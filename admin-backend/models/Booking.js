// =============================
// 📁 models/Booking.js
// FINAL Booking Schema (Lifecycle-aware, Non-breaking)
// =============================

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const bookingSchema = new mongoose.Schema(
  {
    // =============================
    // 🔹 Identifiers
    // =============================
    bookingId: {
      type: String,
      unique: true,
      required: true,
      default: () => "BK-" + uuidv4(),
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
    // 🔹 Relations
    // =============================
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // =============================
    // 🔹 Snapshot Data (Audit-safe)
    // =============================
    doctorName: { type: String, required: true, trim: true },
    patientName: { type: String, required: true, trim: true },
    gender: {type: String,
  enum: ["Male", "Female", "Other"],
  required: true,
},

    age: { type: Number,
    required: true,
},

    mobile: { type: String, required: true, trim: true },
    whatsapp: { type: String, default: null, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    localArea: { type: String, trim: true },
    zip: { type: String, trim: true },
    

    // =============================
    // 🔹 Visit Type
    // =============================
    visitType: {
      type: String,
      enum: ["OPD", "Telemedicine", "Hospital"],
      required: true,
    },

    // =============================
    // 🔹 Appointment Dates
    // =============================

    /**
     * OPD:
     * - Mandatory at booking time
     * - Comes from doctor OPD schedule
     */
    opdDate: {
      type: Date,
      default: null,
    },

    /**
     * Telemedicine / Hospital:
     * - Assigned later by admin
     */
    scheduledDate: {
      type: Date,
      default: null,
    },

    // =============================
    // 🔹 Booking Meta
    // =============================
    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    status: {
      type: String,
      enum: ["Waiting", "Confirmed", "Declined"],
      default: "Waiting",
    },

    isOldPatient: {
      type: Boolean,
      default: false,
    },

    /**
     * ARCHIVE = terminal visibility state
     * - Past date
     * - Declined
     * - Manual archive
     */
    archived: {
      type: Boolean,
      default: false,
    },
// =============================
// 🔹 Email Communication State
// =============================
emailSent: {
  booked: {
    type: Boolean,
    default: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  dateUpdated: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
},

// =============================
// 🔹 Notification Audit
// =============================
notifications: [
  {
    type: {
      type: String,
      enum: ["BOOKED", "CONFIRMED", "DECLINED", "RESCHEDULED"],
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    sentBy: {
      type: String,
    },
    channel: {
      type: String,
      enum: ["whatsapp", "sms"],
    },
  },
],

  },
  {
    timestamps: true,
  }
);


// =============================
// 🔹 Schema-level Guards
// =============================

/**
 * Ensure OPD rules:
 * - OPD must have opdDate
 * - Non-OPD must NOT have opdDate
 */
bookingSchema.pre("save", function (next) {
  if (this.visitType === "OPD" && !this.opdDate) {
    return next(new Error("OPD booking must have opdDate"));
  }

  if (this.visitType !== "OPD" && this.opdDate) {
    return next(new Error("opdDate is only allowed for OPD bookings"));
  }

  next();
});

// =============================
// 🔹 Virtual: Unified Appointment Date
// (Used for lifecycle checks)
// =============================

bookingSchema.virtual("appointmentDate").get(function () {
  return this.visitType === "OPD" ? this.opdDate : this.scheduledDate;
});

// =============================
// 🔹 Indexes (Performance)
// =============================
bookingSchema.index({ visitType: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ archived: 1 });
bookingSchema.index({ opdDate: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ createdAt: -1 });

// =============================
// 🔹 Export
// =============================

module.exports = mongoose.model("Booking", bookingSchema);
