import adminAxios from "./Services/adminAxios";
import { getNotificationState } from "./Services/bookingNotificationState";

export default function BookingNotifyButton({ booking, onSent }) {

  const state = getNotificationState(booking);

  const handleNotify = async () => {
    try {
await adminAxios.post(`/bookings/${booking._id}/notify`);

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
