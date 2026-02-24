// =====================================
// 📁 server.js
// Main server entry point for healthcare backend
// Production-ready + Localhost compatible
// =====================================
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// 🔐 Hide Express signature header (security hardening)
app.disable("x-powered-by");

// 🔐 REQUIRED for Render + cookies behind proxy
app.set("trust proxy", 1);


// ============================================================
// 📊 REQUEST LOGGER (PRODUCTION MONITORING)
// ============================================================
// Logs all incoming API requests
// Helps debug:
// - failed APIs
// - suspicious traffic
// - performance issues
//
// Example log:
// GET /api/doctors 200 12ms
// ============================================================

const morgan = require("morgan");
app.use(morgan("dev"));

//============================================================
// SECURITY HALMET
//============================================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);


//============================================================
// SECURITY - MONGO SANITIZE (EXPRESS 5 SAFE)
// Prevents MongoDB operator injection
// Only sanitizes body + params (not query)
//============================================================

app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith("$") || key.includes(".")) {
        delete req.body[key];
      }
    });
  }

  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      if (key.startsWith("$") || key.includes(".")) {
        delete req.params[key];
      }
    });
  }

  next();
});


// ============================================================
// 🔐 CORS CONFIGURATION (SECURE + DEPLOYMENT READY)
// ============================================================
// PURPOSE:
// - Allow frontend (localhost + production domain)
// - Allow cookies (JWT httpOnly)
// - Prevent random sites from calling backend
//
// LOCAL DEV → keep localhost
// PRODUCTION → add vercel domain
//
// ⚠️ AFTER DEPLOY:
// Replace "https://your-vercel-domain.vercel.app"
// with your actual frontend domain
// ============================================================

const allowedOrigins = [
  "http://localhost:5173", // 🔹 LOCAL DEV (KEEP)
  "https://apollo-ghy.vercel.app", // 🔹 PRODUCTION (CHANGE THIS)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server or Postman requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 🔐 REQUIRED for cookies
  })
);

// ============================================================
// 🚦 RATE LIMITER (ANTI-SPAM / ANTI-BOT)
// ============================================================
// Protects APIs from:
// - brute force login attempts
// - spam bookings
// - bot attacks
//
// Limits each IP to X requests per window
// Safe for production
// ============================================================

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);


// ============================================================
// 🔹 BODY PARSERS
// ============================================================
// Parse JSON & form data
// ============================================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// ============================================================
// 🔐 COOKIE PARSER (REQUIRED FOR JWT COOKIE AUTH)
// ============================================================
// Reads cookies from incoming requests
// Required for verifyToken middleware
// ============================================================

app.use(cookieParser());

// ============================================================
// 📁 STATIC FILE SERVING (TEMPORARY FOR LOCAL STORAGE)
// ============================================================
// Serves uploaded images from local disk
//
// ⚠️ IMPORTANT FOR DEPLOYMENT:
// - This WILL break on Render/Vercel free tier
// - Replace with Cloudinary later
// ============================================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================================
// 🔹 ROUTES
// ============================================================

// -------------------------------
// 🏥 Clinic Auth Routes
// -------------------------------
const clinicRoutes = require("./routes/ClinicRoutes");
app.use("/api/clinic", clinicRoutes);

// -------------------------------
// 👨‍⚕️ Doctor Routes
// -------------------------------
const doctorRoutes = require("./routes/doctors");
app.use("/api/doctors", doctorRoutes);

// -------------------------------
// 🧠 Specialty & Conditions
// -------------------------------
const specialtyRoutes = require("./routes/specialties");
const conditionRoutes = require("./routes/conditions");
app.use("/api/specialties", specialtyRoutes);
app.use("/api/conditions", conditionRoutes);

// -------------------------------
// 👨‍👩‍👧 Patient Routes
// -------------------------------
const patientRoutes = require("./routes/patient");
app.use("/api/patients", patientRoutes);

// -------------------------------
// 📅 Booking Routes
// -------------------------------
const bookingRoutes = require("./routes/booking");
app.use("/api/hospital-requests", require("./routes/hospitalRequest"));

// 🔐 Booking routes internally protected via verifyToken
app.use("/api/bookings", bookingRoutes);


// -------------------------------
// 💳 OPD Payment Routes
// -------------------------------
const opdPaymentRoutes = require("./routes/opdPayment");
app.use("/api/opd-payments", opdPaymentRoutes);

// -------------------------------
// 📰 Blog Routes
// -------------------------------
const blogRoutes = require("./routes/blog.routes");
app.use("/api/blogs", blogRoutes);

// -------------------------------
// ⭐ Testimonial Routes
// -------------------------------
const testimonialRoutes = require("./routes/testimonial.routes");
app.use("/api/testimonials", testimonialRoutes);


//CTA Buttons Components 
app.use("/api/call-cta", require("./routes/callCTARoutes"));
app.use("/api/inquiry", require("./routes/inquiryRoutes"));



// ============================================================
// 🔹 HEALTH CHECK ROUTE
// ============================================================
// Used by:
// - Render
// - Railway
// - Monitoring services
// ============================================================

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ============================================================
// 🔹 MONGODB CONNECTION
// ============================================================
// Connects once and reuses connection
// Also runs scheduled booking maintenance
// ============================================================

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // ---------------------------------
    // 🧹 Auto-archive past OPD bookings
    // ---------------------------------
    const archivePastOPDBookings = require("./middleware/opdSetup");

    // Run immediately on server start
    archivePastOPDBookings();

    // Run every 24 hours
    setInterval(
      archivePastOPDBookings,
      1000 * 60 * 60 * 24
    );
  }
}

connectDB().catch((err) =>
  console.error("MongoDB connection error:", err)
);

// ============================================================
// 🧯 CENTRAL ERROR HANDLER (PRODUCTION SAFETY)
// ============================================================
// Catches all server errors in one place
// Prevents app crash
// Sends safe message to frontend
//
// Handles:
// - database errors
// - route errors
// - validation errors
// - unknown server failures
// ============================================================

app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again later."
        : err.message,
  });
});


// ============================================================
// 🔹 START SERVER
// ============================================================
// Uses environment PORT for production
// Falls back to 5000 locally
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ============================================================
// 🔹 EXPORTS
// ============================================================
// Used for testing or external integration
// ============================================================

module.exports = { app, connectDB };
