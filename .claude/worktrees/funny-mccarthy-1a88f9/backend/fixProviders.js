const db = require("./db/db"); // عدل المسار عندك

async function fixProviders() {
  try {
    console.log("🚀 Start fixing providers...");

    // ================= SPORT =================
    const [sports] = await db.promise().query(
      "SELECT * FROM sport_center WHERE user_id IS NULL"
    );

    for (let sport of sports) {
      const email = `sport_${sport.sport_center_id}@system.com`;

      const [userResult] = await db.promise().query(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, "123456", "sport"]
      );

      await db.promise().query(
        "UPDATE sport_center SET user_id = ? WHERE sport_center_id = ?",
        [userResult.insertId, sport.sport_center_id]
      );

      console.log(`✅ Sport fixed: ${email}`);
    }

    // ================= SCHOOL =================
    const [schools] = await db.promise().query(
      "SELECT * FROM school WHERE user_id IS NULL"
    );

    for (let school of schools) {
      const email = `school_${school.school_id}@system.com`;

      const [userResult] = await db.promise().query(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, "123456", "school"]
      );

      await db.promise().query(
        "UPDATE school SET user_id = ? WHERE school_id = ?",
        [userResult.insertId, school.school_id]
      );

      console.log(`✅ School fixed: ${email}`);
    }

    // ================= CLINIC =================
    const [clinics] = await db.promise().query(
      "SELECT * FROM medical_clinic WHERE user_id IS NULL"
    );

    for (let clinic of clinics) {
      const email = `clinic_${clinic.clinic_id}@system.com`;

      const [userResult] = await db.promise().query(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, "123456", "clinic"]
      );

      await db.promise().query(
        "UPDATE medical_clinic SET user_id = ? WHERE clinic_id = ?",
        [userResult.insertId, clinic.clinic_id]
      );

      console.log(`✅ Clinic fixed: ${email}`);
    }

    console.log("🎉 All providers fixed successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

fixProviders();