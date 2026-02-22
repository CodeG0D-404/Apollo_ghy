import React from "react";
import { useNavigate } from "react-router-dom";

const Production = () => {
  const navigate = useNavigate();

  const handleNavigate = (visitType) => {
    navigate(`/doctors?visitType=${visitType}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px", gap: "20px" }}>
      <h1>Welcome to Apollo Hospital</h1>
      <button onClick={() => handleNavigate("OPD")} style={{ padding: "10px 20px", fontSize: "16px" }}>
        OPD Doctors
      </button>
      <button onClick={() => handleNavigate("Telemedicine")} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Telemedicine Doctors
      </button>
      <button onClick={() => handleNavigate("Hospital Visit")} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Hospital Visit Doctors
      </button>
    </div>
  );
};

export default Production;
