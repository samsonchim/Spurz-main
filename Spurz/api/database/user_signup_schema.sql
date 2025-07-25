-- Minimal Spurz User Signup Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - minimal for signup/authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    verification_token VARCHAR(255),
    verification_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table - basic profile info
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON users 
FOR SELECT USING (auth.uid()::text = id::text);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow signup (insert) - anyone can create an account
CREATE POLICY "Anyone can signup" ON users 
FOR INSERT WITH CHECK (true);

-- RLS Policies for user_profiles table
-- Allow users to read their own profile
CREATE POLICY "Users can view own user_profile" ON user_profiles 
FOR SELECT USING (auth.uid()::text = user_id::text);

-- Allow users to update their own profile
CREATE POLICY "Users can update own user_profile" ON user_profiles 
FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Allow users to create their own profile
CREATE POLICY "Users can create own user_profile" ON user_profiles 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
