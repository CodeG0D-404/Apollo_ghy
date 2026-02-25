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


        // 🔥 SMART COMPRESSION
        quality: "auto:good",

        // 🔥 AUTO OPTIMIZATION
        fetch_format: "auto",


      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

module.exports = uploadToCloudinary;