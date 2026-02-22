const express = require("express");
const router = express.Router();

const {
  getPhoneNumber,
  updatePhoneNumber
} = require("../controller/callCTA.controller");

const validate = require("../middleware/validate");
const { verifyToken } = require("../middleware/auth");

const { updatePhoneSchema } = require("../validators/callCTA.validator");

// PUBLIC
router.get("/", getPhoneNumber);

// ADMIN
router.put(
  "/",
  verifyToken,
  validate(updatePhoneSchema),
  updatePhoneNumber
);

module.exports = router;
