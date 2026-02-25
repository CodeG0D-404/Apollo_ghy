// =============================================
// 📁 src/components/Footer.jsx
// Apollo Information Centre — Premium Footer
// Production Ready + SEO Structured
// =============================================

import { useEffect, useState } from "react";
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
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setShowMobileFooter(window.scrollY > 100);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Better active detection (works with nested routes + query params)
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* ================= DESKTOP FOOTER ================= */}
      <footer className="footer desktop-footer">
        <div className="footer-inner">

          <div className="footer-grid">

            {/* Brand & Contact */}
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

            {/* Services */}
            <div>
              <h4>Services</h4>
              <ul>
                <li><Link to="/services/opd">OPD Consultation</Link></li>
                <li><Link to="/services/telemedicine">Telemedicine</Link></li>
                <li><Link to="/services/hospital-visit">Hospital Visit</Link></li>
                <li><Link to="/services/support-services">Other Services</Link></li>
              </ul>
            </div>

            {/* Booking */}
            <div>
              <h4>Book Appointment</h4>
              <ul>
                <li><Link to="/doctors?visitType=OPD">Book OPD</Link></li>
                <li><Link to="/doctors?visitType=Telemedicine">Book Telemedicine</Link></li>
                <li><Link to="/hospital-request">Hospital Visit (Chennai)</Link></li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4>Information</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
                <li><Link to="/blogs">Blog</Link></li>
              </ul>
            </div>

            {/* Legal */}
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
            © {new Date().getFullYear()} Apollo Information Centre, Guwahati.
            All Rights Reserved.
          </div>

        </div>
      </footer>

      {/* ================= MOBILE iOS STYLE FOOTER ================= */}
      <nav className={`mobile-footer ${showMobileFooter ? "show" : ""}`}>

        <Link to="/" className={isActive("/") ? "active" : ""}>
          <Home />
          <span>Home</span>
        </Link>

        <Link to="/services" className={isActive("/services") ? "active" : ""}>
          <Stethoscope />
          <span>Services</span>
        </Link>

        <Link to="/about" className={isActive("/about") ? "active" : ""}>
          <Info />
          <span>Info</span>
        </Link>

        <Link to="/doctors" className={isActive("/doctors") ? "active" : ""}>
          <UserRound />
          <span>Doctors</span>
        </Link>

        <Link to="/contact" className={isActive("/contact") ? "active" : ""}>
          <Phone />
          <span>Contact</span>
        </Link>

      </nav>
    </>
  );
}