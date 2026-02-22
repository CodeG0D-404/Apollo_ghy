const express = require("express");
const router = express.Router();

const inquiryController = require("../controller/inquiry.controller");
const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");

const {
  createInquirySchema,
  reviewSchema,
  followupSchema
} = require("../validators/inquiry.validator");

// PUBLIC
router.post("/", validate(createInquirySchema), inquiryController.createInquiry);


// ADMIN
router.get("/", verifyToken, inquiryController.getInquiries);
router.patch(
  "/review/:id",
  verifyToken,
  validate(reviewSchema),
  inquiryController.updateReview
);

router.patch(
  "/followup/:id",
  verifyToken,
  validate(followupSchema),
  inquiryController.updateFollowup
);


module.exports = router;
