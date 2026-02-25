// =============================================
// 📁 clinic/Services/doctor.service.js
// Doctor Service Layer (COOKIE AUTH READY)
// =============================================

import axios from "axios";
import adminAxios from "./adminAxios";


const API = import.meta.env.VITE_API_URL;

// =============================================
// 🔒 ADMIN SERVICES (cookie auth via adminAxios)
// =============================================

// 🔹 Fetch all doctors (admin list view)
export const fetchDoctors = (params = {}) =>
  adminAxios.get("/doctors", { params });

// 🔹 Fetch single doctor (admin view / edit)
export const fetchDoctorById = (id) =>
  adminAxios.get(`/doctors/${id}`);

// 🔹 Create doctor
export const createDoctor = (formData) =>
  adminAxios.post("/doctors", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 🔹 Update doctor
export const updateDoctor = (id, formData) =>
  adminAxios.patch(`/doctors/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 🔹 Delete doctor (admin)
export const deleteDoctor = (id) =>
  adminAxios.delete(`/doctors/${id}`);

// =============================================
// 🗓️ OPD DATE MANAGEMENT (ADMIN)
// =============================================

export const updateDoctorOpdDates = (id, opdDates, mode = "add") =>
  adminAxios.patch(`/doctors/${id}/opd-dates`, {
    opdDates,
    mode,
  });

// =============================================
// 🌍 PUBLIC SERVICES (NO AUTH)
// =============================================

// 🔹 Public doctor listing
export const fetchPublicDoctors = (params = {}) =>
  axios.get(`${API}/api/doctors`, { params });

// 🔹 Public doctor details
export const fetchPublicDoctorById = (id) =>
  axios.get(`${API}/api/doctors/${id}`);
