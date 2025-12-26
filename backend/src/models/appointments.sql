-- Appointments table for RTO Management System
-- Run this SQL manually in PostgreSQL to create the table

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    rto_office_id UUID NOT NULL REFERENCES rto_offices(id),
    purpose TEXT NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    status TEXT NOT NULL DEFAULT 'BOOKED',
    notes TEXT,
    completed_by UUID REFERENCES users(id),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_rto ON appointments(rto_office_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
