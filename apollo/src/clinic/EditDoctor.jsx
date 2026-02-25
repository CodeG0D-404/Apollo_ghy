// =============================================
// 📁 src/clinic/EditDoctor.jsx
// Admin: Edit Doctor
// Scoped styling + deployment ready
// =============================================

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/EditDoctor.css";

import {
  fetchDoctorById,
  updateDoctor,
} from "./Services/doctor.service";

import axios from "axios";

const VISIT_TYPES = ["OPD", "Telemedicine", "Hospital Visit"];
const LANGUAGE_OPTIONS = [
  "Hindi","English","Bengali","Tamil","Telugu",
  "Assamese","Marathi","Gujarati","Kannada",
  "Malayalam","Odia","Punjabi",
];

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [allConditions, setAllConditions] = useState([]);
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    specialty: "",
    experience: "",
    language: [],
    visitTypes: [],
    opdDates: [],
    bio: "",
    conditionsTreated: [],
    photo: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data: doctor } = await fetchDoctorById(id);

        setFormData({
          name: doctor.name || "",
          qualification: doctor.qualification || "",
          specialty: doctor.specialty?._id || "",
          experience: doctor.experience || "",
          language: doctor.language || [],
          visitTypes: doctor.visitTypes || [],
          opdDates: doctor.opdDates || [],
          bio: doctor.bio || "",
          conditionsTreated: doctor.conditionsTreated || [],
          photo: null,
        });

        if (doctor.photo) {
          const url = doctor.photo.startsWith("http")
            ? doctor.photo
            : `${BASE_URL}/${doctor.photo.replace(/^\/+/, "")}`;
          setPreviewPhoto(url);
        }

        const [condRes, specRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/conditions`),
          axios.get(`${BASE_URL}/api/specialties`),
        ]);

        setAllConditions(condRes.data || []);
        setAllSpecialties(specRes.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load doctor");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const toggleArray = (key, value) => {
    setFormData((p) => ({
      ...p,
      [key]: p[key].includes(value)
        ? p[key].filter((v) => v !== value)
        : [...p[key], value],
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((p) => ({ ...p, photo: file }));
    setPreviewPhoto(URL.createObjectURL(file));
  };

  const addOpdDate = (e) => {
    const date = e.target.value;
    if (date && !formData.opdDates.includes(date)) {
      setFormData((p) => ({ ...p, opdDates: [...p.opdDates, date] }));
    }
    e.target.value = "";
  };

  const removeOpdDate = (date) => {
    setFormData((p) => ({
      ...p,
      opdDates: p.opdDates.filter((d) => d !== date),
    }));
  };

  const addCondition = (c) => {
    if (!formData.conditionsTreated.some((x) => x._id === c._id)) {
      setFormData((p) => ({
        ...p,
        conditionsTreated: [...p.conditionsTreated, c],
      }));
    }
    setSearchTerm("");
  };

  const removeCondition = (id) => {
    setFormData((p) => ({
      ...p,
      conditionsTreated: p.conditionsTreated.filter((c) => c._id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k === "conditionsTreated") {
        fd.append(k, JSON.stringify(v.map((c) => c._id)));
      } else if (Array.isArray(v)) {
        fd.append(k, JSON.stringify(v));
      } else {
        fd.append(k, v);
      }
    });

    try {
      await updateDoctor(id, fd);
      alert("Doctor updated");
      navigate(`/clinic/doctors/${id}`);
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <p className="edit-doctor-loading">Loading…</p>;

  return (
    <div className="edit-doctor-page">
      <h2 className="edit-doctor-title">Edit Doctor</h2>

      <form onSubmit={handleSubmit} className="edit-doctor-form">

        {/* PHOTO */}
        <div className="edit-doctor-photo-box">
          {previewPhoto ? (
            <img src={previewPhoto} alt="Doctor" />
          ) : (
            <div className="edit-doctor-photo-placeholder">No Photo</div>
          )}
          <input type="file" onChange={handlePhoto} />
        </div>

        {/* BASIC INFO */}
        <div className="edit-doctor-grid">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification" />
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience (yrs)" />

          <select name="specialty" value={formData.specialty} onChange={handleChange}>
            <option value="">Select Specialty</option>
            {allSpecialties.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* LANGUAGES */}
        <div className="edit-doctor-check-group">
          {LANGUAGE_OPTIONS.map((l) => (
            <label key={l}>
              <input type="checkbox" checked={formData.language.includes(l)} onChange={() => toggleArray("language", l)} />
              {l}
            </label>
          ))}
        </div>

        {/* VISIT TYPES */}
        <div className="edit-doctor-check-group">
          {VISIT_TYPES.map((v) => (
            <label key={v}>
              <input type="checkbox" checked={formData.visitTypes.includes(v)} onChange={() => toggleArray("visitTypes", v)} />
              {v}
            </label>
          ))}
        </div>

        {/* OPD */}
        <input type="date" onChange={addOpdDate} />

        <div className="edit-doctor-chips">
          {formData.opdDates.map((d) => (
            <span key={d} onClick={() => removeOpdDate(d)}>{d} ✕</span>
          ))}
        </div>

        {/* BIO */}
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Doctor bio" />

        {/* CONDITIONS */}
        <div className="edit-doctor-condition-box">
          <input
            placeholder="Search condition…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <ul className="edit-doctor-dropdown">
              {allConditions
                .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((c) => (
                  <li key={c._id} onClick={() => addCondition(c)}>
                    {c.name}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="edit-doctor-chips">
          {formData.conditionsTreated.map((c) => (
            <span key={c._id} onClick={() => removeCondition(c._id)}>
              {c.name} ✕
            </span>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="edit-doctor-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;
