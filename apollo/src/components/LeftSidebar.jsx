// ============================================
// 📁 src/components/LeftSidebar.jsx
// Unified Buttons + Smart Sticky Mobile Filter Bar
// ============================================

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./CSS/LeftSidebar.css";

export default function LeftSidebar({ visitType }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);
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

  // auto close drawer on route change
  useEffect(() => {
    setCollapsed(true);
  }, [location.pathname]);

  const navigateAndClose = (url) => {
    setCollapsed(true);
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
      <button
        className="doctor-filter-bar"
        onClick={() => setCollapsed(false)}
      >
        ☰ Filters
      </button>

      {/* SIDEBAR */}
      <aside className={`doctor-sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* CLOSE BUTTON (MOBILE) */}
        <button
          className="doctor-sidebar-close"
          onClick={() => setCollapsed(true)}
        >
          ✕ Close
        </button>

        {/* FIND DOCTORS */}
        <div className="doctor-sidebar-section">

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
              <div className="doctor-filter-loading">
                Loading specialties…
              </div>
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
        </div>

        {/* VISIT TYPES */}
        <div className="doctor-sidebar-visit">
          {[
            { label: "OPD", icon: "🏥" },
            { label: "Telemedicine", icon: "💻" },
          ].map(({ label, icon }) => (
            <button
              key={label}
              className={`doctor-btn ${
                visitType === label ? "active" : ""
              }`}
              onClick={() => navigateAndClose(`/doctors?visitType=${label}`)}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}

          <button
            className="doctor-btn"
            onClick={() => navigateAndClose("/hospital-request")}
          >
            🧪 Hospital Visit
          </button>
        </div>

        <div className="doctor-sidebar-divider" />

        {/* SERVICES */}
        <div className="doctor-sidebar-services">
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

      </aside>
    </>
  );
}