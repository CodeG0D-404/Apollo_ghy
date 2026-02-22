// 📁 services/emailService.js
// PURPOSE:
// - Admin notifications only
// - No patient communication
// - Used for booking lifecycle alerts

const nodemailer = require("nodemailer");

// ===============================
// 🔹 Transporter
// ===============================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===============================
// 🔹 Send Email to Admin
// ACTIONS:
// - BOOKED
// - CONFIRMED
// - DECLINED
// - RESCHEDULED
// ===============================
async function sendEmailToAdmin(booking, action) {
  try {
    const appointmentDate =
      booking.opdDate || booking.scheduledDate;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `[${action}] Booking ${booking.bookingId}`,
      text: `
Action: ${action}

Booking ID: ${booking.bookingId}
Patient: ${booking.patientName}
Mobile: ${booking.mobile}
Email: ${booking.email}
Doctor: ${booking.doctorName}
Visit Type: ${booking.visitType}
Status: ${booking.status}
Date: ${appointmentDate || "Not assigned"}
      `.trim(),
    });

    console.log(`📧 Admin email sent [${action}]`);
  } catch (err) {
    console.error("❌ Admin email failed:", err);
  }
}

// ===============================
// 🔹 Export
// ===============================
module.exports = {
  sendEmailToAdmin,
};
