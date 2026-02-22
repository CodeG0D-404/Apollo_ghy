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
// CREATE CONDITION
// ============================
exports.createConditionSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(80)
    .required(),
});


// ============================
// UPDATE CONDITION
// ============================
exports.updateConditionSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(80)
    .optional(),
});


// ============================
// PARAM VALIDATION
// ============================
exports.idParamSchema = Joi.object({
  id: Joi.string().custom(objectId).required(),
});
