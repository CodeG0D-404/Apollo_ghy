// ============================================
// 📁 src/components/LeftSidebar.jsx
// Production — Sticky medical filter sidebar
// Styled to match DoctorRow + DoctorsList
// ============================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/LeftSidebar.css";

export default function LeftSidebar({ visitType }) {
  const navigate = useNavigate();

  // mobile collapse state
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) setCollapsed(true);
  }, []);

  // doctor search
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/doctors?q=${encodeURIComponent(search.trim())}`);
  };

  // specialties
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(true);

  useEffect(() => {
    axios
      .get("/api/specialties")
      .then((res) => setSpecialties(res.data || []))
      .catch(() => setSpecialties([]))
      .finally(() => setLoadingSpecs(false));
  }, []);

  return (
    <>
      {/* MOBILE OPEN BUTTON */}
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

        {/* FILTER BLOCK */}
        {!collapsed && (
          <div className="doctor-sidebar-section">

            <h3 className="doctor-sidebar-title">
              Find Doctors
            </h3>

            {/* SEARCH */}
            <form
              className="doctor-filter-group"
              onSubmit={handleSearch}
            >
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

        {/* VISIT TYPES */}
        <div className="doctor-sidebar-visit">

          {[
            { label: "OPD", icon: "🏥" },
            { label: "Telemedicine", icon: "💻" },
            { label: "Hospital Visit", icon: "🏨" }
          ].map(({ label, icon }) => (
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

        </div>

        <div className="doctor-sidebar-divider" />

        {/* SERVICES */}
        <div className="doctor-sidebar-services">

          <button onClick={() => navigate("/diagnostic-tests")}>
            🧪 {!collapsed && "Diagnostic Tests"}
          </button>

          <button onClick={() => navigate("/accommodation")}>
            🏠 {!collapsed && "Accommodation"}
          </button>

          <button onClick={() => navigate("/medical-transport")}>
            🚑 {!collapsed && "Medical Transport"}
          </button>

        </div>

      </aside>
    </>
  );
}
