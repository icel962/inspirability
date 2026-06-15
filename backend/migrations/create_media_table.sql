CREATE TABLE IF NOT EXISTS media (
  media_id    INT AUTO_INCREMENT PRIMARY KEY,
  file_name   VARCHAR(255) NOT NULL,
  media_type  ENUM('image', 'video') DEFAULT 'image',
  file_blob   LONGBLOB,
  entity_id   INT NOT NULL,
  entity_type ENUM('sport', 'clinic', 'school') NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_entity (entity_type, entity_id)
);
