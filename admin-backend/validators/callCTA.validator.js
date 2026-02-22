const Joi = require("joi");

// ============================
// UPDATE PHONE CTA
// ============================
exports.updatePhoneSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must be 12 digits (91XXXXXXXXXX)",
    }),
});
