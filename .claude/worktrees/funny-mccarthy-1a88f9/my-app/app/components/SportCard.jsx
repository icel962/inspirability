import Link from "next/link";
import "../styles/school.css";

const SportCard = ({ sport }) => {
  return (
    <div className="school-card">
      
      <div className="card-header">
        <div className="logo-container">
          {sport.sport_center_image ? (
            <img src={sport.sport_center_image} alt={sport.sport_center_name} />
          ) : (
            <div className="placeholder-logo">No Logo</div>
          )}
        </div>

        <h3 className="school-title">{sport.sport_center_name}</h3>
        <p className="sport-subtitle">
          {sport.sport_center_type || "N/A"}
        </p>
      </div>

      <div className="card-body">
        <div className="school-info card-info">
          <p><strong>Type:</strong> {sport.sport_center_type || "N/A"}</p>
          <p><strong>Location:</strong> {sport.location || "N/A"}</p>
          <p><strong>Phone:</strong> {sport.phone_number || "N/A"}</p>
        </div>

        <div className="card-actions">
          
  <Link href={`/clubdetails?id=${sport.sport_center_id}`} className="btn secondary">
  View Details
    </Link>


          <Link
            href={`/appointment?type=sport&id=${sport.sport_center_id}&name=${encodeURIComponent(
              sport.sport_center_name
            )}`}
            className="btn primary"
          >
            Book Appointment
          </Link>

        </div>
      </div>
    </div>
  );
};

export default SportCard;