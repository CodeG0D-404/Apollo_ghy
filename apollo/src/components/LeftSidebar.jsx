// ============================================
// 📁 src/components/LeftSidebar.jsx
// Responsive medical filter sidebar
// Desktop: sticky
// Mobile: slide drawer with auto close
// ============================================

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./CSS/LeftSidebar.css";

export default function LeftSidebar({ visitType }) {
  const navigate = useNavigate();
  const location = useLocation();

  // drawer state
  const [collapsed, setCollapsed] = useState(true);

  // doctor search
  const [search, setSearch] = useState("");

  // specialties
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(true);

  useEffect(() => {
    api
      .get("/api/specialties")
      .then((res) => setSpecialties(res.data || []))
      .catch(() => setSpecialties([]))
      .finally(() => setLoadingSpecs(false));
  }, []);

  // auto close drawer when route changes
  useEffect(() => {
    setCollapsed(true);
  }, [location.pathname]);

  // navigate helper
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
      {/* MOBILE FILTER BUTTON */}
      {collapsed && (
        <button
          className="doctor-sidebar-toggle"
          onClick={() => setCollapsed(false)}
        >
          ☰ Filters
        </button>
      )}

      {/* SIDEBAR */}
      <aside className={`doctor-sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* CLOSE BUTTON (MOBILE) */}
        <button
          className="doctor-sidebar-collapse"
          onClick={() => setCollapsed(true)}
        >
          ⬅
        </button>

        {/* FILTER BLOCK */}
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
              className={`doctor-visit-btn ${
                visitType === label ? "active" : ""
              }`}
              onClick={() => navigateAndClose(`/doctors?visitType=${label}`)}
            >
              <span className="icon">{icon}</span>
              {label}
            </button>
          ))}

          <button onClick={() => navigateAndClose("/hospital-request")}>
            🧪 Hospital Visit
          </button>

        </div>

        <div className="doctor-sidebar-divider" />

        {/* SERVICES */}
        <div className="doctor-sidebar-services">

          <button onClick={() => navigateAndClose("/diagnostic-tests")}>
            🧪 Diagnostic Tests
          </button>

          <button onClick={() => navigateAndClose("/accommodation")}>
            🏠 Accommodation
          </button>

          <button onClick={() => navigateAndClose("/medical-transport")}>
            🚑 Medical Transport
          </button>

        </div>

      </aside>
    </>
  );
}