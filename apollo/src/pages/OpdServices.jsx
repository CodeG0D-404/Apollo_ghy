// ============================================
// 📁 src/components/LeftSidebar.jsx
// Production — Medical Filter + Service Sidebar
// Doctor filters + CTA driven service requests
// ============================================

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import InquiryCTA from "./InquiryCTA";
import "./CSS/LeftSidebar.css";

export default function LeftSidebar({ visitType }) {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // MOBILE COLLAPSE
  // =========================
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) setCollapsed(true);
  }, []);

  // =========================
  // SEARCH
  // =========================
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/doctors?q=${encodeURIComponent(search.trim())}`);
  };

  // =========================
  // SPECIALTIES FETCH
  // =========================
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(true);

  useEffect(() => {
    api
      .get("/api/specialties")
      .then((res) => setSpecialties(res.data || []))
      .catch(() => setSpecialties([]))
      .finally(() => setLoadingSpecs(false));
  }, []);

  // =========================
  // VISIT TYPES CONFIG
  // =========================
  const visitTypes = [
    { label: "OPD", icon: "🏥" },
    { label: "Telemedicine", icon: "💻" },
  ];

  // =========================
  // SERVICES CTA CONFIG
  // =========================
  const services = [
    {
      label: "Diagnostic Tests",
      icon: "🧪",
      section: "diagnostics",
    },
    {
      label: "Accommodation",
      icon: "🏠",
      section: "accommodation",
    },
    {
      label: "Medical Transport",
      icon: "🚑",
      section: "transport",
    },
    {
      label: "Life Saving Drugs",
      icon: "💊",
      section: "lifesaving-drugs",
    },
  ];

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        className="doctor-sidebar-toggle"
        onClick={() => setCollapsed(false)}
      >
        ☰ Filters
      </button>

      <aside className={`doctor-sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* COLLAPSE BTN */}
        <button
          className="doctor-sidebar-collapse"
          onClick={() => setCollapsed(true)}
        >
          ⬅
        </button>

        {/* =========================
            DOCTOR FILTERS
        ========================= */}
        {!collapsed && (
          <div className="doctor-sidebar-section">

            <h3 className="doctor-sidebar-title">Find Doctors</h3>

            {/* SEARCH */}
            <form className="doctor-filter-group" onSubmit={handleSearch}>
              <label>Doctor Name</label>
              <input
                type="text"
                placeholder="Search doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            {/* SPECIALTY */}
            <div className="doctor-filter-group">
              <label>Specialty</label>

              {loadingSpecs ? (
                <div className="doctor-filter-loading">
                  Loading specialties…
                </div>
              ) : (
                <select
                  defaultValue=""
                  onChange={(e) =>
                    e.target.value &&
                    navigate(`/specialty/${e.target.value}`)
                  }
                >
                  <option value="">Select specialty</option>
                  {specialties.map((spec) => (
                    <option key={spec._id} value={spec.slug}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

          </div>
        )}

        {/* =========================
            VISIT TYPES
        ========================= */}
        <div className="doctor-sidebar-visit">
          {visitTypes.map(({ label, icon }) => (
            <button
              key={label}
              className={`doctor-visit-btn ${
                visitType === label ? "active" : ""
              }`}
              onClick={() => navigate(`/doctors?visitType=${label}`)}
            >
              <span className="icon">{icon}</span>
              {!collapsed && label}
            </button>
          ))}

          {/* Hospital Request */}
          <button
            className={`doctor-visit-btn ${
              location.pathname === "/hospital-request" ? "active" : ""
            }`}
            onClick={() => navigate("/hospital-request")}
          >
            🏨 {!collapsed && "Hospital Visit"}
          </button>
        </div>

        <div className="doctor-sidebar-divider" />

        {/* =========================
            SERVICE REQUEST POPUPS
        ========================= */}
        <div className="doctor-sidebar-services">
          {services.map((service) => (
            <InquiryCTA
              key={service.section}
              label={
                <>
                  {service.icon} {!collapsed && service.label}
                </>
              }
              page="support"
              section={service.section}
            />
          ))}
        </div>

      </aside>
    </>
  );
}