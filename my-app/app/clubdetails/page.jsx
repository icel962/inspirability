"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { normalizeProviderDetails } from "../utils/providerPresentation";
import { getAvatarColor, getInitials } from "../utils/avatar";
import MediaGallery from "../components/MediaGallery";
import "./clubdetails.css";

const ENDPOINTS = {
  sport: "http://localhost:5000/api/sports",
  clinic: "http://localhost:5000/api/medical",
  school: "http://localhost:5000/api/schools",
};

function getDetailRows(provider) {
  return [
    { label: "Location", value: provider.location || "Not available" },
    { label: "Phone", value: provider.phone || "Not available" },
    { label: "Email", value: provider.email || "Not available" },
    {
      label: "Diagnoses",
      value: provider.supported_conditions || provider.specialization_type || provider.special_type || "Not available",
    },
    { label: "Age Group", value: provider.age || provider.educational_level || "Not available" },
    { label: "Budget / Price", value: provider.price || "Not available" },
    {
      label: "Working Days / Hours",
      value: provider.working_days_and_hours || provider.working_hours_and_days || "Not available",
    },
    {
      label: "Session Type",
      value: provider.private_sessions_or_group || provider.class_capacity || "Not available",
    },
    {
      label: "Certifications",
      value: provider.coach_certifications || provider.certifications_availability || "Not available",
    },
    {
      label: "Specialties",
      value: provider.specialized_therapists || provider.sport_center_type || provider.clinic_type || provider.category || "Not available",
    },
    {
      label: "Services Offered",
      value: provider.sports_type_offered || provider.details || provider.admission_details || "Not available",
    },
    {
      label: "Adaptive Equipment",
      value: provider.adaptive_equipments || provider.sliding_equipments || provider.shadow_availability || "Not available",
    },
    {
      label: "Staff Qualifications",
      value: provider.staff_qualifications || provider.teacher_training_status || "Not available",
    },
    {
      label: "Additional Information",
      value: provider.more_info || provider.history_info || "Not available",
    },
  ];
}

const SOCIAL_FALLBACKS = {
  "whatsapp-btn":   "https://wa.me/",
  "facebook-btn":   "https://www.facebook.com/",
  "instagram-btn":  "https://www.instagram.com/",
  "call-btn":       "tel:+20",
  "email-btn":      "mailto:",
};

function ActionButton({ href, className, children }) {
  const target = href || SOCIAL_FALLBACKS[className] || "#";
  const isReal = Boolean(href);

  return (
    <a
      className={`contact-btn ${className}`}
      href={target}
      target={isReal ? "_blank" : undefined}
      rel="noreferrer"
      onClick={!isReal ? (e) => e.preventDefault() : undefined}
    >
      {children}
    </a>
  );
}

export default function ClubPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "sport";
  const id = searchParams.get("id");
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !ENDPOINTS[type]) {
      setError("Provider information is missing.");
      setLoading(false);
      return;
    }

    const fetchProvider = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${ENDPOINTS[type]}/${id}`);
        if (!response.ok) {
          throw new Error("Failed to load provider details.");
        }

        const data = await response.json();
        const normalizedProvider = normalizeProviderDetails(data, type);

        console.log("Selected provider:", normalizedProvider);
        console.log("Provider logo:", normalizedProvider.image);
        console.log("Opening details page for:", normalizedProvider.name);
        console.log("Provider contact links:", normalizedProvider.socials);

        setProvider(normalizedProvider);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load provider details right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id, type]);

  const details = useMemo(() => (provider ? getDetailRows(provider) : []), [provider]);

  if (loading) {
    return (
      <section className="provider-details-page">
        <div className="provider-details-shell">
          <div className="provider-state-card">Loading provider details...</div>
        </div>
      </section>
    );
  }

  if (error || !provider) {
    return (
      <section className="provider-details-page">
        <div className="provider-details-shell">
          <div className="provider-state-card">{error || "Provider not found."}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="provider-details-page">
      <div className="provider-details-shell">
        <div className="provider-details-layout">
          <div className="provider-main-panel">
            <header className="provider-hero-card">
              <div className="provider-logo-frame">
                {provider.image ? (
                  <img src={provider.image} alt={provider.name} className="provider-logo" />
                ) : (
                  <div
                    className="provider-logo-avatar"
                    style={{ background: getAvatarColor(provider.name) }}
                  >
                    {getInitials(provider.name)}
                  </div>
                )}
              </div>

              <div className="provider-hero-copy">
                <h1>{provider.name}</h1>
                <p>{provider.category}</p>
              </div>
            </header>

            <div className="provider-details-grid">
              {details.map((detail) => (
                <article className="provider-detail-card" key={detail.label}>
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </article>
              ))}
            </div>

            <MediaGallery
              key={provider.id}
              entityType={type}
              entityId={String(provider.id)}
              isOwner={false}
            />
          </div>

          <aside className="provider-action-panel">
            <h2>{provider.name} contact media</h2>

            <Link href={provider.appointmentHref} className="contact-btn appointment-btn">
              Make an Appointment
            </Link>
            <ActionButton className="whatsapp-btn" href={provider.socials.whatsapp}>WhatsApp</ActionButton>
            <ActionButton className="facebook-btn" href={provider.socials.facebook}>Facebook</ActionButton>
            <ActionButton className="call-btn" href={provider.socials.call}>Call</ActionButton>
            <ActionButton className="instagram-btn" href={provider.socials.instagram}>Instagram</ActionButton>
            <ActionButton className="email-btn" href={provider.socials.email}>Email</ActionButton>
            <Link href={`/feedback?type=${type}&id=${provider.id}&name=${encodeURIComponent(provider.name)}`} className="contact-btn feedback-btn">
              Add Feedback
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
