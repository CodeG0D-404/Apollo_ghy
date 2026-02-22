// =============================================
// 📁 src/pages/HospitalVisitServices.jsx
// Apollo Information Centre — Hospital Visit Services
// Modern calm + SEO structured + production safe
// Scoped CSS: hosp2-*
// =============================================

import React from "react";
import { Link } from "react-router-dom";
import CallCTA from "../components/CallCTA";
import InquiryCTA from "../components/InquiryCTA";
import "./Css/HospitalVisitServices.css";

import bannerBg from "../assets/banner-bg.png";
import hospitalVisitBanner from "../assets/hospital-visit-hero-illustration.png";

export default function HospitalVisitServices() {
  return (
    <main className="hosp2-page">

      {/* ================= HERO ================= */}
      <section
        className="hosp2-hero"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="hosp2-container hosp2-hero-inner">

          <article className="hosp2-hero-content">
            <h1>Book Hospital Visit at Apollo Hospitals, Chennai</h1>
            <p>
              We assist patients in planning and coordinating OPD visits and
              hospital admissions at Apollo Hospitals, Chennai with clarity
              and confidence.
            </p>
          </article>

          <div className="hosp2-hero-image">
            <img
              src={hospitalVisitBanner}
              alt="Hospital visit coordination at Apollo Hospitals Chennai"
            />
          </div>

        </div>
      </section>

      {/* ================= WHAT IS HOSPITAL VISIT ================= */}
      <section className="hosp2-section">
        <div className="hosp2-container hosp2-center">

          <article className="hosp2-card">
            <header>
              <h2>What Is a Hospital Visit?</h2>
              <div className="hosp2-divider" />
            </header>

            <p className="hosp2-lead">
              A hospital visit involves consulting specialists, undergoing
              evaluations, or receiving advanced care at a hospital facility.
            </p>

            <p>
              Through our Apollo Service Centre, we assist patients with
              planning OPD visits and hospital admissions at Apollo Hospitals,
              Chennai, especially for patients travelling from outside the city.
            </p>

            <p>
              Our role is to guide patients regarding departments,
              specialists, appointment scheduling, and visit coordination
              based on medical requirements.
            </p>

            <p>
              All consultations, procedures, and treatments are provided
              directly by Apollo Hospitals and their medical teams.
            </p>

            <p>
              We do not provide medical treatment or influence medical
              decisions.
            </p>
          </article>

        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="hosp2-section hosp2-soft">
        <div className="hosp2-container">

          <header className="hosp2-section-header">
            <h2>Hospital Visit Support Services</h2>
            <p>
              Organised assistance for smooth hospital visits in Chennai.
            </p>
          </header>

          <div className="hosp2-services-grid">

            <article className="hosp2-service">
              <h3>Specialist OPD Coordination</h3>
              <p>
                Assistance in scheduling OPD consultations with specialists
                at Apollo Hospitals, Chennai.
              </p>
            </article>

            <article className="hosp2-service">
              <h3>Hospital Admission Guidance</h3>
              <p>
                Support with planning admissions, documentation, and visit
                timelines when required.
              </p>
            </article>

            <article className="hosp2-service">
              <h3>Outstation Patient Assistance</h3>
              <p>
                Dedicated support for patients travelling to Chennai,
                including coordination and guidance.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="hosp2-section">
        <div className="hosp2-container">

          <header className="hosp2-section-header">
            <h2>How Hospital Visit Booking Works</h2>
            <p>A structured approach to plan your hospital visit.</p>
          </header>

          <div className="hosp2-process">

            <div className="hosp2-step">
              <span>01</span>
              <h4>Share Medical Requirement</h4>
              <p>
                Patients share medical details and consultation requirements
                with our support team.
              </p>
            </div>

            <div className="hosp2-step">
              <span>02</span>
              <h4>Specialist & Department Guidance</h4>
              <p>
                We assist in identifying suitable departments and specialists
                at Apollo Hospitals, Chennai.
              </p>
            </div>

            <div className="hosp2-step">
              <span>03</span>
              <h4>Visit Planning</h4>
              <p>
                OPD dates, admission needs, and visit timelines are planned
                based on availability.
              </p>
            </div>

            <div className="hosp2-step">
              <span>04</span>
              <h4>On-ground Coordination</h4>
              <p>
                Support with travel, accommodation, and hospital navigation
                during the visit.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TRANSPARENCY ================= */}
      <section className="hosp2-section hosp2-soft">
        <div className="hosp2-container hosp2-center">

          <article className="hosp2-card">
            <header>
              <h2>Medical Transparency</h2>
              <div className="hosp2-divider" />
            </header>

            <ul className="hosp2-list">
              <li>All medical services are provided by Apollo Hospitals.</li>
              <li>The service centre does not provide treatment.</li>
              <li>Medical decisions are made by hospital doctors.</li>
              <li>Our role is limited to coordination and patient support.</li>
            </ul>
          </article>

        </div>
      </section>

            {/* ================= CTA ================= */}
            <section className="opd2-cta">
              <div className="opd2-container opd2-center">
      
                <h2>Plan Your Hospital Visit to Chennai</h2>
                <p>
            Get assistance in planning your hospital visit at Apollo Hospitals,
            Chennai.
                </p>
      
                <div className="opd2-cta-actions">
      
        {/* 1️⃣ View OPD Schedule */}
        <Link
          to={{
            pathname: "/doctors",
            search: "?visitType=OPD",
          }}
          className="opd2-btn-primary"
        >
          Book Your Visit
        </Link>
      
        {/* 2️⃣ Call Clinic (dynamic phone from backend) */}
        <CallCTA label="Speak with Our Team" />
      
        {/* 3️⃣ Request Assistance popup */}
        <InquiryCTA
          label="Request Assistance"
          page="hospital"
          section="general"
        />
      
      </div>
      
              </div>
            </section>

    </main>
  );
}
