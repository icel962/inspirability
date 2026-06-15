const db = require("../db/db");

// Get all sport centers
exports.getAllSportCenters = (req, res) => {
const query = `
  SELECT
    s.sport_center_id,
    s.sport_center_name,
    s.sport_center_type,
    s.location,
    s.phone_number,
    s.email_address,
    s.working_days_and_hours,
    s.age,
    s.staff_qualifications,
    s.coach_certifications,
    s.sports_type_offered,
    s.private_sessions_or_group,
    s.special_coach_availability,
    s.adaptive_equipments,
    s.social_media_links,
    s.supported_conditions,
    s.details,
    s.more_info,
    s.session_price_min,
    s.session_price_max,
    s.user_id,
    u.image

  FROM sport_center s

  JOIN users u
    ON s.user_id = u.user_id

  WHERE
    u.approval_status = 'approved'
  ORDER BY s.sport_center_id ASC
`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("SPORT CENTER FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    console.log("Provider order (sports):", result.map((r) => r.sport_center_id));
    res.json(result);
  });
};

// Get a single sport center by ID
exports.getSportCenterById = (req, res) => {
  const { id } = req.params;

  const query = `
  SELECT
    s.sport_center_id,
    s.sport_center_name,
    s.sport_center_type,
    s.location,
    s.phone_number,
    s.email_address,
    s.working_days_and_hours,
    s.age,
    s.staff_qualifications,
    s.coach_certifications,
    s.sports_type_offered,
    s.private_sessions_or_group,
    s.special_coach_availability,
    s.adaptive_equipments,
    s.social_media_links,
    s.supported_conditions,
    s.details,
    s.more_info,
    s.session_price_min,
    s.session_price_max,
    s.user_id,
    u.image

  FROM sport_center s

  JOIN users u
    ON s.user_id = u.user_id

  WHERE
    s.sport_center_id = ?
    AND u.approval_status = 'approved'
`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("SPORT CENTER FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    if (result.length === 0)
      return res.status(404).json({ message: "Sport center not found" });

    console.log("Provider ID (sport):", id, "image:", result[0].image);
    res.json(result[0]);
  });
};
