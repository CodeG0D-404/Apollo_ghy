const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    slug: {
      type: String,
      unique: true,
      index: true,
      required: true
    },

    content: { type: String, required: true }, // HTML
    excerpt: { type: String },

    coverImage: { type: String, required: true },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published"
    }
  },
  {
    timestamps: true // 👈 replaces createdAt & updatedAt safely
  }
);

module.exports = mongoose.model("Blog", blogSchema);
