"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import ProfileHero from "@/app/components/Profile/ProfileHero";
import ProfileInfoSections from "@/app/components/Profile/ProfileInfoSections";
import EditProfileModal from "@/app/components/Profile/EditProfileModal";
import MediaGallery from "@/app/components/MediaGallery";
import "./profile.css";
import { showToast } from "../utils/toast";

const ENTITY_MAP = {
  school:  { entityType: "school",  idKey: "school_id" },
  sport:   { entityType: "sport",   idKey: "sport_center_id" },
  clinic:  { entityType: "clinic",  idKey: "clinic_id" },
  medical: { entityType: "clinic",  idKey: "clinic_id" },
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mediaKey, setMediaKey] = useState(0);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async (updatedData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/profile/update", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProfile();
      setEditOpen(false);
      setMediaKey((k) => k + 1);
      showToast("Your profile details have been saved.", "success", "Profile Updated");
    } catch (err) {
      console.error(err);
      showToast("Could not save profile. Please try again.", "error", "Save Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (!profile) return <div className="profile-loading">No profile data found.</div>;

  const user = profile.profile;
  const role = profile.role;
  const entityEntry = ENTITY_MAP[role];
  const entityType = entityEntry?.entityType;
  const entityId = entityEntry ? user[entityEntry.idKey] : null;

  return (
    <div className="profile-page">
      <ProfileHero
        user={user}
        role={role}
        setProfile={setProfile}
        onEdit={() => setEditOpen(true)}
      />

      <ProfileInfoSections user={user} role={role} />

      {entityId && (
        <div className="profile-media-wrap">
          <MediaGallery key={mediaKey} entityType={entityType} entityId={entityId} isOwner={true} />
        </div>
      )}

      <div className="profile-logout-area">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {editOpen && (
        <EditProfileModal
          user={user}
          role={role}
          onSave={handleSave}
          onClose={() => { setEditOpen(false); setMediaKey((k) => k + 1); }}
          saving={saving}
          setProfile={setProfile}
        />
      )}
    </div>
  );
}
