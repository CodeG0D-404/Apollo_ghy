const Testimonial = require("../models/Testimonial");
const uploadToCloudinary = require("../services/cloudinaryUpload"); // 🔥 added

/**
 * =========================
 * ADMIN CONTROLLERS
 * =========================
 */

// ➕ Create Testimonial (Admin)
exports.createTestimonial = async (req, res) => {
  try {
    const data = { ...req.body };

    // 🔥 Cloudinary image upload
    if (req.file) {
      try {
        const result = await uploadToCloudinary(
          req.file.buffer,
          "testimonials"
        );
        data.patientImage = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const testimonial = await Testimonial.create(data);
    res.status(201).json(testimonial);
  } catch (error) {
    console.error("Create testimonial error:", error);
    res.status(500).json({ message: "Failed to create testimonial" });
  }
};


// 📄 Get All Testimonials (Admin: hidden + published)
exports.getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    res.json(testimonials);
  } catch (error) {
    console.error("Fetch admin testimonials error:", error);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};


// ==============================
// GET SINGLE TESTIMONIAL (Admin)
// ==============================
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json(testimonial);
  } catch (error) {
    console.error("Fetch testimonial by id error:", error);
    res.status(500).json({ message: "Failed to fetch testimonial" });
  }
};


// ✏️ Update Testimonial (Admin)
exports.updateTestimonial = async (req, res) => {
  try {
    const data = { ...req.body };

    // 🔥 Replace image if new one uploaded (Cloudinary)
    if (req.file) {
      try {
        const result = await uploadToCloudinary(
          req.file.buffer,
          "testimonials"
        );
        data.patientImage = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json(testimonial);
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({ message: "Failed to update testimonial" });
  }
};


// 🔁 Publish / Unpublish Testimonial
exports.updateTestimonialStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["hidden", "published"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json(testimonial);
  } catch (error) {
    console.error("Update testimonial status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};


// 🗑️ Soft Delete Testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({ message: "Failed to delete testimonial" });
  }
};


/**
 * =========================
 * PUBLIC CONTROLLER
 * =========================
 */

// 🌐 Get Published Testimonials (Public Website)
exports.getPublishedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      status: "published",
      isDeleted: false
    }).sort({ displayOrder: 1, createdAt: -1 });

    res.json(testimonials);
  } catch (error) {
    console.error("Fetch public testimonials error:", error);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};