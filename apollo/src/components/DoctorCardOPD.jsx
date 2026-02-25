// =============================================
// 📁 DoctorCardOPD.jsx
// OPD Slider Card — Grid layout
// Photo full height | info stacked | qualification full width
// =============================================

import React from "react";
import { Link } from "react-router-dom";
import "./CSS/DoctorCardOPD.css";

export default function DoctorCardOPD({ doctor }) {

  const API_BASE = import.meta.env.VITE_API_URL || "";

  const today = new Date();

  const upcomingOpdDates = (doctor.opdDates || []).filter(
    (date) => new Date(date) >= today
  );

  return (
    <Link to={`/doctor/${doctor._id}/OPD`} className="opd-card">
        <div className="d-flex opd-card-main">
            {/* PHOTO */}
            <div className="opd-card-photo">
            <img
              src={
                doctor.photo
                  ? doctor.photo.startsWith("http")
                    ? doctor.photo
                    : `${API_BASE}/${doctor.photo.replace(/^\/+/, "")}`
                  : "/default-doctor.png"
              }
              alt={doctor.displayName}
            />
            </div>
            <div>
                {/* NAME */}
                <div className="opd-card-name">
                    {doctor.displayName}
                </div>

                {/* DATE */}
                <div className="opd-card-date">
                    {upcomingOpdDates.length > 0
                    ? `Next OPD: ${new Date(upcomingOpdDates[0]).toLocaleDateString()}`
                    : "No upcoming OPD"}
                </div>

                {/* META */}
                <div className="opd-card-meta">
                    {doctor.experience} yrs • {doctor.language?.join(", ")}
                </div>

            </div>
        </div>
      

      
      {/* QUALIFICATION */}
      <div className="opd-card-qualification">
        {doctor.qualification}
      </div>

    </Link>
  );
}
