// ===========================================
// 📁 Dashboard.jsx
// Dashboard page (cookie auth + env API)
// ===========================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/dashboard.css";

const API = `${import.meta.env.VITE_API_URL}/api`;

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔹 Fetch today's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${API}/bookings?limit=100`, {
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/clinic/login");
          return;
        }

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const json = await res.json();
        const allBookings = json.bookings || [];

        // Filter today's bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysBookings = allBookings.filter((b) => {
          const dateStr =
            b.visitType === "OPD" ? b.opdDate : b.scheduledDate;

          if (!dateStr) return false;

          const d = new Date(dateStr);
          d.setHours(0, 0, 0, 0);

          return d.getTime() === today.getTime();
        });

        setAppointments(todaysBookings);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Could not load appointments.");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Today's Appointments</h1>
      </div>

      {loading && <p className="dashboard-message">Loading appointments...</p>}

      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && appointments.length === 0 && (
        <p className="dashboard-message">No appointments for today</p>
      )}

      {!loading && !error && appointments.length > 0 && (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Time</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, i) => (
              <tr key={i}>
                <td>{a.patient?.name || "N/A"}</td>
                <td>{a.doctor?.name || "N/A"}</td>
                <td>{a.time || "—"}</td>
                <td>{a.type || "General"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
