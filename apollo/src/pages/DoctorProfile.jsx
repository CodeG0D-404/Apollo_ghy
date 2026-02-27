// =============================================
// 📁 src/pages/DoctorProfile.jsx
// Public Doctor Profile — Premium Version
// =============================================

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicDoctorById } from "./services/publicDoctor.service";

import LeftSidebar from "../components/LeftSidebar";
import MobileFilterBar from "../components/MobileFilterBar";
import TestimonialSlider from "../components/TestimonialSlider";
import CallCTA from "../components/CallCTA";

import "./Css/DoctorProfile.css";

export default function DoctorProfile() {
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllConditions, setShowAllConditions] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    let isMounted = true;

    async function fetchDoctor() {
      try {
        const res = await getPublicDoctorById(id);
        if (isMounted) setDoctor(res.data);
      } catch (err) {
        console.error("Doctor fetch failed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDoctor();
    return () => (isMounted = false);
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
    <>
      <MobileFilterBar onOpen={() => setCollapsed(false)} />

      <div className="doctor-profile-page">
        <div className="doctor-profile-layout">

          <LeftSidebar
            visitType="All"
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          <div className="doctor-profile-content">

            <div className="doctor-profile-card">
              <div className="doctor-details-page">

                {/* ================= TOP SECTION ================= */}
                <div className="doctor-details-top">

                  <div className="doctor-details-photo">
                    {photo ? (
                      <img
                        src={
                          photo.startsWith("http")
                            ? photo
                            : `${API_BASE}/${photo.replace(/^\/+/, "")}`
                        }
                        alt={name}
                      />
                    ) : (
                      <div className="doctor-details-no-photo">
                        No Photo Available
                      </div>
                    )}
                  </div>

                  <div className="doctor-details-info">

                    <h2 className="doctor-details-name">{name}</h2>

                    <p className="doctor-details-specialty">
                      {specialty?.name || "Specialty not specified"}
                    </p>

                    <div className="doctor-meta-grid">

                      <div className="doctor-meta-item">
                        <span>Qualification</span>
                        <strong>{qualification || "N/A"}</strong>
                      </div>

                      <div className="doctor-meta-item">
                        <span>Experience</span>
                        <strong>
                          {experience ? `${experience} Years` : "N/A"}
                        </strong>
                      </div>

                      <div className="doctor-meta-item">
                        <span>Languages</span>
                        <strong>
                          {language.length ? language.join(", ") : "N/A"}
                        </strong>
                      </div>

                      <div className="doctor-meta-item">
                        <span>Consultation Modes</span>
                        <strong>
                          {visitTypes.length ? visitTypes.join(", ") : "N/A"}
                        </strong>
                      </div>

                    </div>

                    {hasOPD && upcomingOpdDates.length > 0 && (
                      <div className="doctor-opd-section">
                        <span className="doctor-opd-label">
                          Upcoming OPD Dates
                        </span>
                        <div className="doctor-opd-wrap">
                          {upcomingOpdDates.map((d, i) => (
                            <span key={i} className="doctor-details-opd-badge">
                              {new Date(d).toLocaleDateString()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="doctor-details-buttons">
                      <Link
                        to={`/booking/${id}/OPD`}
                        className="doctor-row-book"
                      >
                        Book Appointment
                      </Link>

                      <CallCTA label="Speak with Our Team" />
                    </div>

                  </div>
                </div>

                {/* ================= BIO ================= */}
                <div className="doctor-details-extra">
                  <h3>About the Doctor</h3>
                  <p className="doctor-details-bio">
                    {bio || "Professional biography not available at the moment."}
                  </p>
                </div>

                {/* ================= CONDITIONS ================= */}
                {conditionsTreated.length > 0 && (
                  <div className="doctor-details-extra">
                    <h3>Symptoms & Conditions Treated</h3>

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
                          onClick={() => setShowAllConditions((prev) => !prev)}
                        >
                          {showAllConditions ? "Read Less" : "View All"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            <div className="doctor-profile-testimonial">
              <TestimonialSlider title="What Our Patients Say" />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}