import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import adminAxios from "./Services/adminAxios";
import "./styles/BookingList.css";

const PAGE_LIMIT = 25;

export default function HospitalBooking({ isArchive }) {
  const location = useLocation();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    code: "",
    doctorName: "",
    visitDate: "",
    status: "",
  });

  // ============================
  // Fetch Requests
  // ============================
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await adminAxios.get("/hospital-requests", {
        params: {
          search: searchTerm || undefined,
          page,
          limit: PAGE_LIMIT,
          archived: !!isArchive,
        },
      });

      setRequests(res.data.requests || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch {
      toast.error("Failed to load hospital requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [isArchive, location.pathname, searchTerm, page]);

  // ============================
  // Open Edit Modal
  // ============================
  const openEdit = (req) => {
    setSelected(req);

    setForm({
      code: req.code || "",
      doctorName: req.doctorName || "",
      visitDate: req.visitDate
        ? new Date(req.visitDate).toISOString().split("T")[0]
        : "",
      status: req.status,
    });

    setEditModal(true);
  };

  // ============================
  // Save Update
  // ============================
  const saveUpdate = async () => {
    try {
      const res = await adminAxios.patch(
        `/hospital-requests/${selected._id}`,
        form
      );

      setRequests((prev) =>
        prev.map((r) => (r._id === selected._id ? res.data.request : r))
      );

      toast.success("Hospital request updated");
      setEditModal(false);
    } catch {
      toast.error("Update failed");
    }
  };

  // ============================
  // Archive / Restore
  // ============================
  const handleArchiveRestore = async (req) => {
    try {
      const res = await adminAxios.patch(
        `/hospital-requests/${req._id}`,
        { archived: !req.archived }
      );

      const updated = res.data.request;

      if (req.archived !== updated.archived) {
        setRequests((prev) => prev.filter((r) => r._id !== req._id));
      } else {
        setRequests((prev) =>
          prev.map((r) => (r._id === req._id ? updated : r))
        );
      }

      toast.success("Request updated");
    } catch {
      toast.error("Action failed");
    }
  };

  // ============================
  // Status Colors
  // ============================
  const statusColor = (status) => {
    switch (status) {
      case "New":
        return "#007bff";
      case "Contacted":
        return "#ffc107";
      case "Converted":
        return "#28a745";
      case "Closed":
        return "#6c757d";
      default:
        return "#999";
    }
  };

  return (
    <div className="booking-page">

      {/* HEADER */}
      <div className="booking-header">
        <h1 className="booking-title">
          {isArchive ? "Archived Hospital Requests" : "Hospital Requests"}
        </h1>
      </div>

      {/* TABLE */}
      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>ShortID</th>
              <th>Patient</th>
              <th>Phone</th>
              <th>Code</th>
              <th>Doctor</th>
              <th>Visit Date</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Followup</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 && !loading && (
              <tr>
                <td colSpan="9" className="booking-empty">
                  No hospital requests found
                </td>
              </tr>
            )}

            {requests.map((r) => (
              <tr key={r._id}>

                {/* ShortID */}
                <td>{r.shortId}</td>

                {/* Patient + Badge */}
                <td>
                  {r.name}
                  <div style={{ fontSize: 11 }}>
                    {r.isExistingPatient ? (
                      <span style={{ color: "#28a745", fontWeight: 600 }}>
                        EXISTING
                      </span>
                    ) : (
                      <span style={{ color: "#007bff", fontWeight: 600 }}>
                        NEW
                      </span>
                    )}
                  </div>
                </td>

                {/* Phone */}
                <td>{r.mobile}</td>

                {/* Code */}
                <td>{r.code || "-"}</td>

                {/* Doctor */}
                <td>{r.doctorName || "-"}</td>

                {/* Visit Date */}
                <td>
                  {r.visitDate
                    ? new Date(r.visitDate).toLocaleDateString()
                    : "-"}
                </td>

                {/* Status */}
                <td>
                  <span
                    style={{
                      background: statusColor(r.status),
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    {r.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="booking-actions">
                  <button onClick={() => openEdit(r)}>Edit</button>

                  <button
                    onClick={() => handleArchiveRestore(r)}
                    className="booking-archive-btn"
                  >
                    {r.archived ? "Restore" : "Archive"}
                  </button>
                </td>

                {/* Followup */}
                <td>
                  <button
                    className={
                      r.status === "Contacted" || r.status === "Converted"
                        ? "inquiry-tick"
                        : "inquiry-x"
                    }
                  >
                    {r.status === "Contacted" || r.status === "Converted"
                      ? "✓"
                      : "✕"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <h3>Update Hospital Request</h3>

            <input
              placeholder="Hospital Code"
              value={form.code}
              onChange={(e) =>
                setForm((p) => ({ ...p, code: e.target.value }))
              }
            />

            <input
              placeholder="Doctor Name"
              value={form.doctorName}
              onChange={(e) =>
                setForm((p) => ({ ...p, doctorName: e.target.value }))
              }
            />

            <input
              type="date"
              value={form.visitDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, visitDate: e.target.value }))
              }
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>

            <div className="booking-modal-actions">
              <button onClick={() => setEditModal(false)}>Cancel</button>
              <button onClick={saveUpdate} className="booking-save-btn">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}