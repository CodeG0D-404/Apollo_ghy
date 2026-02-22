const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ID");
  }
  return value;
};


// ============================
// CREATE TESTIMONIAL
// ============================
exports.createTestimonialSchema = Joi.object({
  patientName: Joi.string().trim().min(2).max(120).optional(),

  designation: Joi.string().trim().max(120).allow("").optional(),

  message: Joi.string().trim().max(2000).allow("").optional(),

  displayOrder: Joi.number().min(0).optional(),

  status: Joi.string()
    .valid("hidden", "published")
    .optional(),
});


// ============================
// UPDATE TESTIMONIAL
// ============================
exports.updateTestimonialSchema = Joi.object({
  patientName: Joi.string().trim().min(2).max(120).optional(),

  designation: Joi.string().trim().max(120).allow("").optional(),

  message: Joi.string().trim().max(2000).allow("").optional(),

  displayOrder: Joi.number().min(0).optional(),

  status: Joi.string()
    .valid("hidden", "published")
    .optional(),
});


// ============================
// STATUS UPDATE
// ============================
exports.statusSchema = Joi.object({
  status: Joi.string()
    .valid("hidden", "published")
    .required(),
});


// ============================
// PARAM VALIDATION
// ============================
exports.idParamSchema = Joi.object({
  id: Joi.string().custom(objectId).required(),
});
