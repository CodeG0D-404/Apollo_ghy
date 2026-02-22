// =============================
// 📁 clinic/PatientDetails.jsx
// Patient Dashboard — enhanced
// Doctor fallback + Back button added
// =============================

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/PatientDetails.css";

import {
  fetchPatientDetails,
  archivePatient,
} from "./Services/patient.service";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
};

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // Helpers
  // =========================================
  const getPrimaryPhone = () =>
    patient?.phones?.find((p) => p.isPrimary)?.number || "-";

  const getPrimaryEmail = () =>
    patient?.emails?.find((e) => e.label === "Primary")?.email || "-";

  // Doctor fallback from bookings if doctorConnections empty
  const derivedDoctorsFromBookings = () => {
    if (!bookings?.length) return [];

    const map = new Map();

    bookings.forEach((b) => {
      if (!b.doctorId) return;

      const id = b.doctorId?._id || b.doctorId;
      if (!map.has(id)) {
        map.set(id, {
          doctorName: b.doctorId?.name || b.doctorName || "Doctor",
          specialtyName:
            b.doctorId?.specialty?.name ||
            b.specialtyName ||
            "Specialty",
        });
      }
    });

    return Array.from(map.values());
  };

  // =========================================
  // Load data
  // =========================================
  useEffect(() => {
    const loadPatientDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetchPatientDetails(id);
        setPatient(res.data.patient);
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("❌ Failed to fetch patient details:", err);
        setError("Failed to fetch patient details.");
      } finally {
        setLoading(false);
      }
    };

    loadPatientDetails();
  }, [id]);

  // =========================================
  // Archive
  // =========================================
  const handleArchive = async () => {
    if (!window.confirm("Archive this patient?")) return;

    try {
      await archivePatient(id);
      alert("Patient archived");
      navigate("/clinic/patients");
    } catch {
      alert("Failed to archive");
    }
  };

  if (loading) return <div className="pd-loading">Loading patient details...</div>;
  if (error) return <div className="pd-error">{error}</div>;
  if (!patient) return <div className="pd-error">Patient not found.</div>;

  const doctorHistory =
    patient.doctorConnections?.length
      ? patient.doctorConnections.map((d) => ({
          doctorName: d.doctorId?.name || "Doctor",
          specialtyName: d.specialtyId?.name || "Specialty",
          visits: d.visitCount || 0,
        }))
      : derivedDoctorsFromBookings();

  return (
    <div className="patient-details-page">

      {/* HEADER */}
      <div className="pd-header">
        <div>
          <h2 className="pd-name">{patient.name}</h2>
          <span className="pd-registered">
            Registered on: {formatDate(patient.createdAt)}
          </span>
        </div>

        <div className="pd-actions">
          <button onClick={() => navigate(-1)}>
            Back
          </button>

          <button onClick={() => navigate(`/clinic/patients/${id}/edit`)}>
            Edit
          </button>

          <button onClick={handleArchive}>
            Archive
          </button>
        </div>
      </div>

      {/* PATIENT INFO */}
      <div className="pd-info-card">

        <div className="pd-row">
          <div><strong>Patient ID:</strong> {patient.shortId}</div>
          <div><strong>Primary Mobile:</strong> {getPrimaryPhone()}</div>
          <div><strong>Primary Email:</strong> {getPrimaryEmail()}</div>
        </div>

        <div className="pd-row">
          <div><strong>Age:</strong> {patient.age || "N/A"}</div>
          <div><strong>Gender:</strong> {patient.gender || "N/A"}</div>
          <div><strong>City:</strong> {patient.city || "N/A"}</div>
        </div>

        <div className="pd-row">
          <div><strong>Address:</strong> {patient.address || "N/A"}</div>
          <div><strong>Local Area:</strong> {patient.localArea || "N/A"}</div>
          <div><strong>ZIP:</strong> {patient.zip || "N/A"}</div>
        </div>

        <div className="pd-row pd-full">
          <div>
            <strong>Symptoms:</strong>{" "}
            {patient.symptoms || bookings?.[0]?.reason || "N/A"}
          </div>
        </div>

        {/* ALL PHONES */}
        <div className="pd-row pd-full">
          <div>
            <strong>All Phones:</strong>
            <div className="pd-chip-list">
              {patient.phones?.map((p) => (
                <span key={p.number}>
                  {p.number}
                  {p.isPrimary && " ★"}
                  {p.isWhatsApp && <span className="pd-whatsapp-dot"> ●</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ALL EMAILS */}
        <div className="pd-row pd-full">
          <div>
            <strong>All Emails:</strong>
            <div className="pd-chip-list">
              {patient.emails?.map((e) => (
                <span key={e.email}>
                  {e.email} {e.label === "Primary" && "★"}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DOCTOR HISTORY */}
        <div className="pd-row pd-full">
          <div>
            <strong>Doctor History:</strong>

            {!doctorHistory.length ? (
              <p className="pd-muted">No doctor visits recorded</p>
            ) : (
              <div className="pd-chip-list">
                {doctorHistory.map((d, i) => (
                  <span key={i}>
                    {d.doctorName} — {d.specialtyName}
                    {d.visits ? <small> (Visits: {d.visits})</small> : null}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BOOKINGS HISTORY */}
      <div className="pd-bookings">
        <h3>Bookings</h3>

        {bookings.length === 0 ? (
          <p className="pd-no-booking">No bookings found for this patient.</p>
        ) : (
          <div className="pd-table-wrapper">
            <table className="pd-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Visit Type</th>
                  <th>Appointment Date</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Booked On</th>
                </tr>
              </thead>

              <tbody>
                {[...bookings]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.doctorId?.name || booking.doctorName || "N/A"}</td>
                      <td>{booking.doctorId?.specialty?.name || "N/A"}</td>

                      <td>{booking.visitType}</td>

                      <td>
                        {booking.visitType === "OPD"
                          ? formatDate(booking.opdDate)
                          : booking.scheduledDate
                          ? formatDate(booking.scheduledDate)
                          : "Not scheduled yet"}
                      </td>

                      <td>{booking.reason || "N/A"}</td>
                      <td>{booking.status}</td>
                      <td>{formatDate(booking.createdAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
