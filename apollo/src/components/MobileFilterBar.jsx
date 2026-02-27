// ============================================
// 📁 MobileFilterBar.jsx
// Full width mobile filter bar (below navbar)
// ============================================

import React from "react";
import "./CSS/MobileFilterBar.css";

export default function MobileFilterBar({ onOpen }) {
  return (
    <div className="mobile-filter-bar">
      <button className="mobile-filter-btn" onClick={onOpen}>
        ☰ Filters
      </button>
    </div>
  );
}