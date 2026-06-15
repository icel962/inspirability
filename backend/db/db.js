const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "inspirability 2",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify connectivity on startup and run safe migrations
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL Database");
  connection.release();

  // Add missing columns if they don't already exist.
  // ER_DUP_FIELDNAME (1060) means the column is already there — safe to ignore.
  const migrations = [
    "ALTER TABLE media MODIFY entity_type ENUM('school','clinic','sport_center','sport') NOT NULL",
    "ALTER TABLE media MODIFY media_type ENUM('image','video','pdf') DEFAULT 'image'",
    "ALTER TABLE media MODIFY file_blob longblob NULL DEFAULT NULL",
    "ALTER TABLE users ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP",
    `CREATE TABLE IF NOT EXISTS site_visits (
      visit_date DATE NOT NULL PRIMARY KEY,
      count INT NOT NULL DEFAULT 0
    )`,
    "ALTER TABLE medical_clinic ADD COLUMN age VARCHAR(255)",
    "ALTER TABLE medical_clinic ADD COLUMN private_sessions_or_group VARCHAR(100)",
    "ALTER TABLE medical_clinic ADD COLUMN details TEXT",
    "ALTER TABLE medical_clinic ADD COLUMN staff_qualifications TEXT",
    "ALTER TABLE medical_clinic ADD COLUMN more_info TEXT",
    "ALTER TABLE parent ADD COLUMN preferred_budget VARCHAR(100) NULL",
    "ALTER TABLE parent MODIFY COLUMN preferred_budget VARCHAR(100) NULL",
    "ALTER TABLE parent ADD COLUMN preferred_location VARCHAR(255)",
    "ALTER TABLE parent ADD COLUMN preferred_service_type VARCHAR(255)",
    "ALTER TABLE parent ADD COLUMN username VARCHAR(255)",
    "ALTER TABLE parent ADD COLUMN document_upload TEXT",
  ];
  migrations.forEach((sql) => {
    db.query(sql, (migrErr) => {
      if (migrErr && migrErr.errno !== 1060 && migrErr.errno !== 1061 && migrErr.errno !== 1050) {
        console.error("Migration error:", migrErr.message);
      }
    });
  });
});

module.exports = db;
