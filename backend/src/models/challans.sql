-- Challans table for RTO Management System
-- Run this SQL manually in PostgreSQL to create the table

CREATE TABLE IF NOT EXISTS challans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    issued_by UUID NOT NULL REFERENCES users(id),
    violation_type TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'UNPAID',
    dispute_reason TEXT,
    dispute_resolved_by UUID REFERENCES users(id),
    dispute_resolution TEXT,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_challans_vehicle ON challans(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_challans_issued_by ON challans(issued_by);
CREATE INDEX IF NOT EXISTS idx_challans_status ON challans(status);
