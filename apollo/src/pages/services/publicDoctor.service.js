// =============================================
// 📁 src/pages/services/publicDoctor.service.js
// Public Doctor APIs (NO AUTH)
// =============================================

import api from "../../services/api";

// 🔓 Public doctor list
export const getPublicDoctors = (params = {}) => {
  return api.get(`/api/doctors`, { params });
};

// 🔓 Public doctor details
export const getPublicDoctorById = (id) => {
  return api.get(`/api/doctors/${id}`);
};