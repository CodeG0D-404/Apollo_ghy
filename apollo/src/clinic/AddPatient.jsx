// =============================================
// 📁 src/clinic/AddPatient.jsx
// Add Patient — Production Ready
// Dynamic phones/emails | Schema aligned
// =============================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AddPatient.css";

import { createPatient } from "./Services/patient.service";

const AddPatient = () => {
  const navigate = useNavigate();

  // =================================================
  // FORM STATE
  // =================================================
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    symptoms: "",
    address: "",
    city: "",
    localArea: "",
    zip: "",
    mobile: "",
    whatsapp: "",
    email: "",
  });

  const [phones, setPhones] = useState([]);
  const [emails, setEmails] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =================================================
  // INPUT HANDLERS
  // =================================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Phones
  const addPhone = () => {
    if (phones.length >= 4) return alert("Max 4 extra phones allowed");
    setPhones([...phones, { number: "", label: "Secondary" }]);
  };

  const updatePhone = (index, field, value) => {
    const updated = [...phones];
    updated[index][field] = value;
    setPhones(updated);
  };

  const removePhone = (index) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  // Emails
  const addEmail = () => {
    setEmails([...emails, { email: "", label: "Secondary" }]);
  };

  const updateEmail = (index, field, value) => {
    const updated = [...emails];
    updated[index][field] = value;
    setEmails(updated);
  };

  const removeEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  // =================================================
  // SUBMIT
  // =================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        phones: phones.filter((p) => p.number.trim() !== ""),
        emails: emails.filter((e) => e.email.trim() !== ""),
      };

      await createPatient(payload);

      alert("Patient created successfully");
      navigate("/clinic/patients");
    } catch (err) {
      console.error("❌ Failed to create patient:", err);
      setError(err.response?.data?.error || "Failed to create patient");
    } finally {
      setLoading(false);
    }
  };

  // =================================================
  // RENDER
  // =================================================
  return (
    <div className="add-patient-page">
      <h2>Add Patient</h2>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="patient-form">

        {/* ================= CORE INFO ================= */}
        <h3>Basic Info</h3>

        <input name="name" placeholder="Full Name" required onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" required onChange={handleChange} />

        <select name="gender" onChange={handleChange}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <textarea
          name="symptoms"
          placeholder="Symptoms / Reason for visit"
          required
          onChange={handleChange}
        />

        {/* ================= ADDRESS ================= */}
        <h3>Address</h3>

        <input name="address" placeholder="Address" required onChange={handleChange} />
        <input name="city" placeholder="City" required onChange={handleChange} />
        <input name="localArea" placeholder="Local Area" onChange={handleChange} />
        <input name="zip" placeholder="ZIP Code" required onChange={handleChange} />

        {/* ================= PRIMARY CONTACT ================= */}
        <h3>Primary Contact</h3>

        <input
          name="mobile"
          placeholder="Primary Mobile (+91XXXXXXXXXX)"
          required
          onChange={handleChange}
        />

        <input
          name="whatsapp"
          placeholder="WhatsApp Number (optional)"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Primary Email (optional)"
          onChange={handleChange}
        />

        {/* ================= EXTRA PHONES ================= */}
        <h3>Additional Phones</h3>

        {phones.map((p, i) => (
          <div key={i} className="dynamic-row">
            <input
              placeholder="Phone Number"
              value={p.number}
              onChange={(e) => updatePhone(i, "number", e.target.value)}
            />

            <select
              value={p.label}
              onChange={(e) => updatePhone(i, "label", e.target.value)}
            >
              <option>Secondary</option>
              <option>WhatsApp</option>
              <option>Home</option>
              <option>Other</option>
            </select>

            <button type="button" onClick={() => removePhone(i)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addPhone}>
          + Add Phone
        </button>

        {/* ================= EXTRA EMAILS ================= */}
        <h3>Additional Emails</h3>

        {emails.map((e, i) => (
          <div key={i} className="dynamic-row">
            <input
              placeholder="Email"
              value={e.email}
              onChange={(ev) => updateEmail(i, "email", ev.target.value)}
            />

            <select
              value={e.label}
              onChange={(ev) => updateEmail(i, "label", ev.target.value)}
            >
              <option>Secondary</option>
              <option>Personal</option>
              <option>Work</option>
              <option>Family</option>
              <option>Other</option>
            </select>

            <button type="button" onClick={() => removeEmail(i)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addEmail}>
          + Add Email
        </button>

        {/* ================= SUBMIT ================= */}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Patient"}
          </button>

          <button type="button" onClick={() => navigate("/clinic/patients")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;
