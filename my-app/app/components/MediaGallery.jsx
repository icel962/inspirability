"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/media-gallery.css";
import { showToast } from "../utils/toast";

const BASE_URL = "http://localhost:5000";

const PLACEHOLDERS = {
  sport: [
    "/images/Sport.png",
    "/images/Trn 1.png",
    "/images/Trn 2.png",
    "/images/Trn 3.png",
  ],
  clinic: [
    "/images/Clinic.png",
    "/images/about1.png",
    "/images/about2.png",
    "/images/about3.png",
  ],
  school: [
    "/images/School.png",
    "/images/csc-campus-view.jpg",
    "/images/about1.png",
    "/images/about2.png",
  ],
};

export default function MediaGallery({ entityType, entityId, isOwner = false }) {
  const [media, setMedia] = useState([]);
  const [status, setStatus] = useState("loading");
  const [lightbox, setLightbox] = useState(null);
  const inputRef = useRef(null);

  const fetchMedia = useCallback(async () => {
    if (!entityId) return;
    console.log("Provider ID:", entityId, "| entityType:", entityType);
    try {
      const res = await fetch(`${BASE_URL}/api/media/${entityType}/${entityId}`);
      if (res.ok) {
        const data = await res.json();
        const gallery = Array.isArray(data) ? data : [];
        console.log("Fetched provider media:", entityType, entityId, gallery);
        console.log("Rendered gallery:", gallery.map((m) => m.file_name));
        // Always replace with server truth; server returns ALL existing rows
        setMedia(gallery);
      } else {
        console.error("Media fetch failed:", res.status, entityType, entityId);
        // Do NOT clear existing media on a failed re-fetch — keep what was visible
      }
    } catch (err) {
      console.error("Media fetch error:", err.message, entityType, entityId);
      // Network error: preserve whatever was already in state
    } finally {
      setStatus("idle");
    }
  }, [entityType, entityId]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    console.log("Provider order before upload — entityId:", entityId, "existing count:", media.length);
    console.log("Uploaded files:", files.map((f) => f.name));

    setStatus("uploading");

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("media", f));

      console.log("Uploading media for provider:", entityId, "type:", entityType);

      const res = await fetch(`${BASE_URL}/api/media/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));
      console.log("Upload response:", res.status, payload);

      if (res.ok) {
        // Re-fetch so we get the full merged gallery (old + new) from the DB
        await fetchMedia();
        console.log("Provider order after upload — entityId:", entityId);
        showToast(
          `${files.length === 1 ? "Your file has" : `${files.length} files have`} been added to the gallery.`,
          "success",
          "Upload Successful"
        );
      } else {
        showToast(
          payload.message || "Upload failed. Make sure the server is running.",
          "error",
          "Upload Failed"
        );
        setStatus("idle");
      }
    } catch {
      showToast("Could not reach the server. Please check the backend is running.", "error", "Upload Failed");
      setStatus("idle");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (mediaId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/media/${mediaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.media_id !== mediaId));
        showToast("The item has been removed from your gallery.", "info", "Media Removed");
      }
    } catch {
      showToast("Could not delete. Please try again.", "error");
    }
  };

  if (!entityId) return null;

  const uploading = status === "uploading";
  const loading = status === "loading";
  const isEmpty = media.length === 0;
  const placeholders = PLACEHOLDERS[entityType] || [];

  return (
    <div className="media-gallery">
      <div className="media-gallery-header">
        <h3 className="media-gallery-title">Media Gallery</h3>
        {isOwner && (
          <label className={`media-upload-btn${uploading ? " uploading" : ""}`}>
            {uploading ? "Uploading..." : "+ Add Photos / Videos / PDFs"}
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              hidden
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {loading ? (
        <p className="media-empty">Loading gallery...</p>
      ) : isEmpty && !isOwner && placeholders.length > 0 ? (
        /* Visitor view with no uploads: show category placeholders */
        <div className="media-grid">
          {placeholders.map((src, i) => (
            <div key={i} className="media-item media-item-placeholder">
              <img src={src} alt="gallery" className="media-thumb" onClick={() => setLightbox(src)} />
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <p className="media-empty">
          {isOwner
            ? 'No media yet. Click "+ Add Photos / Videos / PDFs" to upload.'
            : "No media available for this provider."}
        </p>
      ) : (
        <div className="media-grid">
          {media.map((item) => {
            const src = `${BASE_URL}/uploads/${item.file_name}`;
            const isPdf = item.media_type === "pdf" || item.file_name?.toLowerCase().endsWith(".pdf");
            return (
              <div key={item.media_id} className={`media-item${isPdf ? " media-item-pdf" : ""}`}>
                {item.media_type === "video" ? (
                  <video
                    src={src}
                    controls
                    className="media-thumb"
                    preload="metadata"
                  />
                ) : isPdf ? (
                  <div className="media-pdf-wrap" onClick={() => setLightbox(src)}>
                    <embed
                      src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
                      type="application/pdf"
                      className="media-pdf-embed"
                    />
                    <div className="media-pdf-overlay">
                      <span className="media-pdf-label">📄 PDF</span>
                      <span className="media-pdf-hint">Click to view</span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={src}
                    alt="gallery"
                    className="media-thumb"
                    loading="lazy"
                    onClick={() => setLightbox(src)}
                  />
                )}
                {isOwner && (
                  <button
                    className="media-delete-btn"
                    onClick={() => handleDelete(item.media_id)}
                    title="Remove"
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {lightbox && (
        <div className="media-lightbox" onClick={() => setLightbox(null)}>
          <div
            className={`media-lightbox-inner${lightbox.toLowerCase().endsWith(".pdf") ? " media-lightbox-inner--pdf" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="media-lightbox-close" onClick={() => setLightbox(null)} type="button">×</button>
            {lightbox.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={lightbox}
                className="media-lightbox-pdf"
                title="PDF preview"
              />
            ) : (
              <img src={lightbox} alt="preview" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
