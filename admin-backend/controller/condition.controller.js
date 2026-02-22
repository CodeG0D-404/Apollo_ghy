// =============================================
// 📁 controller/condition.controller.js
// Purpose: Business logic for Conditions
// =============================================

const Condition = require("../models/Condition");

// ============================
// START: Public Controllers
// ============================

/**
 * GET /api/conditions
 * Public
 * Returns all active conditions (alphabetically sorted)
 */
exports.getAllConditions = async (req, res) => {
  try {
    const conditions = await Condition.find({ active: true })
      .sort({ name: 1 });

    res.json(conditions);
  } catch (error) {
    console.error("Error fetching conditions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// END: Public Controllers
// ============================


// ============================
// START: Protected Controllers
// ============================

/**
 * POST /api/conditions
 * Protected
 * Create a new condition (case-insensitive duplicate safe)
 */
exports.createCondition = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      return res.status(400).json({ message: "Condition name is required" });
    }

    const existing = await Condition.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (existing) {
      return res.status(400).json({ message: "Condition already exists" });
    }

    const condition = await Condition.create({ name });
    res.status(201).json(condition);
  } catch (error) {
    console.error("Error creating condition:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/conditions/:id
 * Protected
 * Update condition name
 */
exports.updateCondition = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      return res.status(400).json({ message: "Condition name is required" });
    }

    const condition = await Condition.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!condition) {
      return res.status(404).json({ message: "Condition not found" });
    }

    res.json(condition);
  } catch (error) {
    console.error("Error updating condition:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/conditions/:id/hide
 * Protected
 * Soft delete (disable condition)
 */
exports.hideCondition = async (req, res) => {
  try {
    const condition = await Condition.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!condition) {
      return res.status(404).json({ message: "Condition not found" });
    }

    res.json(condition);
  } catch (error) {
    console.error("Error hiding condition:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/conditions/:id
 * Protected
 * Converted to soft delete for safety
 */
exports.deleteCondition = async (req, res) => {
  try {
    const condition = await Condition.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!condition) {
      return res.status(404).json({ message: "Condition not found" });
    }

    res.json({ message: "Condition disabled successfully" });
  } catch (error) {
    console.error("Error disabling condition:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// END: Protected Controllers
// ============================
