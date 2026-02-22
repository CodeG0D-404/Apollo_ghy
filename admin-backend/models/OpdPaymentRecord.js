// =============================================
// 📁 models/OpdPaymentRecord.js
// OPD Payment Record (Admin-only, Non-Transactional)
// =============================================

const mongoose = require("mongoose");

const opdPaymentRecordSchema = new mongoose.Schema(
  {
    // 🔗 Booking linkage (source of truth)
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // 🏥 Defensive scope
    visitType: {
      type: String,
      enum: ["OPD"],
      default: "OPD",
      immutable: true,
    },

    // 💳 Payment status
    paymentStatus: {
      type: String,
      enum: ["NO_ADVANCE", "ADVANCE", "FULL_PAYMENT"],
      default: "NO_ADVANCE",
      index: true,
    },

    // 💰 Amounts (admin-entered)
    totalAmount: {
      type: Number,
      min: 0,
      default: null,
    },

    paidAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    // 📉 Derived but stored for fast reads
    dueAmount: {
      type: Number,
      min: 0,
      default: null,
    },

    // 🔍 Audit
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

// =============================
// 🔹 Consistency Guard
// =============================
opdPaymentRecordSchema.pre("save", function (next) {
  if (this.totalAmount !== null) {
    this.dueAmount = Math.max(this.totalAmount - this.paidAmount, 0);

    if (this.paidAmount === 0) {
      this.paymentStatus = "NO_ADVANCE";
    } else if (this.paidAmount < this.totalAmount) {
      this.paymentStatus = "ADVANCE";
    } else if (this.paidAmount === this.totalAmount) {
      this.paymentStatus = "FULL_PAYMENT";
    }
  }

  next();
});

module.exports = mongoose.model(
  "OpdPaymentRecord",
  opdPaymentRecordSchema
);
