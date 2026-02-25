// =============================================
// 📁 src/components/DoctorCard.jsx
// Apollo-style Doctor Row (Production)
// =============================================

import React from "react";
import { Link } from "react-router-dom";
import "./CSS/DoctorCard.css";

export default function DoctorCard({ doctor, visitType }) {

  const today = new Date();

  const upcomingOpdDates = (doctor.opdDates || []).filter(
    (date) => new Date(date) >= today
  );

  const API_BASE = import.meta.env.VITE_API_URL || "";

  return (
    <div className="doctor-row">

      {/* LEFT — PHOTO */}
      <div className="doctor-row-photo">
      <img
        src={doctor.photo || "/default-doctor.png"}
        alt={doctor.displayName}
      />
      </div>

      {/* CENTER — MAIN INFO */}
      <div className="doctor-row-main">

        {/* TOP LINE */}
        <div className="doctor-row-topline">

          <div className="doctor-row-name">
            {doctor.displayName}
          </div>

          <div className="doctor-row-specialty">
            {doctor.specialty?.name || "Specialty not available"}
          </div>

          {visitType === "OPD" &&
            doctor.visitTypes?.includes("OPD") &&
            upcomingOpdDates.length > 0 && (
              <div className="doctor-row-opd">
                OPD:
                {upcomingOpdDates.slice(0, 2).map((date) => (
                  <span key={date}>
                    {new Date(date).toLocaleDateString()}
                  </span>
                ))}
              </div>
          )}

          <div className="doctor-row-exp">
            {doctor.experience} yrs exp
          </div>

          <div className="doctor-row-lang">
            {doctor.language?.join(", ")}
          </div>

          <Link
            className="doctor-row-view"
            to={`/doctor/${doctor._id}/${(visitType || "all").toUpperCase()}`}
          >
            View details
          </Link>

        </div>

        {/* SECOND LINE */}
        <div className="doctor-row-bottomline">

          <div className="doctor-row-qualification">
            {doctor.qualification}
          </div>

          <Link
            to={`/booking/${doctor._id}/${visitType}`}
            className="doctor-row-book"
          >
            Book now
          </Link>

        </div>

      </div>

    </div>
  );
}
