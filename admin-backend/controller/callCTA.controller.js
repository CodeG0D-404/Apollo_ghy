// =============================================
// 📁 controller/callCTA.controller.js
// Global Call CTA Controller
// Production safe
// =============================================

const CallCTA = require("../models/callCTA");


// PUBLIC — get phone number for website CTA
exports.getPhoneNumber = async (req, res) => {
  try {
    let record = await CallCTA.findOne().lean();

    // If not present, do NOT create empty phone in DB
    if (!record) {
      return res.status(200).json({
        success: true,
        phoneNumber: ""
      });
    }

    return res.status(200).json({
      success: true,
      phoneNumber: record.phoneNumber || ""
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact information"
    });
  }
};


// ADMIN — update phone
exports.updatePhoneNumber = async (req, res) => {
  try {
    let { phoneNumber } = req.body;

    // sanitize
    if (typeof phoneNumber !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number"
      });
    }

    phoneNumber = phoneNumber.trim();

    // empty check
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number cannot be empty"
      });
    }

    // format validation: 91 + 10 digits
    if (!/^[0-9]{12}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone format"
      });
    }

    // ensure single record pattern
    let record = await CallCTA.getSingleton();

    if (!record) {
      record = new CallCTA({ phoneNumber });
    } else {
      record.phoneNumber = phoneNumber;
    }

    await record.save();

    return res.status(200).json({
      success: true,
      message: "Phone updated successfully"
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};
