// =============================================
// 📁 src/components/CallCTA.jsx
// Global Call CTA component
// Fetches phone dynamically from backend
// =============================================

import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./CSS/CallCTA.css";

export default function CallCTA({ label = "Call Clinic" }) {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchPhone = async () => {
      try {
        const res = await api.get(`${import.meta.env.VITE_API_URL}/api/call-cta`, {
          withCredentials: true
        });

        if (mounted && res.data?.phoneNumber) {
          setPhone(res.data.phoneNumber);
        }
      } catch {
        // silent fail for production
      }
    };

    fetchPhone();
    return () => (mounted = false);
  }, []);

  if (!phone) return null;

  return (
    <a
      href={`tel:${phone}`}
      className="callcta-btn-primary"
      aria-label="Call clinic"
    >
      {label}
    </a>
  );
}
