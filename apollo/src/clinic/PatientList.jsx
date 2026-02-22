// =============================================
// 📁 src/clinic/PatientList.jsx
// Same UI + Archive toggle + Add button + Edit
// =============================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/PatientList.css";

import {
  fetchPatients,
  archivePatient,
} from "./Services/patient.service";

const PatientList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const LIMIT = 50;

  // ------------------------------------------------
  // Helpers
  // ------------------------------------------------
  const getPrimaryPhone = (patient) => {
    const primary = patient.phones?.find((p) => p.isPrimary);
    return primary?.number || "-";
  };

  const getPrimaryEmail = (patient) => {
    const primary = patient.emails?.find((e) => e.label === "Primary");
    return primary?.email || "-";
  };

  // ------------------------------------------------
  // Navigation
  // ------------------------------------------------
  const handleView = (id) => {
    navigate(`/clinic/patients/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/clinic/patients/${id}/edit`);
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this patient?")) return;

    try {
      await archivePatient(id);
      setPatients((prev) => prev.filter((p) => p._id !== id));
      alert("Patient archived successfully.");
    } catch (err) {
      console.error("❌ Failed to archive patient:", err);
      alert("Failed to archive patient.");
    }
  };

  // ------------------------------------------------
  // Data load
  // ------------------------------------------------
  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetchPatients({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        archived: showArchived,
      });

      setPatients(res.data.patients || []);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching patients:", err);
      setError("Failed to load patient list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [page, debouncedSearch, showArchived]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ------------------------------------------------
  // Render
  // ------------------------------------------------
  return (
    <div className="patient-page">
      <h2 className="patient-title">Patients</h2>

      {/* Search + Buttons row */}
      <div className="patient-toolbar">
        <input
          type="text"
          placeholder="Search by Patient ID, Name, Mobile, Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="patient-search"
        />

        <div className="patient-toolbar-actions">
          <button
            className="patient-add-btn"
            onClick={() => navigate("/clinic/patients/add")}
          >
            + Add New
          </button>

          <button
            className="patient-archive-toggle-btn"
            onClick={() => {
              setShowArchived((prev) => !prev);
              setPage(1);
            }}
          >
            {showArchived ? "Patients" : "Archive"}
          </button>
        </div>
      </div>

      {loading && <p className="patient-loading">Loading patients...</p>}
      {error && <p className="patient-error">{error}</p>}

      <table className="patient-table">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Mobile (Primary)</th>
            <th>Email (Primary)</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.shortId}</td>
                <td>{patient.name}</td>
                <td>{getPrimaryPhone(patient)}</td>
                <td>{getPrimaryEmail(patient)}</td>
                <td className="patient-actions">
                  <button
                    className="patient-view-btn"
                    onClick={() => handleView(patient._id)}
                  >
                    View
                  </button>

                  {!showArchived && (
                    <>
                      <button
                        className="patient-edit-btn"
                        onClick={() => handleEdit(patient._id)}
                      >
                        Edit
                      </button>

                      <button
                        className="patient-archive-btn"
                        onClick={() => handleArchive(patient._id)}
                      >
                        Archive
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            !loading && (
              <tr>
                <td colSpan="5" className="patient-empty">
                  No patients found
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="patient-pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PatientList;
