"use client";

import { useState } from "react";
import Link from "next/link";
import "../styles/school.css";

const BASE_URL = "http://localhost:5000";

const MedicalCard = ({ clinic }) => {
  const [imgFailed, setImgFailed] = useState(false);
  console.log("Provider logo:", clinic.image);

  return (
    <div className="school-card">
      <div className="logo-container">
        {clinic.image && !imgFailed ? (
          <img
            src={`${BASE_URL}/uploads/${clinic.image}`}
            alt={clinic.clinic_name}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="placeholder-logo">
            {clinic.clinic_name?.[0] || "C"}
          </div>
        )}
      </div>

      <h3 className="school-title">{clinic.clinic_name}</h3>

      <div className="school-info">
        <p><strong>Type:</strong> {clinic.clinic_type || "N/A"}</p>
        <p><strong>Location:</strong> {clinic.location || "N/A"}</p>
        <p><strong>Phone:</strong> {clinic.phone_number || "N/A"}</p>
      </div>

      <Link
        href={`/appointment?type=clinic&id=${clinic.clinic_id}&name=${encodeURIComponent(clinic.clinic_name)}`}
        className="details-btn"
      >
        Book Appointment
      </Link>
    </div>
  );
};

export default MedicalCard;
