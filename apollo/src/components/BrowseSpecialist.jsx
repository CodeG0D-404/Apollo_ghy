// =============================================
// 📁 src/components/BrowseSpecialist.jsx
// Public — Browse medical specialties
// Scoped, responsive, production safe
// =============================================

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./CSS/BrowseSpecialist.css";
import doctorIcon from "../assets/doctor-icon.png";

export default function BrowseSpecialist() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const res = await api.get(`${API_BASE}/api/specialties`);
        setSpecialties(res.data || []);
      } catch {
        setError("Unable to load specialties");
      } finally {
        setLoading(false);
      }
    }

    fetchSpecialties();
  }, []);

  return (
    <section className="browse-spec-section">

      <div className="browse-spec-container">

        <h2 className="browse-spec-title">
          Our Medical Specialties
        </h2>

        {/* Loading */}
        {loading && (
          <div className="browse-spec-state">
            Loading specialties…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="browse-spec-state browse-spec-error">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && specialties.length === 0 && (
          <div className="browse-spec-state">
            No specialties available
          </div>
        )}

        {/* Grid */}
        {!loading && !error && specialties.length > 0 && (
          <div className="browse-spec-grid">
            {specialties.map((spec) => (
              <Link
                key={spec._id}
                to={`/specialty/${spec.slug}`}
                className="browse-spec-card"
              >
                <img
                  src={doctorIcon}
                  alt={spec.name}
                  className="browse-spec-icon"
                />

                <span className="browse-spec-name">
                  {spec.name}
                </span>
              </Link>
            ))}
          </div>
        )}

      </div>

    </section>
  );
}
