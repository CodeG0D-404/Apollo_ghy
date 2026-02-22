// =============================================
// 📁 controller/patient.controller.js
// Production Ready | Schema aligned
// Phones/Emails are source of truth
// Legacy mobile/email derived automatically
// =============================================

const Patient = require("../models/Patient");
const Booking = require("../models/Booking");
const { updatePatientSchema } = require("../validators/patient.validator");

// =====================================================
// 🔧 Helper: Normalize Indian phone
// =====================================================
const normalizePhone = (phone) => {
  if (!phone) return null;
  return phone.startsWith("+91") ? phone : `+91${phone}`;
};

// =====================================================
// 🔧 Helper: Audit trail
// =====================================================
const addAuditLog = (patient, action, meta = {}, user = "admin") => {
  if (!patient.auditTrail) patient.auditTrail = [];

  patient.auditTrail.push({
    action,
    performedBy: user,
    meta,
    date: new Date(),
  });
};

// =====================================================
// 🔹 GET: All patients (ADMIN)
// =====================================================
exports.getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, city, zip, archived } = req.query;

// toggle active vs archived
const filter = archived === "true"
  ? { active: false }
  : { active: true };


    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");

      filter.$or = [
        { patientId: regex },
        { shortId: regex },
        { name: regex },
        { "phones.number": regex },
        { "emails.email": regex },
      ];

      if (search.toLowerCase() === "duplicate") {
        filter.duplicateOf = true;
      }
    }

    if (city) filter.city = { $regex: city, $options: "i" };
    if (zip) filter.zip = zip;

    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Patient.countDocuments(filter),
    ]);

    res.json({
      patients,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ getPatients:", err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

// =====================================================
// 🔹 GET: Single patient
// =====================================================
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      active: true,
    });

    if (!patient) return res.status(404).json({ error: "Patient not found" });

    res.json(patient);
  } catch (err) {
    console.error("❌ getPatientById:", err);
    res.status(500).json({ error: "Failed to fetch patient" });
  }
};

// =====================================================
// 🔹 GET: Patient + Bookings (ADMIN)
// Doctor + Specialty populated
// =====================================================
exports.getPatientDetails = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      active: true,
    })
      .populate({
        path: "doctorConnections.doctorId",
        select: "name specialty",
        populate: {
          path: "specialty",
          select: "name",
        },
      });


    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const bookings = await Booking.find({ patientId: patient._id })
      .sort({ createdAt: -1 })
        .populate({
          path: "doctorId",
          select: "name specialty",
          populate: {
            path: "specialty",
            select: "name",
          },
        });


    res.json({ patient, bookings });
  } catch (err) {
    console.error("❌ getPatientDetails:", err);
    res.status(500).json({ error: "Failed to fetch patient details" });
  }
};


// =====================================================
// 🔹 CREATE PATIENT (ADMIN only path)
// Booking flow uses service
// =====================================================
exports.createPatient = async (req, res) => {
  try {
    const {
      name,
      mobile,
      whatsapp,
      email,
      address,
      city,
      localArea,
      zip,
      symptoms,
      age,
      gender,
    } = req.body;

    const normalizedMobile = normalizePhone(mobile);
    const normalizedWhatsapp = normalizePhone(whatsapp || mobile);

    // Duplicate check aligned with schema
    const existing = await Patient.findOne({
      "phones.number": normalizedMobile,
    });

    if (existing) {
      return res.status(409).json({
        error: "Patient already exists with this phone",
        existingPatient: existing,
      });
    }

    const phones = [];

    if (normalizedMobile) {
      phones.push({
        number: normalizedMobile,
        label: "Primary",
        isPrimary: true,
      });
    }

    if (normalizedWhatsapp && normalizedWhatsapp !== normalizedMobile) {
      phones.push({
        number: normalizedWhatsapp,
        label: "WhatsApp",
        isWhatsApp: true,
      });
    }

    const emails = email
      ? [{ email: email.toLowerCase().trim(), label: "Primary" }]
      : [];

    const patient = new Patient({
      name,
      age,
      gender,
      symptoms,
      address,
      city,
      zip,
      localArea,
      phones,
      emails,
    });

    addAuditLog(patient, "PATIENT_CREATED", { phones, emails });

    await patient.save();

    res.status(201).json(patient);
  } catch (err) {
    console.error("❌ createPatient:", err);
    res.status(500).json({ error: "Failed to create patient" });
  }
};

// =====================================================
// 🔹 SOFT DELETE
// =====================================================
exports.softDeletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        active: false,
        $push: {
          auditTrail: {
            action: "PATIENT_ARCHIVED",
            performedBy: "admin",
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient archived successfully" });
  } catch (err) {
    console.error("❌ softDeletePatient:", err);
    res.status(500).json({ error: "Failed to archive patient" });
  }
};

