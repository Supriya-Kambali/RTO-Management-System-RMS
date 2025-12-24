-- Appointments table for RTO Management System
-- Run this SQL manually in PostgreSQL to create the table

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    rto_office_id UUID NOT NULL,
    purpose TEXT NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    status TEXT NOT NULL DEFAULT 'BOOKED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
