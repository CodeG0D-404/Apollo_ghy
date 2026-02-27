// =============================================
// 📁 src/pages/DoctorsList.jsx
// Apollo-style vertical doctor rows
// Clean Layout + Mobile Filter Integration
// =============================================

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";

import DoctorCard from "../components/DoctorCard";
import LeftSidebar from "../components/LeftSidebar";
import MobileFilterBar from "../components/MobileFilterBar";

import "./Css/DoctorsList.css";

export default function DoctorsList() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const visitType = searchParams.get("visitType") || "All";

  const [collapsed, setCollapsed] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =============================================
  // FETCH DOCTORS
  // =============================================
  useEffect(() => {
    let isMounted = true;

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

        const res = await api.get(url);

        if (!isMounted) return;

        if (slug) {
          setDoctors(res.data.doctors || []);
          setSpecialty(res.data.specialty || null);
        } else {
          setDoctors(res.data || []);
          setSpecialty(null);
        }

      } catch (err) {
        if (isMounted) {
          setError("Unable to load doctors");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDoctors();

    return () => {
      isMounted = false;
    };

  }, [slug, visitType]);

  // =============================================
  // PAGE HEADING
  // =============================================
  const heading = specialty
    ? `${specialty.name} Doctors`
    : visitType === "All"
    ? "All Doctors"
    : `${visitType} Doctors`;

  // =============================================
  // RENDER
  // =============================================
  return (
    <>
      {/* MOBILE FILTER BAR (Must be OUTSIDE layout container) */}
      <MobileFilterBar onOpen={() => setCollapsed(false)} />

      <div className="doctors-page">

        <div className="doctors-layout">

          {/* LEFT SIDEBAR */}
          <LeftSidebar
            visitType={visitType}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          {/* MAIN CONTENT */}
          <div className="doctors-content">

            <div className="doctors-header">
              <h1 className="doctors-title">{heading}</h1>
            </div>

            <div className="doctors-card-wrapper">

              {loading && (
                <div className="doctors-state">
                  Loading doctors…
                </div>
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

      </div>
    </>
  );
}