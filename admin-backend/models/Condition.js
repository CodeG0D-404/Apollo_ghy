// =============================================
// 📁 models/Condition.js
// Purpose: Condition Schema & Model
// Used for: Doctor condition tagging (labels)
// =============================================

const mongoose = require("mongoose");

// ============================
// START: Condition Schema
// ============================

const conditionSchema = new mongoose.Schema(
  {
    // 🔹 Condition name
    // - Human-readable label (e.g. "Diabetes")
    // - Must be unique (no duplicates)
    // - trim removes extra spaces
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 🔹 Active flag (soft delete / visibility control)
    // - true  → condition is usable & visible
    // - false → condition is hidden but NOT deleted
    // - prevents breaking doctor references
    active: {
      type: Boolean,
      default: true,
      index: true, // improves filtering performance
    },
  },

  // ============================
  // Schema Options
  // - timestamps adds:
  //   createdAt, updatedAt automatically
  // ============================
  { timestamps: true }
);

// ============================
// END: Condition Schema
// ============================

// ============================
// START: Condition Model Export
// ============================

const Condition = mongoose.model("Condition", conditionSchema);
module.exports = Condition;

// ============================
// END: Condition Model Export
// ============================
