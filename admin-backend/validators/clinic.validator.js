const Joi = require("joi");

// 📩 Request OTP validation
exports.requestOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

// 🔑 Verify OTP validation
exports.verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});
