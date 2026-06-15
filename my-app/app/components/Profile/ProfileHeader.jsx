"use client";

import { useState } from "react";
import axios from "axios";

export default function ProfileHeader({ user, role, setProfile }) {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");

    try {
      setUploading(true);

      const res = await axios.post(
  "http://localhost:5000/api/profile/upload-image", // ✅ الصح
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
);

      // 🔥 تحديث الصورة فورًا
setProfile((prev) => ({
  ...prev,
  profile: {
    ...prev.profile,
    image: res.data.image,
  },
}));

    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-card">

      <div className="image-wrapper">
        <img
          src={
            user.image
              ? `http://localhost:5000/uploads/${user.image}`
              : "/images/profile.png"
          }
          alt="profile"
        />

        <label className="upload-btn">
          {uploading ? "Uploading..." : "Edit Photo"}
          <input type="file" hidden onChange={handleImageChange} />
        </label>
      </div>

      <h3>
        {user.school_name ||
          user.sport_center_name ||
          user.clinic_name ||
          user.name ||
          "User"}
      </h3>

      <span>{role.toUpperCase()} ACCOUNT</span>
    </div>
  );
}