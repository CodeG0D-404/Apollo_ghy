// =============================================
// 📁 src/clinic/TestimonialView.jsx
// Admin: View Single Testimonial
// Scoped + Production Ready
// =============================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAdminTestimonialById,
  deleteTestimonial,
} from "./Services/testimonial.service";
import { toast } from "react-toastify";
import "./styles/TestimonialView.css";

export default function TestimonialView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const BASE_URL =
    import.meta.env.VITE_API_URL;

  // ----------------------------------
  // LOAD DATA
  // ----------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminTestimonialById(id);
        setTestimonial(res.data);
      } catch {
        toast.error("Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ----------------------------------
  // DELETE
  // ----------------------------------
  const remove = async () => {
    if (!window.confirm("Delete this testimonial?")) return;

    try {
      setActionLoading(true);
      await deleteTestimonial(id);
      toast.success("Testimonial deleted");
      navigate("/clinic/testimonials");
    } catch {
      toast.error("Failed to delete testimonial");
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------
  // STATES
  // ----------------------------------
  if (loading) {
    return (
      <div className="testimonial-view-state">
        Loading testimonial...
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="testimonial-view-state">
        Testimonial not found
      </div>
    );
  }

  // ----------------------------------
  // UI
  // ----------------------------------
  return (
    <div className="testimonial-view-page">
      <div className="testimonial-view-card">
        <h2 className="testimonial-view-name">
          {testimonial.patientName}
        </h2>

        {testimonial.patientImage && (
          <div className="testimonial-view-image">
            <img
              src={
                testimonial.patientImage.startsWith("http")
                  ? testimonial.patientImage
                  : `${BASE_URL}/${testimonial.patientImage.replace(/^\/+/, "")}`
              }
              alt={testimonial.patientName}
            />
          </div>
        )}

        <div className="testimonial-view-message">
          <strong>Message</strong>
          <p>{testimonial.message}</p>
        </div>

        {/* ACTIONS */}
        <div className="testimonial-view-actions">
          <button
            className="testimonial-view-btn testimonial-view-danger"
            disabled={actionLoading}
            onClick={remove}
          >
            Delete
          </button>

          <button
            className="testimonial-view-btn testimonial-view-neutral"
            onClick={() => navigate("/clinic/testimonials")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
