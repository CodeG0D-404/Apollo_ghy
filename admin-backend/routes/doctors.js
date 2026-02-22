const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../controller/doctor.controller");
const validate = require("../middleware/validate");

const {
  createDoctorSchema,
  updateDoctorSchema,
  opdUpdateSchema,
  idParamSchema
} = require("../validators/doctor.validator");

// ---------------------------------------------
// Multer setup
// ---------------------------------------------
const storage = multer.diskStorage({
  destination: "uploads/doctors/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ---------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------
router.get("/", controller.getAllDoctors);

router.get(
  "/specialty/slug/:slug",
  controller.getDoctorsBySpecialtySlug
);

router.get("/specialty/:id", controller.getDoctorsBySpecialty);

router.get("/:id", controller.getDoctorById);

// ---------------------------------------------
// ADMIN ROUTES
// ---------------------------------------------

router.post(
  "/",
  upload.single("photo"),
  validate(createDoctorSchema),
  controller.createDoctor
);

router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  upload.single("photo"),
  validate(updateDoctorSchema),
  controller.updateDoctor
);

router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  controller.deleteDoctor
);

router.patch(
  "/:id/opd-dates",
  validate(idParamSchema, "params"),
  validate(opdUpdateSchema),
  controller.updateOpdDates
);

module.exports = router;
