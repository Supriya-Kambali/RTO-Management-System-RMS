-- Driving Licenses table for RTO Management System
-- Run this SQL manually in PostgreSQL to create the table

CREATE TABLE IF NOT EXISTS driving_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    dl_number TEXT UNIQUE NOT NULL,
    license_type TEXT NOT NULL DEFAULT 'LMV',
    rto_office_id UUID REFERENCES rto_offices(id),
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_driving_licenses_user ON driving_licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_driving_licenses_dl_number ON driving_licenses(dl_number);
CREATE INDEX IF NOT EXISTS idx_driving_licenses_status ON driving_licenses(status);
