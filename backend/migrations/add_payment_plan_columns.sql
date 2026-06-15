-- Run this once in your MySQL database to add payment plan columns to the users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS payment_plan     VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payment_amount   INT          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payment_duration VARCHAR(50)  DEFAULT NULL;
