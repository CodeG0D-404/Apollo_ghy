const express = require("express");
const router = express.Router();

const {
  getAllConditions,
  createCondition,
  updateCondition,
  hideCondition,
  deleteCondition,
} = require("../controller/condition.controller");

const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");

const {
  createConditionSchema,
  updateConditionSchema,
  idParamSchema
} = require("../validators/condition.validator");

// ============================
// PUBLIC ROUTES
// ============================

router.get("/", getAllConditions);

// ============================
// PROTECTED ROUTES
// ============================

router.post(
  "/",
  verifyToken,
  validate(createConditionSchema),
  createCondition
);

router.put(
  "/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  validate(updateConditionSchema),
  updateCondition
);

router.patch(
  "/:id/hide",
  verifyToken,
  validate(idParamSchema, "params"),
  hideCondition
);

router.delete(
  "/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  deleteCondition
);

module.exports = router;
