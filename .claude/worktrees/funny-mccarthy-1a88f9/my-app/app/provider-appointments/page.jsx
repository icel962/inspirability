"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { removeExtraData } from "../utils/appointmentExtraStorage";
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

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/appointments/provider",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching provider appointments:", err);
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
    // STEP 1 — DEBUG: inspect raw appointments and localStorage
    console.log("RAW appointments:", appointments);

    appointments.forEach((appointment) => {
      console.log("Appointment object:", appointment);
      console.log("appointment_id:", appointment.appointment_id);
      console.log("full_name:", appointment.full_name);
      console.log("email_address:", appointment.email_address);
      console.log("phone_number:", appointment.phone_number);
    });

    const rawStorage = localStorage.getItem("appointments_extra");
    console.log("Raw localStorage:", rawStorage);

    const parsedExtra = JSON.parse(rawStorage || "{}");
    console.log("Parsed localStorage:", parsedExtra);
  }, [appointments, extraData]);

  const mappedAppointments = appointments.map((appointment) => {
    // STEP 2 — FIX: always use String() to match numeric IDs stored as string keys
    const extra = extraData?.[String(appointment.appointment_id)];
    console.log("Matched extra for", appointment.appointment_id, ":", extra);

    // STEP 3 — DATA SOURCES: backend fields
    const fullName =
      appointment.full_name ||
      appointment.parent_name ||
      appointment.user_name;

    const email =
      appointment.email_address ||
      appointment.email;

    const phone =
      appointment.phone_number ||
      appointment.phone;

    const appointmentType = appointment.appointment_type;

    // appointment_date is the real column name in the DB
    const preferredDate =
      appointment.preferred_date ||
      appointment.appointment_date;

    // STEP 3 — LOCAL STORAGE FIELDS ONLY
    const preferredTime = extra?.preferred_time;
    const notes = extra?.notes;

    return {
      ...appointment,
      _fullName: fullName,
      _email: email,
      _phone: phone,
      _appointmentType: appointmentType,
      _preferredDate: preferredDate,
      _preferredTime: preferredTime,
      _notes: notes,
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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!confirm("Delete this request?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/provider/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      removeExtraData(id);
      setExtraData(getStoredAppointmentExtras());
      setAppointments((prev) =>
        prev.filter((a) => a.appointment_id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="provider-container">
      <h1 className="title">Appointments</h1>

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
            {/* STEP 5 — RENDER RULES: never render blank values */}
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
