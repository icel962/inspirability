-- Create the appointment table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NOT NULL,
  appointment_date DATE,
  appointment_time TIME,
  type VARCHAR(255),
  clinic_id INT,
  sport_center_id INT,
  school_id INT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id),
  FOREIGN KEY (clinic_id) REFERENCES medicalclinic(clinic_id),
  FOREIGN KEY (sport_center_id) REFERENCES sportcenter(sport_center_id),
  FOREIGN KEY (school_id) REFERENCES school(school_id)
);