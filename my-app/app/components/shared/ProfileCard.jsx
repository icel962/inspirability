"use client";

import { useState } from "react";
import Link from "next/link";
import { getAvatarColor, getInitials } from "../../utils/avatar";

const ProfileCard = ({ item }) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="school-card">
      <div className="card-header">
        <div className="logo-container">
          {item.image && !imgFailed ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className="provider-avatar"
              style={{ background: getAvatarColor(item.name) }}
            >
              {getInitials(item.name)}
            </div>
          )}
        </div>

        <h3 className="school-title">{item.name}</h3>
        <p className="sport-subtitle">{item.typeLabel || "N/A"}</p>
      </div>

      <div className="card-body">
        <div className="school-info card-info">
          <p>
            <strong>Type:</strong> {item.typeLabel || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {item.location || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {item.phone || "N/A"}
          </p>
        </div>

        <div className="card-actions">
          <Link className="action-link" href={item.detailsHref || "#"}>
            <button className="btn secondary" type="button">
              View Details
            </button>
          </Link>
          <Link className="action-link" href={item.appointmentHref}>
            <button className="btn primary" type="button">
              Book Appointment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
