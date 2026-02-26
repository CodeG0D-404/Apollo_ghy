// =============================================
// 📁 src/clinic/ConditionList.jsx
// Updated: 2 Column + Shared Pagination
// =============================================

import React, { useEffect, useState } from "react";
import "./styles/ConditionList.css";

import {
  fetchConditions,
  createCondition,
  deleteCondition,
} from "./Services/condition.service";

const ITEMS_PER_PAGE = 100;
const COLUMN_SPLIT = 50;

const ConditionsList = () => {
  const [conditions, setConditions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [newCondition, setNewCondition] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Fetch conditions
  const loadConditions = async () => {
    setLoading(true);
    try {
      const data = await fetchConditions();
      setConditions(data || []);
      setFiltered(data || []);
    } catch (error) {
      console.error("Error fetching Symptoms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConditions();
  }, []);

  // Add
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCondition.trim()) return;

    try {
      await createCondition({ name: newCondition });
      setNewCondition("");
      loadConditions();
    } catch (error) {
      console.error("Error adding Symptoms:", error);
      alert("Failed to add Symptoms");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Symptoms?")) return;

    try {
      await deleteCondition(id);
      loadConditions();
    } catch (error) {
      console.error("Error deleting Symptoms:", error);
      alert("Failed to delete Symptoms");
    }
  };

  // Search
  useEffect(() => {
    const result = conditions.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setPage(1);
  }, [search, conditions]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const leftColumn = pageItems.slice(0, COLUMN_SPLIT);
  const rightColumn = pageItems.slice(COLUMN_SPLIT, ITEMS_PER_PAGE);

  return (
    <div className="condition-page">
      <h2 className="condition-title">Symptoms Treated</h2>

      {/* Add */}
{/* Add + Search Row */}
<div className="condition-topbar">

  <form className="condition-add-form" onSubmit={handleAdd}>
    <input
      type="text"
      placeholder="New Symptoms"
      value={newCondition}
      onChange={(e) => setNewCondition(e.target.value)}
    />
    <button type="submit">Add</button>
  </form>

  <input
    type="text"
    className="condition-search"
    placeholder="Search Symptoms..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>


      {loading ? (
        <p className="condition-loading">Loading...</p>
      ) : (
        <>
          {/* 2 Column Layout */}
          <div className="condition-columns">

<table className="condition-table">
  <tbody>
    {Array.from({ length: COLUMN_SPLIT }).map((_, i) => {
      const cond = leftColumn[i];

      return (
        <tr key={i}>
          {cond ? (
            <>
              <td className="condition-name">{cond.name}</td>
              <td>
                <button
                  className="condition-delete-btn"
                  onClick={() => handleDelete(cond._id)}
                >
                  Delete
                </button>
              </td>
            </>
          ) : (
            <>
              <td className="condition-empty-row"></td>
              <td className="condition-empty-row"></td>
            </>
          )}
        </tr>
      );
    })}
  </tbody>
</table>


<table className="condition-table">
  <tbody>
    {Array.from({ length: COLUMN_SPLIT }).map((_, i) => {
      const cond = rightColumn[i];

      return (
        <tr key={i}>
          {cond ? (
            <>
              <td className="condition-name">{cond.name}</td>
              <td>
                <button
                  className="condition-delete-btn"
                  onClick={() => handleDelete(cond._id)}
                >
                  Delete
                </button>
              </td>
            </>
          ) : (
            <>
              <td className="condition-empty-row"></td>
              <td className="condition-empty-row"></td>
            </>
          )}
        </tr>
      );
    })}
  </tbody>
</table>
          </div>

          {/* Pagination */}
          <div className="condition-pagination">
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

export default ConditionsList;
