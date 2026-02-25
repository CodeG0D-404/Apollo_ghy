// =============================
// 📁 App.jsx
// Main entry point for routing across public and clinic sections
// =============================

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// =============================
// 🧭 Layout Components
// =============================
import Navbar from "./components/Navbar";
import FloatingChat from "./components/FloatingChat";

/* ============================= */
/* 🆕 Footer Component (ADDED)   */
/* ============================= */
import Footer from "./components/Footer";

// =============================
// 🌐 Public Pages
// =============================
import Home from "./pages/Home";
import DoctorsList from "./pages/DoctorsList";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Production from "./pages/Production";
import DoctorProfile from "./pages/DoctorProfile";

// =============================
// 🩺 Public Service Pages
// =============================
import OpdServices from "./pages/OpdServices";
import TelemedicineServices from "./pages/TelemedicineServices";
import HospitalVisitServices from "./pages/HospitalVisitServices";
import SupportServices from "./pages/SupportServices";


// =============================
// 📄 Public Blog Pages
// =============================
import Blogs from "./pages/Blogs";
import BlogPublicView from "./pages/BlogPublicView";

// =============================
// 📁 Booking Form (Public)
// =============================
import BookingForm from "./pages/BookingForm";
import HospitalRequestForm from "./pages/HospitalRequestForm";

// =============================
// 📞 CTA Management (Clinic)
// =============================
import CallCTAedit from "./clinic/CallCTAedit";
// =============================
// 📩 Inquiry Leads Management
// =============================
import InquiryCTAList from "./clinic/InquiryCTAList";



// =============================
// 📄 Legal Pages
// =============================
import MedicalDisclaimer from "./pages/MedicalDisclaimer";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// =============================
// 🏥 Clinic / Admin Auth
// =============================
import Login from "./clinic/Login";
import Dashboard from "./clinic/Dashboard";
import PrivateRoute from "./clinic/PrivateRoute";
import AdminLayout from "./clinic/components/AdminLayout";

// =============================
// 👨‍⚕️ Doctor Management (Clinic)
// =============================
import AddDoctor from "./clinic/AddDoctor";
import ViewDoctor from "./clinic/ViewDoctor";
import DoctorDetails from "./clinic/DoctorDetails";
import EditDoctor from "./clinic/EditDoctor";
import SpecialtyList from "./clinic/SpecialtyList";
import ConditionList from "./clinic/ConditionList";

// =============================
// 📝 Blog Management (Clinic)
// =============================
import BlogCreate from "./clinic/BlogCreate";
import BlogList from "./clinic/BlogList";
import BlogViewPage from "./clinic/BlogViewPage";

// =============================
// ⭐ Testimonial Management (Clinic)
// =============================
import TestimonialCreate from "./clinic/TestimonialCreate";
import TestimonialList from "./clinic/TestimonialList";
import TestimonialView from "./clinic/TestimonialView";

// =============================
// 👨‍👩‍👧 Patient Management (Clinic)
// =============================
import PatientList from "./clinic/PatientList";
import PatientDetails from "./clinic/PatientDetails";
import AddPatient from "./clinic/AddPatient";
import EditPatient from "./clinic/EditPatient";

// =============================
// 📁 Booking Management (Clinic)
// =============================
import BookingList from "./clinic/BookingList";
import HospitalBooking from "./clinic/HospitalBooking";


      function App() {
        return (
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* all your routes */}
            </Routes>
          </BrowserRouter>
        );
      }


