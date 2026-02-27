// ============================================
// 📁 MobileFilterBar.jsx
// Secondary navbar (Mobile Only)
// Opens Left Sidebar Drawer
// ============================================

import React from "react";
import "./CSS/MobileFilterBar.css";

export default function MobileFilterBar({ onOpen = () => {} }) {
  return (
    <div className="mobile-filter-bar">
      <button
        type="button"
        className="mobile-filter-btn"
        onClick={onOpen}
        aria-label="Open Filters"
      >
        <span className="mobile-filter-icon">☰</span>
        <span>Filters</span>
      </button>
    </div>
  );
}