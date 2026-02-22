// =============================================
// 📁 src/components/testimonial/TestimonialCard.jsx
// Production testimonial card
// Scoped, accessible, safe image handling
// =============================================

import "./CSS/TestimonialCard.css";

export default function TestimonialCard({ item }) {
  const API_BASE = import.meta.env.VITE_API_URL || "";

  const rating = Math.max(0, Math.min(5, item?.rating || 0));
  const filledStars = "★".repeat(rating);
  const emptyStars = "☆".repeat(5 - rating);

  return (
    <article className="testimonial-card">

      {/* AVATAR */}
      {item?.patientImage && (
        <img
          src={`${API_BASE}${item.patientImage}`}
          alt={item.patientName || "Patient testimonial"}
          className="testimonial-avatar"
          loading="lazy"
        />
      )}

      {/* MESSAGE */}
      <p className="testimonial-message">
        “{item?.message || "No testimonial message"}”
      </p>

      {/* FOOTER */}
      <div className="testimonial-footer">

        <span className="testimonial-name">
          {item?.patientName || "Anonymous"}
        </span>

        <div
          className="testimonial-rating"
          aria-label={`Rating: ${rating} out of 5`}
        >
          <span className="stars-filled">{filledStars}</span>
          <span className="stars-empty">{emptyStars}</span>
        </div>

      </div>

    </article>
  );
}
