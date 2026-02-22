// ==================================================
// 📁 services/patientNotificationService.js
// PURPOSE:
// Sends patient notifications (WhatsApp primary, SMS fallback)
// Currently mock mode (logs only)
// ==================================================

async function notifyPatient({ type, booking }) {
  try {
    const phone = booking.mobile;

    console.log("📲 PATIENT NOTIFICATION TRIGGERED");
    console.log("Type:", type);
    console.log("Patient:", booking.patientName);
    console.log("Doctor:", booking.doctorName);
    console.log("Phone:", phone);
    console.log("Date:", booking.opdDate || booking.scheduledDate);

    // TODO:
    // integrate WhatsApp provider
    // integrate SMS fallback

    return true;
  } catch (err) {
    console.error("Notification failed:", err);
    return false;
  }
}

module.exports = { notifyPatient };
