// =====================================================
// 📁 validators/patient.validator.js
// Create Patient Validator (Booking + Admin)
// Production Safe
// =====================================================

const Joi = require("joi");

// reusable validators
const phoneValidator = Joi.string().pattern(/^\+91\d{10}$/);
const emailValidator = Joi.string().email();

// =====================================================
// CREATE PATIENT SCHEMA
// =====================================================
exports.createPatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),

  // PRIMARY PHONE (mandatory)
  mobile: phoneValidator.required(),

  age: Joi.number().integer().min(0).max(120).required(),

  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .required(),

  address: Joi.string().trim().min(1).required(),

  city: Joi.string().trim().min(1).required(),

  localArea: Joi.string().trim().allow("").optional(),

  zip: Joi.string().pattern(/^\d{6}$/).required(),

  symptoms: Joi.string().trim().min(1).required(),

  // optional direct contacts
  whatsapp: phoneValidator.optional(),
  email: emailValidator.optional(),

  // MULTI PHONES
  phones: Joi.array()
    .items(
      Joi.object({
        number: phoneValidator.required(),
        label: Joi.string()
          .valid("Primary", "Secondary", "WhatsApp", "Home", "Other")
          .optional(),
        isPrimary: Joi.boolean().optional(),
      })
    )
    .max(4)
    .optional(),

  // MULTI EMAILS
  emails: Joi.array()
    .items(
      Joi.object({
        email: emailValidator.required(),
        label: Joi.string()
          .valid("Primary", "Personal", "Work", "Family", "Other")
          .optional(),
      })
    )
    .optional(),

  // DOCTOR CONNECTIONS (ADMIN ONLY)
  doctorConnections: Joi.array()
    .items(
      Joi.object({
        doctorId: Joi.string().hex().length(24).optional(),
        specialtyId: Joi.string().hex().length(24).optional(),
        firstVisit: Joi.date().optional(),
        lastVisit: Joi.date().optional(),
        visitCount: Joi.number().min(0).optional(),
      })
    )
    .optional(),
})
.custom((value, helpers) => {

  // =================================================
  // NORMALIZATION
  // =================================================
  const normalizePhone = (num) => {
    if (!num) return num;
    const cleaned = num.replace(/\s+/g, "");
    return cleaned.startsWith("+91") ? cleaned : `+91${cleaned}`;
  };

  const normalizeEmail = (e) => e?.toLowerCase().trim();

  // normalize primary mobile
  value.mobile = normalizePhone(value.mobile);

  // normalize whatsapp
  if (value.whatsapp) value.whatsapp = normalizePhone(value.whatsapp);

  // normalize phones[]
  if (value.phones) {
    value.phones = value.phones.map(p => ({
      number: normalizePhone(p.number),
      label: p.label || "Secondary",
      isPrimary: false,
    }));
  }

  // normalize emails[]
  if (value.emails) {
    value.emails = value.emails.map(e => ({
      ...e,
      email: normalizeEmail(e.email),
    }));
  }

  // RULE 1: max total phones = 5
  const totalPhones = 1 + (value.phones ? value.phones.length : 0);
  if (totalPhones > 5) {
    return helpers.message("Maximum 5 phone numbers allowed");
  }

  // RULE 2: no duplicate phones
  const phoneSet = new Set([value.mobile]);
  if (value.phones) {
    for (const p of value.phones) {
      if (phoneSet.has(p.number)) {
        return helpers.message("Duplicate phone numbers not allowed");
      }
      phoneSet.add(p.number);
    }
  }

  // RULE 3: phones[] cannot override primary
  if (value.phones) {
    const primaryCount = value.phones.filter((p) => p.isPrimary).length;
    if (primaryCount > 0) {
      return helpers.message("Primary phone is auto-set from mobile during creation");
    }
  }

  // RULE 4: only ONE WhatsApp allowed
  let whatsappCount = 0;
  if (value.whatsapp) whatsappCount++;
  if (value.phones) {
    for (const p of value.phones) {
      if (p.label === "WhatsApp") whatsappCount++;
    }
  }
  if (whatsappCount > 1) {
    return helpers.message("Only one WhatsApp number allowed");
  }

  // RULE 5: whatsapp cannot duplicate existing phones
  if (value.whatsapp && phoneSet.has(value.whatsapp)) {
    return helpers.message("WhatsApp number already exists in phone list");
  }

  // RULE 6: no duplicate emails
  const emailSet = new Set();
  if (value.emails) {
    for (const e of value.emails) {
      const normalizedEmail = normalizeEmail(e.email);
      if (emailSet.has(normalizedEmail)) {
        return helpers.message("Duplicate emails not allowed");
      }
      emailSet.add(normalizedEmail);
    }
  }

  return value;
});


// =====================================================
// UPDATE PATIENT SCHEMA (PATCH SAFE)
// =====================================================
exports.updatePatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).optional(),
  age: Joi.number().integer().min(0).max(120).optional(),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  localArea: Joi.string().trim().allow("").optional(),
  zip: Joi.string().pattern(/^\d{6}$/).optional(),
  symptoms: Joi.string().trim().optional(),
  mobile: phoneValidator.optional(),
  whatsapp: phoneValidator.optional(),
  email: emailValidator.optional(),
  doctorId: Joi.string().hex().length(24).optional(),
  specialtyId: Joi.string().hex().length(24).optional(),

}).min(1);
