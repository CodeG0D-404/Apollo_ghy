// =============================================
// 📁 src/pages/SupportServices.jsx
// Apollo Information Centre — Support Services
// Premium layout aligned with OPD design system
// Scoped CSS: supp2-*
// =============================================

import React from "react";
import { Link } from "react-router-dom";
import CallCTA from "../components/CallCTA";
import InquiryCTA from "../components/InquiryCTA";
import "./Css/SupportServices.css";

import bannerBg from "../assets/banner-bg.png";
import supportBanner from "../assets/support-services-illustration.png";

export default function SupportServices() {
  return (
    <main className="supp2-page">

      {/* HERO */}
      <section
        className="supp2-hero"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="supp2-container supp2-hero-inner">

          <article className="supp2-hero-content">
            <h1>Patient Support & Assistance Services</h1>
            <p>
              Assistance for diagnostics, hospital visits, transport,
              accommodation, and procurement support for essential medicines.
            </p>
          </article>

          <div className="supp2-hero-image">
            <img src={supportBanner} alt="Patient support services" />
          </div>

        </div>
      </section>

      {/* INTRO */}
      <section className="supp2-section">
        <div className="supp2-container supp2-center">
          <article className="supp2-card">
            <h2>Support Services for Patients</h2>
            <div className="supp2-divider" />
            <p className="supp2-lead">
              These services assist patients during treatment journeys and
              hospital visits.
            </p>
            <p>
              Our role is coordination and guidance only. Availability may
              require phone confirmation.
            </p>
          </article>
        </div>
      </section>


      {/* ================= DIAGNOSTIC ================= */}
      <section className="supp2-section supp2-soft">
        <div className="supp2-container">

          <div className="supp2-service-wrapper">

            <div className="supp2-service-header">
              <h2>Diagnostic Test Coordination</h2>
              <p>Support for selected lab tests through partner laboratories.</p>
            </div>

            <div className="supp2-service-grid">

              {/* CONTENT */}
              <div className="supp2-content-box">
                <p>
                  We do not perform laboratory tests. Samples are collected from
                  patients and coordinated with partner labs.
                </p>

                <ul className="supp2-list">
                  <li>Blood tests — most types available</li>
                  <li>Urine & stool tests — limited</li>
                  <li>Phone confirmation required</li>
                </ul>

<div className="supp2-actions">

  {/* Call Clinic — dynamic backend number */}
  <CallCTA label="Speak with Our Team" />

  {/* Inquiry popup */}
  <InquiryCTA
    label="Request Assistance"
    page="support"
    section="general"
  />

</div>

              </div>

              {/* HOW */}
              <div className="supp2-how-box">
                <h4>How It Works</h4>
                <ul className="supp2-list">
                  <li>Confirm availability by phone</li>
                  <li>Sample collection coordinated</li>
                  <li>Testing through partner labs</li>
                  <li>Reports shared with patient</li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ================= TRANSPORT ================= */}
      <section className="supp2-section">
        <div className="supp2-container">

          <div className="supp2-service-wrapper">

            <div className="supp2-service-header">
              <h2>Medical Transport Assistance</h2>
              <p>Pickup support for hospital visits in Chennai.</p>
            </div>

            <div className="supp2-service-grid supp2-reverse">

              <div className="supp2-how-box">
                <h4>How It Works</h4>
                <ul className="supp2-list">
                  <li>Travel ticket shared with clinic</li>
                  <li>Pickup arranged from airport/railway</li>
                  <li>Transport to hospital</li>
                </ul>
              </div>

              <div className="supp2-content-box">
                <ul className="supp2-list">
                  <li>Pickup only (no drop)</li>
                  <li>Only for hospital visit patients</li>
                  <li>Ticket copy required</li>
                </ul>

<div className="supp2-actions">

  {/* Call Clinic — dynamic backend number */}
  <CallCTA label="Speak with Our Team" />

  {/* Inquiry popup */}
  <InquiryCTA
    label="Request Assistance"
    page="support"
    section="general"
  />

</div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ================= ACCOMMODATION ================= */}
      <section className="supp2-section supp2-soft">
        <div className="supp2-container">

          <div className="supp2-service-wrapper">

            <div className="supp2-service-header">
              <h2>Accommodation Guidance — Chennai Visit</h2>
              <p>Suggestions for patient stay during hospital visits.</p>
            </div>

            <div className="supp2-service-grid">

              <div className="supp2-content-box">
                <ul className="supp2-list">
                  <li>Suggestions based on hospital location</li>
                  <li>Budget based options</li>
                  <li>Patients book directly</li>
                </ul>

<div className="supp2-actions">

  {/* Call Clinic — dynamic backend number */}
  <CallCTA label="Speak with Our Team" />

  {/* Inquiry popup */}
  <InquiryCTA
    label="Request Assistance"
    page="support"
    section="general"
  />

</div>

              </div>

              <div className="supp2-how-box">
                <h4>How It Works</h4>
                <ul className="supp2-list">
                  <li>Patient shares visit dates</li>
                  <li>Stay suggestions provided</li>
                  <li>Patient confirms booking independently</li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ================= LSD ================= */}
      <section className="supp2-section">
        <div className="supp2-container">

          <div className="supp2-service-wrapper">

            <div className="supp2-service-header">
              <h2>Life Saving Drug Procurement Assistance</h2>
              <p>Support for medicines unavailable in North East India.</p>
            </div>

            <div className="supp2-service-grid supp2-reverse">

              <div className="supp2-how-box">
                <h4>How It Works</h4>
                <ul className="supp2-list">
                  <li>Doctor prescription submitted</li>
                  <li>Availability verified</li>
                  <li>Order placed on patient’s behalf</li>
                </ul>
              </div>

              <div className="supp2-content-box">
                <ul className="supp2-list">
                  <li>Prescription mandatory</li>
                  <li>Availability dependent</li>
                  <li>Coordination support only</li>
                </ul>

<div className="supp2-actions">

  {/* Call Clinic — dynamic backend number */}
  <CallCTA label="Speak with Our Team" />

  {/* Inquiry popup */}
  <InquiryCTA
    label="Request Assistance"
    page="support"
    section="general"
  />

</div>

              </div>

            </div>

          </div>
        </div>
      </section>




    </main>
  );
}
