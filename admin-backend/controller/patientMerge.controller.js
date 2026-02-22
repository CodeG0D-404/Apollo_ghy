// =============================================
// 📁 controller/patientMerge.controller.js
// =============================================

const { mergePatients } = require("../services/patientMerge.service");

exports.mergePatientAccounts = async (req, res) => {
  try {
    const { primaryPatientId, secondaryPatientId } = req.body;

    if (!primaryPatientId || !secondaryPatientId) {
      return res.status(400).json({
        error: "Primary and secondary patient IDs required",
      });
    }

    const result = await mergePatients({
      primaryId: primaryPatientId,
      secondaryId: secondaryPatientId,
      adminId: req.user?.id || "admin",
    });

    res.json({
      message: "Patients merged successfully",
      primary: result.primary,
      secondaryArchived: result.secondary.patientId,
    });
  } catch (err) {
    console.error("❌ mergePatientAccounts:", err);
    res.status(500).json({
      error: err.message || "Merge failed",
    });
  }
};
