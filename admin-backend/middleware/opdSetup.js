// 📁 middleware/opdSetup.js

const Booking = require("../models/Booking");

// ✅ Middleware to archive past OPD bookings
async function archivePastOPDBookings() {
  try {
    const now = new Date();

    // Find OPD bookings that are in the past and not already archived
    const pastOPDBookings = await Booking.updateMany(
      {
        visitType: "OPD",
        opdDate: { $lt: now },
        archived: false,
      },
      { $set: { archived: true } }
    );

    console.log(`✅ Archived ${pastOPDBookings.modifiedCount} past OPD bookings`);
  } catch (err) {
    console.error("❌ Error archiving past OPD bookings:", err);
  }
}

module.exports = archivePastOPDBookings;
