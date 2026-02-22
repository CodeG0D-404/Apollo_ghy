// src/clinic/Services/testimonial.service.js

import axios from "axios";
import adminAxios from "./adminAxios";

// ==============================
// PUBLIC SERVICES
// ==============================

// 🌍 Get published testimonials (public website)
export const getPublicTestimonials = () =>
  axios.get(
    `${import.meta.env.VITE_API_URL}/api/testimonials/public`
  );

// ==============================
// ADMIN SERVICES
// ==============================

// 🔐 Get all testimonials (hidden + published)
export const getAdminTestimonials = () =>
  adminAxios.get("/testimonials/admin");

// 🔐 Get single testimonial (admin)
export const getAdminTestimonialById = (id) =>
  adminAxios.get(`/testimonials/admin/${id}`);

// 🔐 Create testimonial
export const createTestimonial = (data) =>
  adminAxios.post("/testimonials", data);

// 🔐 Update testimonial
export const updateTestimonial = (id, data) =>
  adminAxios.put(`/testimonials/${id}`, data);

// 🔐 Publish / Unpublish testimonial
export const updateTestimonialStatus = (id, status) =>
  adminAxios.patch(`/testimonials/${id}/status`, { status });

// 🔐 Delete testimonial (soft delete)
export const deleteTestimonial = (id) =>
  adminAxios.delete(`/testimonials/${id}`);
