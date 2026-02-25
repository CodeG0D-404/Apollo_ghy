export function getNotificationState(booking) {
  const appointmentDate = booking.opdDate || booking.scheduledDate;

  if (!appointmentDate) {
    return { type: null, disabled: true, reason: "No date assigned" };
  }

  // ✅ Compare date only (ignore time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appt = new Date(appointmentDate);
  appt.setHours(0, 0, 0, 0);

  if (appt < today) {
    return { type: null, disabled: true, reason: "Past booking" };
  }

  let type = null;

  // ✅ Lifecycle priority:
  // DECLINED > RESCHEDULED > CONFIRMED

  if (booking.status === "Declined") {
    type = "DECLINED";
  } 
  else if (
    booking.scheduledDate &&
    !booking.notifications?.find(n => n.type === "RESCHEDULED")
  ) {
    type = "RESCHEDULED";
  } 
  else if (
    booking.status === "Confirmed" &&
    !booking.notifications?.find(n => n.type === "CONFIRMED")
  ) {
    type = "CONFIRMED";
  }

  if (!type) {
    return { type: null, disabled: true, reason: "No valid event" };
  }

  // ✅ Check if already sent
  const alreadySent = booking.notifications?.find(
    n => n.type === type
  );

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
    disabled: false,
    reason: null,
  };
}