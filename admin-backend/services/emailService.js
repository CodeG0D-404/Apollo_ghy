// 📁 services/emailService.js
// PURPOSE:
// - Admin notifications
// - OTP emails
// - Fully Resend-based (no Gmail, no nodemailer)

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// ===============================
// 🔹 OTP Email
// ===============================
async function sendOtpEmail(to, otp) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Your OTP Code",
      html: `<strong>Your OTP: ${otp}</strong>`,
    });

    console.log("📧 OTP email sent via Resend");
  } catch (err) {
    console.error("❌ OTP email failed:", err);
  }
}

// ===============================
// 🔹 Admin Booking Notification
// ===============================
async function sendEmailToAdmin(booking, action) {
  try {
    const appointmentDate =
      booking.opdDate || booking.scheduledDate;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.ADMIN_EMAIL, // your email
      subject: `[${action}] Booking ${booking.bookingId}`,
      html: `
        <h3>Booking Update</h3>
        <p><b>Action:</b> ${action}</p>
        <p><b>Booking ID:</b> ${booking.bookingId}</p>
        <p><b>Patient:</b> ${booking.patientName}</p>
        <p><b>Mobile:</b> ${booking.mobile}</p>
        <p><b>Email:</b> ${booking.email}</p>
        <p><b>Doctor:</b> ${booking.doctorName}</p>
        <p><b>Visit Type:</b> ${booking.visitType}</p>
        <p><b>Status:</b> ${booking.status}</p>
        <p><b>Date:</b> ${appointmentDate || "Not assigned"}</p>
      `,
    });

    console.log(`📧 Admin email sent [${action}]`);
  } catch (err) {
    console.error("❌ Admin email failed:", err);
  }
}

// ===============================
module.exports = {
  sendOtpEmail,
  sendEmailToAdmin,
};