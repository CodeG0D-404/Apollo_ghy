// =============================================
// 📁 src/clinic/SpecialtyList.jsx
// 2 Column + Pagination (25/25)
// =============================================

import React, { useEffect, useState } from "react";
import "./styles/SpacialtyList.css";

import {
  fetchSpecialties,
  createSpecialty,
  deleteSpecialty,
} from "./Services/specialty.service";

const ITEMS_PER_PAGE = 50;
const COLUMN_SPLIT = 25;

const SpecialtyList = () => {
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadSpecialties = async () => {
    setLoading(true);
    try {
      const data = await fetchSpecialties();
      setSpecialties(data || []);
    } catch (error) {
      console.error("Error fetching specialties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  const handleAddSpecialty = async () => {
    if (!newSpecialty.trim()) return;

    try {
      await createSpecialty({ name: newSpecialty });
      setNewSpecialty("");
      loadSpecialties();
    } catch (error) {
      console.error("Error adding specialty:", error);
      alert("Failed to add specialty");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this specialty?"))
      return;

    try {
      await deleteSpecialty(id);
      loadSpecialties();
    } catch (error) {
      console.error("Error deleting specialty:", error);
      alert("Failed to delete specialty");
    }
  };

  // Pagination
  const totalPages = Math.ceil(specialties.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = specialties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const leftColumn = pageItems.slice(0, COLUMN_SPLIT);
  const rightColumn = pageItems.slice(COLUMN_SPLIT, ITEMS_PER_PAGE);

  return (
    <div className="specialty-page">
      <h2 className="specialty-title">Specialties</h2>

      {/* Add */}
      <div className="specialty-add-box">
        <input
          type="text"
          placeholder="Enter new specialty"
          value={newSpecialty}
          onChange={(e) => setNewSpecialty(e.target.value)}
        />
        <button className="specialty-add-btn" onClick={handleAddSpecialty}>
          Add New
        </button>
      </div>

      {loading ? (
        <p className="specialty-loading">Loading...</p>
      ) : (
        <>
          {/* 2 Columns */}
          <div className="specialty-columns">

            {/* LEFT */}
            <table className="specialty-table">
              <tbody>
                {Array.from({ length: COLUMN_SPLIT }).map((_, i) => {
                  const item = leftColumn[i];

                  return (
                    <tr key={i}>
                      {item ? (
                        <>
                          <td className="specialty-name">{item.name}</td>
                          <td>
                            <button
                              className="specialty-delete-btn"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="specialty-empty-row"></td>
                          <td className="specialty-empty-row"></td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* RIGHT */}
            <table className="specialty-table">
              <tbody>
                {Array.from({ length: COLUMN_SPLIT }).map((_, i) => {
                  const item = rightColumn[i];

                  return (
                    <tr key={i}>
                      {item ? (
                        <>
                          <td className="specialty-name">{item.name}</td>
                          <td>
                            <button
                              className="specialty-delete-btn"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="specialty-empty-row"></td>
                          <td className="specialty-empty-row"></td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>

          {/* Pagination */}
          <div className="specialty-pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span>
              Page {page} / {totalPages || 1}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SpecialtyList;
