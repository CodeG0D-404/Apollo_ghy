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
// CREATE DOCTOR
// ============================
exports.createDoctorSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),

  qualification: Joi.string().trim().min(2).max(700).required(),

  experience: Joi.number().min(0).required(),

  specialty: Joi.string().custom(objectId).required(),

  bio: Joi.string().allow("").optional(),

  language: Joi.string().optional(), // JSON string

  conditionsTreated: Joi.string().optional(), // JSON string

  visitTypes: Joi.string().optional(), // JSON string

  opdDates: Joi.string().optional(), // JSON string
});


// ============================
// UPDATE DOCTOR
// ============================
exports.updateDoctorSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).optional(),

  qualification: Joi.string().trim().min(2).max(700).optional(),

  experience: Joi.number().min(0).optional(),

  photo: Joi.any().optional(),

  specialty: Joi.string().custom(objectId).optional(),

  bio: Joi.string().allow("").optional(),

  language: Joi.string().optional(),

  conditionsTreated: Joi.string().optional(),

  visitTypes: Joi.string().optional(),

  opdDates: Joi.string().optional(),
});


// ============================
// OPD DATE UPDATE
// ============================
exports.opdUpdateSchema = Joi.object({
  opdDates: Joi.array().items(Joi.date()).required(),

  mode: Joi.string()
    .valid("add", "remove", "replace")
    .optional(),
});


// ============================
// PARAM VALIDATION
// ============================
exports.idParamSchema = Joi.object({
  id: Joi.string().custom(objectId).required(),
});
