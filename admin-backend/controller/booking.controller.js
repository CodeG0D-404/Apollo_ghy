// ==================================================
// 📁 controllers/booking.controller.js
// PURPOSE:
// Centralized controller for ALL booking operations.
// Handles lifecycle enforcement, business rules,
// and database interaction.
// ==================================================

const Booking = require("../models/Booking");
const Patient = require("../models/Patient");
const { findOrCreatePatient } = require("../services/patientService");
const {sendEmailToAdmin } = require("../services/emailService");
const OpdPaymentRecord = require("../models/OpdPaymentRecord");
const uploadToCloudinary = require("../services/cloudinaryUpload");

// 🆕 ADD: doctor connection service
const { updateDoctorConnection } = require("../services/doctorConnectionService");
const { createPatientSchema } = require("../validators/patient.validator");



// ==================================================
// 🔹 Utility: Get appointment date safely
// ==================================================
function getAppointmentDate(booking) {
  return booking.visitType === "OPD"
    ? booking.opdDate
    : booking.scheduledDate;
}


// ==================================================
// 🔹 CONTROLLER: Create Booking (PUBLIC)
// ==================================================




exports.createBooking = async (req, res) => {
  try {

    // 🛑 Honeypot bot protection
    if (req.body.company) {
      return res.status(400).json({ error: "Invalid request" });
    }
    const {
  doctorId,
  doctorName,
  visitType,
  opdDate,
  name,
  gender,
  age,
  mobile,
  whatsapp,
  email,
  address,
  city,
  localArea,
  zip,
  reason,
} = req.body;

if (
  !doctorId ||
  !doctorName ||
  !visitType ||
  !name ||
  !gender ||
  !age ||
  !mobile ||
  !email ||
  !reason
) {
  return res.status(400).json({ error: "Missing required fields" });
}


const { error, value } = createPatientSchema.validate(
  {
    name,
    mobile,
    whatsapp,
    email,
    address,
    city,
    zip,
    localArea,
    symptoms: reason,
    age,
    gender,
  },
  { abortEarly: false }
);

if (error) {
  throw new Error(error.details.map(d => d.message).join(", "));
}



      const { patient, isOldPatient } = await findOrCreatePatient({
        name,
        mobile,
        whatsapp,
        email,
        address,
        city,
        localArea,
        zip,
        reason,
        age,
        gender,
      });

    // 🔹 derive primary phone
const primaryPhone =
  patient.phones.find((p) => p.isPrimary)?.number ||
  patient.phones[0]?.number ||
  mobile;

// 🔹 derive whatsapp phone
const whatsappPhone =
  patient.phones.find((p) => p.isWhatsApp)?.number ||
  whatsapp ||
  primaryPhone;

// 🔹 derive primary email
const primaryEmail =
  patient.emails.find((e) => e.label === "Primary")?.email ||
  patient.emails[0]?.email ||
  email;

    const booking = new Booking({
      patientId: patient._id,
      doctorId,
      doctorName,
      patientName: patient.name,
      gender,
      age,
      mobile: primaryPhone,
      whatsapp: whatsappPhone,
      email: primaryEmail,
      address: patient.address,
      city: patient.city,
      localArea: patient.localArea,
      zip: patient.zip,
      visitType,
      opdDate: visitType === "OPD" ? opdDate : null,
      reason,
      isOldPatient,
    });

    await booking.save();

    // ==================================================
// 🆕 AUTO WHATSAPP: BOOKING RECEIVED
// ==================================================
const { notifyPatient } = require("../services/patientNotificationService");

try {
  await notifyPatient({
    type: "BOOKED",
    booking,
  });

  // audit entry
  booking.notifications.push({
    type: "BOOKED",
    sentAt: new Date(),
    sentBy: "system",
    channel: "whatsapp",
  });

  await booking.save();

} catch (err) {
  console.error("BOOKED WhatsApp failed:", err);
}



    // ==================================================
    // 🆕 ADD: Create doctor connection on booking creation
    // ==================================================
    await updateDoctorConnection({
      patientId: booking.patientId,
      doctorId: booking.doctorId,
      appointmentDate: getAppointmentDate(booking),
      confirmed: false,
    });


    // ================================
    // 🔸 Auto-create OPD payment record
    // ================================
    if (booking.visitType === "OPD") {
      try {
        await OpdPaymentRecord.create({
          bookingId: booking.bookingId,
          visitType: "OPD",
        });
      } catch (paymentErr) {
        console.error(
          "⚠️ Failed to create OPD payment record for booking:",
          booking.bookingId,
          paymentErr
        );
      }
    }

    // ================================
    // 🔸 Notifications
    // ================================
    try {

      await sendEmailToAdmin(booking, "BOOKED");
    } catch (mailErr) {
      console.error(
        "⚠️ Booking created but email failed:",
        booking.bookingId,
        mailErr
      );
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.error("❌ Create booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};



// ==================================================
// 🔹 CONTROLLER: Get Bookings (ADMIN)
// ==================================================
exports.getBookings = async (req, res) => {
  try {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookings = await Booking.find({ archived: false });

    for (const booking of activeBookings) {
      const appointmentDate = getAppointmentDate(booking);
      if (appointmentDate && appointmentDate < today) {
        booking.archived = true;
        await booking.save();
      }
    }

    const { visitType, status, archived, search } = req.query;
    const filter = {};

    if (visitType) filter.visitType = visitType;
    if (status) filter.status = status;
    if (archived !== undefined) filter.archived = archived === "true";

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { shortId: regex },
        { doctorName: regex },
        { patientName: regex },
        { mobile: regex },
        { email: regex },
      ];
    }

    const totalRecords = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("patientId", "name mobile email")
      .populate("doctorId", "name specialty");

    res.json({
      bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
      },
    });

  } catch (error) {
    console.error("❌ Fetch bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};



// ==================================================
// 🔹 CONTROLLER: Update Booking (ADMIN)
// ==================================================
exports.updateBooking = async (req, res) => {
  try {

    const { status, archived, scheduledDate, opdDate } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 🆕 ADD: capture previous status
    const previousStatus = booking.status;


    const previousAppointmentDate = getAppointmentDate(booking);
if (
  booking.visitType === "OPD" &&
  status === "Confirmed" &&
  !booking.opdDate
) {
  return res.status(400).json({ error: "OPD date required before confirmation" });
}

    

    if (status) {
      booking.status = status;
      if (status === "Declined") {
        booking.archived = true;
      }
    }

    if (booking.visitType !== "OPD" && scheduledDate) {
      booking.scheduledDate = scheduledDate;
      booking.status = "Confirmed";
    }

    if (archived === false) {
      const appointmentDate = getAppointmentDate(booking);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!appointmentDate || appointmentDate < today) {
        return res.status(400).json({
          error: "Cannot restore booking with past or missing appointment date",
        });
      }
    }

    if (archived !== undefined) {
      booking.archived = archived;
    }

    await booking.save();

    // ==================================================
// 🆕 ADMIN EMAIL TRIGGERS (Lifecycle)
// ==================================================
try {

  const newAppointmentDate = getAppointmentDate(booking);

  // CONFIRMED
  if (previousStatus !== "Confirmed" && booking.status === "Confirmed") {
    await sendEmailToAdmin(booking, "CONFIRMED");
  }

  // DECLINED
  if (previousStatus !== "Declined" && booking.status === "Declined") {
    await sendEmailToAdmin(booking, "DECLINED");
  }

  // RESCHEDULED
  const dateChanged =
    previousAppointmentDate &&
    newAppointmentDate &&
    previousAppointmentDate.getTime() !== newAppointmentDate.getTime();

  if (dateChanged) {
    await sendEmailToAdmin(booking, "RESCHEDULED");
  }

} catch (mailErr) {
  console.error(
    "⚠️ Admin lifecycle email failed:",
    booking.bookingId,
    mailErr
  );
}



    // ==================================================
    // 🆕 ADD: update doctor connection ONLY when confirmed
    // ==================================================
    const isNowConfirmed =
      previousStatus !== "Confirmed" && booking.status === "Confirmed";

    if (isNowConfirmed) {
      await updateDoctorConnection({
        patientId: booking.patientId,
        doctorId: booking.doctorId,
        appointmentDate: getAppointmentDate(booking),
        confirmed: true,
      });
    }


    res.json({
      message: "Booking updated successfully",
      booking,
    });

  } catch (error) {
    console.error("❌ Update booking error:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
};



// ==================================================
// 🔹 CONTROLLER: Get Single Booking (ADMIN)
// ==================================================
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("patientId", "name mobile email")
      .populate("doctorId", "name specialty");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);

  } catch (error) {
    console.error("❌ Get booking error:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};
