import React from "react";
import "./CSS/AboutUs.css";
import bannerBg from "../assets/banner-bg.png";
import bannerOne from "../assets/banner-one-illustration.png";

export default function About() {
  return (
    <div className="aboutus">

      {/* ================= Hero Section ================= */}
      <div
        className="contactBanner"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h2>Your Trusted Apollo Service Centre</h2>
              <p>
                OPD consultations, telemedicine appointments, and complete
                patient support — delivered with care and clarity. We assist
                patients with doctor consultations, remote medical appointments,
                and coordinated hospital care for a stress-free healthcare
                journey.
              </p>
            </div>

            <div className="col-md-7">
              <img
                className="img-fluid"
                src={bannerOne}
                alt="Apollo Service Centre Illustration"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= Who We Are ================= */}
      <div className="whoWeAre">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-9 col-lg-8">
              <div className="whoCard">
                <h3>Who We Are</h3>
                <span className="whoDivider"></span>

                <p className="whoLead">
                  We are an Apollo Service Centre dedicated to supporting
                  patients through every step of their healthcare journey.
                </p>

                <p>
                  Our centre functions as a patient-support and coordination
                  facility, where qualified doctors visit to provide OPD
                  consultations. We also assist patients with telemedicine
                  appointments and guide them in planning hospital visits,
                  including advanced care at Apollo Hospitals in Chennai.
                </p>

                <p>
                  While we are not a hospital, we play an important role within
                  the healthcare service ecosystem by helping patients access
                  the right medical care, at the right time, with clarity and
                  confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Our Medical & Consultation Services ================= */}
      <div className="medicalServices">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h3 className="sectionTitle">
                Our Medical & Consultation Services
              </h3>
              <p className="sectionIntro">
                We provide organised medical consultation and patient
                coordination services to help patients access care smoothly and
                confidently.
              </p>
            </div>
          </div>

          <div className="row mt-4">
            {/* OPD */}
            <div className="col-md-4">
              <div className="serviceCard">
                <h4>OPD Consultations</h4>
                <p>
                  Qualified doctors visit our service centre to provide OPD
                  consultations and treatment. Patients receive in-person
                  medical consultations in a comfortable and well-coordinated
                  setting.
                </p>
              </div>
            </div>

            {/* Telemedicine */}
            <div className="col-md-4">
              <div className="serviceCard">
                <h4>Telemedicine Appointments</h4>
                <p>
                  We arrange telemedicine consultations with doctors for remote
                  medical advice, follow-ups, and second opinions. All
                  consultations are conducted directly by doctors.
                </p>
              </div>
            </div>

            {/* Chennai Hospital Support */}
            <div className="col-md-4">
              <div className="serviceCard">
                <h4>Chennai Hospital Coordination</h4>
                <p>
                  We assist patients with OPD visits and admissions at{" "}
                  <strong>Apollo Hospitals, Chennai</strong>. Our support
                  includes department guidance, specialist coordination, and
                  visit planning for outstation patients.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= Travel, Accommodation & Diagnostic Support ================= */}
<div className="supportServices">
  <div className="container">
    <div className="row">
      <div className="col-12 text-center">
        <h3 className="sectionTitle">
          Travel, Accommodation & Diagnostic Support
        </h3>
        <p className="sectionIntro">
          We provide practical support services to ensure patients and families
          experience a smooth and comfortable healthcare journey.
        </p>
      </div>
    </div>

    <div className="row mt-4">
      {/* Travel & Transport */}
      <div className="col-md-6">
        <div className="supportBlock">
          <h4>Travel & Transport Support</h4>
          <p>
            We assist with airport and railway station pickup in Chennai and help
            arrange transport to hospitals as required, especially for
            outstation patients.
          </p>
        </div>
      </div>

      {/* Accommodation */}
      <div className="col-md-6">
        <div className="supportBlock">
          <h4>Accommodation Assistance</h4>
          <p>
            For patients and attendants travelling from outside Chennai, we
            assist in arranging nearby accommodation based on availability and
            individual requirements.
          </p>
        </div>
      </div>
    </div>

    <div className="row mt-3">
      {/* Diagnostic Samples */}
      <div className="col-md-6">
        <div className="supportBlock">
          <h4>Diagnostic Sample Collection</h4>
          <p>
            We assist patients with diagnostic sample collection, such as blood
            tests, offering added convenience for elderly or mobility-restricted
            patients.
          </p>
        </div>
      </div>

      {/* Lab Coordination */}
      <div className="col-md-6">
        <div className="supportBlock">
          <h4>Authorized Lab Coordination</h4>
          <p>
            All diagnostic samples are coordinated with authorized laboratories
            to ensure proper handling, testing, and timely reporting.
          </p>
        </div>
      </div>
    </div>

  </div>
