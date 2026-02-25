// =============================================
// 📁 src/pages/Home.jsx
// Production Home Page
// Scoped, secure, no inline CSS, no hard URLs
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
import BrowseSpecialist from "../components/BrowseSpecialist";
import ServiceTimeline from "../components/ServiceTimeline";
import SocialMediaLinks from "../components/SocialMediaLinks";

import "./Css/Home.css";

import bannerBg from "../assets/banner-bg.png";
import bannerOne from "../assets/banner-one-illustration.png";
import bannerTwo from "../assets/banner-two-illustration.png";
import bannerThree from "../assets/banner-three-illustration.png";
import bannerFour from "../assets/banner-four-illustration.png";
import whyUs from "../assets/how-works-illustration.png";
import circleTick from "../assets/circle.png";

export default function Home() {
  return (
    <main className="home-page">

      {/* ================= HERO / BANNER ================= */}

      <section className="home-banner">

        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1100}
          className="home-banner-swiper"
        >

          {/* Slide 1 */}
          <SwiperSlide>
            <div className="home-banner-slide">
              <div className="home-banner-bg" />
              <div className="home-banner-inner">

                <div className="home-banner-text">
                  <h1>Your Health, Our Priority — Anytime, Anywhere</h1>
                  <p>
                    Consult top doctors online from the comfort of your home.
                    Fast, secure, and affordable care at your fingertips.
                  </p>
                  <Link to="/doctors" className="home-banner-cta">
                    Book a Consultation
                  </Link>
                </div>

                <div className="home-banner-image">
                  <img src={bannerOne} alt="Online consultation" />
                </div>

              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="home-banner-slide">
              <div className="home-banner-bg" />
              <div className="home-banner-inner">

                <div className="home-banner-text">
                  <h2>Seamless Travel for Your Hospital Visit</h2>
                  <p>
                    Pickup and drop from airport or railway station to Apollo Hospital —
                    safe, reliable, and on time.
                  </p>
                  <Link to="/services/support-services" className="home-banner-cta">
                    Book Travel Support
                  </Link>
                </div>

                <div className="home-banner-image">
                  <img src={bannerTwo} alt="Travel support" />
                </div>

              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="home-banner-slide">
              <div className="home-banner-bg" />
              <div className="home-banner-inner">

                <div className="home-banner-text">
                  <h2>Your Complete Diagnostic Partner</h2>
                  <p>
                    All types of medical tests under one roof — accurate, fast, and affordable.
                  </p>
                  <Link to="/services/support-services" className="home-banner-cta">
                    Book Lab Test
                  </Link>
                </div>

                <div className="home-banner-image">
                  <img src={bannerThree} alt="Diagnostics" />
                </div>

              </div>
            </div>
          </SwiperSlide>

          {/* Slide 4 */}
          <SwiperSlide>
            <div className="home-banner-slide">
              <div className="home-banner-bg" />
              <div className="home-banner-inner">

                <div className="home-banner-text">
                  <h2>Stay Close, Stay Comfortable</h2>
                  <p>
                    Affordable accommodation near hospital with 24/7 support and assistance.
                  </p>
                  <Link to="/services/support-services" className="home-banner-cta">
                    Find Accommodation
                  </Link>
                </div>

                <div className="home-banner-image">
                  <img src={bannerFour} alt="Accommodation support" />
                </div>

              </div>
            </div>
          </SwiperSlide>

        </Swiper>

      </section>

      {/* ================= CATALOGUE ================= */}
      <Catalogue />

      {/* ================= WHY US ================= */}

      <section className="home-why">
        <div className="home-container">

          <div className="home-why-grid">

            <div className="home-why-text">
              <h2>Why Apollo Information Centre – Guwahati?</h2>

              <ul className="home-why-list">
                <li>
                  <img src={circleTick} alt="" />
                  <span>
                    <strong>Apollo-Affiliated Doctors –</strong>
                    Verified specialists directly connected with Apollo Hospitals.
                  </span>
                </li>

                <li>
                  <img src={circleTick} alt="" />
                  <span>
                    <strong>Pan-India Appointments –</strong>
                    OPD & telemedicine bookings across Apollo network.
                  </span>
                </li>

                <li>
                  <img src={circleTick} alt="" />
                  <span>
                    <strong>Travel Support –</strong>
                    Airport & railway pickup/drop assistance.
                  </span>
                </li>

                <li>
                  <img src={circleTick} alt="" />
                  <span>
                    <strong>Accommodation Assistance –</strong>
                    Comfortable hotel stay arrangements.
                  </span>
                </li>

                <li>
                  <img src={circleTick} alt="" />
                  <span>
                    <strong>Dedicated Care Coordinators –</strong>
                    Guidance at every step of treatment journey.
                  </span>
                </li>

                <li>
                  <img src={circleTick} alt="" />
                  <span>
                    <strong>End-to-End Patient Care –</strong>
                    From consultation to follow-ups.
                  </span>
                </li>
              </ul>
            </div>

            <div className="home-why-image">
              <img src={whyUs} alt="Why choose Apollo" />
            </div>

          </div>

        </div>
      </section>

      {/* ================= SPECIALTIES ================= */}
      <BrowseSpecialist />

      {/* ================= TIMELINE ================= */}
      <ServiceTimeline />

      {/* ================= OPD ================= */}
      <OPDDoctors />

      {/* ================= TESTIMONIAL ================= */}
      <TestimonialSlider title="What Our Patients Say" />


    </main>
  );
}
