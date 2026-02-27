// ============================================
// 📁 LeftSidebar.jsx
// Desktop: Sticky sidebar
// Mobile: Slide drawer (controlled by parent)
// ============================================

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./CSS/LeftSidebar.css";

export default function LeftSidebar({
  visitType = "All",
  collapsed = true,
  setCollapsed = () => {},
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(true);

  // =============================================
  // FETCH SPECIALTIES
  // =============================================
  useEffect(() => {
    let isMounted = true;

    async function fetchSpecialties() {
      try {
        const res = await api.get("/api/specialties");
        if (isMounted) {
          setSpecialties(res.data || []);
        }
      } catch {
        if (isMounted) {
          setSpecialties([]);
        }
      } finally {
        if (isMounted) {
          setLoadingSpecs(false);
        }
      }
    }

    fetchSpecialties();

    return () => {
      isMounted = false;
    };
  }, []);

  // =============================================
  // CLOSE DRAWER ON ROUTE CHANGE (MOBILE)
  // =============================================
  useEffect(() => {
    setCollapsed(true);
  }, [location.pathname, setCollapsed]);

  // =============================================
  // HELPERS
  // =============================================
  const navigateAndClose = (url) => {
    setCollapsed(true);
    navigate(url);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigateAndClose(
      `/doctors?q=${encodeURIComponent(search.trim())}`
    );
  };

  const visitButtons = [
    { label: "OPD", icon: "🏥" },
    { label: "Telemedicine", icon: "💻" },
  ];

  // =============================================
  // RENDER
  // =============================================
  return (
    <>
      {/* OVERLAY — MOBILE ONLY */}
      {!collapsed && (
        <div
          className="doctor-sidebar-overlay"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`doctor-sidebar ${
          collapsed ? "collapsed" : "open"
        }`}
      >
        {/* CLOSE BUTTON (Mobile Only) */}
        <button
          className="doctor-sidebar-close"
          onClick={() => setCollapsed(true)}
          aria-label="Close Filters"
        >
          ✕
        </button>

        <div className="doctor-sidebar-content">

          {/* ===================================== */}
          {/* FIND DOCTORS */}
          {/* ===================================== */}

          <div className="doctor-sidebar-section">
            <h3 className="doctor-sidebar-title">
              Find Doctors
            </h3>

            <form
              className="doctor-filter-group"
              onSubmit={handleSearch}
            >
              <label>Doctor Name</label>
              <input
                type="text"
                placeholder="Search doctor..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
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
                  onChange={(e) => {
                    if (!e.target.value) return;
                    navigateAndClose(
                      `/specialty/${e.target.value}`
                    );
                  }}
                >
                  <option value="">
                    Select specialty
                  </option>
                  {specialties.map((spec) => (
                    <option
                      key={spec._id}
                      value={spec.slug}
                    >
                      {spec.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* ===================================== */}
          {/* VISIT TYPES */}
          {/* ===================================== */}

          <div className="doctor-sidebar-group">
            {visitButtons.map(({ label, icon }) => (
              <button
                key={label}
                className={`doctor-btn ${
                  visitType === label
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  navigateAndClose(
                    `/doctors?visitType=${label}`
                  )
                }
              >
                <span className="doctor-btn-icon">
                  {icon}
                </span>
                {label}
              </button>
            ))}

            <button
              className="doctor-btn"
              onClick={() =>
                navigateAndClose(
                  "/hospital-request"
                )
              }
            >
              <span className="doctor-btn-icon">
                🧪
              </span>
              Hospital Visit
            </button>
          </div>

          <div className="doctor-sidebar-divider" />

          {/* ===================================== */}
          {/* SERVICES */}
          {/* ===================================== */}

          <div className="doctor-sidebar-group">
            <button
              className="doctor-btn"
              onClick={() =>
                navigateAndClose(
                  "/diagnostic-tests"
                )
              }
            >
              <span className="doctor-btn-icon">
                🧪
              </span>
              Diagnostic Tests
            </button>

            <button
              className="doctor-btn"
              onClick={() =>
                navigateAndClose(
                  "/accommodation"
                )
              }
            >
              <span className="doctor-btn-icon">
                🏠
              </span>
              Accommodation
            </button>

            <button
              className="doctor-btn"
              onClick={() =>
                navigateAndClose(
                  "/medical-transport"
                )
              }
            >
              <span className="doctor-btn-icon">
                🚑
              </span>
              Medical Transport
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}