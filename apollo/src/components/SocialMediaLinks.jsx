// =============================================
// 📁 src/components/SocialMediaLinks.jsx
// Production-ready social + contact links
// =============================================

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPhone,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./CSS/SocialMediaLinks.css";

const SocialMediaLinks = () => {
  const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";
  const PHONE = import.meta.env.VITE_PHONE_NUMBER || "+919999999999";

  const links = [
    { icon: <FaFacebookF />, url: "https://facebook.com/yourpage", label: "Facebook" },
    { icon: <FaInstagram />, url: "https://instagram.com/yourpage", label: "Instagram" },
    { icon: <FaXTwitter />, url: "https://twitter.com/yourpage", label: "X (Twitter)" },
    { icon: <FaYoutube />, url: "https://youtube.com/yourchannel", label: "YouTube" },
    { icon: <FaWhatsapp />, url: `https://wa.me/${WHATSAPP}`, label: "WhatsApp" },
    { icon: <FaPhone />, url: `tel:${PHONE}`, label: "Call" },
  ];

  return (
    <div className="social-media-container">
      {links.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target={item.url.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          aria-label={item.label}
          className="social-icon"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialMediaLinks;