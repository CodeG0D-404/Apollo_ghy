const express = require("express");
const router = express.Router();

const {
  createTestimonial,
  getAllTestimonialsAdmin,
  getTestimonialById,
  updateTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
  getPublishedTestimonials
} = require("../controller/testimonial.controller");

const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/multer");
const validate = require("../middleware/validate");

const {
  createTestimonialSchema,
  updateTestimonialSchema,
  statusSchema,
  idParamSchema
} = require("../validators/testimonial.validator");

/* =========================
   PUBLIC ROUTES
========================= */
router.get("/public", getPublishedTestimonials);

/* =========================
   ADMIN ROUTES
========================= */

router.get("/admin", verifyToken, getAllTestimonialsAdmin);

router.get(
  "/admin/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  getTestimonialById
);

router.post(
  "/",
  verifyToken,
  upload.single("patientImage"),
  validate(createTestimonialSchema),
  createTestimonial
);

router.put(
  "/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  upload.single("patientImage"),
  validate(updateTestimonialSchema),
  updateTestimonial
);

router.patch(
  "/:id/status",
  verifyToken,
  validate(idParamSchema, "params"),
  validate(statusSchema),
  updateTestimonialStatus
);

router.delete(
  "/:id",
  verifyToken,
  validate(idParamSchema, "params"),
  deleteTestimonial
);

module.exports = router;
