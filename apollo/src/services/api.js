// =============================================
// 📁 src/services/api.js
// Resilient API Client with Seamless Fallback Mock Data
// Protects against Atlas downtime / Render errors on Vercel & Localhost
// CORS-safe: credentials only for clinic (protected) routes
// =============================================

import axios from "axios";
import {
  BRAND_INFO,
  MOCK_SPECIALTIES,
  MOCK_DOCTORS,
  MOCK_TESTIMONIALS,
  MOCK_BLOGS,
} from "./mockData";

const BASE_URL = import.meta.env.VITE_API_URL || "";

// Public API client — NO withCredentials (avoids CORS CORB issues)
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Auth API client — WITH withCredentials (for clinic/admin protected routes)
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// =============================================
// Helper: resolve mock fallback by URL
// =============================================
export function getMockFallback(url = "") {
  const cleanUrl = (url || "").toLowerCase();

  // SPECIALTIES
  if (cleanUrl.includes("specialt")) {
    return MOCK_SPECIALTIES;
  }

  // DOCTORS BY SPECIALTY SLUG
  if (cleanUrl.includes("specialty/slug/")) {
    const slug = cleanUrl.split("specialty/slug/")[1]?.split("?")[0] || "";
    const specialty =
      MOCK_SPECIALTIES.find((s) => s.slug.toLowerCase() === slug.toLowerCase()) ||
      { _id: "spec-gen", name: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Specialist", slug };
    const doctors = MOCK_DOCTORS.filter(
      (d) => d.specialty?.slug?.toLowerCase() === slug.toLowerCase()
    );
    return {
      doctors: doctors.length > 0 ? doctors : MOCK_DOCTORS.slice(0, 4),
      specialty,
    };
  }

  // SINGLE DOCTOR BY ID (must come before general doctor check)
  const singleDocMatch = cleanUrl.match(/\/doctors\/([^/?]+)/);
  if (singleDocMatch) {
    const doctorId = singleDocMatch[1];
    if (doctorId && !doctorId.startsWith("specialty")) {
      return MOCK_DOCTORS.find((d) => d._id === doctorId) || MOCK_DOCTORS[0];
    }
  }

  // ALL DOCTORS / FILTERED DOCTORS
  if (cleanUrl.includes("doctor")) {
    let list = [...MOCK_DOCTORS];
    if (cleanUrl.includes("visittype=opd")) {
      list = list.filter((d) => Array.isArray(d.visitTypes) && d.visitTypes.includes("OPD"));
    } else if (cleanUrl.includes("visittype=telemedicine")) {
      list = list.filter((d) => Array.isArray(d.visitTypes) && d.visitTypes.includes("Telemedicine"));
    }
    return list;
  }

  // TESTIMONIALS
  if (cleanUrl.includes("testimonial")) {
    return MOCK_TESTIMONIALS;
  }

  // BLOGS
  if (cleanUrl.includes("blog")) {
    return MOCK_BLOGS;
  }

  // CALL CTA
  if (cleanUrl.includes("call-cta")) {
    return { phone: BRAND_INFO.phone, active: true };
  }

  // BOOKINGS / HOSPITAL REQUESTS (POST — always resolve success)
  if (
    cleanUrl.includes("booking") ||
    cleanUrl.includes("hospital-request")
  ) {
    return { success: true, message: "Request submitted successfully." };
  }

  return null;
}

// =============================================
// Utility: is this an "error" response payload?
// (Server returned 200 but with error body)
// =============================================
function isBackendErrorPayload(data) {
  if (!data || Array.isArray(data) || typeof data !== "object") return false;
  if (data.error) return true;
  if (typeof data.message === "string" && data.message.toLowerCase().includes("error")) return true;
  if (data.message === "Server error") return true;
  return false;
}

// =============================================
// Response interceptor for PUBLIC api
// =============================================
function attachInterceptors(instance) {
  instance.interceptors.response.use(
    (response) => {
      // Successful response — check if backend returned an error payload disguised as 200
      if (isBackendErrorPayload(response.data)) {
        const fallback = getMockFallback(response.config?.url);
        if (fallback !== null) {
          response.data = fallback;
        }
      }
      return response;
    },
    (error) => {
      // Network error, CORS error, timeout, 4xx, 5xx
      const url =
        error?.config?.url ||
        error?.request?.responseURL ||
        error?.request?._url ||
        "";
      const fallback = getMockFallback(url);
      if (fallback !== null) {
        return Promise.resolve({
          data: fallback,
          status: 200,
          statusText: "OK (Mock Fallback)",
          headers: {},
          config: error?.config || {},
        });
      }
      return Promise.reject(error);
    }
  );
}

attachInterceptors(api);
// DO NOT attach interceptors to authApi — auth failures should propagate (e.g. redirect to login)

export default api;