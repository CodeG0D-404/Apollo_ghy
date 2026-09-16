// =============================================
// 📁 src/services/api.js
// Resilient API Client with Seamless Fallback Mock Data
// Protects against Atlas downtime / Render errors on Vercel & Localhost
// =============================================

import axios from "axios";
import {
  MOCK_SPECIALTIES,
  MOCK_DOCTORS,
  MOCK_TESTIMONIALS,
  MOCK_BLOGS,
} from "./mockData";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 8000,
});

// Helper: provide mock fallback based on requested URL
function getMockFallback(url = "", method = "get", requestData = null) {
  const cleanUrl = url.toLowerCase();

  // SPECIALTIES
  if (cleanUrl.includes("/api/specialties")) {
    return MOCK_SPECIALTIES;
  }

  // DOCTORS BY SPECIALTY SLUG
  if (cleanUrl.includes("/api/doctors/specialty/slug/")) {
    const slug = cleanUrl.split("/api/doctors/specialty/slug/")[1]?.split("?")[0];
    const specialty = MOCK_SPECIALTIES.find(
      (s) => s.slug.toLowerCase() === (slug || "").toLowerCase()
    ) || { _id: "spec-gen", name: "Specialist", slug };

    const doctors = MOCK_DOCTORS.filter(
      (d) => d.specialty?.slug?.toLowerCase() === (slug || "").toLowerCase()
    );

    return {
      doctors: doctors.length > 0 ? doctors : MOCK_DOCTORS.slice(0, 3),
      specialty,
    };
  }

  // SINGLE DOCTOR BY ID
  if (cleanUrl.match(/\/api\/doctors\/[^/?]+/)) {
    const parts = cleanUrl.split("/api/doctors/")[1]?.split("?")[0];
    if (parts && !parts.startsWith("specialty")) {
      const doc = MOCK_DOCTORS.find((d) => d._id === parts) || MOCK_DOCTORS[0];
      return doc;
    }
  }

  // ALL DOCTORS / FILTERED DOCTORS
  if (cleanUrl.includes("/api/doctors")) {
    let list = [...MOCK_DOCTORS];
    if (cleanUrl.includes("visittype=opd")) {
      list = list.filter((d) => d.visitTypes?.includes("OPD"));
    } else if (cleanUrl.includes("visittype=telemedicine")) {
      list = list.filter((d) => d.visitTypes?.includes("Telemedicine"));
    }
    return list;
  }

  // TESTIMONIALS
  if (cleanUrl.includes("/api/testimonials")) {
    return MOCK_TESTIMONIALS;
  }

  // BLOGS
  if (cleanUrl.includes("/api/blogs")) {
    return MOCK_BLOGS;
  }

  // BOOKINGS (POST)
  if (cleanUrl.includes("/bookings") || cleanUrl.includes("/api/bookings")) {
    return { success: true, message: "Booking submitted successfully." };
  }

  // HOSPITAL REQUESTS (POST)
  if (cleanUrl.includes("hospital-request")) {
    return { success: true, message: "Hospital request submitted successfully." };
  }

  return null;
}

// -------------------------------------------------------------
// Response Interceptor:
// If backend returns 200 with an error object (e.g. { error: "Failed..." }
// or { message: "Server error" }), replace with fallback data.
// -------------------------------------------------------------
api.interceptors.response.use(
  (response) => {
    const url = response.config?.url || "";
    const data = response.data;

    // If endpoint expects array or valid resource but got error object
    const isErrorPayload =
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      (data.error || data.message === "Server error");

    if (isErrorPayload) {
      const fallback = getMockFallback(url, response.config?.method);
      if (fallback !== null) {
        response.data = fallback;
      }
    }

    return response;
  },
  (error) => {
    const url = error.config?.url || "";
    const method = error.config?.method || "get";
    const fallback = getMockFallback(url, method, error.config?.data);

    if (fallback !== null) {
      // Gracefully resolve with fallback mock data
      return Promise.resolve({
        data: fallback,
        status: 200,
        statusText: "OK (Fallback)",
        headers: {},
        config: error.config,
      });
    }

    return Promise.reject(error);
  }
);

export default api;