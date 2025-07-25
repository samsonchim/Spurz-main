-- Add verification fields to users table
ALTER TABLE users 
ADD COLUMN verification_token VARCHAR(255),
ADD COLUMN verification_expires TIMESTAMP WITH TIME ZONE;
