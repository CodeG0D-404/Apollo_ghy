// =============================================
// 📁 src/components/Navbar.jsx
// Ultra Premium Sticky Navbar
// Desktop: Always visible
// Mobile: Smart hide + reveal system
// =============================================

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CSS/Navbar.css";
import logo from "../assets/apollo-logo.png";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [navVisible, setNavVisible] = useState(true);
  const [isShrunk, setIsShrunk] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  const navRef = useRef(null);

  // =============================================
  // TOGGLES
  // =============================================

  const toggleMobile = () => {
    setMobileOpen(prev => !prev);
    setOpenDropdown(null);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(prev => (prev === menu ? null : menu));
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
  // SMART SCROLL ENGINE
  // =============================================

  useEffect(() => {
    let lastScroll = 0;
    let accumulatedUpScroll = 0;
    let ticking = false;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScroll;
      const isDesktop = window.innerWidth >= 1024;

      // Shrink & shadow (all devices)
      setIsShrunk(currentScroll > 40);
      setHasShadow(currentScroll > 100);

      // =============================
      // DESKTOP: Always visible
      // =============================
      if (isDesktop) {
        setNavVisible(true);
        document.body.classList.remove("navbar-hidden");
        lastScroll = currentScroll;
        return;
      }

      // =============================
      // Always visible near top
      // =============================
      if (currentScroll <= 100) {
        setNavVisible(true);
        document.body.classList.remove("navbar-hidden");
        accumulatedUpScroll = 0;
        lastScroll = currentScroll;
        return;
      }

      // =============================
      // SCROLL DOWN → Hide
      // =============================
      if (delta > 0) {
        accumulatedUpScroll = 0;
        setNavVisible(false);
        document.body.classList.add("navbar-hidden");
      }

      // =============================
      // SCROLL UP → Reveal only after 50px
      // =============================
      if (delta < 0) {
        accumulatedUpScroll += Math.abs(delta);

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

    window.addEventListener("scroll", optimizedScroll, { passive: true });
    window.addEventListener("resize", optimizedScroll);

    return () => {
      window.removeEventListener("scroll", optimizedScroll);
      window.removeEventListener("resize", optimizedScroll);
    };
  }, []);

  // =============================================
  // RENDER
  // =============================================

  return (
    <nav
      ref={navRef}
      className={`main-nav
        ${navVisible ? "nav-show" : "nav-hide"}
        ${isShrunk ? "nav-shrink" : ""}
        ${hasShadow ? "nav-shadow" : ""}`}
    >
      <div className="nav-container">

        {/* LOGO */}
        <Link to="/" className="logo" onClick={closeAll}>
          <img src={logo} alt="Apollo Logo" />
        </Link>

        {/* HAMBURGER (Mobile) */}
        <div
          className={`hamburger ${mobileOpen ? "active" : ""}`}
          onClick={toggleMobile}
        >
          <span />
          <span />
          <span />
        </div>

        {/* NAV MENU */}
        <ul className={`nav-menu ${mobileOpen ? "active" : ""}`}>

          <li>
            <Link to="/" onClick={closeAll}>Home</Link>
          </li>

          {/* BOOK APPOINTMENT */}
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

          {/* SERVICES */}
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

          {/* INFORMATION */}
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