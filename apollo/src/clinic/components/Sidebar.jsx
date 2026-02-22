// =============================================
// 📁 src/clinic/components/Sidebar.jsx
// Admin Sidebar — Scoped & CSS-safe
// =============================================

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

import {
  Home,
  Users,
  Stethoscope,
  ClipboardList,
  Calendar,
  LogOut,
  FileText,
  Phone,
  MessageSquare
} from "lucide-react";

const API = `${import.meta.env.VITE_API_URL}/api`;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuKey) =>
    setOpenMenu(openMenu === menuKey ? null : menuKey);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await fetch(`${API}/clinic/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    navigate("/clinic/login");
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <Home size={18} />, path: "/clinic/dashboard" },
    { key: "specialty", label: "Specialty", icon: <Stethoscope size={18} />, path: "/clinic/specialties" },
    { key: "conditions", label: "Conditions", icon: <ClipboardList size={18} />, path: "/clinic/conditions" },
    { key: "patients", label: "Patient List", icon: <FileText size={18} />, path: "/clinic/patients" },

    { key: "callcta", label: "CTA Phone", icon: <Phone size={18} />, path: "/clinic/call-cta" },
    { key: "inquiry", label: "Inquiry Leads", icon: <MessageSquare size={18} />, path: "/clinic/inquiry-leads" },

    {
      key: "doctor",
      label: "Doctor",
      icon: <Users size={18} />,
      children: [
        { label: "Add Doctor", path: "/clinic/doctors/add" },
        { label: "View Doctor", path: "/clinic/doctors" },
      ],
    },
    {
      key: "booking",
      label: "Booking",
      icon: <Calendar size={18} />,
      children: [
        { label: "OPD Booking", path: "/clinic/booking/opd" },
        { label: "Telemedicine Booking", path: "/clinic/booking/telemedicine" },
        { label: "Hospital Requests", path: "/clinic/hospital-booking" },
      ],
    },
    {
      key: "archive",
      label: "Archive",
      icon: <Calendar size={18} />,
      children: [
        { label: "OPD Archive", path: "/clinic/booking/archive/opd" },
        { label: "Telemedicine Archive", path: "/clinic/booking/archive/telemedicine" },
        { label: "Archived Hospital Requests", path: "/clinic/hospital-booking/archive" },
      ],
    },
  
    {
      key: "blog",
      label: "Blog",
      icon: <FileText size={18} />,
      children: [
        { label: "Add Blog", path: "/clinic/blogs/create" },
        { label: "View Blogs", path: "/clinic/blogs" },
      ],
    },
    {
      key: "testimonial",
      label: "Testimonial",
      icon: <ClipboardList size={18} />,
      children: [
        { label: "Add Testimonial", path: "/clinic/testimonials/create" },
        { label: "View Testimonials", path: "/clinic/testimonials" },
      ],
    },
  ];

  return (
    <aside className="admin-sidebar">

      <div className="admin-sidebar-header">Admin Panel</div>

      <ul className="admin-sidebar-nav">
        {menuItems.map((item) =>
          item.children ? (
            <li key={item.key}>
              <button
                type="button"
                className={`admin-nav-item admin-dropdown ${openMenu === item.key ? "open" : ""}`}
                onClick={() => toggleMenu(item.key)}
              >
                <span className="admin-nav-left">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                <span className="admin-arrow">{openMenu === item.key ? "▲" : "▼"}</span>
              </button>

              {openMenu === item.key && (
                <ul className="admin-submenu">
                  {item.children.map((sub) => (
                    <li key={sub.path}>
                      <Link
                        to={sub.path}
                        className={isActive(sub.path) ? "active" : ""}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ) : (
            <li key={item.key}>
              <Link
                to={item.path}
                className={`admin-nav-item ${isActive(item.path) ? "active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          )
        )}
      </ul>

      <div className="admin-sidebar-footer">
        <button className="admin-nav-item logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
