const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folders exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads/others";

    // Route-based folder selection
    if (req.baseUrl.includes("blogs")) {
      uploadPath = "uploads/blogs";
    } else if (req.baseUrl.includes("doctors")) {
      uploadPath = "uploads/doctors";
    } else if (req.baseUrl.includes("testimonials")) {
      uploadPath = "uploads/testimonials";
    }

    ensureDir(uploadPath);
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.originalname
      .replace(ext, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");

    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
