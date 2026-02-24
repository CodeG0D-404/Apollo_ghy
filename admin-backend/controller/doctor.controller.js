// =============================================
// 📁 controllers/doctor.controller.js
// Purpose: Business logic for Doctor routes
// =============================================

const Doctor = require("../models/Doctor");
const Specialty = require("../models/Specialty");
const slugify = require("slugify");
const uploadToCloudinary = require("../services/cloudinaryUpload"); // 🔥 ADDED

// ---------------------------------------------
// Helpers
// ---------------------------------------------
const cleanOpdDates = (doctor) => {
  const today = new Date();
  const d = doctor.toObject();

  d.opdDates = d.opdDates.filter((date) => new Date(date) >= today);

  if (d.visitTypes.includes("OPD") && d.opdDates.length === 0) {
    d.visitTypes = d.visitTypes.filter((t) => t !== "OPD");
  }

  return d;
};


// ---------------------------------------------
// GET DOCTORS BY SPECIALTY SLUG (Public)
// ---------------------------------------------
exports.getDoctorsBySpecialtySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { visitType } = req.query;

    const specialty = await Specialty.findOne({
      slug,
      active: true,
    });

    if (!specialty) {
      return res.status(404).json({
        error: "Specialty not found",
      });
    }

    let doctors = await Doctor.find({ specialty: specialty._id })
      .populate("specialty", "name slug active")
      .populate("conditionsTreated", "name")
      .select(
        "name slug qualification experience bio photo language specialty conditionsTreated visitTypes opdDates"
      );

    doctors = doctors
      .map(cleanOpdDates)
      .filter((d) => d.specialty?.active);

    if (visitType) {
      doctors = doctors.filter((d) =>
        d.visitTypes.includes(visitType)
      );
    }

    res.json({
      specialty: {
        id: specialty._id,
        name: specialty.name,
        slug: specialty.slug,
      },
      count: doctors.length,
      doctors,
    });
  } catch (err) {
    console.error("❌ getDoctorsBySpecialtySlug:", err);
    res.status(500).json({
      error: "Failed to fetch doctors by specialty slug",
    });
  }
};

// ---------------------------------------------
// ADD DOCTOR
// ---------------------------------------------
exports.createDoctor = async (req, res) => {
  try {
    const {
      name,
      qualification,
      experience,
      bio,
      language,
      specialty,
      conditionsTreated,
      visitTypes,
      opdDates,
    } = req.body;

    let photoUrl = null;

    // 🔥 CLOUDINARY UPLOAD ADDED
    if (req.file) {
      try {
        const result = await uploadToCloudinary(
          req.file.buffer,
          "doctors"
        );
        photoUrl = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({
          error: "Image upload failed",
        });
      }
    }

    const doctor = new Doctor({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      qualification,
      experience,
      bio,
      photo: photoUrl,
      language: language ? JSON.parse(language) : [],
      specialty,
      conditionsTreated: conditionsTreated
        ? JSON.parse(conditionsTreated)
        : [],
      visitTypes: visitTypes ? JSON.parse(visitTypes) : [],
      opdDates: opdDates ? JSON.parse(opdDates) : [],
    });

    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    console.error("❌ createDoctor:", err);
    res.status(500).json({ error: "Failed to add doctor" });
  }
};

// ---------------------------------------------
// GET ALL DOCTORS (Public + Admin)
// ---------------------------------------------
exports.getAllDoctors = async (req, res) => {
  try {
    const { visitType } = req.query;

    let doctors = await Doctor.find()
      .populate("specialty", "name active")
      .populate("conditionsTreated", "name")
      .select(
        "name slug qualification experience bio photo language specialty conditionsTreated visitTypes opdDates"
      );

    doctors = doctors
      .map(cleanOpdDates)
      .filter((d) => d.specialty?.active);

    if (visitType) {
      doctors = doctors.filter((d) =>
        d.visitTypes.includes(visitType)
      );
    }

    res.json(doctors);
  } catch (err) {
    console.error("❌ getAllDoctors:", err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

// ---------------------------------------------
// GET DOCTORS BY SPECIALTY
// ---------------------------------------------
exports.getDoctorsBySpecialty = async (req, res) => {
  try {
    let doctors = await Doctor.find({ specialty: req.params.id })
      .populate("specialty", "name active")
      .populate("conditionsTreated", "name")
      .select(
        "name slug qualification experience bio photo language specialty conditionsTreated visitTypes opdDates"
      );

    doctors = doctors
      .map(cleanOpdDates)
      .filter((d) => d.specialty?.active);

    res.json(doctors);
  } catch (err) {
    console.error("❌ getDoctorsBySpecialty:", err);
    res.status(500).json({ error: "Failed to fetch doctors by specialty" });
  }
};

// ---------------------------------------------
// GET SINGLE DOCTOR
// ---------------------------------------------
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("specialty", "name active")
      .populate("conditionsTreated", "name")
      .select(
        "name slug qualification experience bio photo language specialty conditionsTreated visitTypes opdDates"
      );

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(cleanOpdDates(doctor));
  } catch (err) {
    console.error("❌ getDoctorById:", err);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
};

// ---------------------------------------------
// UPDATE DOCTOR
// ---------------------------------------------
exports.updateDoctor = async (req, res) => {
  try {
    const update = { ...req.body };

    if (update.name) {
      update.slug = slugify(update.name, { lower: true, strict: true });
    }

    // 🔥 CLOUDINARY UPDATE
    if (req.file) {
      try {
        const result = await uploadToCloudinary(
          req.file.buffer,
          "doctors"
        );
        update.photo = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({
          error: "Image upload failed",
        });
      }
    }

    if (update.language) update.language = JSON.parse(update.language);
    if (update.conditionsTreated)
      update.conditionsTreated = JSON.parse(update.conditionsTreated);
    if (update.visitTypes) update.visitTypes = JSON.parse(update.visitTypes);
    if (update.opdDates) update.opdDates = JSON.parse(update.opdDates);

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    )
      .populate("specialty", "name")
      .populate("conditionsTreated", "name");

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("❌ updateDoctor:", err);
    res.status(500).json({ error: "Failed to update doctor" });
  }
};

// ---------------------------------------------
// DELETE DOCTOR
// ---------------------------------------------
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("❌ deleteDoctor:", err);
    res.status(500).json({ error: "Failed to delete doctor" });
  }
};

// ---------------------------------------------
// OPD DATE MANAGEMENT
// ---------------------------------------------
exports.updateOpdDates = async (req, res) => {
  try {
    const { opdDates = [], mode = "replace" } = req.body;
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    if (mode === "add") {
      opdDates.forEach((d) => {
        if (!doctor.opdDates.includes(d)) doctor.opdDates.push(d);
      });
    } else if (mode === "remove") {
      doctor.opdDates = doctor.opdDates.filter(
        (d) => !opdDates.includes(d)
      );
    } else {
      doctor.opdDates = opdDates;
    }

    doctor.opdDates = doctor.opdDates.filter(
      (d) => new Date(d) >= new Date()
    );

    await doctor.save();
    res.json(doctor);
  } catch (err) {
    console.error("❌ updateOpdDates:", err);
    res.status(500).json({ error: "Failed to update OPD dates" });
  }
};