// =============================================
// 📁 src/pages/DoctorProfile.jsx
// Public Doctor Profile
// Clean Layout + Mobile Filter Integration
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

  // =============================================
  // FETCH DOCTOR
  // =============================================
  useEffect(() => {
    let isMounted = true;

    async function fetchDoctor() {
      try {
        const res = await getPublicDoctorById(id);
        if (isMounted) {
          setDoctor(res.data);
        }
      } catch (err) {
        console.error("Doctor fetch failed:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDoctor();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="doctor-profile-state">
        Loading doctor details…
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile-state">
        Doctor not found
      </div>
    );
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
      {/* MOBILE FILTER BAR */}
      <MobileFilterBar onOpen={() => setCollapsed(false)} />

      <div className="doctor-profile-page">

        <div className="doctor-profile-layout">

          {/* SIDEBAR */}
          <LeftSidebar
            visitType="All"
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          {/* MAIN CONTENT */}
          <div className="doctor-profile-content">

            {/* PROFILE CARD */}
            <div className="doctor-profile-card">

              <div className="doctor-details-page">

                <div className="doctor-details-top">

                  {/* PHOTO */}
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
                        No Photo
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="doctor-details-info">

                    <h2 className="doctor-details-name">
                      {name}
                    </h2>

                    <p>
                      <strong>Specialty:</strong>{" "}
                      {specialty?.name || "N/A"} |{" "}
                      <strong>Qualification:</strong>{" "}
                      {qualification || "N/A"} |{" "}
                      <strong>Experience:</strong>{" "}
                      {experience ? `${experience} yrs` : "N/A"}
                    </p>

                    <p>
                      <strong>Languages:</strong>{" "}
                      {language.length
                        ? language.join(", ")
                        : "N/A"}
                    </p>

                    <p>
                      <strong>Visit Types:</strong>{" "}
                      {visitTypes.length
                        ? visitTypes.join(", ")
                        : "N/A"}
                    </p>

                    {hasOPD && upcomingOpdDates.length > 0 && (
                      <p>
                        <strong>OPD Dates:</strong>{" "}
                        {upcomingOpdDates.map((d, i) => (
                          <span
                            key={i}
                            className="doctor-details-opd-badge"
                          >
                            {new Date(d).toLocaleDateString()}
                          </span>
                        ))}
                      </p>
                    )}

                    {/* ACTION BUTTONS */}
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

                      <h3>Symptoms Treated</h3>

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
                            onClick={() =>
                              setShowAllConditions(
                                (prev) => !prev
                              )
                            }
                          >
                            {showAllConditions
                              ? "Read Less"
                              : "Read More"}
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

      </div>
    </>
  );
}