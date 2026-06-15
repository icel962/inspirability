"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getAvatarColor, getInitials } from "../../utils/avatar";

const BASE_URL = "http://localhost:5000";

export default function ProfileHero({ user, role, setProfile, onEdit }) {
  const [uploading, setUploading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const uploadedImage = user.image ? `${BASE_URL}/uploads/${user.image}` : null;

  useEffect(() => { setImgFailed(false); }, [uploadedImage]);

  const getName = () =>
    user.school_name || user.sport_center_name || user.clinic_name || user.name || "User";

  const getLocation = () =>
    [user.city, user.government].filter(Boolean).join(", ") || user.location || "";

  const getTags = () => {
    const raw = [
      user.special_type,
      user.sports_type_offered?.split(/[,/|]+/)[0]?.trim(),
      user.clinic_type,
      user.category_of_school,
      user.sport_center_type,
      user.curriculum_type,
      user.specialization_type?.split(/[,/|]+/)[0]?.trim(),
    ].filter(Boolean);
    return [...new Set(raw)].slice(0, 4);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");
    setUploading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/profile/upload-image`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setImgFailed(false);
      setProfile((prev) => ({
        ...prev,
        profile: { ...prev.profile, image: res.data.image },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const name = getName();
  const location = getLocation();
  const tags = getTags();

  return (
    <div className="profile-hero">
      <div className="hero-inner">
        {/* Avatar */}
        <div className="hero-avatar-wrap">
          {uploadedImage && !imgFailed ? (
            <img
              src={uploadedImage}
              alt={name}
              className="hero-avatar"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className="hero-avatar-placeholder"
              style={{ background: getAvatarColor(name) }}
            >
              {getInitials(name)}
            </div>
          )}
          <label className="hero-photo-label">
            {uploading ? "..." : "Change Photo"}
            <input type="file" hidden accept="image/*" onChange={handlePhotoChange} disabled={uploading} />
          </label>
        </div>

        {/* Info */}
        <div className="hero-info">
          <h1 className="hero-name">{name}</h1>
          <span className="hero-role-badge">{role.toUpperCase()} ACCOUNT</span>
          {location && <p className="hero-location">📍 {location}</p>}
          {tags.length > 0 && (
            <div className="hero-tags">
              {tags.map((t, i) => <span key={i} className="hero-tag">{t}</span>)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="hero-actions">
          <button className="edit-profile-btn" onClick={onEdit}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
