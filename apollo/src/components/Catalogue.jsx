// =============================================
// 📁 src/components/Catalogue.jsx
// Premium service catalogue — homepage section
// =============================================

import React from "react";
import { Link } from "react-router-dom";
import "./CSS/Catalogue.css";

import opdIcon        from "../assets/opd-icon.png";
import telemedicineIcon from "../assets/telemedcine-icon.png";
import docVisitIcon   from "../assets/doctor-visits-icon.png";
import labIcon        from "../assets/flask.png";

const services = [
  {
    title: "OPD Consultation",
    desc: "Meet top Apollo specialists visiting Guwahati at our clinic.",
    icon: opdIcon,
    link: "/services/opd",
  },
  {
    title: "Telemedicine",
    desc: "Video & audio consults with doctors from anywhere in India.",
    icon: telemedicineIcon,
    link: "/services/telemedicine",
  },
  {
    title: "Hospital Visits",
    desc: "End-to-end coordination for your Apollo Hospital visit.",
    icon: docVisitIcon,
    link: "/services/hospital-visit",
  },
  {
    title: "Support Services",
    desc: "Travel, accommodation & diagnostics — all taken care of.",
    icon: labIcon,
    link: "/services/support-services",
  },
];

export default function Catalogue() {
  return (
    <section className="catalogue-section">
      <div className="catalogue-container">

        {/* Section Header */}
        <div className="catalogue-header">
          <span className="catalogue-label">Our Services</span>
          <h2>Everything You Need, <span>Under One Roof</span></h2>
          <p>
            From specialist consultations to travel and accommodation — we make
            your healthcare journey seamless and stress-free.
          </p>
          <div className="catalogue-divider" />
        </div>

        {/* Cards Grid */}
        <div className="catalogue-grid">
          {services.map((item, index) => (
            <Link key={index} to={item.link} className="catalogue-card">

              <div className="catalogue-icon-wrap">
                <img src={item.icon} alt={item.title} className="catalogue-icon" />
              </div>

              <div className="catalogue-content">
                <h3 className="catalogue-title">{item.title}</h3>
                <p className="catalogue-desc">{item.desc}</p>
                <span className="catalogue-cta">Know More →</span>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
