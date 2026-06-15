"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { removeExtraData } from "../utils/appointmentExtraStorage";
import { showConfirm } from "../utils/confirm";
import "./provider-appointments.css";

const getStoredAppointmentExtras = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(localStorage.getItem("appointments_extra")) || {};
  } catch (error) {
    console.error("Failed to read appointments_extra:", error);
    return {};
  }
};

function formatTime(time) {
  if (!time) return "Time not selected";

  const [h, m = "00"] = String(time).split(":");
  let hour = parseInt(h, 10);

  if (Number.isNaN(hour)) {
    return time;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${m} ${suffix}`;
}

export default function ProviderAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [extraData, setExtraData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/appointments/provider",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Provider appointments raw:", res.data);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching provider appointments:", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setExtraData(getStoredAppointmentExtras());
    fetchAppointments();
  }, []);

  useEffect(() => {
    const syncExtraData = () => {
      setExtraData(getStoredAppointmentExtras());
    };

    window.addEventListener("storage", syncExtraData);
    window.addEventListener("appointment-extra-updated", syncExtraData);

    return () => {
      window.removeEventListener("storage", syncExtraData);
      window.removeEventListener("appointment-extra-updated", syncExtraData);
    };
  }, []);

  useEffect(() => {
    if (appointments.length === 0) return;
    console.log("Provider appointments response:", appointments);
  }, [appointments]);

  const mappedAppointments = appointments.map((appointment) => {
    const extra = extraData[String(appointment.appointment_id)];

    // DB takes priority; localStorage is a backward-compat fallback for old bookings
    const fullName        = appointment.full_name      || "Unknown";
    const email           = appointment.email          || "";
    const phone           = appointment.phone          || "";
    const appointmentType = appointment.appointment_type || "";
    const preferredDate   = appointment.appointment_date || null;
    const preferredTime   = appointment.preferred_time  || extra?.preferred_time || null;
    const notes           = appointment.notes           || extra?.notes           || null;

    console.log("Parent details:", { fullName, email, phone, appointmentType, preferredDate, preferredTime, notes });

    return {
      ...appointment,
      _fullName:        fullName,
      _email:           email,
      _phone:           phone,
      _appointmentType: appointmentType,
      _preferredDate:   preferredDate,
      _preferredTime:   preferredTime,
      _notes:           notes,
    };
  });

  const handleAction = async (id, status) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/appointments/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchAppointments();
  };

  const handleDelete = (id) => {
    showConfirm("Delete this appointment request?", async () => {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(
          `http://localhost:5000/api/appointments/provider/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        removeExtraData(id);
        setExtraData(getStoredAppointmentExtras());
        setAppointments((prev) =>
          prev.filter((a) => a.appointment_id !== id)
        );
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (loading) {
    return (
      <div className="provider-container">
        <h1 className="title">Appointments</h1>
        <div className="state-message">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="provider-container">
        <h1 className="title">Appointments</h1>
        <div className="state-message error">{error}</div>
        <div className="retry-wrap">
          <button className="btn approve" onClick={fetchAppointments}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-container">
      <h1 className="title">Appointments</h1>

      {mappedAppointments.length === 0 && (
        <div className="state-message">No appointment requests yet.</div>
      )}

      {mappedAppointments.map((a) => (
        <div key={a.appointment_id} className="appointment-card">
          {a.status === "pending" && (
            <div
              className="delete-icon"
              onClick={() => handleDelete(a.appointment_id)}
            >
              Delete
            </div>
          )}

          <div className="card-info">
            <p>
              <strong>Full Name:</strong>{" "}
              {a._fullName || "Unknown user"}
            </p>

            <p>
              <strong>Email Address:</strong>{" "}
              {a._email || "No email"}
            </p>

            <p>
              <strong>Phone Number:</strong>{" "}
              {a._phone || "Phone not available"}
            </p>

            <p>
              <strong>Appointment Type:</strong>{" "}
              {a._appointmentType || "Not specified"}
            </p>

            <p>
              <strong>Preferred Date:</strong>{" "}
              {a._preferredDate
                ? new Date(a._preferredDate).toLocaleDateString()
                : "Date not selected"}
            </p>

            <p>
              <strong>Preferred Time:</strong>{" "}
              {a._preferredTime
                ? formatTime(a._preferredTime)
                : "Time not selected"}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {a._notes ? a._notes : "No notes available"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${a.status}`}>
                {a.status}
              </span>
            </p>
          </div>

          {a.status === "pending" && (
            <div className="actions">
              <button
                className="btn approve"
                onClick={() =>
                  handleAction(a.appointment_id, "approved")
                }
              >
                Accept
              </button>

              <button
                className="btn reject"
                onClick={() =>
                  handleAction(a.appointment_id, "rejected")
                }
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
