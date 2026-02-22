// =============================================
// 📁 src/clinic/ViewDoctor.jsx
// Admin: List / Search / Filter Doctors + OPD Modal
// Scoped styling + deployment ready
// =============================================

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ViewDoctor.css";

import {
  fetchDoctors,
  deleteDoctor,
  updateDoctorOpdDates,
} from "./Services/doctor.service";

const PAGE_SIZE = 10;
const VISIT_TYPES = ["OPD", "Telemedicine", "Hospital Visit"];

const ViewDoctor = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [visitTypeFilter, setVisitTypeFilter] = useState("");

  const [page, setPage] = useState(1);

  const [showOPDModal, setShowOPDModal] = useState(false);
  const [opdDoctor, setOpdDoctor] = useState(null);
  const [opdInputs, setOpdInputs] = useState([""]);

  useEffect(() => {
    let mounted = true;

    const loadDoctors = async () => {
      try {
        setLoading(true);
        const res = await fetchDoctors();
        if (mounted) setDoctors(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch doctors:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDoctors();
    return () => (mounted = false);
  }, []);

  const normalize = (v) => (v || "").toLowerCase().trim();

  const filteredDoctors = useMemo(() => {
    const q = normalize(searchText);

    return doctors.filter((d) => {
      const name = normalize(d?.name);
      const specialty = normalize(d?.specialty?.name);
      const conditions = (d?.conditionsTreated || []).map((c) =>
        normalize(c?.name)
      );

      const matchSearch =
        !q ||
        name.includes(q) ||
        specialty.includes(q) ||
        conditions.some((c) => c.includes(q));

      const matchVisitType =
        !visitTypeFilter ||
        (Array.isArray(d?.visitTypes) &&
          d.visitTypes.includes(visitTypeFilter));

      return matchSearch && matchVisitType;
    });
  }, [doctors, searchText, visitTypeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDoctors.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDoctors.slice(start, start + PAGE_SIZE);
  }, [filteredDoctors, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [searchText, visitTypeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete doctor");
    }
  };

  const openOPDModal = (doctor) => {
    setOpdDoctor(doctor);
    setOpdInputs([""]);
    setShowOPDModal(true);
  };

  const addOPDRow = () => setOpdInputs((p) => [...p, ""]);

  const removeOPDRow = (idx) =>
    setOpdInputs((p) => p.filter((_, i) => i !== idx));

  const updateOPDRow = (idx, val) =>
    setOpdInputs((p) => p.map((v, i) => (i === idx ? val : v)));

  const saveOPDDates = async () => {
    const dates = opdInputs.filter(Boolean);
    if (!dates.length) return alert("Please add at least one date.");

    try {
      const res = await updateDoctorOpdDates(opdDoctor._id, dates, "add");
      const updatedDoctor = res.data;

      setDoctors((prev) =>
        prev.map((d) =>
          d._id === opdDoctor._id ? updatedDoctor : d
        )
      );

      setShowOPDModal(false);
      setOpdDoctor(null);
      setOpdInputs([""]);
    } catch (err) {
      console.error("❌ OPD update failed:", err);
      alert("Failed to save OPD dates");
    }
  };

  return (
    <>
      <div className="doctor-page">
        <h2 className="doctor-title">👨‍⚕️ Doctors</h2>

        <div className="doctor-filters">
          <input
            type="text"
            placeholder="Search doctor, specialty, condition…"
            className="doctor-search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select
            className="doctor-filter-select"
            value={visitTypeFilter}
            onChange={(e) => setVisitTypeFilter(e.target.value)}
          >
            <option value="">Filter by Visit Type</option>
            {VISIT_TYPES.map((vt) => (
              <option key={vt} value={vt}>
                {vt}
              </option>
            ))}
          </select>
        </div>

        <div className="doctor-table-wrapper">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Visit Types</th>
                <th>OPD Dates</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5}>Loading…</td>
                </tr>
              )}

              {!loading && pageSlice.length === 0 && (
                <tr>
                  <td colSpan={5}>No doctors found</td>
                </tr>
              )}

              {!loading &&
                pageSlice.map((d) => (
                  <tr key={d._id}>
                    <td>{d.name}</td>
                    <td>{d.specialty?.name || "—"}</td>

                    <td>
                      {d.visitTypes?.map((vt, i) => (
                        <span key={i} className="doctor-badge">
                          {vt}
                        </span>
                      ))}
                    </td>

                    <td>
                      {d.opdDates?.map((date, i) => (
                        <span key={i} className="doctor-opd-badge">
                          {new Date(date).toLocaleDateString()}
                        </span>
                      ))}
                    </td>

                    <td>
                      <div className="doctor-actions">
                        <button
                          className="doctor-btn doctor-view-btn"
                          onClick={() =>
                            navigate(`/clinic/doctors/${d._id}`)
                          }
                        >
                          View
                        </button>

                        <button
                          className="doctor-btn doctor-opd-btn"
                          onClick={() => openOPDModal(d)}
                        >
                          OPD DATE
                        </button>

                        <button
                          className="doctor-btn doctor-delete-btn"
                          onClick={() => handleDelete(d._id)}
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

        <div className="doctor-pagination">
          <span>
            Page {currentPage} of {totalPages}
          </span>

          <div>
            <button
              className="doctor-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            <button
              className="doctor-btn"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* OPD MODAL */}
      {showOPDModal && opdDoctor && (
        <div className="doctor-modal-overlay">
          <div className="doctor-modal">
            <h3>Add OPD Dates — {opdDoctor.name}</h3>

            {opdInputs.map((val, idx) => (
              <div key={idx} className="doctor-modal-row">
                <input
                  type="date"
                  value={val}
                  onChange={(e) =>
                    updateOPDRow(idx, e.target.value)
                  }
                />
                {opdInputs.length > 1 && (
                  <button onClick={() => removeOPDRow(idx)}>✕</button>
                )}
              </div>
            ))}

            <button onClick={addOPDRow}>+ Add another date</button>

            <div className="doctor-modal-actions">
              <button
                onClick={() => {
                  setShowOPDModal(false);
                  setOpdDoctor(null);
                  setOpdInputs([""]);
                }}
              >
                Cancel
              </button>
              <button onClick={saveOPDDates}>Save Dates</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewDoctor;
