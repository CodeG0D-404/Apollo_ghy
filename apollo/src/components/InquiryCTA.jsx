// =============================================
// 📁 src/components/InquiryCTA.jsx
// Public Inquiry CTA Popup
// Production safe + brand aligned
// =============================================

import React, { useState } from "react";
import api from "../services/api";
import "./CSS/InquiryCTA.css";

export default function InquiryCTA({
  label = "Request Assistance",
  page = "support",
  section = "general"
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // sanitize text
  const sanitize = (text) => text.replace(/[<>]/g, "").trim();

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length <= 10) setPhone(digits);
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Enter your name");
      return;
    }

    if (phone.length !== 10) {
      setError("Enter valid phone number");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        `${import.meta.env.VITE_API_URL}/api/inquiry`,
        {
          name: sanitize(name),
          phone,
          company_name: company, // honeypot
          page,
          section
        },
        { withCredentials: true }
      );

      setMessage("Request submitted. Our team will contact you.");

      setName("");
      setPhone("");
      setCompany("");

      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 1800);

    } catch {
      setError("Submission failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* CTA BUTTON */}
      <button
        className="inq-btn-primary"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>

      {/* POPUP */}
      {open && (
        <div className="inq-modal-overlay">
          <div className="inq-modal">

            <h3>Request Assistance</h3>
            <p>Our team will contact you shortly.</p>

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Phone */}
            <div className="inq-phone-group">
              <span>+91</span>
              <input
                type="text"
                placeholder="10 digit number"
                value={phone}
                onChange={handlePhoneChange}
              />
            </div>

            {/* Honeypot */}
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="inq-honeypot"
              tabIndex="-1"
              autoComplete="off"
            />

            {/* Actions */}
            <div className="inq-actions">
              <button
                onClick={handleSubmit}
                className="inq-btn-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              <button
                onClick={() => setOpen(false)}
                className="inq-btn-secondary"
              >
                Cancel
              </button>
            </div>

            {message && <p className="inq-success">{message}</p>}
            {error && <p className="inq-error">{error}</p>}

          </div>
        </div>
      )}
    </>
  );
}
