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
// CREATE BLOG
// ============================
exports.createBlogSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),

  content: Joi.string().min(10).required(),

  excerpt: Joi.string().allow("").optional(),

  status: Joi.string()
    .valid("draft", "published")
    .optional(),
});


// ============================
// UPDATE BLOG
// ============================
exports.updateBlogSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).optional(),

  content: Joi.string().min(10).optional(),

  excerpt: Joi.string().allow("").optional(),

  status: Joi.string()
    .valid("draft", "published")
    .optional(),
});


// ============================
// PARAM VALIDATION
// ============================
exports.idParamSchema = Joi.object({
  id: Joi.string().custom(objectId).required(),
});
