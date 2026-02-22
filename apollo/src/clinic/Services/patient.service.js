// =============================================
// 📁 clinic/Services/patient.service.js
// Patient Service Layer (Production Ready)
// Cookie-auth compatible
// =============================================

import adminAxios from "./adminAxios";

// =====================================================
// 🔒 ADMIN PATIENT APIs
// Protected via httpOnly cookie
// =====================================================

// 🔹 Fetch patients (pagination + search + archived toggle)
export const fetchPatients = (params) =>
  adminAxios.get("/patients", { params });

// 🔹 Fetch single patient basic info
export const fetchPatientById = (id) =>
  adminAxios.get(`/patients/${id}`);

// 🔹 Fetch patient + bookings
export const fetchPatientDetails = (id) =>
  adminAxios.get(`/patients/${id}/details`);

// 🔹 Create patient (admin form)
export const createPatient = (data) =>
  adminAxios.post("/patients", data);

// 🔹 Update patient (selective PATCH)
export const updatePatient = (id, data) =>
  adminAxios.patch(`/patients/${id}`, data);

// 🔹 Archive patient (soft delete)
export const archivePatient = (id) =>
  adminAxios.delete(`/patients/${id}`);


// =====================================================
// 📞 PHONE MANAGEMENT
// =====================================================

// 🔹 Add phone
export const addPatientPhone = (id, data) =>
  adminAxios.post(`/patients/${id}/phone`, data);

// 🔹 Remove phone
export const removePatientPhone = (id, data) =>
  adminAxios.delete(`/patients/${id}/phone`, { data });

// 🔹 Set primary phone
export const setPrimaryPhone = (id, data) =>
  adminAxios.patch(`/patients/${id}/phone/primary`, data);


// =====================================================
// 📧 EMAIL MANAGEMENT
// =====================================================

// 🔹 Add email
export const addPatientEmail = (id, data) =>
  adminAxios.post(`/patients/${id}/email`, data);

// 🔹 Remove email
export const removePatientEmail = (id, data) =>
  adminAxios.delete(`/patients/${id}/email`, { data });

// 🔹 Set primary email
export const setPrimaryEmail = (id, data) =>
  adminAxios.patch(`/patients/${id}/email/primary`, data);
