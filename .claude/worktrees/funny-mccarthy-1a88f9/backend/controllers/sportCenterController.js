const db = require("../db/db");

// Get all sport centers
exports.getAllSportCenters = (req, res) => {
  const query = `
    SELECT 
      sport_center_id,
      sport_center_name,
      sport_center_type,
      location,
      phone_number,
      email_address,
      working_days_and_hours,
      age,
      staff_qualifications,
      coach_certifications,
      sports_type_offered,
      private_sessions_or_group,
      special_coach_availability,
      adaptive_equipments,
      social_media_links,
      supported_conditions,
      details,
      more_info,
      session_price_min,
      session_price_max,
      user_id
    FROM sport_center
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("SPORT CENTER FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    res.json(result);
  });
};

// Get a single sport center by ID
exports.getSportCenterById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      sport_center_id,
      sport_center_name,
      sport_center_type,
      location,
      phone_number,
      email_address,
      working_days_and_hours,
      age,
      staff_qualifications,
      coach_certifications,
      sports_type_offered,
      private_sessions_or_group,
      special_coach_availability,
      adaptive_equipments,
      social_media_links,
      supported_conditions,
      details,
      more_info,
      session_price_min,
      session_price_max,
      user_id
    FROM sport_center
    WHERE sport_center_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("SPORT CENTER FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Sport center not found" });
    }

    res.json(result[0]);
  });
};
