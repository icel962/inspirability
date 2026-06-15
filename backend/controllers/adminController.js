const db = require("../db/db");

// ===============================
// TRACK VISIT (public)
// ===============================
exports.trackVisit = async (req, res) => {
  try {
    await db.promise().query(
      "INSERT INTO site_visits (visit_date, count) VALUES (CURDATE(), 1) ON DUPLICATE KEY UPDATE count = count + 1"
    );
    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: false });
  }
};

// ===============================
// GET DASHBOARD STATS
// ===============================
exports.getStats = async (req, res) => {
  try {
    // Build last-6-months label array: ["Dec 2025", "Jan 2026", ...]
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleString("en-US", { month: "short" }) + " " + d.getFullYear();
      months.push(label);
    }
    const toMap = (rows) =>
      Object.fromEntries(rows.map((r) => [r.label, Number(r.count)]));
    const safeQuery = async (sql, fallback) => {
      try {
        const [rows] = await db.promise().query(sql);
        return rows;
      } catch (e) {
        console.error("Stats query failed:", e.message);
        return fallback;
      }
    };

    // ── Totals ────────────────────────────────────────────────────────────────
    const [[{ totalUsers }]] = await db.promise().query(
      "SELECT COUNT(*) AS totalUsers FROM users WHERE role != 'admin'"
    );

    const [[{ totalProviders }]] = await db.promise().query(
      "SELECT (SELECT COUNT(*) FROM school) + (SELECT COUNT(*) FROM medical_clinic) + (SELECT COUNT(*) FROM sport_center) AS totalProviders"
    );

    const nmRows = await safeQuery(
      "SELECT COUNT(*) AS newThisMonth FROM users WHERE role != 'admin' AND created_at IS NOT NULL AND MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())",
      [{ newThisMonth: 0 }]
    );
    const newThisMonth = nmRows[0]?.newThisMonth ?? 0;

    const tvRows = await safeQuery(
      "SELECT COALESCE(SUM(count), 0) AS totalVisits FROM site_visits",
      [{ totalVisits: 0 }]
    );
    const totalVisits = Number(tvRows[0]?.totalVisits ?? 0);

    // ── Monthly signups (users.created_at) ───────────────────────────────────
    const signupRows = await safeQuery(`
      SELECT DATE_FORMAT(created_at, '%b %Y') AS label, COUNT(*) AS count
      FROM users
      WHERE role != 'admin'
        AND created_at IS NOT NULL
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY created_at
    `, []);

    // ── Monthly appointments (appointment.appointment_date) ───────────────────
    const apptRows = await safeQuery(`
      SELECT DATE_FORMAT(appointment_date, '%b %Y') AS label, COUNT(*) AS count
      FROM appointment
      WHERE appointment_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY YEAR(appointment_date), MONTH(appointment_date)
      ORDER BY appointment_date
    `, []);

    // ── Monthly visits (site_visits) ─────────────────────────────────────────
    const visitRows = await safeQuery(`
      SELECT DATE_FORMAT(visit_date, '%b %Y') AS label, SUM(count) AS count
      FROM site_visits
      WHERE visit_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY YEAR(visit_date), MONTH(visit_date)
      ORDER BY visit_date
    `, []);

    const sigMap   = toMap(signupRows);
    const apptMap  = toMap(apptRows);
    const visitMap = toMap(visitRows);

    const chartData = {
      labels:       months.map((m) => m.split(" ")[0]),
      signups:      months.map((m) => sigMap[m]   || 0),
      appointments: months.map((m) => apptMap[m]  || 0),
      visits:       months.map((m) => visitMap[m] || 0),
    };

    // ── Growth snapshot ───────────────────────────────────────────────────────
    const pct = (curr, prev) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

    const cur = months[5];
    const prv = months[4];

    const growthSnapshot = {
      thisMonthVisits:       visitMap[cur]  || 0,
      visitGrowth:           pct(visitMap[cur] || 0, visitMap[prv] || 0),
      thisMonthSignups:      sigMap[cur]    || 0,
      signupGrowth:          pct(sigMap[cur] || 0, sigMap[prv] || 0),
      thisMonthAppointments: apptMap[cur]   || 0,
      appointmentGrowth:     pct(apptMap[cur] || 0, apptMap[prv] || 0),
    };

    // ── Recent registrations ─────────────────────────────────────────────────
    const recentUsers = await safeQuery(`
      SELECT email, role, created_at
      FROM users
      WHERE role != 'admin' AND created_at IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 5
    `, []);

    res.json({
      totalUsers,
      totalProviders,
      newThisMonth,
      totalVisits,
      chartData,
      growthSnapshot,
      recentActivity: recentUsers,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Stats error" });
  }
};

// ===============================
// GET PROVIDER REQUESTS
// ===============================
exports.getProviderRequests = (req, res) => {
  const query = `
    SELECT
      u.user_id,
      u.email        AS user_email,
      u.role,
      u.approval_status,
      u.payment_status,

      s.school_name,
      s.category_of_school,
      s.curriculum_type,
      s.class_capacity,
      s.registration_fees,
      s.annual_fees,
      s.location              AS s_location,
      s.city                  AS s_city,
      s.government            AS s_government,
      s.tel_no                AS s_phone,
      s.email                 AS s_email,
      s.educational_level,
      s.admission_details,
      s.history_info,
      s.shadow_availability,
      s.special_type,
      s.teacher_training_status,
      s.certifications_availability AS s_certifications,
      s.social_media_links          AS s_social_media,
      s.school_logo,

      mc.clinic_name,
      mc.clinic_type,
      mc.specialized_therapists,
      mc.email                AS mc_email,
      mc.phone_number         AS mc_phone,
      mc.location             AS mc_location,
      mc.working_hours_and_days,
      mc.session_price_range,
      mc.certifications_availability AS mc_certifications,
      mc.specialization_type,
      mc.sliding_equipments,

      sc.sport_center_name,
      sc.sport_center_type,
      sc.location             AS sc_location,
      sc.phone_number         AS sc_phone,
      sc.email_address        AS sc_email,
      sc.working_days_and_hours,
      sc.age                  AS sc_age,
      sc.staff_qualifications,
      sc.coach_certifications,
      sc.sports_type_offered,
      sc.private_sessions_or_group,
      sc.special_coach_availability,
      sc.adaptive_equipments,
      sc.social_media_links   AS sc_social_media,
      sc.supported_conditions,
      sc.details              AS sc_details,
      sc.more_info            AS sc_more_info,
      sc.session_price_min,
      sc.session_price_max

    FROM users u
    LEFT JOIN school         s  ON u.user_id = s.user_id  AND u.role = 'school'
    LEFT JOIN medical_clinic mc ON u.user_id = mc.user_id AND u.role = 'clinic'
    LEFT JOIN sport_center   sc ON u.user_id = sc.user_id AND u.role = 'sport'
    WHERE
      u.role IN ('school', 'clinic', 'sport')
      AND u.approval_status = 'pending'
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "DB error",
      });
    }

    res.json(result);
  });
};

// ===============================
// APPROVE PROVIDER
// ===============================
exports.approveProvider = (req, res) => {
  const { id } = req.params;

  db.query(
    `UPDATE users
     SET approval_status = 'approved'
     WHERE user_id = ?`,
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "DB error",
        });
      }

      res.json({
        message: "Provider approved",
      });
    }
  );
};

// ===============================
// REJECT PROVIDER
// ===============================
exports.rejectProvider = (req, res) => {
  const { id } = req.params;

  db.query(
    `UPDATE users
     SET approval_status = 'rejected'
     WHERE user_id = ?`,
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "DB error",
        });
      }

      res.json({
        message: "Provider rejected",
      });
    }
  );
};

// ===============================
// PAYMENT REQUESTS
// ===============================
exports.getPaymentRequests = (req, res) => {
  const query = `
    SELECT
      u.user_id,
      u.email        AS user_email,
      u.role,
      u.payment_status,
      u.payment_plan,
      u.payment_amount,
      u.payment_duration,

      s.school_name,
      s.category_of_school,
      s.location              AS s_location,
      s.city                  AS s_city,
      s.tel_no                AS s_phone,
      s.email                 AS s_email,

      mc.clinic_name,
      mc.clinic_type,
      mc.email                AS mc_email,
      mc.phone_number         AS mc_phone,
      mc.location             AS mc_location,

      sc.sport_center_name,
      sc.sport_center_type,
      sc.location             AS sc_location,
      sc.phone_number         AS sc_phone,
      sc.email_address        AS sc_email

    FROM users u
    LEFT JOIN school         s  ON u.user_id = s.user_id  AND u.role = 'school'
    LEFT JOIN medical_clinic mc ON u.user_id = mc.user_id AND u.role = 'clinic'
    LEFT JOIN sport_center   sc ON u.user_id = sc.user_id AND u.role = 'sport'
    WHERE
      u.role IN ('school', 'clinic', 'sport')
      AND u.payment_status = 'pending'
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "DB error",
      });
    }

    res.json(result);
  });
};

// ===============================
// APPROVE PAYMENT
// ===============================
exports.approvePayment = (req, res) => {
  const { id } = req.params;

  db.query(
    `UPDATE users
     SET payment_status = 'approved'
     WHERE user_id = ?`,
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "DB error",
        });
      }

      res.json({
        message: "Payment approved",
      });
    }
  );
};

// ===============================
// REJECT PAYMENT
// ===============================
exports.rejectPayment = (req, res) => {
  const { id } = req.params;

  db.query(
    `UPDATE users
     SET payment_status = 'rejected'
     WHERE user_id = ?`,
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "DB error",
        });
      }

      res.json({
        message: "Payment rejected",
      });
    }
  );
};