// =============================================
// 📁 src/components/testimonial/TestimonialSlider.jsx
// Production Swiper testimonial slider
// Centered, responsive, sidebar-safe
// =============================================

import { useEffect, useState } from "react";
import axios from "axios";
import TestimonialCard from "./TestimonialCard";
import "./CSS/TestimonialSlider.css";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function TestimonialSlider({ title }) {
  const [testimonials, setTestimonials] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/testimonials/public`)
      .then((res) => setTestimonials(res.data || []))
      .catch(() => setTestimonials([]));
  }, [API_BASE]);

  if (!testimonials.length) return null;

  return (
    <section className="testimonial-swiper-section">

      {title && (
        <h2 className="testimonial-swiper-title">
          {title}
        </h2>
      )}

      <div className="testimonial-swiper-container">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={testimonials.length > 3}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item._id}>
              <TestimonialCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
}
