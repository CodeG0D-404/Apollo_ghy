// =====================================
// 📁 middleware/auth.js
// JWT verification using httpOnly cookies
// Supports cookie auth + fallback header during migration
// =====================================

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // 1️⃣ Try cookie first (NEW system)
  let token = req.cookies?.token;

  // 2️⃣ Fallback: Authorization header (OLD system - temporary support)
  if (!token) {
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  verifyToken,
};
