// =============================================
// 📁 src/clinic/InquiryCTAList.jsx
// Admin Inquiry Dashboard — Scoped + bleed-proof
// =============================================

import React, { useEffect, useState } from "react";
import adminAxios from "./Services/adminAxios";
import "./styles/InquiryCTAList.css";

// Mock sample inquiries for demo mode
const DEMO_INQUIRIES = [
  {
    _id: "inq-1",
    name: "Ranjit Saikia",
    phone: "+91 94010 11111",
    source: { page: "Home", section: "book-appointment" },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isExistingPatient: false,
    review: { status: false },
    followup: { status: false },
  },
  {
    _id: "inq-2",
    name: "Meena Das",
    phone: "+91 94010 22222",
    source: { page: "OPD Services", section: "general" },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isExistingPatient: true,
    patientRef: "pat-1",
    review: { status: true, notes: "Contacted via WhatsApp" },
    followup: { status: false },
  },
  {
    _id: "inq-3",
    name: "Bikram Bora",
    phone: "+91 94010 33333",
    source: { page: "Telemedicine", section: "hero" },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isExistingPatient: false,
    review: { status: true },
    followup: { status: true },
  },
];

export default function InquiryCTAList() {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [reviewPopup, setReviewPopup] = useState(null);
  const [followPopup, setFollowPopup] = useState(null);
  const [notes, setNotes] = useState("");
  const [followDate, setFollowDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await adminAxios.get("/inquiry", {
        params: {
          page,
          limit: 25,
          phone: phoneSearch,
          date: dateFilter,
        },
      });

      // Handle multiple possible shapes: { data: [] } / { inquiries: [] } / []
      const raw = res.data;
      const list = Array.isArray(raw)
        ? raw
        : raw?.data || raw?.inquiries || DEMO_INQUIRIES;
      const pages = raw?.pagination?.pages || raw?.pagination?.totalPages || 1;

      setData(list);
      setTotalPages(pages);
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
      setData(DEMO_INQUIRIES);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [page, phoneSearch, dateFilter]);

  const submitReview = async () => {
    try {
      await adminAxios.patch(`/inquiry/review/${reviewPopup}`, { notes });
      setReviewPopup(null);
      setNotes("");
      fetchInquiries();
    } catch (err) {
      console.error("Failed to submit review:", err);
      setReviewPopup(null);
      setNotes("");
    }
  };

  const submitFollowup = async () => {
    try {
      await adminAxios.patch(`/inquiry/followup/${followPopup}`, {
        date: followDate,
        remarks,
      });
      setFollowPopup(null);
      setFollowDate("");
      setRemarks("");
      fetchInquiries();
    } catch (err) {
      console.error("Failed to submit followup:", err);
      setFollowPopup(null);
      setFollowDate("");
      setRemarks("");
    }
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
        {loading ? (
          <p style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>Loading inquiries...</p>
        ) : data.length === 0 ? (
          <p style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>No inquiries found.</p>
        ) : (
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
                    {item.source?.section && item.source.section !== "general" &&
                      ` → ${item.source.section}`}
                  </td>

                  <td>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                  </td>

                  <td>
                    {item.isExistingPatient ? (
                      <a
                        href={`/clinic/patients/${item.patientRef}`}
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
        )}
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
