// =============================================
// 📁 src/clinic/TestimonialList.jsx
// Admin: Testimonials List
// Scoped + Production Ready
// =============================================

import { useEffect, useState } from "react";
import {
  getAdminTestimonials,
  deleteTestimonial,
  updateTestimonialStatus,
  updateTestimonial,
} from "./Services/testimonial.service";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./styles/TestimonialList.css";

const PAGE_SIZE = 10;

export default function TestimonialList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [page, setPage] = useState(1);

  // ----------------------------------
  // LOAD DATA
  // ----------------------------------
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await getAdminTestimonials();
      setList(res.data || []);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // PAGINATION
  // ----------------------------------
  const totalPages = Math.ceil(list.length / PAGE_SIZE);

  const paginatedList = list.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // ----------------------------------
  // STATUS TOGGLE
  // ----------------------------------
  const toggleStatus = async (t) => {
    const newStatus = t.status === "hidden" ? "published" : "hidden";

    try {
      setLoadingId(t._id);
      await updateTestimonialStatus(t._id, newStatus);

      setList((prev) =>
        prev.map((item) =>
          item._id === t._id ? { ...item, status: newStatus } : item
        )
      );

      toast.success(
        `Testimonial ${
          newStatus === "published" ? "published" : "hidden"
        }`
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  // ----------------------------------
  // DISPLAY ORDER UPDATE
  // ----------------------------------
  const updateOrder = async (id, value) => {
    if (value === "" || isNaN(value)) return;

    try {
      setLoadingId(id);

      const fd = new FormData();
      fd.append("displayOrder", Number(value));

      await updateTestimonial(id, fd);

      setList((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, displayOrder: Number(value) } : t
        )
      );

      toast.success("Display order updated");
    } catch {
      toast.error("Failed to update display order");
    } finally {
      setLoadingId(null);
    }
  };

  // ----------------------------------
  // DELETE
  // ----------------------------------
  const remove = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    try {
      setLoadingId(id);
      await deleteTestimonial(id);
      setList((prev) => prev.filter((t) => t._id !== id));
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Failed to delete testimonial");
    } finally {
      setLoadingId(null);
    }
  };

  // ----------------------------------
  // STATES
  // ----------------------------------
  if (loading) {
    return (
      <div className="testimonial-list-state">
        Loading testimonials...
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="testimonial-list-state">
        No testimonials found
      </div>
    );
  }

  // ----------------------------------
  // UI
  // ----------------------------------
  return (
    <div className="testimonial-list-page">
      <h2 className="testimonial-list-title">Testimonials</h2>

      <div className="testimonial-list-table-wrapper">
        <table className="testimonial-list-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedList.map((t) => (
              <tr key={t._id}>
                {/* Patient */}
                <td className="testimonial-list-name">
                  {t.patientName}
                </td>

                {/* Order */}
                <td className="testimonial-list-order">
                  <input
                    type="number"
                    defaultValue={t.displayOrder}
                    disabled={loadingId === t._id}
                    onBlur={(e) =>
                      updateOrder(t._id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.target.blur();
                    }}
                  />
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`testimonial-list-badge ${
                      t.status === "published"
                        ? "testimonial-list-badge-published"
                        : "testimonial-list-badge-hidden"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="testimonial-list-actions">
                    <Link to={`/clinic/testimonials/${t._id}`}>
                      <button className="testimonial-list-btn testimonial-list-view">
                        View
                      </button>
                    </Link>

                    <button
                      disabled={loadingId === t._id}
                      onClick={() => toggleStatus(t)}
                      className="testimonial-list-btn testimonial-list-primary"
                    >
                      {t.status === "hidden"
                        ? "Publish"
                        : "Hide"}
                    </button>

                    <button
                      disabled={loadingId === t._id}
                      onClick={() => remove(t._id)}
                      className="testimonial-list-btn testimonial-list-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="testimonial-list-pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
