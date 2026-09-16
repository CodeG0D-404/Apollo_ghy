// =============================================
// 📁 src/pages/DoctorsList.jsx
// Apollo-style vertical doctor rows
// Clean Layout + Mobile Filter Integration
// =============================================

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { MOCK_DOCTORS, MOCK_SPECIALTIES } from "../services/mockData";

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

  const q = searchParams.get("q") || "";

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

        const queryParams = [];
        if (visitType !== "All") {
          queryParams.push(`visitType=${visitType}`);
        }
        if (q) {
          queryParams.push(`q=${encodeURIComponent(q)}`);
        }
        if (queryParams.length > 0) {
          url += (url.includes("?") ? "&" : "?") + queryParams.join("&");
        }

        const res = await api.get(url);

        if (!isMounted) return;

        if (slug) {
          let list = Array.isArray(res.data?.doctors) && res.data.doctors.length > 0
            ? res.data.doctors
            : Array.isArray(res.data) && res.data.length > 0
            ? res.data
            : MOCK_DOCTORS.filter(
                (d) => d.specialty?.slug?.toLowerCase() === slug.toLowerCase()
              );
          if (list.length === 0) list = MOCK_DOCTORS.slice(0, 3);
          setDoctors(list);
          setSpecialty(
            res.data?.specialty ||
            MOCK_SPECIALTIES.find((s) => s.slug.toLowerCase() === slug.toLowerCase()) ||
            { name: slug.charAt(0).toUpperCase() + slug.slice(1), slug }
          );
        } else {
          let list = Array.isArray(res.data) && res.data.length > 0
            ? res.data
            : Array.isArray(res.data?.doctors) && res.data.doctors.length > 0
            ? res.data.doctors
            : MOCK_DOCTORS;

          if (visitType && visitType !== "All") {
            list = list.filter((d) => Array.isArray(d.visitTypes) && d.visitTypes.includes(visitType));
          }
          if (q) {
            const qLower = q.toLowerCase();
            list = list.filter(
              (d) =>
                d.name?.toLowerCase().includes(qLower) ||
                d.displayName?.toLowerCase().includes(qLower) ||
                d.specialty?.name?.toLowerCase().includes(qLower)
            );
          }
          setDoctors(list);
          setSpecialty(null);
        }

      } catch (err) {
        if (isMounted) {
          console.warn("API doctors fetch failed, using fallback:", err);
          let list = [...MOCK_DOCTORS];
          if (slug) {
            list = list.filter(
              (d) => d.specialty?.slug?.toLowerCase() === slug.toLowerCase()
            );
            if (list.length === 0) list = MOCK_DOCTORS.slice(0, 3);
            setSpecialty(
              MOCK_SPECIALTIES.find((s) => s.slug.toLowerCase() === slug.toLowerCase()) ||
              { name: slug.charAt(0).toUpperCase() + slug.slice(1), slug }
            );
          } else {
            if (visitType && visitType !== "All") {
              list = list.filter((d) => Array.isArray(d.visitTypes) && d.visitTypes.includes(visitType));
            }
            setSpecialty(null);
          }
          setDoctors(list);
          setError(null);
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

  }, [slug, visitType, q]);

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

              {!loading && !error && (!Array.isArray(doctors) || doctors.length === 0) && (
                <div className="doctors-state">
                  No doctors available
                </div>
              )}

              {!loading && !error && Array.isArray(doctors) && doctors.length > 0 && (
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