const Booking = require("../models/Booking");
const { notifyPatient } = require("../services/patientNotificationService");
const { detectNotificationType } = require("../services/bookingNotificationEngine");

exports.sendBookingNotification = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 🚫 Prevent past notifications
    const appointmentDate =
      booking.opdDate || booking.scheduledDate;

    if (appointmentDate && appointmentDate < new Date()) {
      return res.status(400).json({
        error: "Cannot send notification for past booking",
      });
    }

    // 🔹 Detect correct lifecycle event
    const type = detectNotificationType(null, booking);

    if (!type) {
      return res.status(400).json({
        error: "No valid notification event detected",
      });
    }

    // ==================================================
    // 🆕 BLOCK DUPLICATE NOTIFICATIONS
    // ==================================================
    const alreadySent = booking.notifications?.find(
      (n) => n.type === type
    );

    if (alreadySent) {
      return res.status(400).json({
        error: `${type} notification already sent`,
      });
    }

    // ==================================================
    // 🔹 SEND NOTIFICATION
    // ==================================================
    await notifyPatient({
      type,
      booking,
    });

    // ==================================================
    // 🆕 SAVE AUDIT ENTRY
    // ==================================================
    booking.notifications.push({
      type,
      sentAt: new Date(),
      sentBy:  "admin",
      channel: "whatsapp", // sms fallback handled internally later
    });

    await booking.save();

    res.json({
      message: `${type} notification sent successfully`,
    });

  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ error: "Failed to send notification" });
  }
};
