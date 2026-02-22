const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

async function updateDoctorConnection({
  patientId,
  doctorId,
  appointmentDate,
  confirmed = false,
}) {
  try {
    if (!patientId || !doctorId) return;

    const patient = await Patient.findById(patientId);
    if (!patient) return;

    // Find existing connection
    let connection = patient.doctorConnections.find(
      (dc) => dc.doctorId.toString() === doctorId.toString()
    );

    // Fetch doctor specialty once
    let specialtyId = null;
    if (!connection) {
      const doctor = await Doctor.findById(doctorId).select("specialty");
      specialtyId = doctor?.specialty || null;
    }

    // 1️⃣ CREATE CONNECTION (first ever booking)
    if (!connection) {
      patient.doctorConnections.push({
        doctorId,
        specialtyId,
        firstVisit: appointmentDate || new Date(),
        lastVisit: null,
        visitCount: 0,
      });

      connection = patient.doctorConnections[patient.doctorConnections.length - 1];
    }

    // 2️⃣ CONFIRMED VISIT → real visit recorded
// 2️⃣ CONFIRMED VISIT → real visit recorded
if (confirmed) {
  // Avoid double increment if already counted for same appointment
  if (
    !connection.lastVisit ||
    (appointmentDate &&
      new Date(connection.lastVisit).getTime() !==
        new Date(appointmentDate).getTime())
  ) {
    connection.visitCount += 1;

    if (appointmentDate) {
      connection.lastVisit = appointmentDate;
    }
  }
}


    await patient.save();
  } catch (err) {
    console.error("⚠️ doctorConnections update failed:", err);
  }
}

module.exports = { updateDoctorConnection };
