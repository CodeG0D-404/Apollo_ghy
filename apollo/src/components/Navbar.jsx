// =============================================
// 📁 src/components/Navbar.jsx
// Production-safe Navbar (React + Bootstrap)
// =============================================

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./CSS/Navbar.css";
import logo from "../assets/apollo-logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Toggle mobile menu state
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu + Bootstrap collapse when link clicked
  const handleLinkClick = () => {
    setIsOpen(false);

    const navbarCollapse = document.getElementById("navbarSupportedContent");
    if (navbarCollapse?.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg main-nav" ref={menuRef}>
      <div className="container-fluid">

        {/* LOGO */}
        <Link className="navbar-brand logo" to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Apollo Logo" />
        </Link>

        {/* MOBILE TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV ITEMS */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            {/* Home */}
            <li className="nav-item">
              <Link to="/" onClick={handleLinkClick}>Home</Link>
            </li>

            {/* Book Appointment */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Book Appointment
              </Link>

              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/doctors?visitType=OPD" onClick={handleLinkClick}>
                    Book OPD Consultation
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/doctors?visitType=Telemedicine" onClick={handleLinkClick}>
                    Book Telemedicine (Online)
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/hospital-request" onClick={handleLinkClick}>
                    Book Hospital Visit (Chennai)
                  </Link>
                </li>
              </ul>
            </li>

            {/* Services */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/services"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Services
              </Link>

              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/services/opd" onClick={handleLinkClick}>OPD Consultation</Link></li>
                <li><Link className="dropdown-item" to="/services/telemedicine" onClick={handleLinkClick}>Telemedicine</Link></li>
                <li><Link className="dropdown-item" to="/services/hospital-visit" onClick={handleLinkClick}>Hospital Visit</Link></li>
                <li><Link className="dropdown-item" to="/services/apollo-diagnostics" onClick={handleLinkClick}>Apollo Diadnostics</Link></li>
                <li><Link className="dropdown-item" to="/services/support-services" onClick={handleLinkClick}>Other Services</Link></li>
              </ul>
            </li>

            {/* Information */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Information
              </Link>

              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/about" onClick={handleLinkClick}>About Us</Link></li>
                <li><Link className="dropdown-item" to="/faqs" onClick={handleLinkClick}>FAQs</Link></li>
                <li><Link className="dropdown-item" to="/blogs" onClick={handleLinkClick}>Blog</Link></li>
              </ul>
            </li>

            {/* Contact */}
            <li className="nav-item">
              <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;