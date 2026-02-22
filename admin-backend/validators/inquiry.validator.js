const Joi = require("joi");

// ---------------------------------------------
// CREATE INQUIRY (PUBLIC)
// ---------------------------------------------
exports.createInquirySchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  company_name: Joi.string().allow("").optional(), // honeypot

  page: Joi.string()
    .valid("opd", "tele", "hospital", "support")
    .required(),

  section: Joi.string()
    .valid("diagnostic", "transport", "accommodation", "lsd", "general")
    .required(),
});


// ---------------------------------------------
// REVIEW UPDATE (ADMIN)
// ---------------------------------------------
exports.reviewSchema = Joi.object({
  notes: Joi.string().max(500).allow("").optional(),
});


// ---------------------------------------------
// FOLLOWUP UPDATE (ADMIN)
// ---------------------------------------------
exports.followupSchema = Joi.object({
  date: Joi.date().required(),
  remarks: Joi.string().max(500).allow("").optional(),
});
