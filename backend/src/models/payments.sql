-- Payments table for RTO Management System
-- Run this SQL manually in PostgreSQL to create the table

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challan_id UUID REFERENCES challans(id),
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_type TEXT NOT NULL DEFAULT 'CHALLAN',
    reference_id UUID,
    status TEXT NOT NULL DEFAULT 'PENDING',
    transaction_id TEXT,
    payment_method TEXT,
    paid_at TIMESTAMP,
    refunded_at TIMESTAMP,
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_challan ON payments(challan_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
