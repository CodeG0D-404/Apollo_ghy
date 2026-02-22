// =============================================
// 📁 src/pages/DoctorsList.jsx
// Apollo-style vertical doctor rows (Production)
// =============================================

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

import DoctorCard from "../components/DoctorCard";
import LeftSidebar from "../components/LeftSidebar";

import "./CSS/DoctorsList.css";

export default function DoctorsList() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const visitType = searchParams.get("visitType") || "All";

  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      setError(null);

      try {
        let url = slug
          ? `/api/doctors/specialty/slug/${slug}`
          : `/api/doctors`;

        if (visitType !== "All") {
          url += `?visitType=${visitType}`;
        }

        const res = await axios.get(url);

        if (slug) {
          setDoctors(res.data.doctors || []);
          setSpecialty(res.data.specialty || null);
        } else {
          setDoctors(res.data || []);
          setSpecialty(null);
        }
      } catch {
        setError("Unable to load doctors");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, [slug, visitType]);

  const heading = specialty
    ? `${specialty.name} Doctors`
    : visitType === "All"
    ? "All Doctors"
    : `${visitType} Doctors`;

  return (
    <div className="doctors-page">

      {/* LEFT FILTER SIDEBAR */}
      <LeftSidebar visitType={visitType} />

      {/* MAIN CONTENT */}
      <div className="doctors-content">

        <div className="doctors-header">
          <h1 className="doctors-title">{heading}</h1>
        </div>

        <div className="doctors-card-wrapper">

          {loading && (
            <div className="doctors-state">Loading doctors…</div>
          )}

          {error && (
            <div className="doctors-state doctors-error">
              {error}
            </div>
          )}

          {!loading && !error && doctors.length === 0 && (
            <div className="doctors-state">
              No doctors available
            </div>
          )}

          {!loading && !error && doctors.length > 0 && (
            <div className="doctors-list-rows">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  visitType={visitType}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
