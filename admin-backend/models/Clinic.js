const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },

  otp: { type: String },
  otpExpires: { type: Date },

  // 🔐 OTP brute-force protection
  otpAttempts: { type: Number, default: 0 },
  otpBlockedUntil: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);
