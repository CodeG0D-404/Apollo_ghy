// =============================================
// 📁 src/pages/BookingForm.jsx
// Production Booking Intake Page
// OPD + Telemedicine
// Honeypot protected
// Form reset on success
// =============================================

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

import "./Css/BookingForm.css";

// 🔹 Production base URL
const API = import.meta.env.VITE_API_BASE_URL || "/api";

export default function BookingForm() {
  const { doctorId, visitType } = useParams();
  const isOPD = visitType?.toLowerCase() === "opd";

  const [doctor, setDoctor] = useState(null);
  const [opdDate, setOpdDate] = useState(null);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialState = {
    name: "",
    gender: "",
    age: "",
    mobile: "+91",
    whatsapp: "+91",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    localArea: "",
    reason: "",
    company: "", // honeypot
  };

  const [formData, setFormData] = useState(initialState);

  // =====================
  // Fetch doctor
  // =====================
  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await api.get(`/doctors/${doctorId}`);
        const doc = res.data;
        setDoctor(doc);

        if (isOPD && doc.opdDates?.length > 0) {
          setOpdDate(new Date(doc.opdDates[0]).toISOString());
        }
      } catch (err) {
        console.error("Failed to fetch doctor", err);
        setMessage("Unable to load doctor information.");
      }
    }
    fetchDoctor();
  }, [doctorId, isOPD]);

  // =====================
  // Input handler
  // =====================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" || name === "whatsapp") {
      const digits = value.replace(/\D/g, "");
      setFormData((p) => ({
        ...p,
        [name]: digits.startsWith("91") ? `+${digits}` : `+91${digits}`,
      }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  // =====================
  // Submit
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.company) return; // honeypot

    if (!consent) {
      setMessage("Please accept the legal consent.");
      return;
    }

    if (isOPD && !opdDate) {
      setMessage("OPD date unavailable.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(`/bookings`, {
        doctorId: doctor._id,
        doctorName: doctor.name,
        visitType,
        opdDate: isOPD ? opdDate : null,

        name: formData.name.trim(),
        gender: formData.gender,
        age: Number(formData.age),

        mobile: formData.mobile.trim(),
        whatsapp: formData.whatsapp.trim(),
        email: formData.email.trim(),

        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zip: formData.zip.trim(),
        localArea: formData.localArea.trim(),
        reason: formData.reason.trim(),
      });

      setMessage("Booking submitted successfully.");
      setConsent(false);
      setFormData(initialState); // reset only on success

    } catch (err) {
      console.error("Booking failed", err);
      setMessage("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!doctor) return <div className="booking-state">Loading…</div>;

  return (
    <div className="booking-page">

      <div className="booking-card">

        {/* LEFT INFO PANEL */}
        <div className="booking-info">

          <div className="doctor-card">
            <img
              src={doctor.photo || "/doctor-placeholder.png"}
              alt={doctor.name}
              className="doctor-img"
            />
            <h3>{doctor.name}</h3>
            <p>{doctor.specialty?.name || "Senior Consultant"}</p>
          </div>

          <div className="visit-info">
            <p><strong>Visit Type:</strong> {visitType}</p>

            {isOPD && opdDate && (
              <p className="opd-date">
                <strong>OPD Date:</strong> {new Date(opdDate).toDateString()}
              </p>
            )}
          </div>

          <ul className="trust-points">
            <li>Secure & confidential</li>
            <li>No promotional calls</li>
            <li>Dedicated coordinator</li>
            <li>WhatsApp support</li>
          </ul>
        </div>

        {/* FORM */}
        <form className="booking-form" onSubmit={handleSubmit}>

          <div className="form-scroll">

            {/* Honeypot */}
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="hp-field"
              autoComplete="off"
            />

            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
            <input name="whatsapp" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={handleChange} required />
            <input name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />

            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />

            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
            <input name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange} required />
            <input name="localArea" placeholder="Local Area" value={formData.localArea} onChange={handleChange} />

            <textarea name="reason" placeholder="Symptoms / Reason" value={formData.reason} onChange={handleChange} required />

            <div className="consent-box">
              <label>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                I agree to Privacy Policy & Terms.
              </label>
            </div>

          </div>

          <button disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Booking"}
          </button>

          {message && <p className="form-message">{message}</p>}

        </form>

      </div>
    </div>
  );
}