// =====================================================
// 🔹 UPDATE PATIENT (SELECTIVE PATCH — FINAL)
// =====================================================
exports.updatePatient = async (req, res) => {
  try {
    const { error, value } = updatePatientSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        error: error.details.map((d) => d.message),
      });
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // ---------------------------------------------
    // Build selective update payload
    // ---------------------------------------------
    const updateData = {};

    Object.keys(value).forEach((key) => {
      if (value[key] !== undefined && value[key] !== null) {
        updateData[key] = value[key];
      }
    });

    // =================================================
    // 📱 MOBILE → phones[].isPrimary
    // =================================================
    if (updateData.mobile) {
      const normalized = normalizePhone(updateData.mobile);

      patient.phones = patient.phones.map((p) => ({
        ...p.toObject(),
        isPrimary: p.number === normalized,
      }));

      const exists = patient.phones.some((p) => p.number === normalized);

      if (!exists) {
        patient.phones.push({
          number: normalized,
          label: "Primary",
          isPrimary: true,
        });
      }

      delete updateData.mobile;
    }

    // =================================================
    // 🟢 WHATSAPP → phones[].isWhatsApp
    // =================================================
    if (updateData.whatsapp) {
      const normalized = normalizePhone(updateData.whatsapp);

      patient.phones = patient.phones.map((p) => ({
        ...p.toObject(),
        isWhatsApp: p.number === normalized,
      }));

      const exists = patient.phones.some((p) => p.number === normalized);

      if (!exists) {
        patient.phones.push({
          number: normalized,
          label: "WhatsApp",
          isWhatsApp: true,
        });
      }

      delete updateData.whatsapp;
    }

    // =================================================
    // 👨‍⚕️ ADMIN DOCTOR ASSIGNMENT
    // Adds doctorConnections entry if missing
    // visitCount starts from 0
    // =================================================
    if (updateData.doctorId) {
      const exists = patient.doctorConnections?.some(
        (d) => d.doctorId?.toString() === updateData.doctorId
      );

      if (!exists) {
        patient.doctorConnections.push({
          doctorId: updateData.doctorId,
          specialtyId: updateData.specialtyId || null,
          visitCount: 0,
          firstVisit: null,
          lastVisit: null,
        });
      }

      delete updateData.doctorId;
      delete updateData.specialtyId;
    }

    // =================================================
    // APPLY OTHER SAFE FIELDS
    // =================================================
    Object.assign(patient, updateData);

    // =================================================
    // AUDIT TRAIL
    // =================================================
    addAuditLog(patient, "PATIENT_UPDATED", updateData);

    await patient.save();

    res.json({
      message: "Patient updated successfully",
      patient,
    });

  } catch (err) {
    console.error("❌ updatePatient:", err);
    res.status(500).json({ error: "Failed to update patient" });
  }
};



// =====================================================
// 🔹 PHONE MANAGEMENT
// =====================================================
exports.addPatientPhone = async (req, res) => {
  try {
    const { number, label } = req.body;
    if (!number) return res.status(400).json({ error: "Phone number required" });

    const normalized = normalizePhone(number);
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const exists = patient.phones.some((p) => p.number === normalized);
    if (exists) return res.status(400).json({ error: "Phone already exists" });

    patient.phones.push({
      number: normalized,
      label: label || "Secondary",
    });

    addAuditLog(patient, "PHONE_ADDED", { number: normalized });

    await patient.save();

    res.json({ message: "Phone added", phones: patient.phones });
  } catch (err) {
    console.error("❌ addPatientPhone:", err);
    res.status(500).json({ error: "Failed to add phone" });
  }
};

exports.removePatientPhone = async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) return res.status(400).json({ error: "Phone required" });

    const normalized = normalizePhone(number);
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    patient.phones = patient.phones.filter((p) => p.number !== normalized);

    addAuditLog(patient, "PHONE_REMOVED", { number: normalized });

    await patient.save();

    res.json({ message: "Phone removed", phones: patient.phones });
  } catch (err) {
    console.error("❌ removePatientPhone:", err);
    res.status(500).json({ error: "Failed to remove phone" });
  }
};

exports.setPrimaryPhone = async (req, res) => {
  try {
    const { number } = req.body;
    const normalized = normalizePhone(number);

    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    patient.phones = patient.phones.map((p) => ({
      ...p.toObject(),
      isPrimary: p.number === normalized,
    }));

    addAuditLog(patient, "PRIMARY_PHONE_CHANGED", { number: normalized });

    await patient.save();

    res.json({ message: "Primary phone updated", phones: patient.phones });
  } catch (err) {
    console.error("❌ setPrimaryPhone:", err);
    res.status(500).json({ error: "Failed to update primary phone" });
  }
};


// =====================================================
// 🔹 EMAIL MANAGEMENT
// =====================================================
exports.addPatientEmail = async (req, res) => {
  try {
    const { email, label } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const normalized = email.toLowerCase().trim();
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const exists = patient.emails.some((e) => e.email === normalized);
    if (exists) return res.status(400).json({ error: "Email exists" });

    patient.emails.push({
      email: normalized,
      label: label || "Secondary",
    });

    addAuditLog(patient, "EMAIL_ADDED", { email: normalized });

    await patient.save();

    res.json({ message: "Email added", emails: patient.emails });
  } catch (err) {
    console.error("❌ addPatientEmail:", err);
    res.status(500).json({ error: "Failed to add email" });
  }
};

exports.removePatientEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const normalized = email.toLowerCase().trim();
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    patient.emails = patient.emails.filter((e) => e.email !== normalized);

    addAuditLog(patient, "EMAIL_REMOVED", { email: normalized });

    await patient.save();

    res.json({ message: "Email removed", emails: patient.emails });
  } catch (err) {
    console.error("❌ removePatientEmail:", err);
    res.status(500).json({ error: "Failed to remove email" });
  }
};

exports.setPrimaryEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const normalized = email.toLowerCase().trim();
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    patient.emails = patient.emails.map((e) => ({
      ...e.toObject(),
      label: e.email === normalized ? "Primary" : "Secondary",
    }));

    addAuditLog(patient, "PRIMARY_EMAIL_CHANGED", { email: normalized });

    await patient.save();

    res.json({ message: "Primary email updated", emails: patient.emails });
  } catch (err) {
    console.error("❌ setPrimaryEmail:", err);
    res.status(500).json({ error: "Failed to update primary email" });
  }
};
