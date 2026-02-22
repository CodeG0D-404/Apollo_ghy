const Booking = require("../models/Booking");

function detectNotificationType(previousBooking, currentBooking) {

  if (currentBooking.status === "Declined") {
    return "DECLINED";
  }

  const prevDate = previousBooking?.opdDate || previousBooking?.scheduledDate;
  const newDate = currentBooking.opdDate || currentBooking.scheduledDate;

  if (!prevDate && newDate && currentBooking.status === "Confirmed") {
    return "CONFIRMED";
  }

  if (prevDate && newDate && prevDate.getTime() !== newDate.getTime()) {
    return "RESCHEDULED";
  }

  return null;
}

module.exports = { detectNotificationType };
