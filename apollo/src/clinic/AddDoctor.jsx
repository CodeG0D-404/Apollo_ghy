// =============================================
// 📁 src/clinic/AddDoctor.jsx
// Admin Page: Add a New Doctor
// Production ready + Scoped styling
// =============================================

import React, { useEffect, useState } from "react";
import "./styles/AddDoctor.css";

// Services
import { createDoctor } from "./Services/doctor.service";
import {
  fetchSpecialties,
  createSpecialty,
} from "./Services/specialty.service";

const LANGUAGE_OPTIONS = [
  "Hindi","English","Bengali","Tamil","Telugu",
  "Assamese","Marathi","Gujarati","Kannada",
  "Malayalam","Odia","Punjabi",
];

const VISIT_TYPES = ["OPD", "Telemedicine", "Hospital Visit"];

const AddDoctor = () => {
  // =========================
  // FORM STATE
  // =========================
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [language, setLanguage] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [visitTypes, setVisitTypes] = useState([]);
  const [opdDates, setOpdDates] = useState([]);

  const [specialties, setSpecialties] = useState([]);

  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");

  // =========================
  // FETCH SPECIALTIES (FIXED)
  // =========================
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const res = await fetchSpecialties();

        // supports BOTH:
        // res.data = []
        // res.data = { data: [] }
        const list = res?.data?.data || res?.data || res || [];
        setSpecialties(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch specialties:", err);
      }
    };

    loadSpecialties();
  }, []);

  // =========================
  // HANDLERS
  // =========================

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const toggleArray = (setter, current, value) => {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const handleLanguageChange = (e) =>
    toggleArray(setLanguage, language, e.target.value);

  const handleVisitTypeChange = (e) =>
    toggleArray(setVisitTypes, visitTypes, e.target.value);

  const handleAddOpdDate = (e) => {
    e.preventDefault();
    const date = e.target.previousSibling.value;

    if (date && !opdDates.includes(date)) {
      setOpdDates((prev) => [...prev, date]);
    }
  };

  const handleRemoveOpdDate = (date) =>
    setOpdDates((prev) => prev.filter((d) => d !== date));

  const handleSpecialtyChange = (e) => {
    if (e.target.value === "new") {
      setShowSpecialtyModal(true);
    } else {
      setSpecialty(e.target.value);
    }
  };

  // =========================
  // ADD NEW SPECIALTY
  // =========================
const handleAddSpecialty = async (e) => {
  e.preventDefault();
  try {
    await createSpecialty({ name: newSpecialty });

    // reload specialties from DB
    const res = await fetchSpecialties();
    const list = res?.data?.data || res?.data || res || [];

    if (Array.isArray(list)) {
      setSpecialties(list);

      // select the newly added one
      const last = list[list.length - 1];
      if (last?._id) setSpecialty(last._id);
    }

    setNewSpecialty("");
    setShowSpecialtyModal(false);

    alert("Specialty added");
  } catch (err) {
    console.error("Failed to add specialty:", err);
    alert("Failed to add specialty");
  }
};


  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("qualification", qualification);
      formData.append("experience", experience);

      if (specialty) formData.append("specialty", specialty);
      if (photo) formData.append("photo", photo);

      formData.append("language", JSON.stringify(language));
      formData.append("visitTypes", JSON.stringify(visitTypes));
      formData.append("opdDates", JSON.stringify(opdDates));

      await createDoctor(formData);

      alert("Doctor added successfully");

      // RESET FORM
      setName("");
      setQualification("");
      setExperience("");
      setPhoto(null);
      setPhotoPreview(null);
      setLanguage([]);
      setSpecialty("");
      setVisitTypes([]);
      setOpdDates([]);
    } catch (err) {
      console.error("Failed to add doctor:", err);
      alert("Failed to add doctor");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="add-doctor-page">
      <h2 className="add-doctor-title">Add New Doctor</h2>

      <form className="add-doctor-form" onSubmit={handleSubmit}>
        {/* BASIC INFO */}
        <div className="add-doctor-grid">
          <input
            placeholder="Doctor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="Qualification"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Experience (Years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />

          <select value={specialty} onChange={handleSpecialtyChange} required>
            <option value="">Select Specialty</option>
            <option value="new">Add New</option>

            {Array.isArray(specialties) &&
              specialties.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>

        {/* LANGUAGES */}
        <div className="add-doctor-check-group">
          {LANGUAGE_OPTIONS.map((l) => (
            <label key={l}>
              <input
                type="checkbox"
                value={l}
                checked={language.includes(l)}
                onChange={handleLanguageChange}
              />
              {l}
            </label>
          ))}
        </div>

        {/* VISIT TYPES */}
        <div className="add-doctor-check-group">
          {VISIT_TYPES.map((v) => (
            <label key={v}>
              <input
                type="checkbox"
                value={v}
                checked={visitTypes.includes(v)}
                onChange={handleVisitTypeChange}
              />
              {v}
            </label>
          ))}
        </div>

        {/* OPD */}
        {visitTypes.includes("OPD") && (
          <div className="add-doctor-opd">
            <input type="date" />
            <button onClick={handleAddOpdDate}>Add</button>

            <div className="add-doctor-chips">
              {opdDates.map((d) => (
                <span key={d} onClick={() => handleRemoveOpdDate(d)}>
                  {new Date(d).toLocaleDateString()} ✕
                </span>
              ))}
            </div>
          </div>
        )}

        {/* PHOTO */}
        <div className="add-doctor-photo">
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          {photoPreview && <img src={photoPreview} alt="Preview" />}
        </div>

        <button className="add-doctor-submit">Create Doctor</button>
      </form>

      {/* SPECIALTY MODAL */}
      {showSpecialtyModal && (
        <div className="add-doctor-modal">
          <form onSubmit={handleAddSpecialty}>
            <input
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="Specialty name"
              required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowSpecialtyModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddDoctor;
