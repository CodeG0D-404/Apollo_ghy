// =============================================
// 📁 src/pages/DoctorProfile.jsx
// Public Doctor Profile
// Sidebar layout + Admin Doctor Info UI
// =============================================

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import LeftSidebar from "../components/LeftSidebar";
import TestimonialSlider from "../components/TestimonialSlider";
import CallCTA from "../components/CallCTA";

import "./Css/DoctorProfile.css";

export default function DoctorProfile() {
  const { id, visitType } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllConditions, setShowAllConditions] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await axios.get(`/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Doctor fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctor();
  }, [id]);

  if (loading) {
    return <div className="doctor-profile-state">Loading doctor details…</div>;
  }

  if (!doctor) {
    return <div className="doctor-profile-state">Doctor not found</div>;
  }

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

  const hasOPD = visitTypes.includes("OPD");
  const upcomingOpdDates = hasOPD
    ? opdDates.filter((d) => new Date(d) >= new Date())
    : [];

  return (
    <div className="doctor-profile-page">

      {/* LEFT SIDEBAR */}
      <LeftSidebar visitType={visitType} />

      {/* MAIN CONTENT */}
      <div className="doctor-profile-content">

        {/* CARD */}
        <div className="doctor-profile-card">

          <div className="doctor-details-page">

            {/* TOP SECTION */}
            <div className="doctor-details-top">

              <div className="doctor-details-photo">
                {photo ? (
                  <img src={`${API_BASE}/${photo}`} alt={name} />
                ) : (
                  <div className="doctor-details-no-photo">No Photo</div>
                )}
              </div>

              <div className="doctor-details-info">

                <h2 className="doctor-details-name">{name}</h2>

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

                {/* OPD MOVED HERE */}
                {hasOPD && upcomingOpdDates.length > 0 && (
                  <p>
                    <strong>OPD Dates:</strong>{" "}
                    {upcomingOpdDates.map((d, i) => (
                      <span key={i} className="doctor-details-opd-badge">
                        {new Date(d).toLocaleDateString()}
                      </span>
                    ))}
                  </p>
                )}

                {/* BUTTONS */}
                <div className="doctor-details-buttons">

                  <Link
                    to={`/booking/${id}/${visitType}`}
                    className="doctor-row-book"
                  >
                    Book Appointment
                  </Link>

                  <CallCTA label="Speak with Our Team" />

                </div>

              </div>
            </div>

            {/* BIO */}
            <div className="doctor-details-extra">
              <p className="doctor-details-bio">
                <strong>Bio:</strong> {bio || "N/A"}
              </p>
            </div>

            {/* CONDITIONS */}
            {conditionsTreated.length > 0 && (
              <div className="doctor-details-extra">

                <div className="doctor-details-conditions">

                  <h3>Conditions Treated</h3>

                  <div className="doctor-details-conditions-grid">
                    {(showAllConditions
                      ? conditionsTreated
                      : conditionsTreated.slice(0, 12)
                    ).map((c, i) => (
                      <span
                        key={c._id || i}
                        className="doctor-details-condition-badge"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>

                  {conditionsTreated.length > 12 && (
                    <div className="doctor-details-readmore-wrap">
                      <button
                        className="doctor-details-show-btn"
                        onClick={() => setShowAllConditions(p => !p)}
                      >
                        {showAllConditions ? "Read Less" : "Read More"}
                      </button>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        </div>

        {/* TESTIMONIAL */}
        <div className="doctor-profile-testimonial">
          <TestimonialSlider title="What Our Patients Say" />
        </div>

      </div>
    </div>
  );
}