// ======================================================
// 🔀 AppContent – Handles routing + layout visibility
// ======================================================
function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/clinic");

  return (
    <>
      {/* ============================= */}
      {/* 🌐 Public Layout Components */}
      {/* ============================= */}
      {!hideNavbar && <Navbar />}
      {!hideNavbar && <FloatingChat />}

      {/* ============================= */}
      {/* 🚦 Application Routes */}
      {/* ============================= */}
      <main>
        <Routes>

          {/* ============================= */}
          {/* 🌐 Public Routes */}
          {/* ============================= */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/specialty/:slug" element={<DoctorsList />} />
          <Route path="/services/opd" element={<OpdServices />} />
          <Route path="/services/telemedicine" element={<TelemedicineServices />} />
          <Route path="/services/hospital-visit" element={<HospitalVisitServices />} />
          <Route path="/services/support-services" element={<SupportServices />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/production" element={<Production />} />

          {/* ============================= */}
          {/* 🩺 Booking & Doctor Profiles */}
          {/* ============================= */}
          <Route path="/booking/:doctorId/:visitType" element={<BookingForm />} />
          <Route path="/doctor/:id/:visitType" element={<DoctorProfile />} />
          <Route path="/hospital-request" element={<HospitalRequestForm />} />

          {/* ============================= */}
          {/* 📰 Public Blog Routes */}
          {/* ============================= */}
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPublicView />} />

          {/* ============================= */}
          {/* 📄 Legal Routes */}
          {/* ============================= */}
          <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* ============================= */}
          {/* 🔐 Clinic Login */}
          {/* ============================= */}
          <Route path="/clinic/login" element={<Login />} />

          {/* ============================= */}
          {/* 🔐 Protected Clinic Routes */}
          {/* ============================= */}
          <Route
            path="/clinic/dashboard"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          {/* ============================= */}
{/* 📞 Call CTA Management */}
{/* ============================= */}
<Route
  path="/clinic/call-cta"
  element={
    <PrivateRoute>
      <AdminLayout>
        <CallCTAedit />
      </AdminLayout>
    </PrivateRoute>
  }
/>

{/* ============================= */}
{/* 📩 Inquiry Leads Management */}
{/* ============================= */}
<Route
  path="/clinic/inquiry-leads"
  element={
    <PrivateRoute>
      <AdminLayout>
        <InquiryCTAList />
      </AdminLayout>
    </PrivateRoute>
  }
/>



          {/* ============================= */}
          {/* 👨‍⚕️ Doctor Management */}
          {/* ============================= */}
          <Route
            path="/clinic/doctors"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ViewDoctor />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/doctors/add"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <AddDoctor />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/doctors/:id"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <DoctorDetails />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/doctors/:id/edit"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <EditDoctor />
                </AdminLayout>
              </PrivateRoute>
            }
          />

          {/* ============================= */}
          {/* 🧠 Specialty & Conditions */}
          {/* ============================= */}
          <Route
            path="/clinic/specialties"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <SpecialtyList />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/conditions"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ConditionList />
                </AdminLayout>
              </PrivateRoute>
            }
          />

          {/* ============================= */}
          {/* 👨‍👩‍👧 Patient Management */}
          {/* ============================= */}
          <Route
            path="/clinic/patients"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <PatientList />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
              path="/clinic/patients/add"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <AddPatient />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
          <Route
            path="/clinic/patients/:id"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <PatientDetails />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/patients/:id/edit"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <EditPatient />
                </AdminLayout>
              </PrivateRoute>
            }
          />

          {/* ============================= */}
          {/* 📁 Blog Management (Clinic) */}
          {/* ============================= */}
          <Route
            path="/clinic/blogs"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BlogList />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/blogs/create"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BlogCreate />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/blogs/:id"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BlogViewPage />
                </AdminLayout>
              </PrivateRoute>
            }
          />

          {/* ============================= */}
          {/* ⭐ Testimonial Management */}
          {/* ============================= */}
          <Route
            path="/clinic/testimonials"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <TestimonialList />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/testimonials/create"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <TestimonialCreate />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/testimonials/:id"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <TestimonialView />
                </AdminLayout>
              </PrivateRoute>
            }
          />

          {/* ============================= */}
          {/* 📁 Booking Management */}
          {/* ============================= */}
          <Route
            path="/clinic/booking/opd"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BookingList bookingType="opd" isArchive={false} />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/booking/telemedicine"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BookingList bookingType="telemedicine" isArchive={false} />
                </AdminLayout>
              </PrivateRoute>
            }
          />
            {/* ============================= */}
            {/* 🏥 Hospital Booking Management */}
            {/* ============================= */}
            <Route
              path="/clinic/hospital-booking"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <HospitalBooking />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/clinic/hospital-booking/archive"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <HospitalBooking isArchive={true} />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

          {/* <Route
            path="/clinic/booking/hospital-visit"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BookingList bookingType="hospital-visit" isArchive={false} />
                </AdminLayout>
              </PrivateRoute>
            }
          /> */}

          {/* ============================= */}
          {/* 🗄 Archive Booking Routes */}
          {/* ============================= */}
          <Route
            path="/clinic/booking/archive/opd"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BookingList bookingType="opd" isArchive={true} />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/booking/archive/telemedicine"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BookingList bookingType="telemedicine" isArchive={true} />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clinic/booking/archive/hospital-visit"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <BookingList bookingType="hospital-visit" isArchive={true} />
                </AdminLayout>
              </PrivateRoute>
            }
          />

        </Routes>
      </main>

      {/* ============================= */}
      {/* 🆕 Public Footer (ADDED) */}
      {/* ============================= */}
      {!hideNavbar && <Footer />}
    </>
  );
}


// =============================
// 🚀 App Root
// =============================
function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
