// =============================================
// 📁 controller/inquiry.controller.js
// Inquiry Lead Controller
// Production grade & secure
// =============================================

const Inquiry = require("../models/inquiry");
const Patient = require("../models/Patient"); // confirm name if different



// ---------------------------------------------
// Utility: sanitize string
// ---------------------------------------------
const sanitizeText = (text = "") => {
  return text.replace(/[<>]/g, "").trim();
};


// ---------------------------------------------
// Utility: normalize phone
// accepts 10 digit -> converts to 91XXXXXXXXXX
// ---------------------------------------------
const normalizePhone = (phone = "") => {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;

  return null;
};


// =============================================
// CREATE INQUIRY
// PUBLIC
// =============================================
exports.createInquiry = async (req, res) => {
  try {
    const {
      name,
      phone,
      company_name, // honeypot
      page,
      section
    } = req.body;

    // honeypot trap
    if (company_name) {
      return res.status(200).json({ success: true });
    }

    // validation
    if (!name || !phone || !page || !section) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const sanitizedName = sanitizeText(name);
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number"
      });
    }

    // match patient
    const existingPatient = await Patient.findOne({
      "phones.number": normalizedPhone
    }).select("_id").lean();

    const inquiry = new Inquiry({
      name: sanitizedName,
      phone: normalizedPhone,

      isExistingPatient: !!existingPatient,
      patientRef: existingPatient?._id || null,

      source: {
        page,
        section
      }
    });

    await inquiry.save();

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted"
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to submit inquiry"
    });
  }
};



// =============================================
// GET INQUIRIES (ADMIN)
// Pagination + Search + Date filter
// =============================================
exports.getInquiries = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 25,
      phone,
      date
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // phone search
    if (phone) {
      const normalized = normalizePhone(phone);
      if (normalized) query.phone = normalized;
    }

    // date filter
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: start, $lte: end };
    }

    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("patientRef", "name phone")
      .lean();

    const total = await Inquiry.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch inquiries"
    });
  }
};



// =============================================
// REVIEW UPDATE
// =============================================
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const sanitizedNotes = sanitizeText(notes || "");

    await Inquiry.findByIdAndUpdate(id, {
      "review.status": true,
      "review.notes": sanitizedNotes
    });

    return res.status(200).json({
      success: true,
      message: "Review updated"
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Review update failed"
    });
  }
};



// =============================================
// FOLLOWUP UPDATE
// =============================================
exports.updateFollowup = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, remarks } = req.body;

    await Inquiry.findByIdAndUpdate(id, {
      "followup.status": true,
      "followup.date": date,
      "followup.remarks": sanitizeText(remarks || "")
    });

    return res.status(200).json({
      success: true,
      message: "Follow-up updated"
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Follow-up update failed"
    });
  }
};
