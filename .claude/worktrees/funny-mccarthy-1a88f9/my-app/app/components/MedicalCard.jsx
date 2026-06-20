import Link from "next/link";
import "../styles/school.css";

const MedicalCard = ({ clinic }) => {
  return (
    <div className="school-card">
      
      <div className="logo-container">
        {clinic.clinic_image ? (
          <img src={clinic.clinic_image} alt={clinic.clinic_name} />
        ) : (
          <div className="placeholder-logo">No Logo</div>
        )}
      </div>

      <h3 className="school-title">{clinic.clinic_name}</h3>

      <div className="school-info">
        <p><strong>Type:</strong> {clinic.clinic_type || "N/A"}</p>
        <p><strong>Location:</strong> {clinic.location || "N/A"}</p>
        <p><strong>Phone:</strong> {clinic.phone_number || "N/A"}</p>
      </div>

      <Link
        href={`/appointment?type=clinic&id=${clinic.clinic_id}&name=${encodeURIComponent(
          clinic.clinic_name
        )}`}
        className="details-btn"
      >
        Book Appointment
      </Link>

    </div>
  );
};

export default MedicalCard;