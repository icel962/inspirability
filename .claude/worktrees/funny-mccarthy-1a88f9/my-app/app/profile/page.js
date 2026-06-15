"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import SchoolProfile from "@/app/components/Profile/SchoolProfile";
import ParentProfile from "@/app/components/Profile/ParentProfile";
import SportProfile from "@/app/components/Profile/SportProfile";
import ClinicProfile from "@/app/components/Profile/ClinicProfile";
import ProfileHeader from "@/app/components/Profile/ProfileHeader";  
import "./profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res.data);
      setFormData(res.data.profile);
    } catch (err) {
      console.error(err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/profile/update",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 🔥 نعمل refetch عشان نضمن التحديث
      await fetchProfile();

      alert("Updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error while saving ❌");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ================= LOADING =================
  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile data</div>;

  const user = profile.profile;
  const role = profile.role;

  // ================= GET NAME =================
  const getName = () => {
    if (role === "parent") return user.name;
    if (role === "school") return user.school_name;
    if (role === "sport") return user.sport_center_name;
    if (role === "clinic" || role === "medical") return user.clinic_name;
    return "User";
  };

  return (
    <div className="profile">

      {/* ================= TOP CARD ================= */}
<ProfileHeader
  user={profile.profile}
  role={profile.role}
  setProfile={setProfile}
/>

      {/* ================= ROLE COMPONENT ================= */}
      {role === "school" && (
        <SchoolProfile
          user={user}
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
        />
      )}

      {role === "parent" && (
        <ParentProfile
          user={user}
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
        />
      )}

      {role === "sport" && (
        <SportProfile
          user={user}
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
        />
      )}

      {(role === "clinic" || role === "medical") && (
        <ClinicProfile
          user={user}
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
        />
      )}

      {/* ================= LOGOUT ================= */}
      <div className="logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}