const express = require("express");
const router = express.Router();

const {
  getAllSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} = require("../controller/specialty.controller");

const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");

const {
  createSpecialtySchema,
  updateSpecialtySchema,
  idParamSchema
} = require("../validators/specialty.validator");

// PUBLIC
router.get("/", getAllSpecialties);

// PROTECTED
router.post(
  "/",
  verifyToken,
  validate(createSpecialtySchema),
  createSpecialty
);

router.put(
  "/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  validate(updateSpecialtySchema),
  updateSpecialty
);

router.delete(
  "/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  deleteSpecialty
);

module.exports = router;
