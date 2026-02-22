// =============================================
// 📁 src/components/Catalogue.jsx
// Service catalogue — public homepage section
// Scoped, responsive, router-based navigation
// =============================================

import React from "react";
import { Link } from "react-router-dom";
import "./CSS/Catalogue.css";

import opdIcon from "../assets/opd-icon.png";
import telemedicineIcon from "../assets/telemedcine-icon.png";
import docVisitIcon from "../assets/doctor-visits-icon.png";
import labIcon from "../assets/flask.png";

export default function Catalogue() {

  const services = [
    {
      title: "OPD Consultation",
      icon: opdIcon,
      link: "/services/opd",
    },
    {
      title: "Telemedicine",
      icon: telemedicineIcon,
      link: "/services/telemedicine",
    },
    {
      title: "Hospital Visits",
      icon: docVisitIcon,
      link: "/services/hospital-visit",
    },
    {
      title: "Lab Test",
      icon: labIcon,
      link: "/services/support-services",
    },
  ];

  return (
    <section className="catalogue-section">

      <div className="catalogue-container">

        <div className="catalogue-grid">

          {services.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="catalogue-card"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="catalogue-icon"
              />

              <div className="catalogue-content">
                <h3 className="catalogue-title">
                  {item.title}
                </h3>

                <span className="catalogue-cta">
                  Know More →
                </span>
              </div>
            </Link>
          ))}

        </div>

      </div>

    </section>
  );
}
