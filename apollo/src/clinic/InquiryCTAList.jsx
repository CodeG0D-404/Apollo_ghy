// =============================================
// 📁 src/clinic/InquiryCTAList.jsx
// Admin Inquiry Dashboard — Scoped + bleed-proof
// =============================================

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/InquiryCTAList.css";

export default function InquiryCTAList() {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [reviewPopup, setReviewPopup] = useState(null);
  const [followPopup, setFollowPopup] = useState(null);
  const [notes, setNotes] = useState("");
  const [followDate, setFollowDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const API = `${import.meta.env.VITE_API_URL}/api/inquiry`;

  const fetchInquiries = async () => {
    try {
      const res = await axios.get(API, {
        params: {
          page,
          limit: 25,
          phone: phoneSearch,
          date: dateFilter
        },
        withCredentials: true
      });

      setData(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch {}
  };

  useEffect(() => {
    fetchInquiries();
  }, [page, phoneSearch, dateFilter]);

  const submitReview = async () => {
    await axios.patch(
      `${API}/review/${reviewPopup}`,
      { notes },
      { withCredentials: true }
    );

    setReviewPopup(null);
    setNotes("");
    fetchInquiries();
  };

  const submitFollowup = async () => {
    await axios.patch(
      `${API}/followup/${followPopup}`,
      { date: followDate, remarks },
      { withCredentials: true }
    );

    setFollowPopup(null);
    setFollowDate("");
    setRemarks("");
    fetchInquiries();
  };

  return (
    <div className="inquiry-page">

      <h2 className="inquiry-title">Inquiry Leads</h2>

      {/* Filters */}
      <div className="inquiry-filters">
        <input
          placeholder="Search phone"
          value={phoneSearch}
          onChange={(e) => setPhoneSearch(e.target.value)}
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="inquiry-table-wrapper">
        <table className="inquiry-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Date</th>
              <th>Details</th>
              <th>Review</th>
              <th>Followup</th>
            </tr>
          </thead>

          <tbody>
            {data.map(item => (
              <tr key={item._id}>

                <td>{item.name}</td>
                <td>{item.phone}</td>

                <td>
                  {item.source?.page}
                  {item.source?.section !== "general" &&
                    ` → ${item.source?.section}`}
                </td>

                <td>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                <td>
                  {item.isExistingPatient ? (
                    <a
                      href={`/patients/${item.patientRef}`}
                      className="inquiry-btn-secondary"
                    >
                      Details
                    </a>
                  ) : (
                    <span className="inquiry-new">NEW</span>
                  )}
                </td>

                <td>
                  <button
                    className={item.review?.status ? "inquiry-tick" : "inquiry-x"}
                    onClick={() => setReviewPopup(item._id)}
                  >
                    {item.review?.status ? "✓" : "✕"}
                  </button>
                </td>

                <td>
                  <button
                    className={item.followup?.status ? "inquiry-tick" : "inquiry-x"}
                    onClick={() => setFollowPopup(item._id)}
                  >
                    {item.followup?.status ? "✓" : "✕"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="inquiry-pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Review Modal */}
      {reviewPopup && (
        <div className="inquiry-modal-overlay">
          <div className="inquiry-modal">
            <h3>Review Inquiry</h3>

            <textarea
              placeholder="Add notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="inquiry-actions">
              <button onClick={submitReview} className="inquiry-btn-primary">
                Save
              </button>
              <button onClick={() => setReviewPopup(null)} className="inquiry-btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Followup Modal */}
      {followPopup && (
        <div className="inquiry-modal-overlay">
          <div className="inquiry-modal">
            <h3>Follow-up</h3>

            <input
              type="date"
              value={followDate}
              onChange={(e) => setFollowDate(e.target.value)}
            />

            <textarea
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="inquiry-actions">
              <button onClick={submitFollowup} className="inquiry-btn-primary">
                Save
              </button>
              <button onClick={() => setFollowPopup(null)} className="inquiry-btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
