// =============================================
// 📁 src/clinic/Services/specialty.service.js
// Specialty Service Layer
// PUBLIC + ADMIN separated
// =============================================

import axios from "axios";
import adminAxios from "./adminAxios";

const API = import.meta.env.VITE_API_URL;

// =====================================================
// 🌍 PUBLIC – Fetch active specialties
// =====================================================
export const fetchSpecialties = async () => {
  const res = await axios.get(`${API}/api/specialties`);
  return res.data;
};

// =====================================================
// 🔒 ADMIN – Create specialty
// =====================================================
export const createSpecialty = async (data) => {
  const res = await adminAxios.post("/specialties", data);
  return res.data;
};

// =====================================================
// 🔒 ADMIN – Soft delete specialty
// =====================================================
export const deleteSpecialty = async (id) => {
  const res = await adminAxios.delete(`/specialties/${id}`);
  return res.data;
};
