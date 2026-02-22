// ==========================================
// 📁 Specialty.js - Mongoose Model
// ==========================================

const mongoose = require("mongoose");

// ==========================================
// 🏗️ Define Specialty Schema
// ==========================================
const specialtySchema = new mongoose.Schema(
  {
    // ===============================
    // 👇 Specialty Name
    // - Required field
    // - Must be unique (no duplicate specialties)
    // - Trim removes extra spaces
    // ===============================
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ===============================
    // 👇 Slug (for URL-friendly identifier)
    // - Example: "Cardiology" → "cardiology"
    // - Optional but unique
    // - Useful for searching or routing
    // - Auto-generated before save/update
    // ===============================
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },

    // ===============================
    // 👇 Active status
    // - Boolean value
    // - Default is true (means visible/usable)
    // - If set to false → hidden in dropdowns, filters, etc.
    // ===============================
    active: {
      type: Boolean,
      default: true,
    },
  },

  // ==========================================
  // ⚙️ Schema Options
  // - timestamps: true → Automatically adds
  //   createdAt and updatedAt fields
  // ==========================================
  { timestamps: true }
);

// ==========================================
// 🔄 Middleware: Auto-generate slug
// - Runs before saving (create + update)
// - Converts name → slug
// - Example: "Heart Surgery" → "heart-surgery"
// ==========================================
specialtySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-") // replace spaces & special chars
  .replace(/(^-|-$)+/g, "");   // trim - from start/end
  }
  next();
});

// ==========================================
// 🏗️ Create and Export Model
// ==========================================
const Specialty = mongoose.model("Specialty", specialtySchema);

module.exports = Specialty;
