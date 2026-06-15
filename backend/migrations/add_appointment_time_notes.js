// Migration: add preferred_time and notes columns to appointment table
// Run with: node backend/migrations/add_appointment_time_notes.js

const db = require("../db/db");

async function migrate() {
  const columns = [
    { name: "preferred_time", def: "VARCHAR(10) NULL COMMENT 'HH:MM format'" },
    { name: "notes",          def: "TEXT NULL" },
  ];

  for (const col of columns) {
    try {
      await db.promise().query(
        `ALTER TABLE appointment ADD COLUMN ${col.name} ${col.def}`
      );
      console.log(`✓ Column '${col.name}' added to appointment table`);
    } catch (err) {
      if (err.errno === 1060) {
        console.log(`- Column '${col.name}' already exists, skipping`);
      } else {
        console.error(`✗ Failed to add column '${col.name}':`, err.message);
        process.exit(1);
      }
    }
  }

  console.log("Migration complete — appointment table ready");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration error:", err.message);
  process.exit(1);
});
