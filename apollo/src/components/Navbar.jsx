// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./CSS/Navbar.css";
import logo from "../assets/apollo-logo.png"; // ✅ ensure this exists

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // ✅ Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ✅ Close when clicking a link
  const handleLinkClick = () => setIsOpen(false);
   // Close Bootstrap collapse manually
  const navbarCollapse = document.getElementById("navbarSupportedContent");
  if (navbarCollapse?.classList.contains("show")) {
    navbarCollapse.classList.remove("show");
  };

  return (
    <nav className="navbar navbar-expand-lg main-nav">
      <div className="container-fluid">
        <Link className="navbar-brand logo" to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Apollo Logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
        <Link className="dropdown-item" to="/book/hospital-request" onClick={handleLinkClick}>
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
