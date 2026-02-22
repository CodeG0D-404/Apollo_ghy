// ==================================================
// 📁 controllers/hospitalRequest.controller.js
// Lead-first Hospital Request Controller
// Inquiry-style intake + HMS conversion lifecycle
// ==================================================

const HospitalRequest = require("../models/HospitalRequest");
const Patient = require("../models/Patient");


// ==================================================
// 🔹 Utility: Normalize phone (same as Inquiry)
// ==================================================
const normalizePhone = (phone = "") => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return null;
};


// ==================================================
// 🔹 CREATE HOSPITAL REQUEST (PUBLIC)
// ROUTE: POST /api/hospital-requests
// Inquiry-style intake
// ==================================================
exports.createHospitalRequest = async (req, res) => {
  try {
    const {
      name,
      gender,
      age,
      mobile,
      whatsapp,
      email,
      city,
      message,
    } = req.body;

    // basic validation
    if (!name || !gender || !age || !mobile) {
      return res.status(400).json({
        error: "Name, gender, age and mobile are required",
      });
    }

    const normalizedMobile = normalizePhone(mobile);

    if (!normalizedMobile) {
      return res.status(400).json({
        error: "Invalid mobile number",
      });
    }

    // ==================================================
    // 🔹 Soft existing-patient check (badge only)
    // ==================================================
    const existingPatient = await Patient.findOne({
      "phones.number": normalizedMobile,
    })
      .select("_id")
      .lean();

    const request = new HospitalRequest({
      name,
      gender,
      age,
      mobile: normalizedMobile,
      whatsapp,
      email,
      city,
      message,

      isExistingPatient: !!existingPatient,
      existingPatientRef: existingPatient?._id || null,
    });

    await request.save();

    res.status(201).json({
      message: "Hospital request submitted successfully",
      request,
    });

  } catch (error) {
    console.error("❌ Hospital request creation error:", error);
    res.status(500).json({
      error: "Failed to submit hospital request",
    });
  }
};


// ==================================================
// 🔹 GET HOSPITAL REQUESTS (ADMIN)
// ROUTE: GET /api/hospital-requests
// Pagination + search + archive
// ==================================================
exports.getHospitalRequests = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const skip = (page - 1) * limit;

    const { status, search, archived } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (archived !== undefined) {
      filter.archived = archived === "true";
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { shortId: regex },
        { name: regex },
        { mobile: regex },
        { email: regex },
      ];
    }

    const totalRecords = await HospitalRequest.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);

    const requests = await HospitalRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("patientId", "name phones email")
      .populate("existingPatientRef", "name phones")
      .populate("assignedCoordinator", "name email");

    res.json({
      requests,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
      },
    });

  } catch (error) {
    console.error("❌ Fetch hospital requests error:", error);
    res.status(500).json({ error: "Failed to fetch hospital requests" });
  }
};


// ==================================================
// 🔹 GET SINGLE REQUEST (ADMIN)
// ROUTE: GET /api/hospital-requests/:id
// ==================================================
exports.getHospitalRequestById = async (req, res) => {
  try {
    const request = await HospitalRequest.findById(req.params.id)
      .populate("patientId", "name phones email")
      .populate("existingPatientRef", "name phones")
      .populate("assignedCoordinator", "name email");

    if (!request) {
      return res.status(404).json({ error: "Hospital request not found" });
    }

    res.json(request);

  } catch (error) {
    console.error("❌ Get hospital request error:", error);
    res.status(500).json({ error: "Failed to fetch hospital request" });
  }
};


// ==================================================
// 🔹 UPDATE HOSPITAL REQUEST (ADMIN)
// ROUTE: PATCH /api/hospital-requests/:id
// Lifecycle + conversion + archive
// ==================================================
exports.updateHospitalRequest = async (req, res) => {
  try {
    const {
      status,
      assignedCoordinator,
      convertedBookingId,
      code,
      doctorName,
      visitDate,
      archived,
    } = req.body;

    const request = await HospitalRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Hospital request not found" });
    }

    const previousStatus = request.status;

    // lifecycle updates
    if (status) request.status = status;

    if (assignedCoordinator !== undefined) {
      request.assignedCoordinator = assignedCoordinator;
    }

    if (code !== undefined) request.code = code;
    if (doctorName !== undefined) request.doctorName = doctorName;
    if (visitDate !== undefined) request.visitDate = visitDate;

    // ==================================================
    // 🔹 Conversion → create/find patient ONLY here
    // ==================================================
    if (status === "Converted" && !request.patientId) {
      const { findOrCreatePatient } = require("../services/patientService");

      const { patient } = await findOrCreatePatient({
        name: request.name,
        mobile: request.mobile,
        whatsapp: request.whatsapp,
        email: request.email,
        city: request.city,
        age: request.age,
        gender: request.gender,
        reason: request.message,
      });

      request.patientId = patient._id;
    }

    // booking attach
    if (convertedBookingId) {
      request.convertedBookingId = convertedBookingId;
    }

    // archive / restore
    if (archived !== undefined) {
      request.archived = archived;
      request.archivedAt = archived ? new Date() : null;
    }

    await request.save();

    // ==================================================
    // 🔹 WhatsApp trigger on lifecycle change
    // ==================================================
    const statusChanged = previousStatus !== request.status;

    if (statusChanged && archived === undefined) {
      try {
        const { notifyPatient } = require("../services/patientNotificationService");

        await notifyPatient({
          type: "HOSPITAL_REQUEST",
          mobile: request.mobile,
          name: request.name,
        });

      } catch (err) {
        console.error("Hospital request WhatsApp failed:", err);
      }
    }

    res.json({
      message: "Hospital request updated successfully",
      request,
    });

  } catch (error) {
    console.error("❌ Update hospital request error:", error);
    res.status(500).json({ error: "Failed to update hospital request" });
  }
};