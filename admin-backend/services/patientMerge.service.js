// =============================================
// 📁 services/patientMerge.service.js
// Patient Merge Engine
// =============================================

const Patient = require("../models/Patient");
const Booking = require("../models/Booking");

async function mergePatients({ primaryId, secondaryId, adminId }) {
  if (primaryId === secondaryId) {
    throw new Error("Cannot merge same patient");
  }

  // 1️⃣ Load patients
  const primary = await Patient.findById(primaryId);
  const secondary = await Patient.findById(secondaryId);

  if (!primary || !secondary) {
    throw new Error("Patient not found");
  }

  if (!secondary.active) {
    throw new Error("Secondary patient already archived");
  }

  // 2️⃣ Merge phones
  if (secondary.phones?.length) {
    secondary.phones.forEach((phone) => {
      const exists = primary.phones.some(
        (p) => p.number === phone.number
      );
      if (!exists) primary.phones.push(phone);
    });
  }

  // 3️⃣ Merge emails
  if (secondary.emails?.length) {
    secondary.emails.forEach((email) => {
      const exists = primary.emails.some(
        (e) => e.email === email.email
      );
      if (!exists) primary.emails.push(email);
    });
  }

  // 4️⃣ Merge doctor connections
  if (secondary.doctorConnections?.length) {
    secondary.doctorConnections.forEach((dc) => {
      const exists = primary.doctorConnections.some(
        (pdc) => pdc.doctorId.toString() === dc.doctorId.toString()
      );
      if (!exists) primary.doctorConnections.push(dc);
    });
  }

  // 5️⃣ Move bookings B → A
  await Booking.updateMany(
    { patientId: secondary._id },
    { $set: { patientId: primary._id } }
  );

  // 6️⃣ Store reference IDs
  primary.referencePatientIds.push(secondary.patientId);

  primary.mergeHistory.push({
    mergedPatientId: secondary.patientId,
    mergedIntoPatientId: primary.patientId,
    mergedBy: adminId || "admin",
    date: new Date(),
  });

  await primary.save();

  // 7️⃣ Archive secondary patient
  secondary.active = false;
  secondary.duplicateOf = true;
  secondary.mergedInto = primary._id;

  await secondary.save();

  return {
    primary,
    secondary,
  };
}

module.exports = { mergePatients };
