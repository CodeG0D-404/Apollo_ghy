// =============================================
// 📁 src/pages/TelemedicineServices.jsx
// Apollo Information Centre — Telemedicine Services
// Modern calm + SEO structured + production safe
// Scoped CSS: tele2-*
// =============================================

import React from "react";
import { Link } from "react-router-dom";
import CallCTA from "../components/CallCTA";
import InquiryCTA from "../components/InquiryCTA";
import "./Css/TelemedicineServices.css";

import bannerBg from "../assets/banner-bg.png";
import telemedicineBanner from "../assets/telemedicine-hero-illustration.png";

export default function TelemedicineServices() {
  return (
    <main className="tele2-page">

      {/* ================= HERO ================= */}
      <section
        className="tele2-hero"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="tele2-container tele2-hero-inner">

          <article className="tele2-hero-content">
            <h1>Book Telemedicine Consultations Online</h1>
            <p>
              Consult qualified Apollo doctors through secure online
              telemedicine appointments. Book consultations from the comfort
              of your home based on doctor availability.
            </p>
          </article>

          <div className="tele2-hero-image">
            <img
              src={telemedicineBanner}
              alt="Telemedicine consultation with Apollo doctors online"
            />
          </div>

        </div>
      </section>

      {/* ================= WHAT IS TELEMEDICINE ================= */}
      <section className="tele2-section">
        <div className="tele2-container tele2-center">

          <article className="tele2-card">
            <header>
              <h2>What Is Telemedicine?</h2>
              <div className="tele2-divider" />
            </header>

            <p className="tele2-lead">
              Telemedicine allows patients to consult doctors online using video
              or audio calls without visiting a clinic or hospital.
            </p>

            <p>
              Through our Apollo Service Centre, patients can book online
              telemedicine consultations with qualified doctors for medical
              advice, follow-ups, and second opinions.
            </p>

            <p>
              Telemedicine appointments are scheduled in advance based on doctor
              availability and are conducted directly by doctors through secure
              digital platforms.
            </p>

            <p>
              Our role is limited to coordinating appointments and ensuring a
              smooth consultation experience.
            </p>

            <p>
              All medical consultations and decisions are made solely by
              qualified doctors.
            </p>
          </article>

        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="tele2-section tele2-soft">
        <div className="tele2-container">

          <header className="tele2-section-header">
            <h2>Telemedicine Services</h2>
            <p>
              Easy access to trusted medical advice through online consultations.
            </p>
          </header>

          <div className="tele2-services-grid">

            <article className="tele2-service">
              <h3>Online Doctor Consultation</h3>
              <p>
                Consult experienced doctors online through video or audio calls
                from anywhere.
              </p>
            </article>

            <article className="tele2-service">
              <h3>Follow-up Consultations</h3>
              <p>
                Ideal for follow-ups, report reviews, and ongoing treatment
                guidance.
              </p>
            </article>

            <article className="tele2-service">
              <h3>Second Medical Opinions</h3>
              <p>
                Get expert second opinions from Apollo doctors without
                travelling.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="tele2-section">
        <div className="tele2-container">

          <header className="tele2-section-header">
            <h2>How Telemedicine Booking Works</h2>
            <p>A simple and secure process for online consultations.</p>
          </header>

          <div className="tele2-process">

            <div className="tele2-step">
              <span>01</span>
              <h4>Choose Doctor</h4>
              <p>
                Select a doctor and available time slot for telemedicine consultation.
              </p>
            </div>

            <div className="tele2-step">
              <span>02</span>
              <h4>Book Appointment</h4>
              <p>
                Book your online consultation securely through the platform.
              </p>
            </div>

            <div className="tele2-step">
              <span>03</span>
              <h4>Attend Online Consultation</h4>
              <p>
                Join the telemedicine session at the scheduled time using your device.
              </p>
            </div>

            <div className="tele2-step">
              <span>04</span>
              <h4>Post-Consultation Support</h4>
              <p>
                Assistance with reports, prescriptions, and follow-ups if required.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TRANSPARENCY ================= */}
      <section className="tele2-section tele2-soft">
        <div className="tele2-container tele2-center">

          <article className="tele2-card">
            <header>
              <h2>Medical Transparency</h2>
              <div className="tele2-divider" />
            </header>

            <ul className="tele2-list">
              <li>Telemedicine consultations are conducted by doctors.</li>
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

          <h2>Book an Online Consultation</h2>
          <p>
          Schedule your telemedicine appointment with Apollo doctors today.
          </p>

          <div className="opd2-cta-actions">

  {/* 1️⃣ View OPD Schedule */}
  <Link
    to={{
      pathname: "/doctors",
      search: "?visitType=Telemedicine",
    }}
    className="opd2-btn-primary"
  >
    View Telemedicine Doctors
  </Link>

  {/* 2️⃣ Call Clinic (dynamic phone from backend) */}
  <CallCTA label="Speak with Our Team" />

  {/* 3️⃣ Request Assistance popup */}
  <InquiryCTA
    label="Request Assistance"
    page="tele"
    section="general"
  />

</div>

        </div>
      </section>


    </main>
  );
}
