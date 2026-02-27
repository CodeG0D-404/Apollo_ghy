// =============================================
// 📁 src/components/Footer.jsx
// Apollo Information Centre — Re-Architected
// Desktop Structured + Mobile Tooltip Nav
// =============================================

import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CSS/Footer.css";
import {
  Home,
  Stethoscope,
  Info,
  UserRound,
  Phone,
} from "lucide-react";

export default function Footer() {
  const [showMobileFooter, setShowMobileFooter] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const location = useLocation();
  const tooltipRef = useRef();

  // Show mobile footer after scroll
  useEffect(() => {
    const onScroll = () => {
      setShowMobileFooter(window.scrollY > 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close tooltip on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTooltip = (name) => {
    setActiveTooltip(activeTooltip === name ? null : name);
  };

  const closeTooltip = () => setActiveTooltip(null);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* ================= DESKTOP FOOTER ================= */}
      <footer className="footer desktop-footer">
        <div className="footer-inner">

          <div className="footer-grid">

            {/* Column 1 — Brand Only */}
            <div className="footer-brand">
              <h3>Apollo Information Centre</h3>
              <p>
                Bora Commercial Complex,<br />
                Basisthapur Bye Lane 4,<br />
                Bhabendra Nath Saikia Road,<br />
                Beltola Tiniali, Guwahati,<br />
                Assam – 781028
              </p>

              <div className="footer-contact">
                <p>📞 09678769107</p>
                <p>✉ info@apolloinfoghy.com</p>
                <p>🕒 Mon – Sat, 9 AM – 6 PM</p>
                <p>Sunday Closed (Except OPD Dates)</p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="footer-column">
              <div>
                <h4>Services</h4>
                <ul>
                  <li><Link to="/services/opd">OPD Consultation</Link></li>
                  <li><Link to="/services/telemedicine">Telemedicine</Link></li>
                  <li><Link to="/services/hospital-visit">Hospital Visit</Link></li>
                  <li><Link to="/services/support-services">Other Services</Link></li>
                </ul>
              </div>

              <div className="footer-subsection">
                <h4>Book Appointment</h4>
                <ul>
                  <li><Link to="/doctors?visitType=OPD">Book OPD</Link></li>
                  <li><Link to="/doctors?visitType=Telemedicine">Book Telemedicine</Link></li>
                  <li><Link to="/hospital-request">Hospital Visit</Link></li>
                </ul>
              </div>
            </div>

            {/* Column 3 */}
            <div className="footer-column">
              <div>
                <h4>Information</h4>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/faqs">FAQs</Link></li>
                  <li><Link to="/blogs">Blog</Link></li>
                </ul>
              </div>

              <div className="footer-subsection">
                <h4>Legal</h4>
                <ul>
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                  <li><Link to="/medical-disclaimer">Medical Disclaimer</Link></li>
                </ul>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} Apollo Information Centre, Guwahati. All Rights Reserved.
          </div>

        </div>
      </footer>

      {/* ================= MOBILE TOOLTIP NAV ================= */}
      <nav className={`mobile-footer ${showMobileFooter ? "show" : ""}`} ref={tooltipRef}>

        <Link 
          to="/" 
          className={isActive("/") ? "active" : ""} 
          onClick={closeTooltip}
        >
          <Home />
          <span>Home</span>
        </Link>

        {/* Services */}
        <div className="mobile-item">
          <button onClick={() => toggleTooltip("services")}>
            <Stethoscope />
            <span>Services</span>
          </button>

          {activeTooltip === "services" && (
            <div className="tooltip-bubble">
              <Link to="/services/opd" onClick={closeTooltip}>OPD</Link>
              <Link to="/services/telemedicine" onClick={closeTooltip}>Telemedicine</Link>
              <Link to="/services/hospital-visit" onClick={closeTooltip}>Hospital Visit</Link>
              <Link to="/services/support-services" onClick={closeTooltip}>Other Services</Link>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mobile-item">
          <button onClick={() => toggleTooltip("info")}>
            <Info />
            <span>Info</span>
          </button>

          {activeTooltip === "info" && (
            <div className="tooltip-bubble">
              <Link to="/about" onClick={closeTooltip}>About</Link>
              <Link to="/faqs" onClick={closeTooltip}>FAQs</Link>
              <Link to="/blogs" onClick={closeTooltip}>Blog</Link>
            </div>
          )}
        </div>

        {/* Doctors */}
        <div className="mobile-item">
          <button onClick={() => toggleTooltip("doctors")}>
            <UserRound />
            <span>Doctors</span>
          </button>

          {activeTooltip === "doctors" && (
            <div className="tooltip-bubble">
              <Link to="/doctors?visitType=OPD" onClick={closeTooltip}>Book OPD</Link>
              <Link to="/doctors?visitType=Telemedicine" onClick={closeTooltip}>Telemedicine</Link>
              <Link to="/hospital-request" onClick={closeTooltip}>Hospital Visit</Link>
            </div>
          )}
        </div>

        <Link to="/contact" className={isActive("/contact") ? "active" : ""}>
          <Phone />
          <span>Contact</span>
        </Link>

      </nav>
    </>
  );
}