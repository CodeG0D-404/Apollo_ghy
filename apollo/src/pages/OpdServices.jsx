// =============================================
// 📁 src/pages/OpdServices.jsx
// Apollo Information Centre — OPD Services
// Modern calm + SEO structured + production safe
// =============================================

import React from "react";
import { Link } from "react-router-dom";
import CallCTA from "../components/CallCTA";
import InquiryCTA from "../components/InquiryCTA";
import "./Css/OpdServices.css";

import bannerBg from "../assets/banner-bg.png";
import opdBanner from "../assets/opd-hero-illustration.png";

export default function OpdServices() {
  return (
    <main className="opd2-page">

      {/* ================= HERO ================= */}
      <section
        className="opd2-hero"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="opd2-container opd2-hero-inner">

          <article className="opd2-hero-content">
            <h1>OPD Consultations with Visiting Apollo Doctors</h1>
            <p>
              Doctors from Apollo Hospitals, Guwahati visit our service centre
              on scheduled dates. Patients can view upcoming OPD consultation
              days and book appointments in advance.
            </p>
          </article>

          <div className="opd2-hero-image">
            <img
              src={opdBanner}
              alt="OPD consultation with visiting Apollo doctors in Guwahati"
            />
          </div>

        </div>
      </section>

      {/* ================= WHAT IS OPD ================= */}
      <section className="opd2-section">
        <div className="opd2-container opd2-center">

          <article className="opd2-card">
            <header>
              <h2>What Is OPD Consultation?</h2>
              <div className="opd2-divider" />
            </header>

            <p className="opd2-lead">
              OPD (Outpatient Department) consultation allows patients to
              consult a qualified doctor without hospital admission.
            </p>

            <p>
              At our Apollo Service Centre, OPD consultations are conducted
              through scheduled visits by doctors from Apollo Hospitals,
              Guwahati. These visits are published in advance as consultation
              events.
            </p>

            <p>
              Patients can review available OPD dates, select their preferred
              doctor, and book an in-person consultation.
            </p>

            <p>
              While we are not a hospital, our role is limited to patient
              support, coordination, and appointment facilitation.
            </p>

            <p>
              All medical consultations and decisions are provided solely by
              qualified doctors.
            </p>
          </article>

        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="opd2-section opd2-soft">
        <div className="opd2-container">

          <header className="opd2-section-header">
            <h2>OPD Consultation Services</h2>
            <p>
              Organised, scheduled access to experienced Apollo doctors.
            </p>
          </header>

          <div className="opd2-services-grid">

            <article className="opd2-service">
              <h3>Scheduled Doctor Visits</h3>
              <p>
                Visiting Apollo doctors consult patients at our service centre
                on pre-announced dates.
              </p>
            </article>

            <article className="opd2-service">
              <h3>Advance Booking</h3>
              <p>
                Patients can book OPD consultations in advance based on
                published schedules.
              </p>
            </article>

            <article className="opd2-service">
              <h3>Follow-ups & Second Opinions</h3>
              <p>
                Suitable for follow-ups, treatment reviews, and specialist
                second opinions.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="opd2-section">
        <div className="opd2-container">

          <header className="opd2-section-header">
            <h2>How OPD Booking Works</h2>
            <p>A simple and transparent OPD consultation process.</p>
          </header>

          <div className="opd2-process">

            <div className="opd2-step">
              <span>01</span>
              <h4>Check OPD Dates</h4>
              <p>
                Upcoming OPD consultation dates are published on the website.
              </p>
            </div>

            <div className="opd2-step">
              <span>02</span>
              <h4>Book Appointment</h4>
              <p>
                Select a suitable date and book your OPD consultation.
              </p>
            </div>

            <div className="opd2-step">
              <span>03</span>
              <h4>Visit Centre</h4>
              <p>
                Visit the service centre on the scheduled date for consultation.
              </p>
            </div>

            <div className="opd2-step">
              <span>04</span>
              <h4>Post-Consult Support</h4>
              <p>
                Assistance with follow-ups and further coordination if required.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TRANSPARENCY ================= */}
      <section className="opd2-section opd2-soft">
        <div className="opd2-container opd2-center">

          <article className="opd2-card">
            <header>
              <h2>Medical Transparency</h2>
              <div className="opd2-divider" />
            </header>

            <ul className="opd2-list">
              <li>Consultations are conducted by qualified doctors only.</li>
              <li>The service centre does not provide medical treatment.</li>
              <li>Medical decisions remain between doctor and patient.</li>
              <li>Our role is limited to coordination and support.</li>
            </ul>
          </article>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="opd2-cta">
        <div className="opd2-container opd2-center">

          <h2>Book Your OPD Consultation</h2>
          <p>
            View upcoming OPD consultation dates and book an appointment with
            visiting Apollo doctors.
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
    View OPD Schedule
  </Link>

  {/* 2️⃣ Call Clinic (dynamic phone from backend) */}
  <CallCTA label="Speak with Our Team" />

  {/* 3️⃣ Request Assistance popup */}
  <InquiryCTA
    label="Request Assistance"
    page="opd"
    section="general"
  />

</div>

        </div>
      </section>

    </main>
  );
}
