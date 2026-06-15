const db = require("../db/db");

// ==============================
// CREATE APPOINTMENT
// ==============================
exports.createAppointment = (req, res) => {
  try {
    const user_id = req.user.id;

const {
  appointment_date,
  type,
  clinic_id,
  sport_center_id,
  school_id,
  appointment_type   // 🔥 جديد
} = req.body;

    if (!appointment_date || !type) {
      return res.status(400).json({
        message: "appointment_date and type are required",
      });
    }

    // ✅ validation حسب النوع
    if (type === "clinic" && !clinic_id) {
      return res.status(400).json({ message: "clinic_id is required" });
    }

    if (type === "sport" && !sport_center_id) {
      return res.status(400).json({ message: "sport_center_id is required" });
    }

    if (type === "school" && !school_id) {
      return res.status(400).json({ message: "school_id is required" });
    }

    // =========================
    // GET parent_id
    // =========================
    db.query(
      "SELECT parent_id FROM parent WHERE user_id = ?",
      [user_id],
      (err, parentResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "DB error" });
        }

        if (parentResult.length === 0) {
          return res.status(400).json({
            message: "Parent not found",
          });
        }

        const parent_id = parentResult[0].parent_id;

        let provider_user_id = null;

        // =========================
        // GET provider_user_id
        // =========================
        const getProvider = (query, id) => {
          db.query(query, [id], (err, result) => {
            if (err || result.length === 0) {
              return res.status(400).json({ message: "Provider not found" });
            }

            provider_user_id = result[0].user_id;

            insertAppointment();
          });
        };

        if (type === "clinic") {
          getProvider(
            "SELECT user_id FROM medical_clinic WHERE clinic_id = ?",
            clinic_id
          );
        } else if (type === "sport") {
          getProvider(
            "SELECT user_id FROM sport_center WHERE sport_center_id = ?",
            sport_center_id
          );
        } else if (type === "school") {
          getProvider(
            "SELECT user_id FROM school WHERE school_id = ?",
            school_id
          );
        } else {
          return res.status(400).json({ message: "Invalid type" });
        }

        // =========================
        // INSERT
        // =========================
        function insertAppointment() {
          const query = `
  INSERT INTO appointment 
  (parent_id, appointment_date, clinic_id, sport_center_id, school_id, status, provider_user_id, appointment_type)
  VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
`;

          db.query(
            query,
            [
  parent_id,
  appointment_date,
  clinic_id || null,
  sport_center_id || null,
  school_id || null,
  provider_user_id,
  appointment_type || null   // 🔥 هنا
],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: "Insert error" });
              }

              res.json({
                message: "Appointment sent successfully ✅",
                id: result.insertId,
              });
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET PROVIDER APPOINTMENTS
// ==============================
exports.getProviderAppointments = (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT * FROM appointment 
     WHERE provider_user_id = ?
     ORDER BY 
       FIELD(status, 'pending', 'approved', 'rejected'),
       appointment_date DESC`,
    [user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      res.json(result);
    }
  );
};

// ==============================
// GET PARENT APPOINTMENTS
// ==============================
exports.getParentAppointments = (req, res) => {
  const user_id = req.user.id;

  db.query(
    "SELECT parent_id FROM parent WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (result.length === 0)
        return res.status(400).json({ message: "Parent not found" });

      const parent_id = result[0].parent_id;

      // 🔥 هنا التعديل
      db.query(
        `SELECT * FROM appointment 
         WHERE parent_id = ?
         ORDER BY 
           FIELD(status, 'pending', 'approved', 'rejected'),
           appointment_date DESC`,
        [parent_id],
        (err, appointments) => {
          if (err)
            return res.status(500).json({ message: "Fetch error" });

          res.json(appointments);
        }
      );
    }
  );
};

// ==============================
// UPDATE STATUS (APPROVE / REJECT)
// ==============================
exports.updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user_id = req.user.id;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    "UPDATE appointment SET status = ? WHERE appointment_id = ? AND provider_user_id = ?",
    [status, id, user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({ message: "Not authorized" });
      }

      res.json({ message: "Updated successfully ✅" });
    }
  );
};

// ==============================
// DELETE APPOINTMENT
// ==============================

exports.deleteAppointment = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  db.query(
    "SELECT parent_id FROM parent WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (result.length === 0)
        return res.status(400).json({ message: "Parent not found" });

      const parent_id = result[0].parent_id;

      db.query(
        "DELETE FROM appointment WHERE appointment_id = ? AND parent_id = ?",
        [id, parent_id],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Delete error" });

          if (result.affectedRows === 0) {
            return res.status(403).json({ message: "Not authorized" });
          }

          res.json({ message: "Deleted successfully ✅" });
        }
      );
    }
  );
};

// ==============================
// DELETE PROVIDER APPOINTMENT
// ==============================
exports.deleteProviderAppointment = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  db.query(
    "DELETE FROM appointment WHERE appointment_id = ? AND provider_user_id = ?",
    [id, user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Delete error" });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({ message: "Not authorized" });
      }

      res.json({ message: "Deleted successfully ✅" });
    }
  );
};