// =============================================
// 📁 services/cloudinaryUpload.js
// Production Optimized Media Upload
// =============================================

const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer, folder = "general") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,

        // 🔥 AUTO FORMAT → converts JPG/PNG to WebP automatically
        format: "webp",

        // 🔥 SMART COMPRESSION
        quality: "auto:good",

        // 🔥 AUTO OPTIMIZATION
        fetch_format: "auto",

        // 🔥 LIMIT IMAGE SIZE (prevents huge uploads)
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit"
          }
        ]
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

module.exports = uploadToCloudinary;