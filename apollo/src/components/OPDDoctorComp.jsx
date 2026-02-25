// =============================================
// 📁 src/components/OPDDoctors.jsx
// Clean Swiper OPD doctor slider
// Same structure as testimonial slider
// =============================================

import { useEffect, useState } from "react";
import api from "../services/api";
import DoctorCardOPD from "./DoctorCardOPD";
import "./CSS/OPDDoctorComp.css";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function OPDDoctors({ title = "OPD Doctors Available" }) {
  const [doctors, setDoctors] = useState([]);

      useEffect(() => {
        api
          .get("/api/doctors?visitType=OPD")
          .then((res) => setDoctors(res.data || []))
          .catch(() => setDoctors([]));
      }, []);

  if (!doctors.length) return null;

  return (
    <section className="opd-swiper-section">

      {title && (
        <h2 className="opd-swiper-title">
          {title}
        </h2>
      )}

      <div className="opd-swiper-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={doctors.length > 2}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 }
          }}
        >
          {doctors.map((doctor) => (
            <SwiperSlide key={doctor._id}>
              <DoctorCardOPD doctor={doctor} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
}
