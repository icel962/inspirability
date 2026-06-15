"use client";

import { useState } from "react";
import Link from "next/link";
import "../styles/school.css";

const BASE_URL = "http://localhost:5000";

const SchoolCard = ({ school }) => {
  const [imgFailed, setImgFailed] = useState(false);
  console.log("Provider logo:", school.image);

  return (
    <div className="school-card">
      <div className="logo-container">
        {school.image && !imgFailed ? (
          <img
            src={`${BASE_URL}/uploads/${school.image}`}
            alt={school.school_name}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="placeholder-logo">
            {school.school_name?.[0] || "S"}
          </div>
        )}
      </div>

      <h3 className="school-title">{school.school_name}</h3>

      <div className="school-info">
        <p><strong>Special Type:</strong> {school.special_type || "N/A"}</p>
        <p><strong>City:</strong> {school.city || "N/A"}</p>
        <p>
          <strong>Annual Fees:</strong>{" "}
          {school.annual_fees ? `${school.annual_fees} EGP` : "N/A"}
        </p>
      </div>

      <Link
        href={`/appointment?type=school&id=${school.school_id}&name=${encodeURIComponent(school.school_name)}`}
        className="details-btn"
      >
        Book Appointment
      </Link>
    </div>
  );
};

export default SchoolCard;
