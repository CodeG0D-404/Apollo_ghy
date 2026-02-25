// =============================================
// 📁 src/clinic/CallCTAedit.jsx
// Admin panel — Edit global call CTA number
// Scoped + CSS bleed proof
// =============================================

import React, { useEffect, useState } from "react";
import adminAxios from "./Services/adminAxios";
import "./styles/CallCTA.css";

export default function CallCTAedit() {

  const [currentNumber, setCurrentNumber] = useState("");
  const [inputNumber, setInputNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCurrentNumber();
  }, []);

  const fetchCurrentNumber = async () => {
    try {
        const res = await adminAxios.get("/call-cta");

      if (res.data?.phoneNumber) {
        setCurrentNumber(res.data.phoneNumber);
      }
    } catch {
      setError("Unable to load current number");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setInputNumber(value);
      setError("");
    }
  };

  const handleSave = async () => {
    setError("");
    setMessage("");

    if (inputNumber.length < 10) {
      setError("Incorrect number");
      return;
    }

    try {
      const formattedNumber = `91${inputNumber}`;

      await adminAxios.put("/call-cta", {
        phoneNumber: formattedNumber,
      });

      setMessage("Number updated successfully");
      setInputNumber("");
      fetchCurrentNumber(); // smoother than reload

    } catch {
      setError("Update failed");
    }
  };

  return (
    <div className="callcta-page">

      <h2 className="callcta-title">Call CTA Settings</h2>

      {/* Current number */}
      <div className="callcta-card">
        <label className="callcta-label">Current Number</label>
        <div className="callcta-current-number">
          {currentNumber || "Not set"}
        </div>
      </div>

      {/* Replace form */}
      <div className="callcta-card">
        <label className="callcta-label">Update Number</label>

        <div className="callcta-input-group">
          <span className="callcta-prefix">+91</span>
          <input
            type="text"
            value={inputNumber}
            onChange={handleChange}
            placeholder="Enter 10 digit number"
          />
        </div>

        <button onClick={handleSave} className="callcta-save-btn">
          Save Number
        </button>

        {message && <p className="callcta-success">{message}</p>}
        {error && <p className="callcta-error">{error}</p>}
      </div>

    </div>
  );
}
