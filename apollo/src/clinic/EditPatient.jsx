// =============================================
// 📁 src/clinic/EditPatient.jsx
// Admin: Edit Patient
// Doctor & Specialty independent
// Phones & Emails via APIs
// Selective PATCH updates only
// =============================================

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/EditPatient.css";

import {
  fetchPatientById,
  updatePatient,
  addPatientPhone,
  removePatientPhone,
  setPrimaryPhone,
  addPatientEmail,
  removePatientEmail,
  setPrimaryEmail,
} from "./Services/patient.service";


const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [original, setOriginal] = useState(null);
  const [instantChangesMade, setInstantChangesMade] = useState(false);
  const [notice, setNotice] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    address: "",
    city: "",
    localArea: "",
    zip: "",
    doctorId: "",
    specialtyId: "",
  });

  const [phones, setPhones] = useState([]);
  const [emails, setEmails] = useState([]);

    useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(t);
  }, [notice]);
  
  // =================================================
  // LOAD DATA
  // =================================================
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchPatientById(id);


        setOriginal(data);

        setFormData({
          name: data.name || "",
          age: data.age || "",
          gender: data.gender || "",
          symptoms: data.symptoms || "",
          address: data.address || "",
          city: data.city || "",
          localArea: data.localArea || "",
          zip: data.zip || "",
          doctorId: "",
          specialtyId: "",
        });

        setPhones(data.phones || []);
        setEmails(data.emails || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load patient");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // =================================================
  // INPUT CHANGE
  // =================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // =================================================
  // PATCH DIFF BUILDER
  // =================================================
  const buildPatchPayload = () => {
    const payload = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && formData[key] !== original[key]) {
        payload[key] = formData[key];
      }
    });

    return payload;
  };

  // =================================================
  // SUBMIT
  // =================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPatchPayload();

    if (Object.keys(payload).length === 0) {
      if (instantChangesMade) {
        setNotice({ type: "info", message: "Changes already saved" });
      } else {
        setNotice({ type: "info", message: "No changes made" });
      }
      return;
    }


    try {
      setSaving(true);
      await updatePatient(id, payload);
      setNotice({ type: "success", message: "Patient updated successfully" });
      navigate(`/clinic/patients/${id}`);
    } catch (err) {
      console.error(err);
      setNotice({ type: "error", message: "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  // =================================================
  // REFRESH CONTACTS
  // =================================================
  const refreshPatientContacts = async () => {
    const { data } = await fetchPatientById(id);
    setPhones(data.phones || []);
    setEmails(data.emails || []);
    setOriginal(data);
  };

  // =================================================
  // PHONE MANAGEMENT
  // =================================================
  const handleAddPhone = async () => {
    const number = prompt("Enter phone number (+91XXXXXXXXXX)");
    if (!number) return;

    await addPatientPhone(id, { number });
  setInstantChangesMade(true);
  await refreshPatientContacts();
  };

  const handleRemovePhone = async (number) => {
    if (!window.confirm("Remove this phone?")) return;
      await removePatientPhone(id, { number });
    setInstantChangesMade(true);
    await refreshPatientContacts();
  };

  const handlePrimaryPhone = async (number) => {
    await setPrimaryPhone(id, { number });
    setInstantChangesMade(true);
    await refreshPatientContacts();
};

  const handleWhatsAppPhone = async (number) => {
    await updatePatient(id, { whatsapp: number });
    setInstantChangesMade(true);
    await refreshPatientContacts();
  };
  

  // =================================================
  // EMAIL MANAGEMENT
  // =================================================
  const handleAddEmail = async () => {
    const email = prompt("Enter email");
    if (!email) return;

    await addPatientEmail(id, { email });
    setInstantChangesMade(true);
    await refreshPatientContacts();
  };

  const handleRemoveEmail = async (email) => {
    if (!window.confirm("Remove this email?")) return;
    await removePatientEmail(id, { email });
    setInstantChangesMade(true);
    await refreshPatientContacts();
  };

  const handlePrimaryEmail = async (email) => {
    await setPrimaryEmail(id, { email });
    setInstantChangesMade(true);
    await refreshPatientContacts();
  };

  if (loading) return <p className="edit-patient-loading">Loading…</p>;

  return (
    <div className="edit-patient-page">
      <h2>Edit Patient</h2>

          {notice && (
      <div className={`notice ${notice.type}`}>
        {notice.message}
        <button onClick={() => setNotice(null)}>✕</button>
      </div>
    )}


      <form onSubmit={handleSubmit} className="edit-patient-form">

        {/* BASIC INFO */}
        <div className="edit-patient-grid">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" type="number" />

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} placeholder="Symptoms" />
        </div>

        {/* ADDRESS */}
        <div className="edit-patient-grid">
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
          <input name="localArea" value={formData.localArea} onChange={handleChange} placeholder="Local Area" />
          <input name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP" />
        </div>

        {/* PHONES */}
        <h3>Phones</h3>
        <div className="edit-patient-chips">
          {phones.map((p) => (
            <span key={p.number}>
              {p.number}
              {p.isPrimary && <span title="Primary"> ★ </span>}
              {p.isWhatsApp && <span title="WhatsApp"> 🟢 </span>}

              <button type="button" onClick={() => handlePrimaryPhone(p.number)}>Primary</button>
              <button type="button" onClick={() => handleWhatsAppPhone(p.number)}>WhatsApp</button>
              <button type="button" onClick={() => handleRemovePhone(p.number)}>✕</button>
            </span>
          ))}
          <button type="button" onClick={handleAddPhone}>+ Add Phone</button>
        </div>

        {/* EMAILS */}
        <h3>Emails</h3>
        <div className="edit-patient-chips">
          {emails.map((e) => (
            <span key={e.email}>
              {e.email} {e.label === "Primary" && "★"}
              <button type="button" onClick={() => handlePrimaryEmail(e.email)}>Primary</button>
              <button type="button" onClick={() => handleRemoveEmail(e.email)}>✕</button>
            </span>
          ))}
          <button type="button" onClick={handleAddEmail}>+ Add Email</button>
        </div>

        {/* ACTIONS */}
        <div className="edit-patient-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>

          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditPatient;
