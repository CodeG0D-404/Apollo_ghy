// =============================================
// 📁 models/callCTA.js
// Global Call CTA phone setting
// Single-record enforced
// India format: 91XXXXXXXXXX
// =============================================

const mongoose = require("mongoose");

const CallCTASchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true,

      // must be 12 digits: 91 + 10 digits
      match: [/^[0-9]{12}$/, "Invalid phone format"],

      minlength: 12,
      maxlength: 12
    }
  },
  { timestamps: true }
);


// 🔹 enforce single document pattern
CallCTASchema.statics.getSingleton = async function () {
  let record = await this.findOne();

  if (!record) {
    record = await this.create({ phoneNumber: "910000000000" }); // placeholder
  }

  return record;
};


module.exports = mongoose.model("CallCTA", CallCTASchema);
