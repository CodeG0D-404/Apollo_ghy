// ==================================================
// 📁 src/clinic/Services/booking.service.js
// PURPOSE:
// Centralized API service for booking operations
// - adminAxios for protected routes
// - axios for public booking creation
// ==================================================

import axios from "axios";
import adminAxios from "./adminAxios";

// ==============================
// 🔹 CREATE BOOKING (PUBLIC)
// Used by patient booking form
// ==============================
export const createBooking = (data) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/api/bookings`,
    data
  );
};

// ==============================
// 🔹 GET BOOKINGS (ADMIN)
// Supports filters:
// - visitType
// - archived
// - search
// ==============================
export const getBookings = (params) => {
  return adminAxios.get("/bookings", { params });
};

// ==============================
// 🔹 UPDATE BOOKING (ADMIN)
// Generic updater for:
// - Confirm
// - Decline
// - Archive
// - Restore
// - Date assignment
// ==============================
export const updateBooking = (id, payload) => {
  return adminAxios.patch(`/bookings/${id}`, payload);
};

// ==============================
// 🔹 CONVENIENCE HELPERS
// ==============================

// ✅ Confirm booking
export const confirmBooking = (id) =>
  updateBooking(id, { status: "Confirmed", archived: false });

// ❌ Decline booking
export const declineBooking = (id) =>
  updateBooking(id, { status: "Declined" });

// 📦 Archive booking
export const archiveBooking = (id) =>
  updateBooking(id, { archived: true });

// ♻️ Restore booking
export const restoreBooking = (id) =>
  updateBooking(id, { archived: false });

// 📅 Update appointment date
export const updateBookingDate = (id, payload) =>
  updateBooking(id, payload);

// ==============================
// 🔹 GET SINGLE BOOKING (ADMIN)
// ==============================
export const getBookingById = (id) => {
  return adminAxios.get(`/bookings/${id}`);


};
// ==============================
// 🔹 EMAIL TRIGGERS (ADMIN)
// Explicit manual email sending
// ==============================

// 📧 Send confirmation email
export const sendConfirmationEmail = (id) => {
  return adminAxios.post(`/bookings/${id}/send-confirmation-email`);
};

// 📧 Send date update email
export const sendDateUpdateEmail = (id) => {
  return adminAxios.post(`/bookings/${id}/send-date-update-email`);
};

// 📧 Send cancellation email
export const sendCancellationEmail = (id) => {
  return adminAxios.post(`/bookings/${id}/send-cancellation-email`);
};

