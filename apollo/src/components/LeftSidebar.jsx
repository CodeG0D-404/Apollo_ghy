// ============================================
// 📁 src/components/LeftSidebar.jsx
// Stable Layout + Proper Sticky Behavior
// ============================================

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./CSS/LeftSidebar.css";

export default function LeftSidebar({ visitType }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(true);

  useEffect(() => {
    api
      .get("/api/specialties")
      .then((res) => setSpecialties(res.data || []))
      .catch(() => setSpecialties([]))
      .finally(() => setLoadingSpecs(false));
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const navigateAndClose = (url) => {
    setDrawerOpen(false);
    navigate(url);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigateAndClose(`/doctors?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      {/* MOBILE FILTER BAR */}
      <div className="mobile-filter-wrapper">
        <button
          className="mobile-filter-bar"
          onClick={() => setDrawerOpen(true)}
        >
          ☰ Filters
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`doctor-sidebar ${drawerOpen ? "open" : ""}`}>

        {/* CLOSE (MOBILE) */}
        <button
          className="doctor-sidebar-close"
          onClick={() => setDrawerOpen(false)}
        >
          ✕ Close
        </button>

        <div className="doctor-sidebar-content">

          <h3 className="doctor-sidebar-title">Find Doctors</h3>

          <form className="doctor-filter-group" onSubmit={handleSearch}>
            <label>Doctor Name</label>
            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="doctor-filter-group">
            <label>Specialty</label>

            {loadingSpecs ? (
              <div>Loading specialties…</div>
            ) : (
              <select
                defaultValue=""
                onChange={(e) =>
                  e.target.value &&
                  navigateAndClose(`/specialty/${e.target.value}`)
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

          <div className="doctor-section-divider" />

          {/* VISIT TYPES */}
          <div className="doctor-button-group">
            {[
              { label: "OPD", icon: "🏥" },
              { label: "Telemedicine", icon: "💻" },
            ].map(({ label, icon }) => (
              <button
                key={label}
                className={`doctor-btn ${
                  visitType === label ? "active" : ""
                }`}
                onClick={() =>
                  navigateAndClose(`/doctors?visitType=${label}`)
                }
              >
                {icon} {label}
              </button>
            ))}

            <button
              className="doctor-btn"
              onClick={() => navigateAndClose("/hospital-request")}
            >
              🧪 Hospital Visit
            </button>
          </div>

          <div className="doctor-section-divider" />

          {/* SERVICES */}
          <div className="doctor-button-group">
            <button
              className="doctor-btn"
              onClick={() => navigateAndClose("/diagnostic-tests")}
            >
              🧪 Diagnostic Tests
            </button>

            <button
              className="doctor-btn"
              onClick={() => navigateAndClose("/accommodation")}
            >
              🏠 Accommodation
            </button>

            <button
              className="doctor-btn"
              onClick={() => navigateAndClose("/medical-transport")}
            >
              🚑 Medical Transport
            </button>
          </div>

        </div>
      </aside>

      {/* OVERLAY */}
      {drawerOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}