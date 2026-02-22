const Joi = require("joi");

// ============================
// PARAM VALIDATION
// ============================
exports.bookingParamSchema = Joi.object({
  bookingId: Joi.string().trim().min(3).required(),
});


// ============================
// UPDATE PAYMENT RECORD
// ============================
exports.updatePaymentSchema = Joi.object({
  totalAmount: Joi.number().min(0).allow(null).optional(),

  paidAmount: Joi.number().min(0).optional(),
});
