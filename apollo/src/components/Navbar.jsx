// =============================================
// 📁 src/components/Navbar.jsx
// Premium Elegant Navbar (No Bootstrap Dropdown JS)
// + Smart Scroll Hide/Reveal Logic Added
// =============================================

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CSS/Navbar.css";
import logo from "../assets/apollo-logo.png";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // ✅ ADDED: Smart scroll visibility state
  const [navVisible, setNavVisible] = useState(true);

  const navRef = useRef(null);

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeAll = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  // Close on outside click (unchanged)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ ADDED: Smart Hide/Show on Scroll
  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setNavVisible(false);
    } else {
      setNavVisible(true);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  return (
    <nav
      // ✅ Only class modified to support visibility
      className={`main-nav ${navVisible ? "nav-show" : "nav-hide"}`}
      ref={navRef}
    >
      <div className="nav-container">

        {/* LOGO */}
        <Link to="/" className="logo" onClick={closeAll}>
          <img src={logo} alt="Apollo Logo" />
        </Link>

        {/* HAMBURGER */}
        <div
          className={`hamburger ${mobileOpen ? "active" : ""}`}
          onClick={toggleMobile}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* MENU */}
        <ul className={`nav-menu ${mobileOpen ? "active" : ""}`}>

          <li>
            <Link to="/" onClick={closeAll}>Home</Link>
          </li>

          {/* Book Appointment */}
          <li className="dropdown">
            <button onClick={() => toggleDropdown("book")}>
              Book Appointment
            </button>

            <div className={`dropdown-menu ${openDropdown === "book" ? "show" : ""}`}>
              <Link to="/doctors?visitType=OPD" onClick={closeAll}>
                OPD Consultation
              </Link>
              <Link to="/doctors?visitType=Telemedicine" onClick={closeAll}>
                Telemedicine
              </Link>
              <Link to="/hospital-request" onClick={closeAll}>
                Hospital Visit
              </Link>
            </div>
          </li>

          {/* Services */}
          <li className="dropdown">
            <button onClick={() => toggleDropdown("services")}>
              Services
            </button>

            <div className={`dropdown-menu ${openDropdown === "services" ? "show" : ""}`}>
              <Link to="/services/opd" onClick={closeAll}>OPD Consultation</Link>
              <Link to="/services/telemedicine" onClick={closeAll}>Telemedicine</Link>
              <Link to="/services/hospital-visit" onClick={closeAll}>Hospital Visit</Link>
              <Link to="/services/apollo-diagnostics" onClick={closeAll}>Apollo Diagnostics</Link>
              <Link to="/services/support-services" onClick={closeAll}>Other Services</Link>
            </div>
          </li>

          {/* Information */}
          <li className="dropdown">
            <button onClick={() => toggleDropdown("info")}>
              Information
            </button>

            <div className={`dropdown-menu ${openDropdown === "info" ? "show" : ""}`}>
              <Link to="/about" onClick={closeAll}>About Us</Link>
              <Link to="/faqs" onClick={closeAll}>FAQs</Link>
              <Link to="/blogs" onClick={closeAll}>Blog</Link>
            </div>
          </li>

          <li>
            <Link to="/contact" onClick={closeAll}>Contact</Link>
          </li>

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;