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
      setShowMobileFooter(window.scrollY > 80);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ================= DESKTOP FOOTER ================= */}
      <footer className="footer desktop-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <h4>Apollo Service Centre</h4>
              <p>
                Chennai, Tamil Nadu<br />
                India – 600001
              </p>
            </div>

            <div>
              <h4>Explore</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/doctors">Doctors</Link></li>
                <li><Link to="/contact">Contact</Link></li>
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
            © {new Date().getFullYear()} Apollo Service Centre. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ================= MOBILE iOS FOOTER ================= */}
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
          <span>Doctor</span>
        </Link>

        <Link to="/contact" className={isActive("/contact") ? "active" : ""}>
          <Phone />
          <span>Contact</span>
        </Link>
      </nav>
    </>
  );
}
