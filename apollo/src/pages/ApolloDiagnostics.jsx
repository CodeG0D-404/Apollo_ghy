/* =============================================
   📁 src/pages/ApolloDiagnostics.jsx
   Apollo Information Centre — Redesigned
   Elegant • Premium • Modern
============================================= */

import React from "react";
import CallCTA from "../components/CallCTA";
import InquiryCTA from "../components/InquiryCTA";
import "./Css/ApolloDiagnostics.css";

import diagHero from "../assets/diagnostic-hero.png";

export default function ApolloDiagnostics() {
  return (
    <main className="diag-page">

      {/* ================= HERO ================= */}
      <section className="diag-hero">
        <div className="diag-container diag-hero-grid">

          <div className="diag-hero-content">
            <span className="diag-badge">
              10M+ High Quality Tests Every Year
            </span>

            <h1>
              Good Health Begins With
              <span> Accurate Diagnosis</span>
            </h1>

            <p>
              Nearly four decades of trusted excellence in delivering
              reliable, safe and world-class diagnostic services.
            </p>

            <div className="diag-hero-actions">
              <a
                href="https://www.apollodiagnostics.in"
                target="_blank"
                rel="noopener noreferrer"
                className="diag-btn-primary"
              >
                Book Test Online
              </a>

              <CallCTA label="Home Collection" />
            </div>
          </div>

          <div className="diag-hero-image">
            <img
              src={diagHero}
              alt="Apollo Diagnostics lab testing"
            />
          </div>

        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="diag-section">
        <div className="diag-container">

          <div className="diag-section-header">
            <h2>Comprehensive Diagnostic Services</h2>
            <p>Accurate. Safe. Trusted.</p>
          </div>

          <div className="diag-grid">

            <div className="diag-card">
              <h3>Blood Tests</h3>
              <p>Routine and advanced blood investigations.</p>
            </div>

            <div className="diag-card">
              <h3>Urine Analysis</h3>
              <p>Comprehensive urine diagnostics and screening.</p>
            </div>

            <div className="diag-card">
              <h3>Stool Examination</h3>
              <p>Pathology testing with precision handling.</p>
            </div>

            <div className="diag-card">
              <h3>Health Checkups</h3>
              <p>Preventive and wellness diagnostic packages.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOME COLLECTION ================= */}
      <section className="diag-section diag-light">
        <div className="diag-container">

          <div className="diag-home-collection">
            <div>
              <h2>Safe & Convenient Home Sample Collection</h2>
              <p>
                Professional phlebotomists. Sterile equipment.
                Accurate reporting.
              </p>

              <ul>
                <li>No infection risk</li>
                <li>No multiple needle pricks</li>
                <li>Sterile vacutainer tubes</li>
                <li>Comfort of your home</li>
              </ul>
            </div>

            <div className="diag-home-cta">
              <CallCTA label="Schedule Collection" />
              <InquiryCTA
                label="Need Assistance?"
                page="diagnostics"
                section="home-collection"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= TRUST / STATS ================= */}
      <section className="diag-section">
        <div className="diag-container diag-center">

          <div className="diag-section-header">
            <h2>Nearly 4 Decades of Excellence</h2>
            <p>NABL & CAP Accredited Laboratories</p>
          </div>

          <div className="diag-stats">

            <div className="diag-stat">
              <h3>10M+</h3>
              <span>Tests Every Year</span>
            </div>

            <div className="diag-stat">
              <h3>3000+</h3>
              <span>Diagnostic Tests</span>
            </div>

            <div className="diag-stat">
              <h3>4+</h3>
              <span>Decades of Legacy</span>
            </div>

          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="diag-cta">
        <div className="diag-container diag-center">
          <h2>Book Your Diagnostic Test Today</h2>
          <p>Fast booking. Trusted reporting. Professional care.</p>

          <div className="diag-cta-actions">
            <a
              href="https://www.apollodiagnostics.in"
              target="_blank"
              rel="noopener noreferrer"
              className="diag-btn-light"
            >
              Book Online
            </a>

            <CallCTA label="Call Now" />
          </div>
        </div>
      </section>

    </main>
  );
}