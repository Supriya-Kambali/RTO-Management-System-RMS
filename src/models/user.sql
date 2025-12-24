-- Users table for RTO Management System
-- Run this SQL manually in PostgreSQL to create the table

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CITIZEN',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    rto_office_id UUID REFERENCES rto_offices(id),
    address TEXT,
    date_of_birth DATE,
    aadhaar_number TEXT,
    refresh_token TEXT,
    otp_code TEXT,
    otp_expires_at TIMESTAMP,
    reset_token TEXT,
    reset_token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
