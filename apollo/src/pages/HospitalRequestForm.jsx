import React, { useState } from "react";
import axios from "axios";
import "./Css/HospitalRequestForm.css";

const API = import.meta.env.VITE_BASE_URL;

export default function HospitalRequestForm() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    mobile: "+91",
    whatsapp: "+91",
    email: "",
    city: "",
    message: "",
    companyName: "",
  });

  // =====================
  // Handle input (LOCK +91)
  // =====================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" || name === "whatsapp") {
      let digits = value.replace(/\D/g, "");

      // remove leading 91
      if (digits.startsWith("91")) {
        digits = digits.slice(2);
      }

      // allow only 10 digits after 91
      digits = digits.slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        [name]: "+91" + digits,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =====================
  // Submit
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.companyName) return;

    if (!consent) {
      setMessage("❌ Please accept the legal consent to proceed.");
      return;
    }

    // validate phone
    if (formData.mobile.length !== 13) {
      setMessage("❌ Please enter a valid 10 digit mobile number.");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`${API}/api/hospital-requests`, {
        name: formData.name.trim(),
        gender: formData.gender,
        age: Number(formData.age),
        mobile: formData.mobile.trim(),
        whatsapp:
          formData.whatsapp.length === 13
            ? formData.whatsapp.trim()
            : formData.mobile.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        message: formData.message.trim(),
      });

      setMessage(
        "✅ Request submitted. Our care coordinator will contact you shortly."
      );

      setFormData({
        name: "",
        gender: "",
        age: "",
        mobile: "+91",
        whatsapp: "+91",
        email: "",
        city: "",
        message: "",
        companyName: "",
      });

      setConsent(false);
    } catch (err) {
      console.error("❌ Hospital request failed", err);
      setMessage("❌ Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hospital-page">
      <div className="hospital-container">
        <div className="hospital-card">

          {/* LEFT PANEL */}
          <div className="hospital-info">
            <h3>Hospital Care Assistance</h3>

            <p>
              Our medical coordinators will guide you for admission, treatment,
              surgery support, and specialist consultations.
            </p>

            <ul className="hospital-trust">
              <li>✔ Dedicated care coordinator</li>
              <li>✔ Fast admission support</li>
              <li>✔ Confidential & secure process</li>
              <li>✔ WhatsApp assistance available</li>
            </ul>
          </div>

          {/* RIGHT PANEL */}
          <form className="hospital-form" onSubmit={handleSubmit}>
            <div className="hospital-form-grid">

              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                name="age"
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />

              {/* MOBILE */}
              <input
                name="mobile"
                placeholder="+91XXXXXXXXXX"
                value={formData.mobile}
                onChange={handleChange}
                required
              />

              {/* WHATSAPP */}
              <input
                name="whatsapp"
                placeholder="+91XXXXXXXXXX"
                value={formData.whatsapp}
                onChange={handleChange}
              />

              <input
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />

              <textarea
                name="message"
                placeholder="Tell us how we can assist you"
                value={formData.message}
                onChange={handleChange}
              />

              {/* Honeypot */}
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="hp-field"
                autoComplete="off"
              />

              {/* Consent */}
              <div className="hospital-consent">
                <label>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/privacy-policy" target="_blank" rel="noreferrer">
                      Privacy Policy
                    </a>
                    ,{" "}
                    <a href="/terms-and-conditions" target="_blank" rel="noreferrer">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/medical-disclaimer" target="_blank" rel="noreferrer">
                      Medical Disclaimer
                    </a>.
                  </span>
                </label>
              </div>

            </div>

            <button disabled={submitting}>
              {submitting ? "Submitting..." : "Request Assistance"}
            </button>

            {message && <p className="hospital-message">{message}</p>}
          </form>

        </div>
      </div>
    </div>
  );
}