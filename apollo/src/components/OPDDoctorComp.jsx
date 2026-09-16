// =============================================
// 📁 src/components/OPDDoctors.jsx
// Premium OPD Doctor Swiper Section
// =============================================

import { useEffect, useState } from "react";
import api from "../services/api";
import DoctorCardOPD from "./DoctorCardOPD";
import "./CSS/OPDDoctorComp.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function OPDDoctors({
  title = "OPD Doctors Available"
}) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api
      .get("/api/doctors?visitType=OPD")
      .then((res) => {
        const doctorsData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.doctors)
          ? res.data.doctors
          : [];

        setDoctors(doctorsData);
      })
      .catch(() => {
        setDoctors([]);
      });
  }, []);

  if (!doctors.length) return null;

  return (
    <section className="opd-swiper-section">

      {/* Section Header */}
      <div className="opd-section-header">
        <span className="opd-section-label">Our Specialists</span>
        <h2 className="opd-swiper-title">
          {title.split(" ").slice(0, -1).join(" ")}{" "}
          <span>{title.split(" ").slice(-1)}</span>
        </h2>
        <div className="opd-section-divider" />
      </div>

      <div className="opd-swiper-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={2}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={doctors.length > 2}
          breakpoints={{
            0:    { slidesPerView: 1 },
            640:  { slidesPerView: 1 },
            768:  { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
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