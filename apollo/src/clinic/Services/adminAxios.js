// src/clinic/Services/adminAxios.js
// =============================================
// Admin Axios: Cookie-auth client
// Falls back to mock data when dummy admin session (adminAuth) is active
// =============================================

import axios from "axios";
import {
  MOCK_DOCTORS,
  MOCK_SPECIALTIES,
  MOCK_TESTIMONIALS,
  MOCK_BLOGS,
} from "../../services/mockData";

// =============================================
// 🧾 MOCK DATA — Admin Panel
// Used when dummy admin session (adminAuth) is active
// =============================================

const MOCK_CONDITIONS = [
  { _id: "cond-1", name: "Coronary Artery Disease", active: true },
  { _id: "cond-2", name: "Hypertension", active: true },
  { _id: "cond-3", name: "Type 2 Diabetes", active: true },
  { _id: "cond-4", name: "Osteoarthritis", active: true },
  { _id: "cond-5", name: "Chronic Migraine", active: true },
  { _id: "cond-6", name: "Asthma & COPD", active: true },
  { _id: "cond-7", name: "Thyroid Disorders", active: true },
  { _id: "cond-8", name: "Fatty Liver Disease", active: true },
];

const MOCK_PATIENTS = [
  {
    _id: "pat-1",
    name: "Rajesh Kumar",
    phones: [{ number: "+91 98001 11111", primary: true }],
    emails: [{ address: "rajesh.kumar@example.com", primary: true }],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    archived: false,
  },
  {
    _id: "pat-2",
    name: "Sunita Bose",
    phones: [{ number: "+91 98002 22222", primary: true }],
    emails: [{ address: "sunita.bose@example.com", primary: true }],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    archived: false,
  },
  {
    _id: "pat-3",
    name: "Amit Das",
    phones: [{ number: "+91 98003 33333", primary: true }],
    emails: [{ address: "amit.das@example.com", primary: true }],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    archived: false,
  },
  {
    _id: "pat-4",
    name: "Priya Gogoi",
    phones: [{ number: "+91 98004 44444", primary: true }],
    emails: [{ address: "priya.gogoi@example.com", primary: true }],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    archived: false,
  },
  {
    _id: "pat-5",
    name: "Bikash Sharma",
    phones: [{ number: "+91 98005 55555", primary: true }],
    emails: [{ address: "bikash.sharma@example.com", primary: true }],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    archived: false,
  },
];

