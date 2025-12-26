-- DL Applications table for RTO Management System
-- Run this SQL manually in PostgreSQL to create the table

CREATE TABLE IF NOT EXISTS dl_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    rto_office_id UUID NOT NULL REFERENCES rto_offices(id),
    license_type TEXT NOT NULL DEFAULT 'LMV',
    status TEXT NOT NULL DEFAULT 'PENDING',
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    test_scheduled_at TIMESTAMP,
    test_result TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejected_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_dl_applications_user ON dl_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_dl_applications_rto ON dl_applications(rto_office_id);
CREATE INDEX IF NOT EXISTS idx_dl_applications_status ON dl_applications(status);
