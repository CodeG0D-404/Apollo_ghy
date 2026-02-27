// =============================================
// 📁 src/components/Footer.jsx
// Apollo Information Centre — Redesigned Footer
// Structured Desktop + Speech Bubble Mobile
// =============================================

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CSS/Footer.css";
import {
  Home,
  Stethoscope,
  Info,
  UserRound,
} from "lucide-react";

export default function Footer() {
  const [showMobileFooter, setShowMobileFooter] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();
  const mobileRef = useRef();

  // Show mobile footer after scroll
useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      if (currentScrollY < lastScrollY) {
        setShowMobileFooter(true); // scrolling up
      } else {
        setShowMobileFooter(false); // scrolling down
      }
    } else {
      setShowMobileFooter(false);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  // Close tooltip on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const closeMenu = () => setActiveMenu(null);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* ================= DESKTOP FOOTER ================= */}
      <footer className="footer desktop-footer">
        <div className="footer-inner">

          <div className="footer-grid">

            {/* Brand (Spans 2 rows) */}
            <div className="footer-brand span-2-rows">
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

            {/* Row 1 */}
            <div>
              <h4>Services</h4>
              <ul>
                <li><Link to="/services/opd">OPD Consultation</Link></li>
                <li><Link to="/services/telemedicine">Telemedicine</Link></li>
                <li><Link to="/services/hospital-visit">Hospital Visit</Link></li>
                <li><Link to="/services/support-services">Other Services</Link></li>
              </ul>
            </div>

            <div>
              <h4>Information</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
                <li><Link to="/blogs">Blog</Link></li>
              </ul>
            </div>

            {/* Row 2 */}
            <div>
              <h4>Book Appointment</h4>
              <ul>
                <li><Link to="/doctors?visitType=OPD">Book OPD</Link></li>
                <li><Link to="/doctors?visitType=Telemedicine">Book Telemedicine</Link></li>
                <li><Link to="/hospital-request">Hospital Visit</Link></li>
              </ul>
            </div>

            <div>
              <h4>Legal</h4>
              <ul>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                <li><Link to="/medical-disclaimer">Medical Disclaimer</Link></li>
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} Apollo Information Centre, Guwahati. All Rights Reserved.
          </div>

        </div>
      </footer>

      {/* ================= MOBILE FOOTER ================= */}
      <nav
        ref={mobileRef}
        className={`mobile-footer ${showMobileFooter ? "show" : ""}`}
      >

        {/* HOME */}
        <Link to="/" className={isActive("/") ? "active" : ""}>
          <Home />
          <span>Home</span>
        </Link>

        {/* SERVICES */}
        <div className="mobile-item">
          <button onClick={() => toggleMenu("services")}>
            <Stethoscope />
            <span>Services</span>
          </button>

          {activeMenu === "services" && (
            <div className="tooltip-bubble">
              <Link to="/services/opd" onClick={closeMenu}>OPD</Link>
              <Link to="/services/telemedicine" onClick={closeMenu}>Telemedicine</Link>
              <Link to="/services/hospital-visit" onClick={closeMenu}>Hospital Visit</Link>
              <Link to="/services/support-services" onClick={closeMenu}>Other Services</Link>
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="mobile-item">
          <button onClick={() => toggleMenu("info")}>
            <Info />
            <span>Info</span>
          </button>

          {activeMenu === "info" && (
            <div className="tooltip-bubble">
              <Link to="/about" onClick={closeMenu}>About</Link>
              <Link to="/faqs" onClick={closeMenu}>FAQs</Link>
              <Link to="/blogs" onClick={closeMenu}>Blog</Link>
            </div>
          )}
        </div>

        {/* DOCTORS */}
        <div className="mobile-item">
          <button onClick={() => toggleMenu("doctors")}>
            <UserRound />
            <span>Doctors</span>
          </button>

          {activeMenu === "doctors" && (
            <div className="tooltip-bubble">
              <Link to="/doctors?visitType=OPD" onClick={closeMenu}>Book OPD</Link>
              <Link to="/doctors?visitType=Telemedicine" onClick={closeMenu}>Telemedicine</Link>
              <Link to="/hospital-request" onClick={closeMenu}>Hospital Visit</Link>
            </div>
          )}
        </div>

      </nav>
    </>
  );
}