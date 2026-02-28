// =============================================
// 📁 src/components/Navbar.jsx
// Premium Elegant Navbar
// Desktop: Always Sticky
// Mobile: Smart Hide on Scroll
// =============================================

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CSS/Navbar.css";
import logo from "../assets/apollo-logo.png";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [navVisible, setNavVisible] = useState(true);

  const navRef = useRef(null);
  const lastScrollY = useRef(0);

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
    setOpenDropdown(null);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeAll = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  // =============================================
  // CLOSE ON OUTSIDE CLICK
  // =============================================
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

// =============================================
// SMART SCROLL BEHAVIOR (IMPROVED)
// Desktop: Always visible
// Mobile:
//   - Hide after 100px scroll down
//   - Show only after 50px intentional scroll up
// =============================================
useEffect(() => {
  let ticking = false;
  let lastScroll = 0;
  let accumulatedUpScroll = 0;

  const handleScroll = () => {
    const isDesktop = window.innerWidth >= 1024;

    if (isDesktop) {
      setNavVisible(true);
      document.body.classList.remove("navbar-hidden");
      return;
    }

    const currentScroll = window.scrollY;
    const delta = currentScroll - lastScroll;

    // If near top → always show
    if (currentScroll <= 100) {
      setNavVisible(true);
      document.body.classList.remove("navbar-hidden");
      accumulatedUpScroll = 0;
      lastScroll = currentScroll;
      return;
    }

    // SCROLLING DOWN
    if (delta > 0) {
      accumulatedUpScroll = 0;
      setNavVisible(false);
      document.body.classList.add("navbar-hidden");
    }

    // SCROLLING UP
    if (delta < 0) {
      accumulatedUpScroll += Math.abs(delta);

      // Only show if scrolled up more than 50px intentionally
      if (accumulatedUpScroll > 50) {
        setNavVisible(true);
        document.body.classList.remove("navbar-hidden");
      }
    }

    lastScroll = currentScroll;
  };

  const optimizedScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", optimizedScroll);
  window.addEventListener("resize", optimizedScroll);

  return () => {
    window.removeEventListener("scroll", optimizedScroll);
    window.removeEventListener("resize", optimizedScroll);
  };
}, []);


  return (
    <nav
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

          <li className="dropdown">
            <button onClick={() => toggleDropdown("services")}>
              Services
            </button>

            <div className={`dropdown-menu ${openDropdown === "services" ? "show" : ""}`}>
              <Link to="/services/opd" onClick={closeAll}>OPD Consultation</Link>
              <Link to="/services/telemedicine" onClick={closeAll}>Telemedicine</Link>
              <Link to="/services/hospital-visit" onClick={closeAll}>Hospital Visit</Link>
              <Link to="/apollo-diagnostics" onClick={closeAll}>Apollo Diagnostics</Link>
              <Link to="/services/support-services" onClick={closeAll}>Other Services</Link>
            </div>
          </li>

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