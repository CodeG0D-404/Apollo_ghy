export function getNotificationState(booking) {
  const appointmentDate = booking.opdDate || booking.scheduledDate;

  if (!appointmentDate) {
    return { type: null, disabled: true, reason: "No date assigned" };
  }

  if (new Date(appointmentDate) < new Date()) {
    return { type: null, disabled: true, reason: "Past booking" };
  }

  // detect lifecycle
  let type = null;

  if (booking.status === "Declined") {
    type = "DECLINED";
  }

  if (booking.status === "Confirmed") {
    const rescheduled = booking.notifications?.find(n => n.type === "CONFIRMED");
    if (!rescheduled) type = "CONFIRMED";
  }

  // reschedule detection
  const rescheduledAlready = booking.notifications?.find(n => n.type === "RESCHEDULED");

  if (!rescheduledAlready && booking.scheduledDate) {
    type = "RESCHEDULED";
  }

  // already sent?
  const alreadySent = booking.notifications?.find(n => n.type === type);

  if (alreadySent) {
    return {
      type,
      disabled: true,
      reason: `${type} already sent`,
      sentAt: alreadySent.sentAt,
    };
  }

  return {
    type,
    disabled: !type,
    reason: !type ? "No valid event" : null,
  };
}
