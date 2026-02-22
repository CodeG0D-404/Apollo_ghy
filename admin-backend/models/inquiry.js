// =============================================
// Inquiry Lead Schema
// =============================================

const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },

  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{12}$/, "Invalid phone"]
  },

  isExistingPatient: {
    type: Boolean,
    default: false
  },

  patientRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    default: null
  },

  source: {
    page: {
      type: String,
      enum: ["opd", "tele", "hospital", "support"],
      required: true
    },
    section: {
      type: String,
      enum: ["diagnostic", "transport", "accommodation", "lsd", "general"],
      required: true
    }
  },


  review: {
    status: { type: Boolean, default: false },
    notes: { type: String, trim: true }
  },

  followup: {
    status: { type: Boolean, default: false },
    date: { type: Date },
    remarks: { type: String, trim: true }
  }

}, { timestamps: true });


InquirySchema.index({ phone: 1 });
InquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Inquiry", InquirySchema);
