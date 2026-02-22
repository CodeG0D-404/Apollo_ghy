// =============================================
// 📁 services/patientService.js
// Handles patient creation during booking flow
// Used internally by booking controller
// Multi-phone safe | Duplicate-safe | Schema aligned
// =============================================

const Patient = require("../models/Patient");

// =====================================================
// 🔧 Helper: Normalize Indian phone
// Ensures consistent storage (+91XXXXXXXXXX)
// =====================================================
const normalizePhone = (phone) => {
  if (!phone) return null;
  return phone.startsWith("+91") ? phone : `+91${phone}`;
};

// =====================================================
// 🧠 FIND OR CREATE PATIENT
// Used ONLY by booking flow
// =====================================================
async function findOrCreatePatient(patientData) {
  const {
    name,
    mobile,
    whatsapp,
    email,
    address,
    city,
    zip,
    localArea,
    reason,
    age,
    gender,
  } = patientData;

  try {
    const normalizedMobile = normalizePhone(mobile);
    const normalizedWhatsapp = normalizePhone(whatsapp || mobile);
    const normalizedEmail = email?.toLowerCase().trim();

    // ==================================================
    // 🔎 DUPLICATE CHECK (phones[] only — schema aligned)
    // ==================================================
    let patient = await Patient.findOne({
      "phones.number": normalizedMobile,
      active: true,
    });

    // ==================================================
    // EXISTING PATIENT → reuse
    // ==================================================
    if (patient) {

      // add new phone if not present
      if (normalizedMobile) {
        const exists = patient.phones.some(
          (p) => p.number === normalizedMobile
        );

        if (!exists && patient.phones.length < 5) {
          patient.phones.push({
            number: normalizedMobile,
            label: "Secondary",
          });
        }
      }

      // add whatsapp if new
      if (normalizedWhatsapp) {
        const exists = patient.phones.some(
          (p) => p.number === normalizedWhatsapp
        );

        if (!exists && patient.phones.length < 5) {
          patient.phones.push({
            number: normalizedWhatsapp,
            label: "WhatsApp",
          });
        }
      }

      // add email if new
      if (normalizedEmail) {
        const exists = patient.emails?.some(
          (e) => e.email === normalizedEmail
        );

        if (!exists) {
          patient.emails.push({
            email: normalizedEmail,
            label: "Primary",
          });
        }
      }

      await patient.save();

      return { patient, isOldPatient: true };
    }

    // ==================================================
    // NEW PATIENT CREATION (booking auto-create)
    // ==================================================

    const phones = [];

    if (normalizedMobile) {
      phones.push({
        number: normalizedMobile,
        label: "Primary",
        isPrimary: true,
      });
    }

    if (
      normalizedWhatsapp &&
      normalizedWhatsapp !== normalizedMobile &&
      phones.length < 5
    ) {
      phones.push({
        number: normalizedWhatsapp,
        label: "WhatsApp",
      });
    }

    const emails = normalizedEmail
      ? [
          {
            email: normalizedEmail,
            label: "Primary",
          },
        ]
      : [];

    patient = new Patient({
      name,
      age,
      gender,
      symptoms: reason,
      address,
      city,
      zip,
      localArea,
      phones,
      emails,
    });

    await patient.save();

    return { patient, isOldPatient: false };

  } catch (err) {
    console.error("❌ Error in findOrCreatePatient:", err);
    throw err;
  }
}

module.exports = {
  findOrCreatePatient,
};
