// =============================================
// Allow ONLY booking server to create patients
// Blocks all external/public calls
// =============================================

module.exports = (req, res, next) => {
  const allowedIPs = [
    "127.0.0.1",        // local server
    "::1",              // IPv6 local
    "YOUR_BOOKING_SERVER_IP",  // production booking server
  ];

  const requestIP =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress;

  if (!allowedIPs.includes(requestIP)) {
    return res.status(403).json({
      error: "Access denied. Booking server only.",
    });
  }

  next();
};
