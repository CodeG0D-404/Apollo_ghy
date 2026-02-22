// =============================================
// 📁 src/clinic/TestimonialCreate.jsx
// Admin: Add Testimonial
// Scoped + Production Ready
// =============================================

import { useState } from "react";
import { createTestimonial } from "./Services/testimonial.service";
import { toast } from "react-toastify";
import "./styles/TestimonialCreate.css";

export default function TestimonialCreate() {
  const [form, setForm] = useState({
    patientName: "",
    message: "",
    rating: 5,
    displayOrder: 0,
    status: "hidden",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.patientName.trim() || !form.message.trim()) {
      toast.error("Name and message are required");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, value);
    });

    if (image) fd.append("patientImage", image);

    try {
      setLoading(true);
      await createTestimonial(fd);

      toast.success("Testimonial created successfully");

      setForm({
        patientName: "",
        message: "",
        rating: 5,
        displayOrder: 0,
        status: "hidden",
      });
      setImage(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add testimonial");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="testimonial-create-page">
      <div className="testimonial-create-card">
        <h2 className="testimonial-create-title">Add Testimonial</h2>

        <form className="testimonial-create-form" onSubmit={submit}>
          {/* Name */}
          <input
            type="text"
            name="patientName"
            placeholder="Patient Name"
            value={form.patientName}
            onChange={handleChange}
            className="testimonial-create-input"
          />

          {/* Message */}
          <textarea
            name="message"
            placeholder="Patient message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            className="testimonial-create-textarea"
          />

          {/* Rating + Order */}
          <div className="testimonial-create-row">
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="testimonial-create-select"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="displayOrder"
              placeholder="Display order"
              value={form.displayOrder}
              onChange={handleChange}
              className="testimonial-create-input"
            />
          </div>

          {/* Status + Image */}
          <div className="testimonial-create-row">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="testimonial-create-select"
            >
              <option value="hidden">Hidden</option>
              <option value="published">Published</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="testimonial-create-file"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="testimonial-create-btn"
          >
            {loading ? "Saving..." : "Save Testimonial"}
          </button>
        </form>
      </div>
    </div>
  );
}
