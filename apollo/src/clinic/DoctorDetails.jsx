// =============================================
// 📁 src/clinic/DoctorDetails.jsx
// Admin: View Doctor Details
// Scoped styling + deployment ready
// =============================================

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/DoctorDetails.css";

import {
  fetchDoctorById,
  deleteDoctor,
} from "./Services/doctor.service";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllConditions, setShowAllConditions] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    let mounted = true;

    const loadDoctor = async () => {
      try {
        const res = await fetchDoctorById(id);
        if (mounted) setDoctor(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch doctor:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDoctor();
    return () => (mounted = false);
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await deleteDoctor(id);
      navigate("/clinic/doctors");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete doctor");
    }
  };

  if (loading)
    return <p className="doctor-details-loading">Loading…</p>;
  if (!doctor)
    return <p className="doctor-details-error">Doctor not found</p>;

  const {
    name,
    specialty,
    qualification,
    experience,
    language = [],
    visitTypes = [],
    opdDates = [],
    photo,
    bio,
    conditionsTreated = [],
  } = doctor;

  const visibleConditions = showAllConditions
    ? conditionsTreated
    : conditionsTreated.slice(0, 12);

  return (
    <div className="doctor-details-page">
      {/* TOP SECTION */}
      <div className="doctor-details-top">
        <div className="doctor-details-photo">
          {photo ? (
            <img src={`${BASE_URL}/${photo}`} alt={name} />
          ) : (
            <div className="doctor-details-no-photo">No Photo</div>
          )}
        </div>

        <div className="doctor-details-info">
          <h2 className="doctor-details-name">{doctor.displayName || `Dr. ${name}`}</h2>

          <p>
            <strong>Specialty:</strong> {specialty?.name || "N/A"} |{" "}
            <strong>Qualification:</strong> {qualification || "N/A"} |{" "}
            <strong>Experience:</strong>{" "}
            {experience ? `${experience} yrs` : "N/A"}
          </p>

          <p>
            <strong>Languages:</strong>{" "}
            {language.length ? language.join(", ") : "N/A"}
          </p>

          <p>
            <strong>Visit Types:</strong>{" "}
            {visitTypes.length ? visitTypes.join(", ") : "N/A"}
          </p>
        </div>
      </div>

      {/* ADDITIONAL INFO */}
      <div className="doctor-details-extra">
        <p>
          <strong>OPD Dates:</strong>{" "}
          {opdDates.length ? (
            opdDates.map((d, i) => (
              <span key={i} className="doctor-details-opd-badge">
                {new Date(d).toLocaleDateString()}
              </span>
            ))
          ) : (
            "N/A"
          )}
        </p>

        <p className="doctor-details-bio">
          <strong>Bio:</strong> {bio || "N/A"}
        </p>

        <div className="doctor-details-conditions">
          <h3>Conditions Treated</h3>

          <div className="doctor-details-conditions-grid">
            {visibleConditions.map((c, i) => (
              <span
                key={c._id || i}
                className="doctor-details-condition-badge"
              >
                {c.name}
              </span>
            ))}
          </div>

          {conditionsTreated.length > 12 && (
            <button
              className="doctor-details-show-btn"
              onClick={() => setShowAllConditions((p) => !p)}
            >
              {showAllConditions ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="doctor-details-actions">
        <button
          className="doctor-details-btn doctor-details-edit"
          onClick={() => navigate(`/clinic/doctors/${id}/edit`)}
        >
          Edit
        </button>

        <button
          className="doctor-details-btn doctor-details-delete"
          onClick={handleDelete}
        >
          Delete
        </button>

        <button
          className="doctor-details-btn doctor-details-back"
          onClick={() => navigate("/clinic/doctors")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default DoctorDetails;
