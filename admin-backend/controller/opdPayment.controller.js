// =============================================
// 📁 controller/opdPayment.controller.js
// OPD Payment Record Controller (Admin Only)
// =============================================

const OpdPaymentRecord = require("../models/OpdPaymentRecord");

// ---------------------------------------------
// GET payment record by bookingId (ADMIN)
// Always returns a usable object (no 404)
// ---------------------------------------------
exports.getPaymentByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const record = await OpdPaymentRecord.findOne({ bookingId });

    // 🟢 Graceful fallback for old OPD bookings
    if (!record) {
      return res.json({
        bookingId,
        visitType: "OPD",
        paymentStatus: "NO_ADVANCE",
        totalAmount: null,
        paidAmount: 0,
        dueAmount: null,
      });
    }

    res.json(record);
  } catch (err) {
    console.error("❌ getPaymentByBookingId:", err);
    res.status(500).json({
      error: "Failed to fetch payment record",
    });
  }
};

// ---------------------------------------------
// UPDATE payment record (ADMIN)
// UPSERT + explicit business logic
// ---------------------------------------------
exports.updatePaymentRecord = async (req, res) => {
  try {
    const { bookingId } = req.params;
    let { totalAmount, paidAmount } = req.body;

    // -----------------------------
    // 🔒 Validation
    // -----------------------------
    if (totalAmount !== undefined && totalAmount < 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    if (paidAmount !== undefined && paidAmount < 0) {
      return res.status(400).json({ error: "Invalid paid amount" });
    }

    // Normalize values
    totalAmount =
      totalAmount !== undefined ? Number(totalAmount) : null;
    paidAmount =
      paidAmount !== undefined ? Number(paidAmount) : 0;

    // -----------------------------
    // 🧠 Business logic (KEY FIX)
    // -----------------------------
    let paymentStatus = "NO_ADVANCE";
    let dueAmount = null;

    if (totalAmount !== null) {
      dueAmount = Math.max(totalAmount - paidAmount, 0);

      if (paidAmount === 0) {
        paymentStatus = "NO_ADVANCE";
      } else if (paidAmount < totalAmount) {
        paymentStatus = "ADVANCE";
      } else {
        paymentStatus = "FULL_PAYMENT";
        dueAmount = 0;
      }
    }

    // -----------------------------
    // 🚀 UPSERT (create or update)
    // -----------------------------
    const record = await OpdPaymentRecord.findOneAndUpdate(
      { bookingId },
      {
        bookingId,
        visitType: "OPD",
        totalAmount,
        paidAmount,
        dueAmount,
        paymentStatus,
        ...(req.user?.id && { updatedBy: req.user.id }),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      message: "Payment record saved successfully",
      record,
    });
  } catch (err) {
    console.error("❌ updatePaymentRecord:", err);
    res.status(500).json({
      error: "Failed to save payment record",
    });
  }
};
