// =============================================
// 📁 controller/specialty.controller.js
// Purpose: Business logic for Specialties
// =============================================

const Specialty = require("../models/Specialty");

// ============================
// PUBLIC
// ============================

/**
 * GET /api/specialties
 * Public
 * Returns only active specialties
 */
exports.getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find({ active: true })
      .sort({ name: 1 });

    res.json(specialties);
  } catch (error) {
    console.error("Error fetching specialties:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// PROTECTED
// ============================

/**
 * POST /api/specialties
 * Create new specialty
 */
exports.createSpecialty = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      return res.status(400).json({ message: "Specialty name is required" });
    }

    const existing = await Specialty.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existing) {
      return res.status(400).json({ message: "Specialty already exists" });
    }

    const specialty = await Specialty.create({ name });
    res.status(201).json(specialty);
  } catch (error) {
    console.error("Error creating specialty:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/specialties/:id
 * Update specialty name
 */
exports.updateSpecialty = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      return res.status(400).json({ message: "Specialty name is required" });
    }

    const specialty = await Specialty.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!specialty) {
      return res.status(404).json({ message: "Specialty not found" });
    }

    res.json(specialty);
  } catch (error) {
    console.error("Error updating specialty:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/specialties/:id
 * Soft delete (active = false)
 */
exports.deleteSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!specialty) {
      return res.status(404).json({ message: "Specialty not found" });
    }

    res.json({ message: "Specialty disabled successfully" });
  } catch (error) {
    console.error("Error disabling specialty:", error);
    res.status(500).json({ message: "Server error" });
  }
};
