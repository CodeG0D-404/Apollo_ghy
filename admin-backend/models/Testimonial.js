const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    patientImage: {
      type: String,
      default: ""
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },

    status: {
      type: String,
      enum: ["hidden", "published"],
      default: "hidden"
    },

    displayOrder: {
      type: Number,
      default: 0
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
