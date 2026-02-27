// =============================================
// 📁 src/pages/Contact.jsx
// Production Contact Page
// Scoped, secure, SEO friendly
// =============================================

import React from "react";
import "./Css/ContactUs.css";

import mapIcon from "../assets/map-icon.png";
import phoneIcon from "../assets/phone-call.png";
import mailIcon from "../assets/mail-icon.png";
import clockIcon from "../assets/clock-icon.png";
import contactIllus from "../assets/contact-illustration.png";

export default function Contact() {

  // 🔐 centralised contact data (can move to .env later)
  const CONTACT = {
    phone: "09678769107",
    email: "info@apolloinformationcentre.com",
    address:
      "Bora Commercial Complex, Basisthapur Bye Lane 4, Bhabendra Nath Saikia Road, Beltola Tiniali, Guwahati, Assam 781028",
    hours: "Mon – Sat, 9 AM – 6 PM",
  };

  return (
    <main className="contact-page">

      {/* ================= HERO ================= */}

      <section className="contact-hero">
        <div className="contact-hero-bg" />

        <div className="contact-container">

          <div className="contact-hero-grid">

            <div className="contact-hero-text">
              <h1>Get In Touch</h1>
              <p>
                Have a question or need assistance? Reach out to us for appointments,
                support, or general enquiries. Our team will get back to you as soon as possible.
              </p>
            </div>

            <div className="contact-hero-image">
              <img src={contactIllus} alt="Contact support illustration" />
            </div>

          </div>

        </div>
      </section>

      {/* ================= CONTACT DETAILS ================= */}

      <section className="contact-details">
        <div className="contact-container">

          <div className="contact-details-grid">

            {/* LEFT SIDE INFO */}
            <div className="contact-info">

              <div className="contact-row">
                <img src={mapIcon} alt="" />
                <div>
                  <h3>Address</h3>
                  <p>{CONTACT.address}</p>
                </div>
              </div>

              <div className="contact-row">
                <img src={phoneIcon} alt="" />
                <div>
                  <h3>Phone</h3>
                  <p>
                    <a href={`tel:${CONTACT.phone}`}>
                      {CONTACT.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-row">
                <img src={mailIcon} alt="" />
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href={`mailto:${CONTACT.email}`}>
                      {CONTACT.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-row">
                <img src={clockIcon} alt="" />
                <div>
                  <h3>Opening Hours</h3>
                  <p>{CONTACT.hours}</p>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE MAP */}
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.9925334637805!2d91.7889602789956!3d26.131786434244354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a58d61305ddcb%3A0x8fe706184e2126f6!2sApollo%20Hospitals%20Information%20Centre%2C%20Beltola%2CGhy!5e0!3m2!1sen!2sin"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Apollo Hospitals Information Centre location map"
              />
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
