const { Pool } = require('pg');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkPayments() {
  try {
    // Check all payment statuses
    const statusCount = await pool.query(`
      SELECT status, COUNT(*) as count, SUM(amount) as total_amount
      FROM payments
      GROUP BY status
      ORDER BY status
    `);
    console.log('Payment status summary:');
    console.table(statusCount.rows);
    
    // Check all payments
    const allPayments = await pool.query(`
      SELECT id, amount, status, payment_method, paid_at
      FROM payments
      ORDER BY created_at DESC
    `);
    console.log('\nAll payments:');
    console.table(allPayments.rows);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkPayments();
