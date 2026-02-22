import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Circle, Mail } from "react-feather";

import {
  getBookings,
  confirmBooking,
  declineBooking,
  archiveBooking,
  restoreBooking,
  sendConfirmationEmail,
  sendDateUpdateEmail,
  sendCancellationEmail,
} from "./Services/booking.service";

import adminAxios from "./Services/adminAxios";
import "./styles/BookingList.css";

const PAGE_LIMIT = 25;

export default function BookingList({ bookingType, isArchive }) {
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [paymentMap, setPaymentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    bookingId: "",
    totalAmount: "",
    paidAmount: "",
  });

  const mapVisitType = (type) => {
    switch (type?.toLowerCase()) {
      case "opd":
        return "OPD";
      case "telemedicine":
        return "Telemedicine";
      case "hospital-visit":
        return "Hospital";
      default:
        return null;
    }
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle color="green" />;
      case "Declined":
        return <XCircle color="red" />;
      default:
        return <Circle color="gray" />;
    }
  };

  const getEmailState = (b) => {
    if (b.emailSent?.cancelled)
      return { color: "green", tooltip: "Cancellation email sent", enabled: false };

    if (b.emailSent?.dateUpdated)
      return { color: "green", tooltip: "Date update email sent", enabled: false };

    if (b.emailSent?.confirmed)
      return { color: "green", tooltip: "Confirmation email sent", enabled: false };

    if (b.status === "Declined")
      return { color: "gray", tooltip: "Send cancellation email", enabled: true };

    if (b.status === "Confirmed" && (b.opdDate || b.scheduledDate))
      return {
        color: "gray",
        tooltip: "Send confirmation / date update email",
        enabled: true,
      };

    return {
      color: "gray",
      tooltip: "Complete booking before sending email",
      enabled: false,
    };
  };

  const handleSendEmail = async (booking) => {
    try {
      if (booking.status === "Declined") {
        await sendCancellationEmail(booking._id);
        toast.success("Cancellation email sent");
      } else if (booking.status === "Confirmed") {
        if (!booking.emailSent?.confirmed) {
          await sendConfirmationEmail(booking._id);
          toast.success("Confirmation email sent");
        } else {
          await sendDateUpdateEmail(booking._id);
          toast.success("Date update email sent");
        }
      }
      fetchBookings();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to send email");
    }
  };

  const getPaymentDotColor = (record) => {
    if (!record) return "red";
    if (record.paymentStatus === "FULL_PAYMENT") return "green";
    if (record.paymentStatus === "ADVANCE") return "orange";
    return "red";
  };

  const getPaymentTooltip = (record) => {
    if (!record || record.paymentStatus === "NO_ADVANCE") return "No advance paid";
    if (record.paymentStatus === "FULL_PAYMENT")
      return `Total: ₹${record.totalAmount}\nPaid: ₹${record.paidAmount}`;
    return `Total: ₹${record.totalAmount}\nPaid: ₹${record.paidAmount}\nDue: ₹${record.dueAmount}`;
  };

  const openPaymentModal = (booking) => {
    const record = paymentMap[booking.bookingId];
    setPaymentForm({
      bookingId: booking.bookingId,
      totalAmount: record?.totalAmount || "",
      paidAmount: record?.paidAmount || "",
    });
    setShowPaymentModal(true);
  };

  const savePayment = async () => {
    try {
      await adminAxios.patch(`/opd-payments/${paymentForm.bookingId}`, {
        totalAmount: Number(paymentForm.totalAmount),
        paidAmount: Number(paymentForm.paidAmount),
      });

      toast.success("Payment updated");
      setShowPaymentModal(false);
      fetchBookings();
    } catch {
      toast.error("Failed to update payment");
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getBookings({
        visitType: mapVisitType(bookingType),
        archived: !!isArchive,
        search: searchTerm || undefined,
        page,
        limit: PAGE_LIMIT,
      });

      const list = res.data.bookings || [];
      setBookings(list);
      setTotalPages(res.data.pagination?.totalPages || 1);

      if (bookingType === "opd") {
        const payments = {};
        await Promise.all(
          list.map(async (b) => {
            try {
              const r = await adminAxios.get(`/opd-payments/${b.bookingId}`);
              payments[b.bookingId] = r.data;
            } catch {
              payments[b.bookingId] = null;
            }
          })
        );
        setPaymentMap(payments);
      }
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [bookingType, isArchive, location.pathname, searchTerm, page]);

  const handleConfirmDecline = async (booking) => {
    try {
      const res =
        booking.status === "Confirmed"
          ? await declineBooking(booking._id)
          : await confirmBooking(booking._id);

      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? res.data.booking : b))
      );

      toast.success("Booking updated");
    } catch {
      toast.error("Action failed");
    }
  };

  const handleArchiveRestore = async (booking) => {
    try {
      const res = booking.archived
        ? await restoreBooking(booking._id)
        : await archiveBooking(booking._id);

      if (booking.archived !== res.data.booking.archived) {
        setBookings((prev) => prev.filter((b) => b._id !== booking._id));
      } else {
        setBookings((prev) =>
          prev.map((b) => (b._id === booking._id ? res.data.booking : b))
        );
      }

      toast.success("Booking updated");
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="booking-page">
      {/* PAGE HEADING */}
      <div className="booking-header">
        <h1 className="booking-title">
          {isArchive ? "Archived Bookings" : "Bookings"} — {bookingType?.toUpperCase()}
        </h1>
      </div>

      {/* TABLE AREA */}
      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>ShortID</th>
              <th>Patient</th>
              <th>Phone</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Date</th>
              {bookingType === "opd" && <th>Payment</th>}
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 && !loading && (
              <tr>
                <td colSpan="9" className="booking-empty">
                  No bookings found
                </td>
              </tr>
            )}

            {bookings.map((b) => {
              const payment = paymentMap[b.bookingId];
              const emailState = getEmailState(b);

              return (
                <tr key={b._id}>
                  <td>{b.shortId}</td>
                  <td>{b.patientName}</td>
                  <td>{b.mobile}</td>
                  <td>{b.doctorName}</td>
                  <td>{renderStatusIcon(b.status)}</td>
                  <td>
                    {(b.opdDate || b.scheduledDate)
                      ? new Date(b.opdDate || b.scheduledDate).toLocaleDateString()
                      : "-"}
                  </td>

                  {bookingType === "opd" && (
                    <td
                      title={getPaymentTooltip(payment)}
                      onClick={() => openPaymentModal(b)}
                      className="booking-payment-cell"
                    >
                      <span
                        className="booking-payment-dot"
                        style={{ backgroundColor: getPaymentDotColor(payment) }}
                      />
                    </td>
                  )}

                  <td className="booking-email-cell">
                    <Mail
                      size={18}
                      color={emailState.color}
                      title={emailState.tooltip}
                      style={{
                        cursor: emailState.enabled ? "pointer" : "not-allowed",
                        opacity: emailState.enabled ? 1 : 0.4,
                      }}
                      onClick={() => emailState.enabled && handleSendEmail(b)}
                    />
                  </td>

                  <td className="booking-actions">
                    {!isArchive && (
                      <button
                        onClick={() => handleConfirmDecline(b)}
                        className="booking-confirm-btn"
                      >
                        {b.status === "Confirmed" ? "Decline" : "Confirm"}
                      </button>
                    )}
                    <button
                      onClick={() => handleArchiveRestore(b)}
                      className="booking-archive-btn"
                    >
                      {b.archived ? "Restore" : "Archive"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <h3>Update Payment</h3>

            <input
              className="booking-input"
              placeholder="Total Amount"
              value={paymentForm.totalAmount}
              onChange={(e) =>
                setPaymentForm((p) => ({ ...p, totalAmount: e.target.value }))
              }
            />

            <input
              className="booking-input"
              placeholder="Paid Amount"
              value={paymentForm.paidAmount}
              onChange={(e) =>
                setPaymentForm((p) => ({ ...p, paidAmount: e.target.value }))
              }
            />

            <div className="booking-modal-actions">
              <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button onClick={savePayment} className="booking-save-btn">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
