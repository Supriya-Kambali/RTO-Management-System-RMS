process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const setupDatabase = async () => {
  console.log('🚀 Starting database setup...\n');

  const queries = [
    // Enable UUID extension
    `CREATE EXTENSION IF NOT EXISTS "pgcrypto"`,

    // Drop existing tables
    `DROP TABLE IF EXISTS notifications CASCADE`,
    `DROP TABLE IF EXISTS payments CASCADE`,
    `DROP TABLE IF EXISTS appointments CASCADE`,
    `DROP TABLE IF EXISTS challans CASCADE`,
    `DROP TABLE IF EXISTS driving_licenses CASCADE`,
    `DROP TABLE IF EXISTS dl_applications CASCADE`,
    `DROP TABLE IF EXISTS vehicle_transfers CASCADE`,
    `DROP TABLE IF EXISTS vehicles CASCADE`,
    `DROP TABLE IF EXISTS users CASCADE`,
    `DROP TABLE IF EXISTS rto_offices CASCADE`,

    // Create RTO Offices Table
    `CREATE TABLE rto_offices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      code TEXT UNIQUE,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Create Users Table
    `CREATE TABLE users (
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
    )`,

    // Create Vehicles Table
    `CREATE TABLE vehicles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      registration_number TEXT UNIQUE,
      vehicle_type TEXT NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      color TEXT NOT NULL,
      engine_number TEXT NOT NULL,
      chassis_number TEXT NOT NULL,
      fuel_type TEXT NOT NULL,
      rto_office_id UUID NOT NULL REFERENCES rto_offices(id),
      status TEXT NOT NULL DEFAULT 'PENDING',
      verified_by UUID REFERENCES users(id),
      verified_at TIMESTAMP,
      approved_by UUID REFERENCES users(id),
      approved_at TIMESTAMP,
      scrapped_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Create Vehicle Transfers Table
    `CREATE TABLE vehicle_transfers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      from_owner_id UUID NOT NULL REFERENCES users(id),
      to_owner_id UUID NOT NULL REFERENCES users(id),
      transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'PENDING',
      approved_by UUID REFERENCES users(id),
      approved_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Create DL Applications Table
    `CREATE TABLE dl_applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    )`,

    // Create Driving Licenses Table
    `CREATE TABLE driving_licenses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      dl_number TEXT UNIQUE NOT NULL,
      license_type TEXT NOT NULL DEFAULT 'LMV',
      rto_office_id UUID REFERENCES rto_offices(id),
      issue_date DATE NOT NULL,
      expiry_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Create Challans Table
    `CREATE TABLE challans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      issued_by UUID NOT NULL REFERENCES users(id),
      violation_type TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'UNPAID',
      dispute_reason TEXT,
      dispute_resolved_by UUID REFERENCES users(id),
      dispute_resolution TEXT,
      issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Create Payments Table
    `CREATE TABLE payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      challan_id UUID REFERENCES challans(id),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    )`,

    // Create Appointments Table
    `CREATE TABLE appointments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rto_office_id UUID NOT NULL REFERENCES rto_offices(id),
      purpose TEXT NOT NULL,
      appointment_date TIMESTAMP NOT NULL,
      status TEXT NOT NULL DEFAULT 'BOOKED',
      notes TEXT,
      completed_by UUID REFERENCES users(id),
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Create Notifications Table
    `CREATE TABLE notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Create Indexes
    `CREATE INDEX idx_users_email ON users(email)`,
    `CREATE INDEX idx_users_role ON users(role)`,
    `CREATE INDEX idx_vehicles_owner ON vehicles(owner_id)`,
    `CREATE INDEX idx_vehicles_status ON vehicles(status)`,
    `CREATE INDEX idx_dl_applications_user ON dl_applications(user_id)`,
    `CREATE INDEX idx_dl_applications_status ON dl_applications(status)`,
    `CREATE INDEX idx_driving_licenses_user ON driving_licenses(user_id)`,
    `CREATE INDEX idx_driving_licenses_dl_number ON driving_licenses(dl_number)`,
    `CREATE INDEX idx_challans_vehicle ON challans(vehicle_id)`,
    `CREATE INDEX idx_challans_status ON challans(status)`,
    `CREATE INDEX idx_payments_user ON payments(user_id)`,
    `CREATE INDEX idx_payments_status ON payments(status)`,
    `CREATE INDEX idx_appointments_user ON appointments(user_id)`,
    `CREATE INDEX idx_appointments_date ON appointments(appointment_date)`,
    `CREATE INDEX idx_notifications_user ON notifications(user_id)`,

    // Insert RTO Office first
    `INSERT INTO rto_offices (name, code, state, district, address, phone, email)
     VALUES ('Mumbai Central RTO', 'MH01', 'Maharashtra', 'Mumbai', 
             'RTO Building, Tardeo Road, Mumbai - 400034', '022-23456789', 'mh01@rto.gov.in')`,

    // Insert SUPER_ADMIN (password: admin123)
    `INSERT INTO users (name, email, password, phone, role, status)
     VALUES ('Super Admin', 'admin@rto.gov.in', 
             '$2b$10$8K1p/a0dR1xqM6t5xQvZPOJFpJVOZqpTqRxhCqVCnR/k5O5Lz.G2K',
             '9999999999', 'SUPER_ADMIN', 'ACTIVE')`,

    // Insert POLICE (password: admin123)
    `INSERT INTO users (name, email, password, phone, role, status)
     VALUES ('Traffic Police Officer', 'police@traffic.gov.in', 
             '$2b$10$8K1p/a0dR1xqM6t5xQvZPOJFpJVOZqpTqRxhCqVCnR/k5O5Lz.G2K',
             '9888888888', 'POLICE', 'ACTIVE')`,

    // Insert RTO_OFFICER (password: admin123)
    `INSERT INTO users (name, email, password, phone, role, status, rto_office_id)
     VALUES ('RTO Officer', 'officer@rto.gov.in', 
             '$2b$10$8K1p/a0dR1xqM6t5xQvZPOJFpJVOZqpTqRxhCqVCnR/k5O5Lz.G2K',
             '9777777777', 'RTO_OFFICER', 'ACTIVE',
             (SELECT id FROM rto_offices WHERE code = 'MH01'))`,

    // Insert RTO_ADMIN (password: admin123)
    `INSERT INTO users (name, email, password, phone, role, status, rto_office_id)
     VALUES ('RTO Admin', 'rtoadmin@rto.gov.in', 
             '$2b$10$8K1p/a0dR1xqM6t5xQvZPOJFpJVOZqpTqRxhCqVCnR/k5O5Lz.G2K',
             '9666666666', 'RTO_ADMIN', 'ACTIVE',
             (SELECT id FROM rto_offices WHERE code = 'MH01'))`,

    // Insert AUDITOR (password: admin123)
    `INSERT INTO users (name, email, password, phone, role, status)
     VALUES ('System Auditor', 'auditor@rto.gov.in', 
             '$2b$10$8K1p/a0dR1xqM6t5xQvZPOJFpJVOZqpTqRxhCqVCnR/k5O5Lz.G2K',
             '9555555555', 'AUDITOR', 'ACTIVE')`
  ];

  const client = await pool.connect();
  
  try {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const shortQuery = query.substring(0, 50).replace(/\s+/g, ' ');
      
      try {
        await client.query(query);
        console.log(`✅ [${i + 1}/${queries.length}] ${shortQuery}...`);
      } catch (err) {
        console.log(`❌ [${i + 1}/${queries.length}] ${shortQuery}... - ${err.message}`);
      }
    }

    // Verify setup
    console.log('\n📊 Verifying setup...\n');
    
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log('📋 Tables created:');
    tables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    const users = await client.query(`SELECT id, name, email, role FROM users`);
    console.log('\n👥 Users created:');
    users.rows.forEach(row => console.log(`   - ${row.email} (${row.role})`));

    const offices = await client.query(`SELECT id, name, code FROM rto_offices`);
    console.log('\n🏢 RTO Offices created:');
    offices.rows.forEach(row => console.log(`   - ${row.name} (${row.code})`));

    console.log('\n✅ DATABASE SETUP COMPLETE!\n');
    console.log('🔑 Test Users (all passwords: admin123):');
    console.log('   - admin@rto.gov.in      (SUPER_ADMIN)');
    console.log('   - rtoadmin@rto.gov.in   (RTO_ADMIN)');
    console.log('   - officer@rto.gov.in    (RTO_OFFICER)');
    console.log('   - police@traffic.gov.in (POLICE)');
    console.log('   - auditor@rto.gov.in    (AUDITOR)');

  } finally {
    client.release();
    await pool.end();
  }
};

setupDatabase().catch(err => {
  console.error('❌ Setup failed:', err);
  process.exit(1);
});
