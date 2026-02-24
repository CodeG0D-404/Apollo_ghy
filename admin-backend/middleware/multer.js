// =============================================
// 📁 middleware/upload.js
// Cloudinary-ready Multer
// =============================================

const multer = require("multer");

// use memory, NOT disk
const storage = multer.memoryStorage();

// file filter (images only)
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files allowed"), false);
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