const MOCK_BOOKINGS = [
  {
    _id: "bk-1",
    patientName: "Rajesh Kumar",
    phone: "+91 98001 11111",
    email: "rajesh.kumar@example.com",
    visitType: "OPD",
    doctorId: "doc-1",
    doctorName: "Dr. Rajiv Sharma",
    specialty: "Cardiology",
    opdDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Confirmed",
    archived: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "bk-2",
    patientName: "Sunita Bose",
    phone: "+91 98002 22222",
    email: "sunita.bose@example.com",
    visitType: "Telemedicine",
    doctorId: "doc-2",
    doctorName: "Dr. Ananya Mukherjee",
    specialty: "General Medicine",
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Pending",
    archived: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "bk-3",
    patientName: "Amit Das",
    phone: "+91 98003 33333",
    email: "amit.das@example.com",
    visitType: "OPD",
    doctorId: "doc-3",
    doctorName: "Dr. Vikramaditya Barua",
    specialty: "Orthopedics",
    opdDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Pending",
    archived: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "bk-4",
    patientName: "Priya Gogoi",
    phone: "+91 98004 44444",
    email: "priya.gogoi@example.com",
    visitType: "Telemedicine",
    doctorId: "doc-4",
    doctorName: "Dr. Sanjay Goel",
    specialty: "Neurology",
    scheduledDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Declined",
    archived: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "bk-5",
    patientName: "Bikash Sharma",
    phone: "+91 98005 55555",
    email: "bikash.sharma@example.com",
    visitType: "OPD",
    doctorId: "doc-1",
    doctorName: "Dr. Rajiv Sharma",
    specialty: "Cardiology",
    opdDate: new Date().toISOString(), // today
    status: "Confirmed",
    archived: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_CALL_CTA = { phone: "+91 98765 43210", active: true };

// =============================================
// 🔍 Mock resolver — maps API URL to mock data
// Shapes match what each clinic page expects from res.data
// =============================================
function getMockAdminFallback(url = "", method = "get") {
  const u = (url || "").toLowerCase().replace(/\?.*$/, "");

  // ── Doctors ──────────────────────────────────────────────
  // Single doctor: /doctors/:id  → object
  if (/\/doctors\/[^/]+$/.test(u) && method === "get") {
    const id = u.split("/doctors/")[1];
    return MOCK_DOCTORS.find((d) => d._id === id) || MOCK_DOCTORS[0];
  }
  // List: /doctors  → array (ViewDoctor expects res.data to be array)
  if (u.includes("/doctors")) return MOCK_DOCTORS;

  // ── Specialties ───────────────────────────────────────────
  // SpecialtyList via fetchSpecialties() → res.data = array
  if (u.includes("/specialt")) return MOCK_SPECIALTIES;

  // ── Conditions ────────────────────────────────────────────
  // ConditionList via fetchConditions() → res.data = array
  if (u.includes("/condition")) return MOCK_CONDITIONS;

  // ── Patients ──────────────────────────────────────────────
  // Single patient detail: /patients/:id → { patient, bookings }
  if (/\/patients\/[^/]+\/details/.test(u) && method === "get") {
    const id = u.split("/patients/")[1].split("/")[0];
    const patient = MOCK_PATIENTS.find((p) => p._id === id) || MOCK_PATIENTS[0];
    return { patient, bookings: MOCK_BOOKINGS.filter((b) => b.patientName === patient.name) };
  }
  if (/\/patients\/[^/]+$/.test(u) && method === "get") {
    const id = u.split("/patients/")[1];
    return MOCK_PATIENTS.find((p) => p._id === id) || MOCK_PATIENTS[0];
  }
  // List: PatientList expects res.data.patients & res.data.pagination.totalPages
  if (u.includes("/patients")) {
    return { patients: MOCK_PATIENTS, pagination: { totalPages: 1, currentPage: 1, total: MOCK_PATIENTS.length } };
  }

  // ── Bookings ──────────────────────────────────────────────
  // Single booking: /bookings/:id
  if (/\/bookings\/[^/]+$/.test(u) && method === "get") {
    const id = u.split("/bookings/")[1];
    return { booking: MOCK_BOOKINGS.find((b) => b._id === id) || MOCK_BOOKINGS[0] };
  }
  // Update booking: PATCH /bookings/:id → returns updated booking
  if (/\/bookings\/[^/]+$/.test(u) && ["patch", "put"].includes(method)) {
    const id = u.split("/bookings/")[1];
    return { booking: MOCK_BOOKINGS.find((b) => b._id === id) || MOCK_BOOKINGS[0] };
  }
  // List: BookingList expects res.data.bookings & res.data.pagination.totalPages
  if (u.includes("/booking")) {
    return {
      bookings: MOCK_BOOKINGS,
      pagination: { totalPages: 1, currentPage: 1, total: MOCK_BOOKINGS.length },
    };
  }

  // ── Testimonials ──────────────────────────────────────────
  // TestimonialList: res.data = array
  if (u.includes("/testimonial")) return MOCK_TESTIMONIALS;

  // ── Blogs ─────────────────────────────────────────────────
  // BlogList: res.data.blogs or array
  if (u.includes("/blog")) return { blogs: MOCK_BLOGS, total: MOCK_BLOGS.length, pages: 1 };

  // ── Call CTA ──────────────────────────────────────────────
  if (u.includes("/call-cta")) return MOCK_CALL_CTA;

  // ── Hospital requests ─────────────────────────────────────
  if (u.includes("/hospital-request")) return { requests: [], total: 0, pages: 1 };

  // ── Inquiry CTA ───────────────────────────────────────────
  if (u.includes("/inquiry") || u.includes("/cta")) return { inquiries: [], total: 0, pages: 1 };

  // ── Mutating endpoints (POST/PATCH/PUT/DELETE) ────────────
  if (["post", "patch", "put", "delete"].includes(method)) {
    return { success: true, message: "Demo mode: action simulated successfully." };
  }

  return null;
}


// =============================================
// 🔐 Admin Axios instance
// =============================================
const adminAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
  withCredentials: true, // 🔐 IMPORTANT: send cookies automatically
});

// =============================================
// Response interceptor
// =============================================
adminAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    const isDummySession = localStorage.getItem("adminAuth") === "true";

    if (isDummySession) {
      // 🧪 Dummy session: return mock data instead of error
      const url =
        err?.config?.url ||
        err?.request?.responseURL ||
        "";
      const method = (err?.config?.method || "get").toLowerCase();
      const fallback = getMockAdminFallback(url, method);

      if (fallback !== null) {
        return Promise.resolve({
          data: fallback,
          status: 200,
          statusText: "OK (Demo Mode)",
          headers: {},
          config: err?.config || {},
        });
      }

      // Even if no fallback matched, don't redirect — return empty success
      return Promise.resolve({
        data: { success: true, message: "Demo mode." },
        status: 200,
        statusText: "OK (Demo Mode)",
        headers: {},
        config: err?.config || {},
      });
    }

    // If not authenticated and NOT dummy session → redirect to login
    if (err.response?.status === 401) {
      window.location.href = "/clinic/login";
    }

    return Promise.reject(err);
  }
);

// =============================================
// Request interceptor: intercept BEFORE the network call in dummy mode
// =============================================
adminAxios.interceptors.request.use(
  async (config) => {
    const isDummySession = localStorage.getItem("adminAuth") === "true";

    if (isDummySession) {
      // Intercept the request and return mock data immediately
      const url = config.url || "";
      const method = (config.method || "get").toLowerCase();
      const fallback = getMockAdminFallback(url, method);

      if (fallback !== null) {
        // Throw a special "cancel" to short-circuit, then resolve in response interceptor
        // Instead, use a custom approach: override adapter
        config.adapter = () =>
          Promise.resolve({
            data: fallback,
            status: 200,
            statusText: "OK (Demo Mode)",
            headers: {},
            config,
            request: {},
          });
      } else {
        // Default success for unknown routes in demo mode
        config.adapter = () =>
          Promise.resolve({
            data: { success: true, message: "Demo mode." },
            status: 200,
            statusText: "OK (Demo Mode)",
            headers: {},
            config,
            request: {},
          });
      }
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default adminAxios;
