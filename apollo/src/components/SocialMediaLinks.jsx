// 📌 src/components/SocialMediaLinks.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaPhone } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./CSS/SocialMediaLinks.css";

const SocialMediaLinks = () => {
  const links = [
    { icon: <FaFacebookF />, url: "https://facebook.com/yourpage", label: "Facebook" },
    { icon: <FaInstagram />, url: "https://instagram.com/yourpage", label: "Instagram" },
    { icon: <FaXTwitter />, url: "https://twitter.com/yourpage", label: "X (Twitter)" },
    { icon: <FaYoutube />, url: "https://youtube.com/yourchannel", label: "YouTube" },
    { icon: <FaWhatsapp />, url: "https://wa.me/919999999999", label: "WhatsApp" },
    { icon: <FaPhone />, url: "tel:+919999999999", label: "Call" },
  ];

  return (
    <div className="social-media-container">
      {links.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
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
