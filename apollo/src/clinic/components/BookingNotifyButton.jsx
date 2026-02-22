import axios from "axios";
import { getNotificationState } from ".Services/bookingNotificationState";

export default function BookingNotifyButton({ booking, onSent }) {

  const state = getNotificationState(booking);

  const handleNotify = async () => {
    try {
      await axios.post(
        `/api/bookings/${booking._id}/notify`,
        {},
        { withCredentials: true }
      );

      onSent(); // refresh list
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send notification");
    }
  };

  return (
    <button
      onClick={handleNotify}
      disabled={state.disabled}
      title={state.reason || "Send WhatsApp notification"}
      className={`notify-btn ${state.disabled ? "disabled" : ""}`}
    >
      📲
    </button>
  );
}