</div>

{/* ================= How We Work ================= */}
<div className="howWeWork">
  <div className="container">
    <div className="row">
      <div className="col-12 text-center">
        <h3 className="sectionTitle">How We Work</h3>
        <p className="sectionIntro">
          Our process is designed to keep healthcare access simple,
          transparent, and stress-free for patients and their families.
        </p>
      </div>
    </div>

    <div className="timelineWrapper">
      <div className="timelineLine"></div>

      <div className="timelineSteps">
        {/* Step 1 */}
        <div className="timelineStep">
          <div className="stepCircle">01</div>
          <h4>Connect With Us</h4>
          <p>
            Patients contact our service centre through phone, online, or in
            person to begin their healthcare journey.
          </p>
        </div>

        {/* Step 2 */}
        <div className="timelineStep">
          <div className="stepCircle">02</div>
          <h4>Understand Your Requirement</h4>
          <p>
            We carefully understand your needs, whether it is an OPD
            consultation, telemedicine appointment, or a hospital visit to
            Chennai.
          </p>
        </div>

        {/* Step 3 */}
        <div className="timelineStep">
          <div className="stepCircle">03</div>
          <h4>Doctor Consultation or Coordination</h4>
          <p>
            Based on the requirement, we arrange doctor consultations or assist
            with coordinating OPD visits or admissions at hospitals.
          </p>
        </div>

        {/* Step 4 */}
        <div className="timelineStep">
          <div className="stepCircle">04</div>
          <h4>Continued Patient Support</h4>
          <p>
            We continue to support patients with travel arrangements,
            diagnostic coordination, and follow-ups to ensure a smooth
            experience.
          </p>
        </div>
      </div>
    </div>

  </div>
</div>
{/* ================= Our Commitment & Medical Transparency ================= */}
<div className="commitmentSection">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-10 col-lg-9">
        <div className="commitmentCard">
          <h3>Our Commitment & Medical Transparency</h3>
          <span className="commitmentDivider"></span>

          <p className="commitmentLead">
            We are committed to placing patients first through ethical
            practices, clear communication, and responsible coordination of
            healthcare services.
          </p>

          <ul className="commitmentList">
            <li>
              All medical consultations, diagnoses, and treatments are provided
              solely by qualified doctors.
            </li>
            <li>
              The service centre does not influence or interfere with medical
              decisions made by doctors or hospitals.
            </li>
            <li>
              Hospital-based care, procedures, and admissions are handled
              directly by Apollo Hospitals.
            </li>
            <li>
              Our role is limited to patient support, coordination, and
              facilitating access to appropriate healthcare services.
            </li>
            <li>
              We ensure transparent communication so patients and families can
              make informed decisions with confidence.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
{/* ================= Call to Action ================= */}
<div className="aboutCTA">
  <div className="container">
    <div className="row justify-content-center text-center">
      <div className="col-md-9 col-lg-8">
        <h3>We’re Here to Help</h3>
        <p>
          If you need assistance with OPD consultations, telemedicine
          appointments, or planning a hospital visit, our support team is here
          to guide you every step of the way.
        </p>

        <div className="ctaActions">
          <a href="/contact" className="ctaPrimary">
            Contact the Service Centre
          </a>
          <a href="/contact" className="ctaSecondary">
            Speak with Our Support Team
          </a>
        </div>
      </div>
    </div>
  </div>
</div>


    </div>
  );
}
