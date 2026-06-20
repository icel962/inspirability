"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { removeExtraData } from "../utils/appointmentExtraStorage";
import "./my-appointments.css";

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

const formatTime = (timeValue) => {
  if (!timeValue) {
    return "Time not set";
  }

  const [hoursString, minutes = "00"] = String(timeValue).split(":");
  let hours = Number.parseInt(hoursString, 10);

  if (Number.isNaN(hours)) {
    return timeValue;
  }

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [extraData, setExtraData] = useState({});
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Fetch user profile data
  const fetchUserData = async (token) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/parents/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.tel_no || ""
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch user data first
      await fetchUserData(token);

      const res = await axios.get(
  "http://localhost:5000/api/appointments/my",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
);

      setAppointments(res.data);
    } catch (err) {
      console.error(err);
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
    console.log("Appointments:", appointments);
    console.log("LocalStorage:", extraData);
  }, [appointments, extraData]);

  const mappedAppointments = appointments.map((appointment) => {
    const extra = extraData[String(appointment.appointment_id)];
    const preferredTime = extra?.preferred_time;
    const notes = extra?.notes;

    return {
      ...appointment,
      preferred_time: preferredTime || null,
      notes: notes || null,
    };
  });

  const handleDelete = async (id) => {
  const token = localStorage.getItem("token");

  if (!confirm("Are you sure you want to delete this request?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/appointments/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    removeExtraData(id);
    setExtraData(getStoredAppointmentExtras());
    setAppointments(prev =>
      prev.filter(a => a.appointment_id !== id)
    );

  } catch (err) {
    console.error(err);
  }
};

  return (
  <div className="parent-container">
    <h2 className="title">My Appointments</h2>

    {mappedAppointments.map((a) => (
      <div key={a.appointment_id} className="appointment-card">

        <div className="card-info">
          <p>
            <strong>Full Name:</strong>{" "}
            {userData.name || "N/A"}
          </p>

          <p>
            <strong>Email Address:</strong>{" "}
            {userData.email || "N/A"}
          </p>

          <p>
            <strong>Phone Number:</strong>{" "}
            {userData.phone || "N/A"}
          </p>

          <p>
            <strong>Appointment Type:</strong>{" "}
            {a.appointment_type || (a.type === "school" ? a.school_name : a.type === "sport" ? a.sport_center_name : a.type === "clinic" ? a.clinic_name : a.type) || "N/A"}
          </p>

          <p>
            <strong>Preferred Date:</strong>{" "}
            {a.appointment_date ? new Date(a.appointment_date).toLocaleDateString() : "N/A"}
          </p>

          <p>
            <strong>Preferred Time:</strong>{" "}
            {a.preferred_time ? formatTime(a.preferred_time) : "Time not selected"}
          </p>

          <p>
            <strong>Notes:</strong>{" "}
            {a.notes ? a.notes : "No notes available"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${a.status}`}>
              {a.status}
            </span>
          </p>
        </div>

        {/* 🗑️ أيقونة الحذف */}
        {a.status === "pending" && (
          <div
            className="delete-icon"
            onClick={() => handleDelete(a.appointment_id)}
          >
            🗑️
          </div>
        )}

      </div>
    ))}
  </div>
);
}
