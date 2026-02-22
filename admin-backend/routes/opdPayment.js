const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");

const {
  getPaymentByBookingId,
  updatePaymentRecord,
} = require("../controller/opdPayment.controller");

const {
  bookingParamSchema,
  updatePaymentSchema
} = require("../validators/opdPayment.validator");

// ---------------------------------------------
// 🔒 ADMIN ROUTES
// ---------------------------------------------

router.get(
  "/:bookingId",
  verifyToken,
  validate(bookingParamSchema, "params"),
  getPaymentByBookingId
);

router.patch(
  "/:bookingId",
  verifyToken,
  validate(bookingParamSchema, "params"),
  validate(updatePaymentSchema),
  updatePaymentRecord
);

module.exports = router;
