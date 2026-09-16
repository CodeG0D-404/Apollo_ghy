// =============================================
// 📁 src/pages/Home.jsx
// Premium Redesigned Home Page
// Apollo brand colours preserved: #2582A1 / #FDB931
// =============================================

import React from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import OPDDoctors from "../components/OPDDoctorComp";
import TestimonialSlider from "../components/TestimonialSlider";
import Catalogue from "../components/Catalogue";
import ServiceTimeline from "../components/ServiceTimeline";

import "./Css/Home.css";

import bannerOne from "../assets/banner-one-illustration.png";
import bannerTwo from "../assets/banner-two-illustration.png";
import bannerThree from "../assets/banner-three-illustration.png";
import bannerFour from "../assets/banner-four-illustration.png";
import whyUs from "../assets/how-works-illustration.png";

// ─── Inline SVG tick icon ───────────────────────────────────────────────────
const TickIcon = () => (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <polyline points="2.5 8.5 6 12 13.5 4.5" />
  </svg>
);

// ─── Why-Us bullet data ──────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    title: "Verified Specialists Network",
    desc: "Connect with trusted, experienced specialists across 30+ medical disciplines.",
  },
  {
    title: "Pan-India Appointment Support",
    desc: "Assistance for OPD and teleconsultations across leading hospitals nationwide.",
  },
  {
    title: "Travel Support",
    desc: "Airport & railway pickup–drop coordination for a stress-free hospital journey.",
  },
  {
    title: "Accommodation Assistance",
    desc: "Comfortable, affordable stay options near the hospital with 24/7 support.",
  },
  {
    title: "Dedicated Care Coordinators",
    desc: "Personalised guidance at every step — from consultation to follow-ups.",
  },
  {
    title: "End-to-End Patient Care",
    desc: "Complete support from first inquiry through treatment to post-care follow-up.",
  },
];

// ─── Stats data ──────────────────────────────────────────────────────────────
const STATS = [
  { number: "10,000+", label: "Patients Served" },
  { number: "200+",    label: "Specialist Doctors" },
  { number: "30+",     label: "Medical Specialties" },
  { number: "24 / 7",  label: "Care Coordinator Support" },
];

// ─── Hero slides ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    badge: "Teleconsultation",
    h1: true,
    heading: "Your Health, Our Priority — Anytime, Anywhere",
    sub: "Consult top doctors online from the comfort of your home. Fast, secure, and affordable care at your fingertips.",
    cta: { label: "Book a Consultation", to: "/doctors" },
    ctaSecondary: { label: "Learn more", to: "/services/telemedicine" },
    img: bannerOne,
    alt: "Online doctor consultation",
    trust: ["Verified Doctors", "Secure Platform", "Quick Appointments"],
  },
  {
    badge: "Travel Support",
    h1: false,
    heading: "Seamless Travel for Your Hospital Visit",
    sub: "Pickup and drop from airport or railway station to the hospital — safe, reliable, and always on time.",
    cta: { label: "Book Travel Support", to: "/services/support-services" },
    ctaSecondary: { label: "Learn more", to: "/services/hospital-visit" },
    img: bannerTwo,
    alt: "Hospital travel support",
    trust: ["Airport Pickup", "Train Station Drop", "24/7 Available"],
  },
  {
    badge: "Diagnostics",
    h1: false,
    heading: "Your Complete Diagnostic Partner",
    sub: "All types of medical tests under one roof — accurate, fast, and affordable results you can trust.",
    cta: { label: "Book Lab Test", to: "/services/support-services" },
    ctaSecondary: { label: "Learn more", to: "/apollo-diagnostics" },
    img: bannerThree,
    alt: "Complete diagnostics laboratory",
    trust: ["NABL Accredited", "Home Sample", "Fast Reports"],
  },
  {
    badge: "Accommodation",
    h1: false,
    heading: "Stay Close, Stay Comfortable",
    sub: "Affordable accommodation near the hospital with 24/7 assistance and round-the-clock support.",
    cta: { label: "Find Accommodation", to: "/services/support-services" },
    ctaSecondary: { label: "Learn more", to: "/about" },
    img: bannerFour,
    alt: "Hospital accommodation support",
    trust: ["Verified Hotels", "Walking Distance", "Budget Friendly"],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="home-page">

      {/* ════════════════════ HERO BANNER ════════════════════ */}
      <section className="home-banner">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4800, disableOnInteraction: false }}
          loop
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1200}
          className="home-banner-swiper"
        >
          {SLIDES.map((slide, idx) => {
            const Heading = slide.h1 ? "h1" : "h2";
            return (
              <SwiperSlide key={idx}>
                <div className="home-banner-slide">
                  <div className="home-banner-bg" />
                  <div className="home-banner-inner">

                    <div className="home-banner-text">
                      <div className="home-banner-badge">{slide.badge}</div>

                      <Heading>
                        {slide.heading}
                      </Heading>

                      <p>{slide.sub}</p>

                      <div className="home-banner-cta-group">
                        <Link to={slide.cta.to} className="home-banner-cta">
                          {slide.cta.label} →
                        </Link>
                        <Link to={slide.ctaSecondary.to} className="home-banner-cta-secondary">
                          {slide.ctaSecondary.label}
                        </Link>
                      </div>

                      <div className="home-banner-trust">
                        {slide.trust.map((t, i) => (
                          <span className="home-banner-trust-item" key={i}>
                            <span className="home-banner-trust-dot" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="home-banner-image">
                      <img src={slide.img} alt={slide.alt} />
                    </div>

                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      {/* ════════════════════ STATS STRIP ════════════════════ */}
      <section className="home-stats">
        <div className="home-stats-inner">
          {STATS.map((s, i) => (
            <div className="home-stat-item" key={i}>
              <div className="home-stat-number">{s.number}</div>
              <div className="home-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ CATALOGUE ════════════════════ */}
      <Catalogue />

      {/* ════════════════════ WHY US ════════════════════ */}
      <section className="home-why">
        <div className="home-container">
          <div className="home-why-grid">

            <div className="home-why-text">
              <span className="home-section-label">Why Choose Us</span>
              <h2>
                ApexCare Information Centre —{" "}
                <span>Guwahati</span>
              </h2>
              <p className="home-why-subtitle">
                We bridge the gap between patients across North-East India and world-class
                specialist care, with comprehensive end-to-end support at every step.
              </p>

              <ul className="home-why-list">
                {WHY_ITEMS.map((item, i) => (
                  <li key={i}>
                    <div className="home-why-tick">
                      <TickIcon />
                    </div>
                    <span>
                      <strong>{item.title}</strong>
                      {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="home-why-image">
              <img src={whyUs} alt="Why choose ApexCare" />
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════ HOW IT WORKS ════════════════════ */}
      <ServiceTimeline />

      {/* ════════════════════ OPD DOCTORS ════════════════════ */}
      <OPDDoctors />

      {/* ════════════════════ TESTIMONIALS ════════════════════ */}
      <TestimonialSlider title="What Our Patients Say" />

    </main>
  );
}
